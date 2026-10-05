'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ===========================================================
// CERTIFICATION PRICING ENGINE
// Rules:
//   - Base price per property: from admin settings (default 10000 FCFA)
//   - 2nd+ property in SAME building, SAME type: 50% of base
//   - 2nd+ property in SAME building, DIFFERENT type: 75% of base
//   - Properties in different buildings: full base price each
// ===========================================================

export type CertificationItem = {
  propertyId: string
  title: string
  propertyType: string
  buildingGroup: string   // A string key grouping properties in the same building (e.g. same address)
  basePrice: number
  discountRate: number    // 0, 0.5, 0.25
  finalPrice: number
}

/**
 * Calculate the price quote for a list of properties the owner wants to certify.
 * Properties are grouped by buildingGroup. Within a group, the first property
 * pays full price. Subsequent ones get discounts based on type similarity.
 */
export async function calculateCertificationQuote(
  properties: { propertyId: string; title: string; propertyType: string; buildingGroup: string }[]
): Promise<{ items: CertificationItem[]; total: number; basePrice: number }> {
  const supabase = await createClient()

  // Fetch base price from admin settings
  const { data: settings } = await supabase
    .from('system_settings')
    .select('value')
    .eq('key', 'certification_base_price')
    .single()

  const basePrice = Number(settings?.value ?? 10000)

  // Group by building
  const buildingGroups = new Map<string, typeof properties>()
  for (const prop of properties) {
    const key = prop.buildingGroup || prop.propertyId // fallback: each property is its own building
    if (!buildingGroups.has(key)) buildingGroups.set(key, [])
    buildingGroups.get(key)!.push(prop)
  }

  const items: CertificationItem[] = []

  for (const [, group] of buildingGroups) {
    const firstType = group[0].propertyType
    group.forEach((prop, index) => {
      let discountRate = 0
      if (index > 0) {
        // Same type as first: 50% discount
        // Different type: 25% discount
        discountRate = prop.propertyType === firstType ? 0.50 : 0.25
      }
      const finalPrice = Math.round(basePrice * (1 - discountRate))
      items.push({
        ...prop,
        basePrice,
        discountRate,
        finalPrice
      })
    })
  }

  const total = items.reduce((sum, item) => sum + item.finalPrice, 0)
  return { items, total, basePrice }
}

/**
 * Create certification requests and a payment record, then redirect to the payment simulator.
 */
export async function createCertificationRequests(
  items: CertificationItem[]
): Promise<{ success: boolean; paymentId?: string; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Non autorise. Veuillez vous connecter.' }
    }

    const total = items.reduce((sum, item) => sum + item.finalPrice, 0)
    const reference = `CERT-${Date.now()}-${user.id.substring(0, 8).toUpperCase()}`

    // 1. Create the payment record (status: pending)
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        payer_id: user.id,
        amount: total,
        currency: 'XAF',
        payment_type: 'certification',
        status: 'pending',
        reference,
        metadata: { items: items.map(i => ({ propertyId: i.propertyId, finalPrice: i.finalPrice })) }
      })
      .select('id')
      .single()

    if (paymentError || !payment) {
      console.error('Payment creation error:', paymentError)
      return { success: false, error: 'Erreur lors de la creation du paiement.' }
    }

    // 2. Create individual certification_requests linked to the payment
    const certRequests = items.map(item => ({
      property_id: item.propertyId,
      requester_id: user.id,
      status: 'awaiting_payment',
      amount: item.finalPrice,
      payment_id: payment.id
    }))

    const { error: certError } = await supabase
      .from('certification_requests')
      .insert(certRequests)

    if (certError) {
      console.error('Certification requests creation error:', certError)
      // Rollback payment
      await supabase.from('payments').delete().eq('id', payment.id)
      return { success: false, error: 'Erreur lors de la creation des demandes de certification.' }
    }

    return { success: true, paymentId: payment.id }
  } catch (error) {
    console.error('Error in createCertificationRequests:', error)
    return { success: false, error: 'Une erreur inattendue est survenue.' }
  }
}

/**
 * Simulate a successful payment (CinetPay simulation mode).
 * Updates payment status to 'success' and all related certification_requests to 'paid'.
 */
export async function simulatePaymentSuccess(paymentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Non autorise.' }

    // Update payment
    const { error: paymentError } = await supabase
      .from('payments')
      .update({ status: 'success', paid_at: new Date().toISOString() })
      .eq('id', paymentId)
      .eq('payer_id', user.id)

    if (paymentError) return { success: false, error: 'Erreur de mise a jour du paiement.' }

    // Update certification_requests to 'paid' (queued for assignment)
    const { error: certError } = await supabase
      .from('certification_requests')
      .update({ status: 'paid' })
      .eq('payment_id', paymentId)

    if (certError) return { success: false, error: 'Erreur de mise a jour des certifications.' }

    revalidatePath('/dashboard/owner')
    revalidatePath('/dashboard/owner/certifier')
    revalidatePath('/dashboard/admin/certifications')

    return { success: true }
  } catch (error) {
    console.error('Error in simulatePaymentSuccess:', error)
    return { success: false, error: 'Erreur inattendue.' }
  }
}

/**
 * Simulate a failed payment.
 */
export async function simulatePaymentFailure(paymentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Non autorise.' }

    await supabase
      .from('payments')
      .update({ status: 'failed' })
      .eq('id', paymentId)
      .eq('payer_id', user.id)

    return { success: true }
  } catch (error) {
    console.error('Error in simulatePaymentFailure:', error)
    return { success: false, error: 'Erreur inattendue.' }
  }
}

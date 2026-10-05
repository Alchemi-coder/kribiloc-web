'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. Toggle favorite
export async function toggleFavorite(propertyId: string): Promise<{ success: boolean; isFavorited: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, isFavorited: false, error: 'Non autorisé' }
    }

    const { data: existingFavorite, error: fetchError } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      return { success: false, isFavorited: false, error: 'Erreur lors de la vérification du favori' }
    }

    if (existingFavorite) {
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId)

      if (deleteError) throw deleteError
      
      revalidatePath('/favoris')
      revalidatePath(`/propriete/${propertyId}`)
      
      return { success: true, isFavorited: false }
    } else {
      const { error: insertError } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, property_id: propertyId })

      if (insertError) throw insertError

      revalidatePath('/favoris')
      revalidatePath(`/propriete/${propertyId}`)

      return { success: true, isFavorited: true }
    }
  } catch (error) {
    console.error('Error in toggleFavorite:', error)
    return { success: false, isFavorited: false, error: 'Une erreur est survenue' }
  }
}

// 2. Create visit request
export async function createVisitRequest(data: {
  propertyId: string
  ownerId: string
  preferredSlot: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Non autorisé' }
    }

    const { error } = await supabase
      .from('visit_requests')
      .insert({
        property_id: data.propertyId,
        tenant_id: user.id,
        owner_id: data.ownerId,
        preferred_slot: data.preferredSlot,
        message: data.message,
        status: 'requested'
      })

    if (error) throw error

    revalidatePath('/dashboard/tenant/visites')
    revalidatePath(`/propriete/${data.propertyId}`)

    return { success: true }
  } catch (error) {
    console.error('Error in createVisitRequest:', error)
    return { success: false, error: 'Une erreur est survenue lors de la création de la demande de visite' }
  }
}

// 3. Update visit request status (for owners)
export async function updateVisitRequest(data: {
  visitId: string
  status: 'accepted' | 'refused' | 'rescheduled'
  newSlot?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Non autorisé' }
    }

    const updateData: any = { status: data.status }
    if (data.status === 'rescheduled' && data.newSlot) {
      updateData.preferred_slot = data.newSlot
    }

    const { error } = await supabase
      .from('visit_requests')
      .update(updateData)
      .eq('id', data.visitId)
      .eq('owner_id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/owner/visites')
    
    return { success: true }
  } catch (error) {
    console.error('Error in updateVisitRequest:', error)
    return { success: false, error: 'Une erreur est survenue lors de la mise à jour de la demande de visite' }
  }
}

// 4. Create report
export async function createReport(data: {
  propertyId: string
  category: string
  description: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Non autorisé' }
    }

    const { error } = await supabase
      .from('reports')
      .insert({
        property_id: data.propertyId,
        reporter_id: user.id,
        category: data.category,
        description: data.description,
        status: 'open'
      })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error in createReport:', error)
    return { success: false, error: 'Une erreur est survenue lors du signalement' }
  }
}

// 5. Update property status
export async function updatePropertyStatus(data: {
  propertyId: string
  status: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Non autorisé' }
    }

    const { error } = await supabase
      .from('properties')
      .update({ status: data.status })
      .eq('id', data.propertyId)
      .eq('owner_id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/owner/annonces')
    revalidatePath(`/propriete/${data.propertyId}`)

    return { success: true }
  } catch (error) {
    console.error('Error in updatePropertyStatus:', error)
    return { success: false, error: 'Une erreur est survenue lors de la mise à jour du statut' }
  }
}

// 6. Update profile
export async function updateProfile(data: {
  fullName?: string
  phone?: string
  avatarUrl?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Non autorisé' }
    }

    const updateData: any = {}
    if (data.fullName !== undefined) updateData.full_name = data.fullName
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/profil')
    revalidatePath('/dashboard/owner/profil')
    revalidatePath('/dashboard/tenant/profil')
    revalidatePath('/dashboard/admin/profil')

    return { success: true }
  } catch (error) {
    console.error('Error in updateProfile:', error)
    return { success: false, error: 'Une erreur est survenue lors de la mise à jour du profil' }
  }
}

// 7. Update property (edit)
export async function updateProperty(propertyId: string, data: {
  title?: string
  description?: string
  price?: number
  deposit?: number
  advance?: number
  type?: string
  bedrooms?: number
  bathrooms?: number
  surface_area?: number
  is_furnished?: boolean
  neighborhood_id?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Non autorisé' }
    }

    const { error } = await supabase
      .from('properties')
      .update(data)
      .eq('id', propertyId)
      .eq('owner_id', user.id)

    if (error) throw error

    revalidatePath('/dashboard/owner/annonces')
    revalidatePath(`/propriete/${propertyId}`)

    return { success: true }
  } catch (error) {
    console.error('Error in updateProperty:', error)
    return { success: false, error: 'Une erreur est survenue lors de la modification de la propriété' }
  }
}

// 8. Admin: Update property moderation status
export async function adminModerateProperty(data: {
  propertyId: string
  status: 'published' | 'suspended' | 'rejected'
  reason?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Non autorisé' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Non autorisé. Rôle administrateur requis.' }
    }

    const { error } = await supabase
      .from('properties')
      .update({ 
        status: data.status,
        moderation_reason: data.reason || null
      })
      .eq('id', data.propertyId)

    if (error) throw error

    revalidatePath('/dashboard/admin/moderation')
    revalidatePath(`/propriete/${data.propertyId}`)

    return { success: true }
  } catch (error) {
    console.error('Error in adminModerateProperty:', error)
    return { success: false, error: 'Une erreur est survenue lors de la modération' }
  }
}

// 9. Admin: Update visit request (admin override)
export async function adminUpdateVisitRequest(data: {
  visitId: string
  status: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Non autorisé' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Non autorisé. Rôle administrateur requis.' }
    }

    const { error } = await supabase
      .from('visit_requests')
      .update({ status: data.status })
      .eq('id', data.visitId)

    if (error) throw error

    revalidatePath('/dashboard/admin/visites')
    
    return { success: true }
  } catch (error) {
    console.error('Error in adminUpdateVisitRequest:', error)
    return { success: false, error: 'Une erreur est survenue lors de la mise à jour de la visite' }
  }
}

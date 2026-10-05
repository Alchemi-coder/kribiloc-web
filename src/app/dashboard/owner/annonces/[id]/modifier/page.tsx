import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import EditListingForm from './EditListingForm'

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  // Vérifier le rôle
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'owner') {
    redirect('/dashboard')
  }

  // Récupérer l'annonce avec ses médias (uniquement si elle appartient à l'utilisateur)
  const { data: property, error } = await supabase
    .from('properties')
    .select(`
      *,
      property_media ( id, url, is_primary, order_index )
    `)
    .eq('id', id)
    .eq('owner_id', user.id)
    .single()

  if (error || !property) {
    notFound()
  }

  // Trier les médias
  const media = property.property_media || []
  media.sort((a: any, b: any) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return (a.order_index || 0) - (b.order_index || 0)
  })

  // Récupérer les quartiers actifs
  const { data: neighborhoods } = await supabase
    .from('neighborhoods')
    .select('id, name')
    .eq('active', true)
    .order('name')

  return (
    <EditListingForm 
      property={property} 
      media={media} 
      neighborhoods={neighborhoods || []} 
      userId={user.id} 
    />
  )
}

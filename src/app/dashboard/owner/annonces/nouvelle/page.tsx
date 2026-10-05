import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NewListingForm from './NewListingForm'

export default async function NewListingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'owner') {
    redirect('/dashboard')
  }

  const { data: neighborhoods } = await supabase
    .from('neighborhoods')
    .select('id, name')
    .eq('active', true)
    .order('name')

  return (
    <NewListingForm
      neighborhoods={neighborhoods ?? []}
      userId={user.id}
    />
  )
}

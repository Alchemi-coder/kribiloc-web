import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default async function NewListingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/connexion')
  }

  // Verify role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'owner') {
    redirect('/dashboard')
  }

  // Get active neighborhoods for the form
  const { data: neighborhoods } = await supabase
    .from('neighborhoods')
    .select('id, name')
    .eq('active', true)
    .order('name')

  const createListing = async (formData: FormData) => {
    'use server'
    
    const supabaseServer = await createClient()
    const { data: { user } } = await supabaseServer.auth.getUser()
    if (!user) return

    const title = formData.get('title') as string
    const type = formData.get('type') as string
    const price = parseFloat(formData.get('price') as string)
    const neighborhood_id = formData.get('neighborhood_id') as string
    const bedrooms = parseInt(formData.get('bedrooms') as string) || 0
    const bathrooms = parseInt(formData.get('bathrooms') as string) || 0
    const surface_area = parseFloat(formData.get('surface_area') as string) || 0
    const description = formData.get('description') as string
    
    if (!title || !type || !price) return

    const { data, error } = await supabaseServer
      .from('properties')
      .insert({
        owner_id: user.id,
        title,
        type,
        price,
        neighborhood_id: neighborhood_id || null,
        bedrooms,
        bathrooms,
        surface_area,
        description,
        availability_status: 'draft'
      })
      .select('id')
      .single()

    if (!error && data) {
      redirect('/dashboard/owner/annonces')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/owner/annonces" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à mes annonces
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8 border-b border-gray-100 pb-6">
            <h1 className="text-2xl font-bold text-gray-900">Publier une annonce</h1>
            <p className="text-gray-500 mt-1">Veuillez remplir les informations de votre bien immobilier.</p>
          </div>
          
          <form action={createListing} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Titre de l'annonce <span className="text-red-500">*</span></label>
                <input name="title" type="text" required className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" placeholder="ex: Grand appartement vue mer à Ngoyè" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type de bien <span className="text-red-500">*</span></label>
                <select name="type" required className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all">
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison / Villa</option>
                  <option value="studio">Studio</option>
                  <option value="chambre">Chambre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prix (FCFA / mois) <span className="text-red-500">*</span></label>
                <input name="price" type="number" required min={0} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" placeholder="ex: 150000" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quartier (Kribi)</label>
                <select name="neighborhood_id" className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all">
                  <option value="">Sélectionner un quartier...</option>
                  {neighborhoods?.map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Surface (m²)</label>
                <input name="surface_area" type="number" min={0} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" placeholder="ex: 80" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Chambres</label>
                <input name="bedrooms" type="number" min={0} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" placeholder="ex: 2" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Salles de bain</label>
                <input name="bathrooms" type="number" min={0} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" placeholder="ex: 1" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea name="description" rows={5} className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b] transition-all" placeholder="Décrivez votre bien en détail..."></textarea>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button type="submit" className="bg-[#e4002b] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#c5001f] transition-colors shadow-sm flex items-center">
                <Save className="w-5 h-5 mr-2" />
                Enregistrer le brouillon
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

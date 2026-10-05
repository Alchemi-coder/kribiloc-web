import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, Home, Edit3, Trash2, MapPin, Eye, Shield } from 'lucide-react'

export default async function OwnerDashboardPage() {
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

  // Fetch owner's properties — ALL statuses (draft, pending, published, etc.)
  const { data: properties } = await supabase
    .from('properties')
    .select(`
      id, 
      title, 
      price, 
      type, 
      availability_status, 
      created_at,
      neighborhoods ( name )
    `)
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Annonces</h1>
            <p className="text-gray-500 mt-1">Gérez vos biens immobiliers à Kribi</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard/owner/certifier"
              className="inline-flex items-center justify-center bg-white border-2 border-[#e4002b] text-[#e4002b] hover:bg-red-50 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm"
            >
              <Shield className="w-5 h-5 mr-2" />
              Certifier mes annonces
            </Link>
            <Link
              href="/dashboard/owner/annonces/nouvelle"
              className="inline-flex items-center justify-center bg-[#e4002b] hover:bg-[#c5001f] text-white px-6 py-3 rounded-xl font-semibold transition-all shadow hover:shadow-md"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Nouvelle annonce
            </Link>
          </div>
        </div>

        {properties && properties.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 font-semibold text-gray-600">Propriété</th>
                    <th className="p-4 font-semibold text-gray-600">Type</th>
                    <th className="p-4 font-semibold text-gray-600">Prix</th>
                    <th className="p-4 font-semibold text-gray-600">Statut</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {properties.map((property: any) => (
                    <tr key={property.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">{property.title}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {property.neighborhoods?.name || 'Kribi'}
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 capitalize">{property.type}</td>
                      <td className="p-4 font-medium text-gray-900">{property.price.toLocaleString('fr-FR')} FCFA</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          property.availability_status === 'published' ? 'bg-green-100 text-green-800' : 
                          property.availability_status === 'draft' ? 'bg-gray-100 text-gray-700' : 
                          property.availability_status === 'pending_moderation' ? 'bg-yellow-100 text-yellow-800' :
                          property.availability_status === 'rented' ? 'bg-blue-100 text-blue-800' :
                          property.availability_status === 'suspended' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {property.availability_status === 'published' ? '✓ Publiée' : 
                           property.availability_status === 'draft' ? '✏️ Brouillon' : 
                           property.availability_status === 'pending_moderation' ? '⏳ En modération' :
                           property.availability_status === 'rented' ? '🔑 Louée' :
                           property.availability_status === 'suspended' ? '⛔ Suspendue' :
                           property.availability_status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/locations/${property.id}`} className="p-2 text-gray-400 hover:text-blue-600 bg-white rounded-lg border border-gray-200 shadow-sm transition-all" title="Aperçu">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link href={`/dashboard/owner/annonces/${property.id}/modifier`} className="p-2 text-gray-400 hover:text-green-600 bg-white rounded-lg border border-gray-200 shadow-sm transition-all" title="Modifier">
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button className="p-2 text-gray-400 hover:text-red-600 bg-white rounded-lg border border-gray-200 shadow-sm transition-all" title="Supprimer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-[#e4002b] mb-4">
              <Home className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune annonce pour l'instant</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Vous n'avez pas encore créé de bien. Cliquez ci-dessous pour publier votre première annonce.</p>
            <Link
              href="/dashboard/owner/annonces/nouvelle"
              className="inline-flex items-center justify-center bg-[#e4002b] hover:bg-[#c5001f] text-white px-6 py-3 rounded-xl font-semibold transition-all shadow"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Créer ma première annonce
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

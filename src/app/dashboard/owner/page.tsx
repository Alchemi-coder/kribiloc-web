import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, Eye, Heart, MessageSquare, Calendar, Shield, TrendingUp, Plus, ChevronRight, CheckCircle, Clock, XCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function OwnerDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  // Fetch user profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'owner') {
    redirect('/dashboard')
  }

  // Fetch counts
  // Total properties
  const { count: totalProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user.id)

  // Published properties
  const { count: publishedProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user.id)
    .eq('status', 'published')

  // Visit requests
  const { count: visitRequests } = await supabase
    .from('visit_requests')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user.id)

  // Get user's property IDs for favorites
  const { data: userProperties } = await supabase
    .from('properties')
    .select('id')
    .eq('owner_id', user.id)
  
  const propertyIds = userProperties?.map(p => p.id) || []

  // Favorites
  let favoritesCount = 0
  if (propertyIds.length > 0) {
    const { count } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .in('property_id', propertyIds)
    
    favoritesCount = count || 0
  }

  // Fetch recent properties
  const { data: recentProperties } = await supabase
    .from('properties')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
<main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#e4002b] to-[#c5001f] rounded-2xl p-8 text-white mb-10 shadow-lg">
            <h1 className="text-3xl font-bold mb-2">Bienvenue, {profile.full_name || 'Propriétaire'}</h1>
            <p className="text-white/90 text-lg">Gérez vos biens immobiliers à Kribi en toute simplicité.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar (Navigation) */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <nav className="space-y-2">
                  <Link href="/dashboard/owner" className="flex items-center space-x-3 px-4 py-3 bg-red-50 text-[#e4002b] rounded-xl font-medium transition-colors">
                    <Home className="w-5 h-5" />
                    <span>Tableau de bord</span>
                  </Link>
                  <Link href="/dashboard/owner/annonces" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#e4002b] rounded-xl font-medium transition-colors">
                    <Home className="w-5 h-5" />
                    <span>Mes annonces</span>
                  </Link>
                  <Link href="/dashboard/owner/visites" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#e4002b] rounded-xl font-medium transition-colors">
                    <Calendar className="w-5 h-5" />
                    <span>Demandes de visite</span>
                  </Link>
                  <Link href="/dashboard/owner/profil" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#e4002b] rounded-xl font-medium transition-colors">
                    <Shield className="w-5 h-5" />
                    <span>Mon profil</span>
                  </Link>
                </nav>
              </div>

              {/* Quick Action Button */}
              <Link 
                href="/dashboard/owner/annonces/nouvelle"
                className="w-full flex items-center justify-center space-x-2 bg-[#e4002b] hover:bg-[#c5001f] text-white px-6 py-3.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Publier une annonce</span>
              </Link>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <Home className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-bold text-[#111315]">{totalProperties || 0}</span>
                  </div>
                  <p className="text-gray-500 font-medium">Mes annonces</p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                      <Eye className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-bold text-[#111315]">{publishedProperties || 0}</span>
                  </div>
                  <p className="text-gray-500 font-medium">Publiées</p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-bold text-[#111315]">{visitRequests || 0}</span>
                  </div>
                  <p className="text-gray-500 font-medium">Visites</p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#e4002b]">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-bold text-[#111315]">{favoritesCount}</span>
                  </div>
                  <p className="text-gray-500 font-medium">Favoris reçus</p>
                </div>
              </div>

              {/* Recent Properties */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#111315]">Annonces récentes</h2>
                  <Link href="/dashboard/owner/annonces" className="text-[#e4002b] hover:text-[#c5001f] text-sm font-medium flex items-center">
                    Voir tout <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {recentProperties && recentProperties.length > 0 ? (
                    recentProperties.map((property) => (
                      <div key={property.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                            {property.images && property.images[0] ? (
                              <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Home className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-[#111315] line-clamp-1">{property.title}</h3>
                            <p className="text-gray-500 text-sm mt-1">{new Intl.NumberFormat('fr-FR').format(property.price)} FCFA</p>
                            <div className="mt-2 flex items-center">
                              {property.status === 'published' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Publiée
                                </span>
                              ) : property.status === 'draft' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Brouillon
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {property.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end">
                          <Link 
                            href={`/dashboard/owner/annonces/${property.id}/modifier`}
                            className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Modifier
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p>Vous n'avez pas encore d'annonces.</p>
                      <Link href="/dashboard/owner/annonces/nouvelle" className="text-[#e4002b] font-medium mt-2 inline-block">
                        Créer ma première annonce
                      </Link>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
</div>
  )
}

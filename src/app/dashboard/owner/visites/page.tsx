import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Home, Calendar, Shield, MapPin, Mail, Phone } from 'lucide-react'
import VisitActions from './VisitActions'

export const dynamic = 'force-dynamic'

export default async function OwnerVisitsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'owner') {
    redirect('/dashboard')
  }

  // Fetch visit requests
  const { data: visitRequests } = await supabase
    .from('visit_requests')
    .select(`
      *,
      property:properties(id, title),
      tenant:profiles!tenant_id(full_name, phone, email)
    `)
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <nav className="space-y-2">
                  <Link href="/dashboard/owner" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#e4002b] rounded-xl font-medium transition-colors">
                    <Home className="w-5 h-5" />
                    <span>Tableau de bord</span>
                  </Link>
                  <Link href="/dashboard/owner/annonces" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#e4002b] rounded-xl font-medium transition-colors">
                    <Home className="w-5 h-5" />
                    <span>Mes annonces</span>
                  </Link>
                  <Link href="/dashboard/owner/visites" className="flex items-center space-x-3 px-4 py-3 bg-red-50 text-[#e4002b] rounded-xl font-medium transition-colors">
                    <Calendar className="w-5 h-5" />
                    <span>Demandes de visite</span>
                  </Link>
                  <Link href="/dashboard/owner/profil" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#e4002b] rounded-xl font-medium transition-colors">
                    <Shield className="w-5 h-5" />
                    <span>Mon profil</span>
                  </Link>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#111315]">Demandes de visite</h1>
                <p className="text-gray-500 mt-2">Gérez les demandes de visite pour vos propriétés.</p>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {visitRequests && visitRequests.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {visitRequests.map((request: any) => (
                      <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                          
                          <div className="space-y-3 flex-1">
                            <div>
                              <h3 className="font-bold text-lg text-[#111315]">{request.property?.title || 'Propriété supprimée'}</h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Calendar className="w-4 h-4 mr-1.5" />
                                Date souhaitée: {new Date(request.preferred_date).toLocaleDateString('fr-FR', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Coordonnées du demandeur</h4>
                              <p className="text-[#111315] font-medium">{request.tenant?.full_name || 'Utilisateur inconnu'}</p>
                              <div className="mt-2 space-y-1">
                                {request.tenant?.email && (
                                  <a href={`mailto:${request.tenant.email}`} className="flex items-center text-sm text-gray-600 hover:text-[#e4002b]">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {request.tenant.email}
                                  </a>
                                )}
                                {request.tenant?.phone && (
                                  <a href={`tel:${request.tenant.phone}`} className="flex items-center text-sm text-gray-600 hover:text-[#e4002b]">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {request.tenant.phone}
                                  </a>
                                )}
                              </div>
                            </div>

                            {request.message && (
                              <div className="text-sm text-gray-700 bg-orange-50/50 p-3 rounded-lg border border-orange-100">
                                <span className="font-medium">Message :</span> "{request.message}"
                              </div>
                            )}
                          </div>

                          <div className="flex lg:flex-col justify-end lg:justify-start items-center lg:items-end gap-3 min-w-[200px]">
                            <div className="mb-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {request.status === 'pending' ? 'En attente' :
                                 request.status === 'accepted' ? 'Acceptée' :
                                 request.status === 'rejected' ? 'Refusée' : 
                                 request.status === 'rescheduled' ? 'À replanifier' : request.status}
                              </span>
                            </div>
                            
                            <VisitActions requestId={request.id} currentStatus={request.status} />
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                      <Calendar className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#111315] mb-2">Aucune demande</h3>
                    <p className="text-gray-500 max-w-sm">
                      Vous n'avez aucune demande de visite pour le moment. Vos demandes apparaîtront ici.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

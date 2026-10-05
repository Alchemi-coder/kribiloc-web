import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Heart, Calendar, Bell, User, Search, ChevronRight, Home, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Tableau de bord - Locataire | KribiLoc',
  description: 'Gérez vos favoris, visites et profil sur KribiLoc.',
};

export default async function TenantDashboardPage() {
  const supabase = await createClient();

  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/connexion');
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch metrics
  const { count: favoritesCount } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: visitsCount } = await supabase
    .from('visit_requests')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', user.id);

  const { count: plannedVisitsCount } = await supabase
    .from('visit_requests')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', user.id)
    .eq('status', 'accepted');

  // Fetch recent visit requests
  const { data: recentVisits } = await supabase
    .from('visit_requests')
    .select(`
      id,
      status,
      created_at,
      properties (
        id,
        title
      )
    `)
    .eq('tenant_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch recent favorites
  const { data: recentFavorites } = await supabase
    .from('favorites')
    .select(`
      id,
      properties (
        id,
        title,
        price,
        neighborhood,
        images
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(4);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'requested': return { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' };
      case 'accepted': return { label: 'Acceptée', color: 'bg-green-100 text-green-800' };
      case 'refused': return { label: 'Refusée', color: 'bg-red-100 text-red-800' };
      case 'rescheduled': return { label: 'Replanifiée', color: 'bg-orange-100 text-orange-800' };
      case 'completed': return { label: 'Terminée', color: 'bg-blue-100 text-blue-800' };
      default: return { label: 'Inconnu', color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
<main className="flex-grow pt-10 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-2xl p-8 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#111315] mb-2">
                Bonjour, {profile?.full_name || 'Locataire'} 👋
              </h1>
              <p className="text-gray-500 text-lg">
                Trouvez votre logement idéal à Kribi
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link 
                href="/locations"
                className="inline-flex items-center gap-2 bg-[#e4002b] hover:bg-[#c5001f] text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                <Search className="w-5 h-5" />
                Rechercher un logement
              </Link>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#e4002b]">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Favoris</p>
                <p className="text-2xl font-bold text-[#111315]">{favoritesCount || 0}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Demandes de visite</p>
                <p className="text-2xl font-bold text-[#111315]">{visitsCount || 0}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Visites planifiées</p>
                <p className="text-2xl font-bold text-[#111315]">{plannedVisitsCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#111315]">Activité récente</h2>
                  <Link href="/dashboard/tenant/visites" className="text-sm font-medium text-[#e4002b] hover:underline flex items-center">
                    Voir tout <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                {recentVisits && recentVisits.length > 0 ? (
                  <div className="space-y-4">
                    {recentVisits.map((visit) => {
                      const statusInfo = getStatusLabel(visit.status);
                      return (
                        <div key={visit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg border border-gray-200">
                              <Calendar className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-[#111315]">{(visit.properties as any)?.title || 'Propriété inconnue'}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(visit.created_at).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Aucune activité récente.
                  </div>
                )}
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#111315] mb-6">Accès rapide</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link href="/favoris" className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <Heart className="w-8 h-8 text-[#e4002b] mb-3" />
                    <span className="font-semibold text-[#111315]">Mes favoris</span>
                  </Link>
                  <Link href="/dashboard/tenant/visites" className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <Calendar className="w-8 h-8 text-blue-500 mb-3" />
                    <span className="font-semibold text-[#111315]">Mes visites</span>
                  </Link>
                  <Link href="/dashboard/tenant/profil" className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <User className="w-8 h-8 text-gray-600 mb-3" />
                    <span className="font-semibold text-[#111315]">Mon profil</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Favorites */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#111315]">Mes favoris récents</h2>
                  <Link href="/favoris" className="text-sm font-medium text-[#e4002b] hover:underline flex items-center">
                    Voir tout <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                {recentFavorites && recentFavorites.length > 0 ? (
                  <div className="space-y-4">
                    {recentFavorites.map((fav) => {
                      const prop: any = fav.properties;
                      if (!prop) return null;
                      const image = prop.images && prop.images[0] ? prop.images[0] : null;
                      
                      return (
                        <Link href={`/locations/${prop.id}`} key={fav.id} className="flex gap-4 group">
                          <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 relative">
                            {image ? (
                              <img src={image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Home className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col justify-center">
                            <h3 className="font-semibold text-[#111315] line-clamp-1 group-hover:text-[#e4002b] transition-colors">{prop.title}</h3>
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <MapPin className="w-3 h-3 mr-1" /> {prop.neighborhood || 'Kribi'}
                            </p>
                            <p className="font-bold text-[#e4002b] mt-1">{prop.price?.toLocaleString('fr-FR')} FCFA</p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Vous n'avez pas encore de favoris.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
</div>
  );
}

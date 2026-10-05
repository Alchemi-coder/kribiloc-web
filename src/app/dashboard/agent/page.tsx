import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, Calendar, MapPin, Target } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AgentDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch profile to verify role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'agent') {
    redirect('/dashboard/locataire');
  }

  // Fetch real data counts
  const { count: propertiesCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', user.id);

  const { count: missionsCount } = await supabase
    .from('certification_visits')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', user.id);

  const { data: recentMissions } = await supabase
    .from('certification_visits')
    .select(`
      id,
      scheduled_date,
      status,
      certification_requests (
        property_id,
        properties (
          title,
          address_text
        )
      )
    `)
    .eq('agent_id', user.id)
    .order('scheduled_date', { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
<main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111315]">Espace Agent</h1>
          <p className="text-gray-500 mt-2">Bienvenue, {profile.full_name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-medium">Annonces gérées</h3>
              <div className="bg-red-50 p-2 rounded-lg">
                <Target className="w-5 h-5 text-[#e4002b]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#111315]">{propertiesCount || 0}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-medium">Missions terrain</h3>
              <div className="bg-blue-50 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#111315]">{missionsCount || 0}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-medium">Visites planifiées</h3>
              <div className="bg-orange-50 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#111315]">0</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-medium">Taux de réponse</h3>
              <div className="bg-green-50 p-2 rounded-lg">
                <ClipboardList className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#111315]">95%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#111315]">Missions récentes</h2>
                <Link href="/dashboard/agent/missions" className="text-[#e4002b] font-medium hover:underline">
                  Voir tout
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentMissions && recentMissions.length > 0 ? (
                  recentMissions.map((mission: any) => (
                    <div key={mission.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-semibold text-[#111315]">{mission.certification_requests?.properties?.title || 'Bien inconnu'}</p>
                        <p className="text-sm text-gray-500">{mission.certification_requests?.properties?.address_text}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-1
                          ${mission.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            mission.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'}`}>
                          {mission.status === 'completed' ? 'Terminée' : mission.status === 'in_progress' ? 'En cours' : 'Planifiée'}
                        </span>
                        <p className="text-xs text-gray-500">
                          {mission.scheduled_date ? new Date(mission.scheduled_date).toLocaleDateString('fr-FR') : 'Date non définie'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Aucune mission récente.</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#111315] mb-4">Actions rapides</h2>
            
            <Link href="/dashboard/agent/missions" className="block w-full p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center">
                <div className="bg-red-50 p-3 rounded-lg group-hover:bg-[#e4002b] group-hover:text-white transition-colors">
                  <MapPin className="w-5 h-5 text-[#e4002b] group-hover:text-white" />
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-[#111315]">Mes missions</p>
                  <p className="text-sm text-gray-500">Certifications sur le terrain</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/agent/catalogue" className="block w-full p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center">
                <div className="bg-red-50 p-3 rounded-lg group-hover:bg-[#e4002b] group-hover:text-white transition-colors">
                  <Target className="w-5 h-5 text-[#e4002b] group-hover:text-white" />
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-[#111315]">Mon catalogue</p>
                  <p className="text-sm text-gray-500">Gérer mes annonces</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/agent/visites" className="block w-full p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center">
                <div className="bg-red-50 p-3 rounded-lg group-hover:bg-[#e4002b] group-hover:text-white transition-colors">
                  <Calendar className="w-5 h-5 text-[#e4002b] group-hover:text-white" />
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-[#111315]">Planning visites</p>
                  <p className="text-sm text-gray-500">Rendez-vous clients</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
</div>
  );
}

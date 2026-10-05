import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export default async function AgentMissionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch missions
  const { data: missions } = await supabase
    .from('certification_visits')
    .select(`
      id,
      scheduled_date,
      status,
      notes,
      certification_requests (
        property_id,
        status,
        properties (
          title,
          address_text,
          type
        )
      )
    `)
    .eq('agent_id', user.id)
    .order('scheduled_date', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#111315]">Missions terrain</h1>
            <p className="text-gray-500 mt-2">Gérez vos visites de certification</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions && missions.length > 0 ? (
            missions.map((mission: any) => {
              const property = mission.certification_requests?.properties;
              return (
                <div key={mission.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                        ${mission.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          mission.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {mission.status === 'completed' ? 'Terminée' : mission.status === 'in_progress' ? 'En cours' : 'Planifiée'}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {property?.type || 'Bien'}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-[#111315] mb-2 line-clamp-1">
                      {property?.title || 'Titre indisponible'}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{property?.address_text || 'Adresse non renseignée'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{mission.scheduled_date ? new Date(mission.scheduled_date).toLocaleString('fr-FR', {
                          dateStyle: 'long',
                          timeStyle: 'short'
                        }) : 'Date à définir'}</span>
                      </div>
                    </div>
                    
                    {mission.notes && (
                      <p className="text-sm text-gray-500 italic line-clamp-2 mt-4 bg-gray-50 p-3 rounded-lg">
                        "{mission.notes}"
                      </p>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    {mission.status === 'completed' ? (
                      <div className="flex items-center justify-center text-green-600 py-2">
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        <span className="font-medium">Rapport soumis</span>
                      </div>
                    ) : (
                      <Link 
                        href={`/dashboard/agent/terrain?mission=${mission.id}`}
                        className="flex items-center justify-center w-full bg-[#e4002b] text-white rounded-xl py-3 font-semibold hover:bg-[#c5001f] transition-colors"
                      >
                        Démarrer la mission
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#111315] mb-2">Aucune mission</h3>
              <p className="text-gray-500">Vous n'avez aucune mission assignée pour le moment.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

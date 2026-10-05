import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Clock, MessageSquare, Phone, Home, Search, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Mes demandes de visite | KribiLoc',
  description: 'Suivez l\'état de vos demandes de visite sur KribiLoc.',
};

export default async function TenantVisitsPage() {
  const supabase = await createClient();

  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/connexion');
  }

  // Fetch visit requests
  const { data: visits } = await supabase
    .from('visit_requests')
    .select(`
      id,
      status,
      preferred_date,
      message,
      created_at,
      properties (
        id,
        title,
        price,
        type,
        owner_id
      )
    `)
    .eq('tenant_id', user.id)
    .order('created_at', { ascending: false });

  // If there are visits, fetch owner profiles
  let visitsWithOwnerData = visits || [];
  
  if (visits && visits.length > 0) {
    const ownerIds = [...new Set(visits.map((v: any) => v.properties?.owner_id).filter(Boolean))];
    
    if (ownerIds.length > 0) {
      const { data: owners } = await supabase
        .from('profiles')
        .select('id, full_name, phone')
        .in('id', ownerIds);
        
      const ownerMap = new Map((owners || []).map(o => [o.id, o]));
      
      visitsWithOwnerData = visits.map((visit: any) => ({
        ...visit,
        owner: visit.properties?.owner_id ? ownerMap.get(visit.properties.owner_id) : null
      }));
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested': return <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">En attente</span>;
      case 'accepted': return <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Acceptée</span>;
      case 'refused': return <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Refusée</span>;
      case 'rescheduled': return <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">Replanifiée</span>;
      case 'completed': return <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">Terminée</span>;
      default: return <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">Inconnu</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
<main className="flex-grow pt-10 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#111315] mb-2">Mes demandes de visite</h1>
            <p className="text-gray-500">Suivez l'état de vos rendez-vous pour visiter des logements.</p>
          </div>

          {!visitsWithOwnerData || visitsWithOwnerData.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-[#111315] mb-2">Aucune demande de visite</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Vous n'avez pas encore fait de demande de visite. Parcourez nos annonces pour trouver votre prochain logement.
              </p>
              <Link 
                href="/locations"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-full text-white bg-[#e4002b] hover:bg-[#c5001f] transition-colors"
              >
                <Search className="w-5 h-5 mr-2" />
                Rechercher des logements
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {visitsWithOwnerData.map((visit: any) => (
                <div key={visit.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(visit.status)}
                        <span className="text-sm text-gray-500">
                          Demandée le {new Date(visit.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#111315] mb-1">
                        {visit.properties?.title || 'Annonce supprimée'}
                      </h3>
                      {visit.properties && (
                        <p className="text-[#e4002b] font-semibold">
                          {visit.properties.price?.toLocaleString('fr-FR')} FCFA / mois
                        </p>
                      )}
                    </div>
                    
                    {visit.properties && (
                      <Link 
                        href={`/locations/${visit.properties.id}`}
                        className="inline-flex items-center text-sm font-semibold text-[#111315] hover:text-[#e4002b] transition-colors whitespace-nowrap"
                      >
                        Voir l'annonce <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-4">
                    <div className="space-y-3">
                      <div className="flex items-start text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                        <div>
                          <p className="font-medium text-[#111315]">Créneau souhaité</p>
                          <p>{visit.preferred_date ? new Date(visit.preferred_date).toLocaleString('fr-FR', {
                            dateStyle: 'long',
                            timeStyle: 'short'
                          }) : 'Non spécifié'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start text-sm text-gray-600">
                        <MessageSquare className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                        <div>
                          <p className="font-medium text-[#111315]">Votre message</p>
                          <p className="line-clamp-2 italic">{visit.message || 'Aucun message'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start text-sm text-gray-600">
                        <Home className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                        <div>
                          <p className="font-medium text-[#111315]">Propriétaire</p>
                          <p>{visit.owner?.full_name || 'Inconnu'}</p>
                        </div>
                      </div>
                      
                      {visit.status === 'accepted' && visit.owner?.phone && (
                        <div className="flex items-start text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2 mt-0.5 text-green-500" />
                          <div>
                            <p className="font-medium text-[#111315]">Contact</p>
                            <p className="font-semibold text-green-600">{visit.owner.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
        </div>
      </main>
</div>
  );
}

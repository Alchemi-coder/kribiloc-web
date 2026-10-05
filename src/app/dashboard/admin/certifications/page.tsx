import { createClient } from '@/lib/supabase/server';
import { BadgeCheck, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { CertificationActions } from './CertificationActions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default async function CertificationsPage() {
  const supabase = await createClient();
  
  // Fetch certifications
  const { data: requests, error } = await supabase
    .from('certification_requests')
    .select(`
      id,
      status,
      created_at,
      amount,
      properties:property_id (title, property_type),
      requester:requester_id (full_name),
      agent:assigned_agent_id (full_name)
    `)
    .order('created_at', { ascending: false });

  // Fetch agents for the dropdown
  const { data: agents } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'agent'); // Adjust if role field differs

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string, classes: string }> = {
      'awaiting_payment': { label: 'En attente paiement', classes: 'bg-gray-100 text-gray-800' },
      'paid': { label: 'Payé', classes: 'bg-blue-100 text-blue-800' },
      'queued': { label: 'En file', classes: 'bg-purple-100 text-purple-800' },
      'scheduled': { label: 'Programmé', classes: 'bg-indigo-100 text-indigo-800' },
      'in_progress': { label: 'En cours', classes: 'bg-orange-100 text-orange-800' },
      'submitted': { label: 'À valider', classes: 'bg-yellow-100 text-yellow-800' },
      'approved': { label: 'Approuvé', classes: 'bg-green-100 text-green-800' },
      'rejected': { label: 'Rejeté', classes: 'bg-red-100 text-red-800' },
    };
    
    const badge = badges[status] || { label: status, classes: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${badge.classes}`}>{badge.label}</span>;
  };

  // Stats for summary cards
  const stats = {
    total: requests?.length || 0,
    paid: requests?.filter((r: any) => r.status === 'paid' || r.status === 'queued').length || 0,
    inProgress: requests?.filter((r: any) => ['scheduled', 'in_progress', 'submitted'].includes(r.status)).length || 0,
    completed: requests?.filter((r: any) => r.status === 'approved').length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
<main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
          {/* Sidebar Admin */}
          <aside className="w-64 flex-shrink-0 hidden md:block">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sticky top-6">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Menu Admin</h2>
              <nav className="flex flex-col gap-1">
                <Link href="/dashboard/admin/parametres" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                  Paramètres
                </Link>
                <Link href="/dashboard/admin/audit" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                  Journal d'audit
                </Link>
                <Link href="/dashboard/admin/moderation" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                  Modération
                </Link>
                <Link href="/dashboard/admin/certifications" className="flex items-center gap-3 px-3 py-2 bg-[#e4002b]/10 text-[#e4002b] rounded-xl font-medium transition-colors">
                  <BadgeCheck className="w-5 h-5" />
                  Certifications
                </Link>
              </nav>
            </div>
          </aside>

          {/* Contenu principal */}
          <div className="flex-grow">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#111315]">Gestion des Certifications</h1>
              <p className="text-gray-500 mt-2">Gérez les demandes de certification et assignez des agents.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Total demandes</p>
                <p className="text-2xl font-bold text-[#111315] mt-1">{stats.total}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Payées en attente</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.paid}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500">En cours</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{stats.inProgress}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Terminées</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Propriété & Demandeur</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Agent assigné</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Montant</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(!requests || requests.length === 0) ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <BadgeCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">Aucune demande de certification</p>
                        </td>
                      </tr>
                    ) : (
                      requests.map((request: any) => (
                        <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-[#111315]">
                              {request.properties?.title || 'Annonce supprimée'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Par: {request.requester?.full_name || 'Inconnu'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(request.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {request.agent?.full_name || <span className="text-gray-400 italic">Non assigné</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {format(new Date(request.created_at), 'dd MMM yyyy', { locale: fr })}
                            </div>
                            <div className="text-sm font-semibold text-[#e4002b] mt-1">
                              {request.amount?.toLocaleString()} FCFA
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <CertificationActions 
                              requestId={request.id} 
                              status={request.status} 
                              agents={agents || []} 
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
</div>
  );
}

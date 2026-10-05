import { createClient } from '@/lib/supabase/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Activity, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default async function AuditLogsPage() {
  const supabase = await createClient();
  
  // Fetch logs joined with user profile
  const { data: logs, error } = await supabase
    .from('audit_logs')
    .select(`
      id,
      created_at,
      action,
      entity_type,
      entity_id,
      old_data,
      new_data,
      actor_id,
      profiles:actor_id (full_name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  const getActionColor = (action: string) => {
    switch (action?.toUpperCase()) {
      case 'CREATE': return 'bg-green-100 text-green-800 border-green-200';
      case 'UPDATE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELETE': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action?.toUpperCase()) {
      case 'CREATE': return 'CRÉATION';
      case 'UPDATE': return 'MODIFICATION';
      case 'DELETE': return 'SUPPRESSION';
      default: return action?.toUpperCase() || 'INCONNU';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
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
                <Link href="/dashboard/admin/audit" className="flex items-center gap-3 px-3 py-2 bg-[#e4002b]/10 text-[#e4002b] rounded-xl font-medium">
                  <Activity className="w-5 h-5" />
                  Journal d'audit
                </Link>
                <Link href="/dashboard/admin/moderation" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                  Modération
                </Link>
                <Link href="/dashboard/admin/certifications" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                  Certifications
                </Link>
              </nav>
            </div>
          </aside>

          {/* Contenu principal */}
          <div className="flex-grow">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#111315]">Journal d'audit</h1>
              <p className="text-gray-500 mt-2">Historique immuable des actions sensibles (100 dernières entrées)</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Dernières activités du système</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date/Heure</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acteur</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entité</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Entité</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Détails</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(!logs || logs.length === 0) ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          Aucune action enregistrée
                        </td>
                      </tr>
                    ) : (
                      logs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {format(new Date(log.created_at), 'dd MMM yyyy, HH:mm', { locale: fr })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-[#111315]">
                              {log.profiles?.full_name || 'Système'}
                            </div>
                            {log.profiles?.email && (
                              <div className="text-xs text-gray-500">{log.profiles.email}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getActionColor(log.action)}`}>
                              {getActionLabel(log.action)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                            {log.entity_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                            {log.entity_id?.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <details className="group cursor-pointer">
                              <summary className="text-[#e4002b] font-medium outline-none">Voir les données</summary>
                              <div className="mt-2 p-3 bg-gray-900 rounded-xl text-gray-300 text-xs font-mono overflow-x-auto max-w-xs">
                                {log.old_data && (
                                  <div className="mb-2">
                                    <span className="text-red-400">Ancien:</span> {JSON.stringify(log.old_data)}
                                  </div>
                                )}
                                {log.new_data && (
                                  <div>
                                    <span className="text-green-400">Nouveau:</span> {JSON.stringify(log.new_data)}
                                  </div>
                                )}
                              </div>
                            </details>
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
      
      <Footer />
    </div>
  );
}

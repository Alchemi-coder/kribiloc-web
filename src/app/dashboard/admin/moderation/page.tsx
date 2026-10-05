import { createClient } from '@/lib/supabase/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { ModerationActions } from './ModerationActions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default async function ModerationPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const supabase = await createClient();
  const params = await searchParams;
  const currentTab = params.tab || 'pending';
  
  let query = supabase
    .from('properties')
    .select(`
      id,
      title,
      property_type,
      price,
      created_at,
      status,
      owner_id,
      profiles:owner_id (full_name)
    `)
    .order('created_at', { ascending: false });

  if (currentTab === 'pending') {
    query = query.in('status', ['pending_moderation', 'draft']);
  }

  const { data: properties, error } = await query;

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
                <Link href="/dashboard/admin/audit" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                  Journal d'audit
                </Link>
                <Link href="/dashboard/admin/moderation" className="flex items-center gap-3 px-3 py-2 bg-[#e4002b]/10 text-[#e4002b] rounded-xl font-medium transition-colors">
                  <ShieldCheck className="w-5 h-5" />
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
              <h1 className="text-3xl font-bold text-[#111315]">Modération des Annonces</h1>
              <p className="text-gray-500 mt-2">Validez ou rejetez les nouvelles annonces soumises.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 flex items-center bg-gray-50/50 px-2 pt-2">
                <Link 
                  href="?tab=pending"
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${currentTab === 'pending' ? 'border-[#e4002b] text-[#e4002b]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  En attente ({currentTab === 'pending' ? properties?.length || 0 : '?'})
                </Link>
                <Link 
                  href="?tab=all"
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${currentTab === 'all' ? 'border-[#e4002b] text-[#e4002b]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  Toutes les annonces
                </Link>
              </div>
              
              <div className="p-4 grid grid-cols-1 gap-4">
                {(!properties || properties.length === 0) ? (
                  <div className="text-center py-12 text-gray-500">
                    <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="font-medium text-gray-700">Aucune annonce à modérer</p>
                    <p className="text-sm">Tout est à jour !</p>
                  </div>
                ) : (
                  properties.map((property: any) => (
                    <div key={property.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-[#111315]">{property.title}</h3>
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">
                            {property.property_type}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                          <span className="font-semibold text-[#e4002b]">{property.price?.toLocaleString()} FCFA</span>
                          <span>•</span>
                          <span>Par: <span className="font-medium text-gray-700">{property.profiles?.full_name || 'Inconnu'}</span></span>
                          <span>•</span>
                          <span>{format(new Date(property.created_at), 'dd MMM yyyy', { locale: fr })}</span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <ModerationActions propertyId={property.id} initialStatus={property.status} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

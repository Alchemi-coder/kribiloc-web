import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ReportActions from './ReportActions'
import { AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SignalementsAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (adminProfile?.role !== 'admin' && adminProfile?.role !== 'super_admin') {
    redirect('/dashboard')
  }

  const { data: reports } = await supabase
    .from('reports')
    .select('*, profiles!reporter_id(full_name), properties!property_id(title)')
    .order('created_at', { ascending: false })

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'open': return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Nouveau</span>
      case 'in_review': return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">En cours</span>
      case 'resolved': return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Résolu</span>
      case 'dismissed': return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Rejeté</span>
      default: return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  const getCategoryName = (cat: string) => {
    const map: Record<string, string> = {
      'scam': 'Arnaque',
      'inaccurate': 'Informations inexactes',
      'unavailable': 'Déjà loué/vendu',
      'inappropriate': 'Contenu inapproprié',
      'other': 'Autre'
    }
    return map[cat] || cat
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#111315]">Gestion des signalements</h1>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {reports?.map((report: any) => (
              <div key={report.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start">
                <div className="bg-red-50 p-3 rounded-full flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-[#e4002b]" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-[#111315] mb-1">
                        Annonce: {(report.properties as any)?.title || 'Introuvable'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Signalé par {(report.profiles as any)?.full_name || 'Utilisateur inconnu'} • {new Date(report.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      {getStatusBadge(report.status)}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-semibold text-gray-700 rounded mb-2">
                      Catégorie: {getCategoryName(report.category)}
                    </span>
                    <p className="text-gray-700 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      {report.description}
                    </p>
                  </div>
                  
                  <div className="flex justify-end border-t pt-4 border-gray-100">
                    <ReportActions reportId={report.id} currentStatus={report.status} />
                  </div>
                </div>
              </div>
            ))}

            {(!reports || reports.length === 0) && (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-500">
                Aucun signalement trouvé.
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

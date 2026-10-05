import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  Home, 
  CheckCircle, 
  Clock, 
  Users, 
  Calendar, 
  CreditCard, 
  AlertTriangle, 
  Shield,
  Settings,
  MapPin
} from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
    redirect('/dashboard')
  }

  // Fetch KPIs
  const [
    { count: totalProperties },
    { count: publishedProperties },
    { count: pendingProperties },
    { count: totalUsers },
    { count: totalVisits },
    { count: totalPayments },
    { count: totalReports },
    { count: totalCertifications },
  ] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('availability_status', 'published'),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('availability_status', 'pending_moderation'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('visit_requests').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('*', { count: 'exact', head: true }),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('certification_requests').select('*', { count: 'exact', head: true })
  ])

  const kpis = [
    { title: 'Annonces totales', value: totalProperties || 0, icon: <Home className="w-6 h-6 text-blue-500" />, bgColor: 'bg-blue-50' },
    { title: 'Publiées', value: publishedProperties || 0, icon: <CheckCircle className="w-6 h-6 text-green-500" />, bgColor: 'bg-green-50' },
    { title: 'En attente', value: pendingProperties || 0, icon: <Clock className="w-6 h-6 text-yellow-500" />, bgColor: 'bg-yellow-50' },
    { title: 'Utilisateurs', value: totalUsers || 0, icon: <Users className="w-6 h-6 text-purple-500" />, bgColor: 'bg-purple-50' },
    { title: 'Demandes visite', value: totalVisits || 0, icon: <Calendar className="w-6 h-6 text-blue-500" />, bgColor: 'bg-blue-50' },
    { title: 'Paiements', value: totalPayments || 0, icon: <CreditCard className="w-6 h-6 text-green-500" />, bgColor: 'bg-green-50' },
    { title: 'Signalements', value: totalReports || 0, icon: <AlertTriangle className="w-6 h-6 text-red-500" />, bgColor: 'bg-red-50' },
    { title: 'Certifications', value: totalCertifications || 0, icon: <Shield className="w-6 h-6 text-teal-500" />, bgColor: 'bg-teal-50' },
  ]

  const quickLinks = [
    { title: 'Utilisateurs', description: 'Gérer les membres et rôles', icon: <Users className="w-6 h-6 text-[#e4002b]" />, href: '/dashboard/admin/utilisateurs' },
    { title: 'Paiements', description: 'Suivi financier et transactions', icon: <CreditCard className="w-6 h-6 text-[#e4002b]" />, href: '/dashboard/admin/paiements' },
    { title: 'Signalements', description: 'Traiter les plaintes', icon: <AlertTriangle className="w-6 h-6 text-[#e4002b]" />, href: '/dashboard/admin/signalements' },
    { title: 'Quartiers', description: 'Gérer la base géographique', icon: <MapPin className="w-6 h-6 text-[#e4002b]" />, href: '/dashboard/admin/quartiers' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
<main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#111315]">Administration KribiLoc</h1>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex items-center space-x-4">
                <div className={`p-4 rounded-full ${kpi.bgColor}`}>
                  {kpi.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{kpi.title}</p>
                  <p className="text-2xl font-bold text-[#111315]">{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-[#111315] mb-6">Accès rapides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, idx) => (
              <Link key={idx} href={link.href}>
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all cursor-pointer h-full">
                  <div className="mb-4">
                    {link.icon}
                  </div>
                  <h3 className="font-semibold text-[#111315] mb-2">{link.title}</h3>
                  <p className="text-sm text-gray-500">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
</div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Heart,
  Calendar,
  User,
  Home as HomeIcon,
  ShieldCheck,
  MapPin,
  BookOpen,
  Settings,
  Users,
  CreditCard,
  AlertTriangle,
  Map,
  Activity,
  Menu,
  X
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  role: 'tenant' | 'owner' | 'agent' | 'admin'
  currentPath: string
}

export default function DashboardLayout({ children, role, currentPath }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const getMenuItems = () => {
    switch (role) {
      case 'tenant':
        return [
          { name: 'Tableau de bord', path: '/dashboard/tenant', icon: LayoutDashboard },
          { name: 'Mes favoris', path: '/favoris', icon: Heart },
          { name: 'Mes visites', path: '/dashboard/tenant/visites', icon: Calendar },
          { name: 'Mon profil', path: '/dashboard/tenant/profil', icon: User },
        ]
      case 'owner':
        return [
          { name: 'Tableau de bord', path: '/dashboard/owner', icon: LayoutDashboard },
          { name: 'Mes annonces', path: '/dashboard/owner/annonces', icon: HomeIcon },
          { name: 'Demandes de visite', path: '/dashboard/owner/visites', icon: Calendar },
          { name: 'Certification', path: '/dashboard/owner/certification', icon: ShieldCheck },
          { name: 'Profil', path: '/dashboard/owner/profil', icon: User },
        ]
      case 'agent':
        return [
          { name: 'Tableau de bord', path: '/dashboard/agent', icon: LayoutDashboard },
          { name: 'Missions terrain', path: '/dashboard/agent/missions', icon: MapPin },
          { name: 'Visites', path: '/dashboard/agent/visites', icon: Calendar },
          { name: 'Catalogue', path: '/dashboard/agent/catalogue', icon: BookOpen },
          { name: 'Profil', path: '/dashboard/agent/profil', icon: User },
        ]
      case 'admin':
        return [
          { name: 'Dashboard', path: '/dashboard/admin', icon: LayoutDashboard },
          { name: 'Modération', path: '/dashboard/admin/moderation', icon: ShieldCheck },
          { name: 'Certifications', path: '/dashboard/admin/certifications', icon: ShieldCheck },
          { name: 'Utilisateurs', path: '/dashboard/admin/utilisateurs', icon: Users },
          { name: 'Paiements', path: '/dashboard/admin/paiements', icon: CreditCard },
          { name: 'Signalements', path: '/dashboard/admin/signalements', icon: AlertTriangle },
          { name: 'Quartiers', path: '/dashboard/admin/quartiers', icon: Map },
          { name: 'Paramètres', path: '/dashboard/admin/parametres', icon: Settings },
          { name: 'Audit', path: '/dashboard/admin/audit', icon: Activity },
        ]
      default:
        return []
    }
  }

  const menuItems = getMenuItems()
  const roleNames = {
    tenant: 'Locataire',
    owner: 'Propriétaire',
    agent: 'Agent Terrain',
    admin: 'Administrateur'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 md:hidden">
          <span className="font-bold text-[#e4002b]">Menu</span>
          <button onClick={toggleSidebar} className="p-2 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => {
              const isActive = currentPath === item.path || (currentPath !== '/' && item.path !== '/' && currentPath.startsWith(item.path) && item.path !== `/dashboard/${role}`)
              const isExactActive = currentPath === item.path

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isExactActive || isActive
                      ? 'bg-red-50 text-[#e4002b] border-l-4 border-[#e4002b]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#111315]'}
                  `}
                >
                  <item.icon className={`mr-3 w-5 h-5 ${isExactActive || isActive ? 'text-[#e4002b]' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-[#111315]">
              Espace {roleNames[role]}
            </h1>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 hidden sm:block">Bonjour!</span>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

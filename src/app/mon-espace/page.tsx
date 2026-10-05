import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  MessageSquare, Heart, Bell, History, 
  FolderOpen, Home, Calculator, Coins, 
  Wrench, User, Smartphone, Sparkles, Search, Clock
} from 'lucide-react'
import { LogoutButton } from './LogoutButton'

export default async function MonEspacePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/connexion')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const firstName = profile?.full_name?.split(' ')[0] || ''

  const cards = [
    { icon: MessageSquare, title: 'Messages', desc: 'Recevoir et envoyer des messages' },
    { icon: Heart, title: 'Favoris', desc: 'Retrouver vos biens enregistrés' },
    { icon: Bell, title: 'Mes recherches', desc: 'Gérer vos recherches sauvegardées' },
    { icon: History, title: 'Consultés', desc: 'Retrouvez vos biens récemment consultés.' },
    { icon: FolderOpen, title: 'Mon profil locataire', desc: 'Compléter votre profil' },
    { icon: Home, title: 'Mes annonces', desc: 'Annonces déposées et contacts' },
    { icon: Calculator, title: 'Mes estimations', desc: 'Retrouvez vos estimations passées' },
    { icon: Coins, title: 'Financement', desc: 'Estimer votre prêt immobilier' },
    { icon: Wrench, title: 'Outils & Services', desc: 'Agents immo, carte des prix et plus' },
    { icon: User, title: 'Compte', desc: 'Données personnelles et plus' },
  ]

  return (
    <div className="min-h-screen bg-white pb-12">
      
      {/* Top Red Banner */}
      <div className="bg-[#e4002b] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto pl-2 sm:pl-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">
            Bonjour {firstName ? `${firstName} !` : '!'}
          </h1>
          <p className="text-white/90 text-sm sm:text-base font-medium">
            Bienvenue dans votre espace personnel
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group flex flex-col items-start"
            >
              <card.icon className="w-5 h-5 text-gray-700 mb-6 group-hover:text-[#e4002b] transition-colors stroke-[1.5]" />
              <h3 className="font-bold text-gray-900 text-[14px] mb-1.5">{card.title}</h3>
              <p className="text-[13px] text-gray-500 font-medium leading-snug">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile App Banner — Annonce honnête : Application bientôt disponible */}
        <div className="mt-12 bg-[#e4002b] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              Arrive bientôt
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-snug">
              L&apos;application mobile KribiLoc arrive très bientôt !
            </h2>

            <p className="text-white/90 mb-8 font-normal text-sm md:text-base leading-relaxed">
              Nos équipes travaillent activement au développement de l&apos;application. Vous pourrez bientôt gérer vos annonces, recevoir des alertes instantanées de nouveaux logements à Kribi et échanger directement depuis votre smartphone.
            </p>
            
            <div className="bg-white rounded-2xl p-5 shadow-sm text-gray-900 max-w-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 rounded-xl text-[#e4002b] shrink-0">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900 text-sm">
                      Bientôt disponible sur Android et iOS
                    </h4>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      En préparation
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4 leading-normal">
                    L&apos;application est actuellement en phase de test. Elle sera disponible prochainement sur Google Play et l&apos;App Store.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <div className="bg-gray-900 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      App Store · Sortie prochaine
                    </div>
                    <div className="bg-gray-900 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Google Play · Sortie prochaine
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Phone Mockup Preview */}
          <div className="hidden md:block relative z-10 w-64 h-64 mt-8 md:mt-0">
            <div className="w-48 h-[340px] bg-black rounded-[2.5rem] border-[6px] border-black mx-auto overflow-hidden relative shadow-2xl rotate-12 translate-y-16 translate-x-8">
              {/* Screen content */}
              <div className="bg-white h-full w-full relative">
                {/* Status Bar */}
                <div className="absolute top-0 inset-x-0 h-6 bg-[#e4002b] flex justify-between items-center px-4">
                  <div className="text-[8px] text-white font-medium">12:00</div>
                  <div className="flex gap-1">
                    <div className="w-3 h-2 border border-white rounded-[2px]"></div>
                    <div className="w-4 h-2 bg-white rounded-[2px]"></div>
                  </div>
                </div>

                {/* App Header */}
                <div className="bg-[#e4002b] h-32 w-full pt-10 px-4">
                  <div className="text-white font-bold text-lg leading-tight">KribiLoc Mobile</div>
                  <div className="text-white/90 text-[10px] mb-3">Version 1.0 en test</div>
                  <div className="bg-white/20 text-white text-[9px] font-semibold px-2.5 py-1 rounded-full inline-block backdrop-blur-xs">
                    Arrive bientôt
                  </div>
                </div>

                {/* Content mockup */}
                <div className="p-4 bg-gray-50 h-full">
                  <div className="font-bold text-xs text-gray-800 mb-2">Aperçu exclusif</div>
                  <div className="bg-white p-2.5 rounded-lg shadow-xs border border-gray-100 flex flex-col gap-1.5">
                    <span className="text-[9px] font-semibold text-gray-800">Alertes temps réel</span>
                    <span className="text-[8px] text-gray-500">Notifications instantanées dès qu&apos;un bien est publié à Kribi.</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg shadow-xs border border-gray-100 flex flex-col gap-1.5 mt-2">
                    <span className="text-[9px] font-semibold text-gray-800">Messagerie directe</span>
                    <span className="text-[8px] text-gray-500">Discutez en direct avec les propriétaires certifiés.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <LogoutButton />
      </div>
    </div>
  )
}

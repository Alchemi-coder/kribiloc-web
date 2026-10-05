import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Search, Home, ShieldCheck, Heart, ArrowRight, Bed, Bath, Maximize } from 'lucide-react'

export default async function DashboardPage() {
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

  if (profile?.role === 'owner') {
    redirect('/dashboard/owner')
  }

  if (profile?.role === 'admin' || profile?.role === 'super_admin') {
    redirect('/dashboard/admin')
  }

  if (profile?.role === 'agent') {
    redirect('/dashboard/agent')
  }

  // Locataire / visiteur -> dashboard tenant
  redirect('/dashboard/tenant')

  const firstName = profile?.full_name?.split(' ')[0] || 'Utilisateur'

  // Fetch recent properties properly according to schema
  const { data: recentProperties } = await supabase
    .from('properties')
    .select(`
      id, 
      title, 
      price, 
      type, 
      surface_area, 
      bedrooms, 
      bathrooms,
      neighborhoods ( name, city ),
      property_media ( storage_path )
    `)
    .eq('availability_status', 'published')
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative bg-[#111315] pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/hero-illustration.jpg"
            alt="Fond KribiLoc"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111315] via-transparent to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">
            Heureux de vous revoir, {firstName} !
          </h1>
          
          {/* Search Box */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl max-w-4xl">
            <div className="flex gap-4 border-b border-gray-100 pb-4 mb-4">
              <button className="flex items-center gap-2 text-[#e4002b] font-medium border-b-2 border-[#e4002b] pb-4 -mb-[18px]">
                <Home className="w-5 h-5" />
                Louer
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Saisir un quartier (ex: Dombè, Mpangou...)"
                  className="w-full pl-12 pr-4 py-3 md:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e4002b] focus:bg-white transition-all text-gray-900"
                />
              </div>
              <button className="bg-[#e4002b] text-white px-8 py-3 md:py-4 rounded-xl font-medium hover:bg-[#c5001f] transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-red-200">
                <Search className="w-5 h-5" />
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Services / Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <Link href="/favoris" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-[#e4002b] group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Mes favoris</h3>
              <p className="text-sm text-gray-500">Retrouvez vos annonces sauvegardées</p>
            </div>
          </Link>
          
          <Link href="/certification" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">La Certification</h3>
              <p className="text-sm text-gray-500">Louez en toute confiance à Kribi</p>
            </div>
          </Link>

          <Link href="/dashboard/owner/annonces/nouvelle" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-700 group-hover:scale-110 transition-transform">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Publier un bien</h3>
              <p className="text-sm text-gray-500">Vous avez un bien à louer ?</p>
            </div>
          </Link>
        </div>

        {/* Recent Properties Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Nos dernières locations à Kribi</h2>
            <Link href="/locations" className="text-[#e4002b] font-medium hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {(recentProperties || []).length > 0 ? (
            <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
              {(recentProperties || []).map((property: any) => {
                const imgPath = property.property_media?.[0]?.storage_path
                let imgSrc = null
                if (imgPath) {
                  imgSrc = imgPath.startsWith('http') ? imgPath : null 
                }

                return (
                  <Link href={`/locations/${property.id}`} key={property.id} className="min-w-[300px] md:min-w-[350px] max-w-[350px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 snap-start group block">
                    <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={property.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                          <Home className="w-12 h-12 opacity-20" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                        Nouveau
                      </div>
                      <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-[#e4002b] transition-colors shadow-sm z-10">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="p-5">
                      <div className="text-[#e4002b] font-bold text-xl mb-1">
                        {property.price.toLocaleString('fr-FR')} FCFA <span className="text-sm text-gray-500 font-normal">/ mois</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 truncate text-lg mb-2">
                        {property.title}
                      </h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1 mb-4 truncate">
                        <MapPin className="w-4 h-4 shrink-0" />
                        {property.neighborhoods?.name || 'Kribi'}, {property.neighborhoods?.city || 'Cameroun'}
                      </p>
                      
                      <div className="flex items-center gap-4 text-gray-600 text-sm border-t border-gray-100 pt-4">
                        {property.bedrooms > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Bed className="w-4 h-4" />
                            <span>{property.bedrooms} ch.</span>
                          </div>
                        )}
                        {property.bathrooms > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Bath className="w-4 h-4" />
                            <span>{property.bathrooms} sdb</span>
                          </div>
                        )}
                        {property.surface_area > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Maximize className="w-4 h-4" />
                            <span>{property.surface_area} m²</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 flex flex-col items-center justify-center min-h-[250px]">
              <Home className="w-16 h-16 text-gray-200 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune location n'est encore publiée</h3>
              <p className="text-gray-500">Les prochaines locations ajoutées par les propriétaires apparaîtront ici.</p>
            </div>
          )}
        </div>

        {/* Information / Partner section adapted for KribiLoc */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-[#111315] to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium mb-6 inline-block">Restez informé !</span>
              <h3 className="text-2xl font-bold mb-4">Découvrez les prix de l'immobilier à Kribi</h3>
              <p className="text-gray-300 mb-8 max-w-sm">
                Utilisez nos données pour obtenir facilement des informations sur le marché de l'immobilier. Découvrez les loyers moyens par quartier.
              </p>
              <button className="bg-white text-[#111315] px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                Explorer les prix
              </button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity transform translate-x-1/4 translate-y-1/4">
              <MapPin className="w-64 h-64" />
            </div>
          </div>
          
          <div className="bg-red-50 rounded-3xl p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <span className="bg-[#e4002b]/10 text-[#e4002b] px-3 py-1 rounded-full text-xs font-medium mb-6 inline-block">100% Gratuit</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Vendez ou louez vous-même sur KribiLoc</h3>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="mt-1 bg-white p-0.5 rounded-full shadow-sm"><ShieldCheck className="w-3 h-3 text-[#e4002b]" /></div>
                  Présentez votre bien et ses caractéristiques
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 bg-white p-0.5 rounded-full shadow-sm"><ShieldCheck className="w-3 h-3 text-[#e4002b]" /></div>
                  Définissez votre propre prix de location
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 bg-white p-0.5 rounded-full shadow-sm"><ShieldCheck className="w-3 h-3 text-[#e4002b]" /></div>
                  Mettez en avant ce qui le rend unique
                </li>
              </ul>
              <Link href="/dashboard/owner/annonces/nouvelle" className="inline-block bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-xl font-medium hover:border-gray-300 transition-colors shadow-sm">
                Déposer une annonce
              </Link>
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  )
}

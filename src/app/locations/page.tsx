import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Home, MapPin, Bed, Bath, Maximize2, Shield, Heart, SlidersHorizontal, Search } from 'lucide-react'
import { MapComponent } from '@/lib/maps/MapComponent'

interface SearchParams {
  quartier?: string
  type?: string
  prix_min?: string
  prix_max?: string
  chambres?: string
  meuble?: string
  certifie?: string
  tri?: string
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const supabase = await createClient()

  // Récupérer les quartiers pour les filtres
  const { data: neighborhoods } = await supabase
    .from('neighborhoods')
    .select('id, name, slug')
    .eq('active', true)
    .order('name')

  // Construire la requête avec filtres
  let query = supabase
    .from('properties')
    .select(`
      id, title, price, deposit, advance, type, 
      bedrooms, bathrooms, surface_area, is_furnished,
      availability_status, description, latitude, longitude,
      neighborhood_id, created_at,
      neighborhoods(name)
    `)
    .eq('availability_status', 'published')

  // Filtre par quartier
  if (params.quartier) {
    const neighborhood = neighborhoods?.find(n => n.slug === params.quartier)
    if (neighborhood) {
      query = query.eq('neighborhood_id', neighborhood.id)
    }
  }

  // Filtre par type
  if (params.type) {
    query = query.eq('type', params.type)
  }

  // Filtre par prix
  if (params.prix_min) {
    query = query.gte('price', parseInt(params.prix_min))
  }
  if (params.prix_max) {
    query = query.lte('price', parseInt(params.prix_max))
  }

  // Filtre par chambres
  if (params.chambres) {
    query = query.gte('bedrooms', parseInt(params.chambres))
  }

  // Filtre meublé
  if (params.meuble === 'oui') {
    query = query.eq('is_furnished', true)
  }

  // Tri
  switch (params.tri) {
    case 'prix_asc':
      query = query.order('price', { ascending: true })
      break
    case 'prix_desc':
      query = query.order('price', { ascending: false })
      break
    case 'recent':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  const { data: properties } = await query
  const listings = properties ?? []

  // Vérifier les badges de certification
  const propertyIds = listings.map(p => p.id)
  const { data: badges } = propertyIds.length > 0
    ? await supabase
        .from('verification_badges')
        .select('property_id, level, issued_at')
        .in('property_id', propertyIds)
        .gte('expires_at', new Date().toISOString())
    : { data: [] }

  const certifiedMap = new Map<string, { level: string; date: string }>(
    (badges ?? []).map(b => [b.property_id, { level: b.level, date: b.issued_at }])
  )

  // Données pour la carte
  const mapLocations = listings
    .filter(p => p.latitude && p.longitude)
    .map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      latitude: Number(p.latitude),
      longitude: Number(p.longitude),
    }))

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR')
  }

  const typeLabels: Record<string, string> = {
    appartement: 'Appartement',
    maison: 'Maison / Villa',
    studio: 'Studio',
    chambre: 'Chambre',
    immeuble: 'Immeuble',
    terrain: 'Terrain',
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Barre de filtres sticky */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <form method="GET" className="flex flex-wrap gap-3 items-end">

              {/* Quartier */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Quartier</label>
                <select
                  name="quartier"
                  defaultValue={params.quartier || ''}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b]"
                >
                  <option value="">Tous les quartiers</option>
                  {neighborhoods?.map(n => (
                    <option key={n.id} value={n.slug}>{n.name}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Type</label>
                <select
                  name="type"
                  defaultValue={params.type || ''}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b]"
                >
                  <option value="">Tous les types</option>
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison / Villa</option>
                  <option value="studio">Studio</option>
                  <option value="chambre">Chambre</option>
                  <option value="immeuble">Immeuble</option>
                </select>
              </div>

              {/* Prix min */}
              <div className="min-w-[120px]">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Prix min</label>
                <input
                  name="prix_min"
                  type="number"
                  defaultValue={params.prix_min || ''}
                  placeholder="0 FCFA"
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b]"
                />
              </div>

              {/* Prix max */}
              <div className="min-w-[120px]">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Prix max</label>
                <input
                  name="prix_max"
                  type="number"
                  defaultValue={params.prix_max || ''}
                  placeholder="∞ FCFA"
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b]"
                />
              </div>

              {/* Chambres */}
              <div className="min-w-[100px]">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Chambres</label>
                <select
                  name="chambres"
                  defaultValue={params.chambres || ''}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b]"
                >
                  <option value="">Toutes</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Meublé */}
              <div className="min-w-[100px]">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Meublé</label>
                <select
                  name="meuble"
                  defaultValue={params.meuble || ''}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b]"
                >
                  <option value="">Peu importe</option>
                  <option value="oui">Oui</option>
                </select>
              </div>

              {/* Tri */}
              <div className="min-w-[140px]">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Trier par</label>
                <select
                  name="tri"
                  defaultValue={params.tri || 'recent'}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e4002b]/20 focus:border-[#e4002b]"
                >
                  <option value="recent">Plus récents</option>
                  <option value="prix_asc">Prix croissant</option>
                  <option value="prix_desc">Prix décroissant</option>
                </select>
              </div>

              {/* Bouton rechercher */}
              <button
                type="submit"
                className="bg-[#e4002b] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#c5001f] transition-colors flex items-center gap-2 text-sm"
              >
                <Search className="w-4 h-4" />
                Rechercher
              </button>
            </form>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500 text-sm">
              <span className="font-bold text-[#111315]">{listings.length}</span> logement{listings.length > 1 ? 's' : ''} disponible{listings.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Liste des annonces */}
            <div className="lg:col-span-3 space-y-4">
              {listings.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                  <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-[#111315] mb-2">Aucun logement trouvé</h3>
                  <p className="text-gray-500 mb-6">Essayez de modifier vos critères de recherche.</p>
                  <Link
                    href="/locations"
                    className="text-[#e4002b] font-semibold hover:underline"
                  >
                    Réinitialiser les filtres
                  </Link>
                </div>
              ) : (
                listings.map(prop => {
                  const cert = certifiedMap.get(prop.id)
                  const neighborhoodName = (prop as any).neighborhoods?.name
                  return (
                    <Link
                      href={`/locations/${prop.id}`}
                      key={prop.id}
                      className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all flex flex-col sm:flex-row group"
                    >
                      {/* Image placeholder */}
                      <div className="sm:w-72 h-48 sm:h-auto bg-gray-100 flex-shrink-0 flex items-center justify-center relative">
                        <Home className="w-10 h-10 text-gray-300" />
                        {cert && (
                          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                            <Shield className="w-3 h-3" />
                            Certifié
                          </div>
                        )}
                      </div>

                      {/* Détails */}
                      <div className="p-5 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              {typeLabels[prop.type] || prop.type}
                            </span>
                            <span className="text-xl font-black text-[#e4002b]">
                              {formatPrice(prop.price)} <span className="text-sm font-medium text-gray-500">FCFA/mois</span>
                            </span>
                          </div>
                          <h2 className="text-lg font-bold text-[#111315] group-hover:text-[#e4002b] transition-colors mb-2 leading-tight">
                            {prop.title}
                          </h2>
                          {neighborhoodName && (
                            <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                              <MapPin className="w-3.5 h-3.5" />
                              {neighborhoodName}, Kribi
                            </p>
                          )}
                        </div>

                        {/* Caractéristiques */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {prop.bedrooms && prop.bedrooms > 0 && (
                            <span className="flex items-center gap-1">
                              <Bed className="w-4 h-4" />
                              {prop.bedrooms} ch.
                            </span>
                          )}
                          {prop.bathrooms && prop.bathrooms > 0 && (
                            <span className="flex items-center gap-1">
                              <Bath className="w-4 h-4" />
                              {prop.bathrooms} sdb.
                            </span>
                          )}
                          {prop.surface_area && prop.surface_area > 0 && (
                            <span className="flex items-center gap-1">
                              <Maximize2 className="w-4 h-4" />
                              {prop.surface_area} m²
                            </span>
                          )}
                          {prop.is_furnished && (
                            <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">
                              Meublé
                            </span>
                          )}
                          {prop.deposit && prop.deposit > 0 && (
                            <span className="text-xs text-gray-400">
                              Caution: {prop.deposit} mois
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>

            {/* Carte Mapbox */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="sticky top-28 h-[calc(100vh-10rem)] rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <MapComponent locations={mapLocations} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

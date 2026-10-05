import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import PropertyActions from './PropertyActions';
import { Home, MapPin, Shield, Phone, Bed, Bath, Maximize, Sofa, CheckCircle2, AlertCircle, Heart } from 'lucide-react';

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id: propertyId } = await params;

  // 1. Fetch property
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (propertyError || !property) {
    notFound();
  }

  // 2. Fetch owner profile
  const { data: owner } = await supabase
    .from('profiles')
    .select('full_name, phone, email, created_at')
    .eq('id', property.owner_id)
    .single();

  // 3. Fetch neighborhood
  let neighborhoodName = 'Quartier inconnu';
  if (property.neighborhood_id) {
    const { data: neighborhood } = await supabase
      .from('neighborhoods')
      .select('name')
      .eq('id', property.neighborhood_id)
      .single();
    if (neighborhood) neighborhoodName = neighborhood.name;
  }

  // 4. Fetch verification badges
  const { data: verification } = await supabase
    .from('verification_badges')
    .select('level, issued_at')
    .eq('property_id', propertyId)
    .single();

  // 5. Views and favorites count
  const { count: viewCount } = await supabase
    .from('view_events')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', propertyId);

  const { count: favoriteCount } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', propertyId);

  // 6. Check if current user favorited
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  let isFavorite = false;
  if (userId) {
    const { data: fav } = await supabase
      .from('favorites')
      .select('id')
      .eq('property_id', propertyId)
      .eq('user_id', userId)
      .single();
    if (fav) isFavorite = true;
  }

  // 7. Record view event (fire and forget)
  if (userId) {
    await supabase.from('view_events').insert({ property_id: propertyId, user_id: userId });
  } else {
    await supabase.from('view_events').insert({ property_id: propertyId });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
<main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Hero Gallery */}
            <div className="w-full aspect-video bg-gray-100 rounded-2xl overflow-hidden relative flex items-center justify-center border border-gray-200">
              <Home className="w-20 h-20 text-gray-300" />
            </div>

            {/* Title and Location */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {verification && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    <Shield className="w-3.5 h-3.5" />
                    Vérifié {verification.level}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                  <MapPin className="w-3.5 h-3.5" />
                  {neighborhoodName}
                </span>
              </div>
              <h1 className="text-3xl font-black text-[#111315] mb-2">{property.title}</h1>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                Publié récemment
              </p>
            </div>

            {/* Characteristics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="bg-gray-50 p-2 rounded-lg text-gray-500"><Home className="w-5 h-5" /></div>
                <div>
                  <div className="text-xs text-gray-400">Type</div>
                  <div className="font-semibold text-[#111315]">{property.type === 'apartment' ? 'Appartement' : property.type === 'house' ? 'Maison' : 'Studio'}</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="bg-gray-50 p-2 rounded-lg text-gray-500"><Bed className="w-5 h-5" /></div>
                <div>
                  <div className="text-xs text-gray-400">Chambres</div>
                  <div className="font-semibold text-[#111315]">{property.bedrooms || '-'}</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="bg-gray-50 p-2 rounded-lg text-gray-500"><Bath className="w-5 h-5" /></div>
                <div>
                  <div className="text-xs text-gray-400">Salles de bain</div>
                  <div className="font-semibold text-[#111315]">{property.bathrooms || '-'}</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="bg-gray-50 p-2 rounded-lg text-gray-500"><Maximize className="w-5 h-5" /></div>
                <div>
                  <div className="text-xs text-gray-400">Surface</div>
                  <div className="font-semibold text-[#111315]">{property.surface ? `${property.surface} m²` : '-'}</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="bg-gray-50 p-2 rounded-lg text-gray-500"><Sofa className="w-5 h-5" /></div>
                <div>
                  <div className="text-xs text-gray-400">Meublé</div>
                  <div className="font-semibold text-[#111315]">{property.is_furnished ? 'Oui' : 'Non'}</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="bg-gray-50 p-2 rounded-lg text-gray-500"><CheckCircle2 className="w-5 h-5" /></div>
                <div>
                  <div className="text-xs text-gray-400">Statut</div>
                  <div className="font-semibold text-green-600">Disponible</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-[#111315] mb-4">Description</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {property.description || "Aucune description fournie."}
              </div>
            </div>

            {/* Certification Block */}
            {verification && (
              <div className="bg-green-50 border border-green-100 p-6 rounded-2xl flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-green-800 text-lg mb-1">Logement vérifié {verification.level}</h3>
                  <p className="text-green-700 text-sm">
                    Ce logement a été vérifié sur le terrain par notre équipe le {new Date(verification.issued_at).toLocaleDateString('fr-FR')}. Les photos et les caractéristiques correspondent à la réalité.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Price Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <div className="mb-6">
                <div className="text-3xl font-black text-[#e4002b] mb-1">
                  {property.price?.toLocaleString('fr-FR')} FCFA<span className="text-lg text-gray-500 font-normal">/mois</span>
                </div>
                <div className="flex flex-col gap-1 mt-3">
                  <p className="text-sm text-gray-500">Caution : {property.deposit || 0} mois</p>
                  <p className="text-sm text-gray-500">Avance : {property.advance || 0} mois</p>
                </div>
              </div>

              {/* Actions */}
              <PropertyActions 
                propertyId={propertyId} 
                initialFavorite={isFavorite}
                userId={userId}
              />

              {/* Ethical FOMO */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-2.5 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  <span><strong className="text-[#111315]">{viewCount || 0} personnes</strong> ont consulté ce logement</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-2.5 rounded-lg">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span><strong className="text-[#111315]">{favoriteCount || 0} personnes</strong> l'ont ajouté en favoris</span>
                </div>
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#111315] mb-4">À propos du propriétaire</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl">
                  {owner?.full_name?.charAt(0) || 'P'}
                </div>
                <div>
                  <div className="font-semibold text-[#111315]">{owner?.full_name || 'Propriétaire'}</div>
                  <div className="text-xs text-gray-500">
                    Membre depuis {owner?.created_at ? new Date(owner.created_at).getFullYear() : '2024'}
                  </div>
                </div>
              </div>
              <button className="w-full border-2 border-[#111315] text-[#111315] hover:bg-[#111315] hover:text-white font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 transition-all">
                <Phone className="w-4 h-4" />
                Contacter
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                Répond généralement en quelques heures
              </p>
            </div>

          </div>
        </div>
      </main>
</div>
  );
}

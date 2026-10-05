import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Mes Favoris — KribiLoc',
  description: 'Vos logements favoris sur KribiLoc.',
};

export default async function FavorisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/connexion');
  }

  // Récupérer les favoris avec les propriétés associées
  const { data: favorites } = await supabase
    .from('favorites')
    .select('property_id, created_at, properties(id, title, price, type, address_text, bedrooms, bathrooms)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const items = (favorites ?? []).filter((f: Record<string, unknown>) => f.properties != null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="text-3xl font-black text-[#111315] mb-2">Mes Favoris</h1>
      <p className="text-gray-500 mb-8">{items.length} logement{items.length > 1 ? 's' : ''} sauvegardé{items.length > 1 ? 's' : ''}</p>

      {items.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">❤️</div>
          <h2 className="text-xl font-bold text-[#111315] mb-4">Vous n&apos;avez pas encore de favoris</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Parcourez les logements disponibles à Kribi et sauvegardez ceux qui vous intéressent pour les retrouver ici.
          </p>
          <Link 
            href="/locations" 
            className="inline-block px-8 py-4 bg-[#e4002b] text-white font-semibold rounded-full hover:bg-[#c5001f] transition-all shadow-lg shadow-red-200"
          >
            Découvrir les annonces
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((fav: any) => {
            const prop = fav.properties;
            if (!prop) return null;
            
            return (
              <Link 
                href={`/locations/${prop.id}`} 
                key={fav.property_id}
                className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all bg-white flex flex-col group"
              >
                <div className="h-44 bg-gray-100 flex items-center justify-center">
                  <span className="text-sm font-mono text-gray-400 uppercase tracking-widest">Photo</span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-lg font-black text-[#e4002b] mb-1">
                    {Number(prop.price).toLocaleString('fr-FR')} FCFA <span className="text-sm font-normal text-gray-400">/ mois</span>
                  </div>
                  <h3 className="font-bold text-[#111315] group-hover:text-[#e4002b] transition-colors line-clamp-1">{prop.title}</h3>
                  {prop.address_text ? (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{prop.address_text}</p>
                  ) : null}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span className="capitalize">{prop.type}</span>
                    <div className="flex gap-3">
                      {prop.bedrooms ? <span>{prop.bedrooms} ch.</span> : null}
                      {prop.bathrooms ? <span>{prop.bathrooms} sdb.</span> : null}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

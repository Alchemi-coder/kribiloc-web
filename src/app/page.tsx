import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui/animated-section';

export default async function Home() {
  const supabase = await createClient();
  
  const { count: publishedCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('availability_status', 'published');
    
  const { count: certifiedCount } = await supabase
    .from('verification_badges')
    .select('*', { count: 'exact', head: true });
    
  const { count: neighborhoodCount } = await supabase
    .from('neighborhoods')
    .select('*', { count: 'exact', head: true })
    .eq('active', true);

  return (
    <>
      {/* HERO SECTION */}
      <section className="min-h-[90vh] flex items-center pt-24 pb-12 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left — Message principal */}
            <div className="flex flex-col items-start">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight text-[#111315]">
                Trouver une location à{' '}
                <span className="text-[#e4002b]">Kribi</span>{' '}
                n&apos;a jamais été aussi facile
              </h1>
              <p className="text-base sm:text-lg text-gray-500 mt-4 sm:mt-6 max-w-lg leading-relaxed">
                Chambre, appartement, studio, maison — recherchez gratuitement parmi les logements disponibles à Kribi, ou publiez le vôtre en quelques minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 w-full sm:w-auto">
                <Link
                  href="/inscription"
                  className="bg-[#e4002b] text-white px-7 py-4 rounded-full font-semibold text-base hover:bg-[#c5001f] transition-all shadow-lg shadow-red-200 text-center"
                >
                  Je cherche un logement
                </Link>
                <Link
                  href="/inscription"
                  className="border-2 border-[#111315] text-[#111315] px-7 py-4 rounded-full font-semibold text-base hover:bg-[#111315] hover:text-white transition-all text-center"
                >
                  Je suis propriétaire
                </Link>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Inscription gratuite · Aucun engagement
              </p>
            </div>

            <div className="flex items-center justify-center mt-6 lg:mt-0">
              <Image
                src="/hero-illustration.jpg"
                alt="Trouvez votre location à Kribi sur la carte"
                width={560}
                height={420}
                className="w-full h-auto"
                priority
              />
            </div>

          </div>
        </div>
      </section>

      {/* BARRE DE STATS RÉELLES */}
      <AnimatedSection>
        <section className="bg-[#111315] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-black mb-2 flex items-center justify-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-[#e4002b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {publishedCount ?? 0}
                </div>
                <div className="text-sm uppercase tracking-widest text-gray-400">Logements publiés</div>
              </div>
              <div>
                <div className="text-5xl font-black mb-2 flex items-center justify-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-[#e4002b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {certifiedCount ?? 0}
                </div>
                <div className="text-sm uppercase tracking-widest text-gray-400">Vérifiés sur le terrain</div>
              </div>
              <div>
                <div className="text-5xl font-black mb-2 flex items-center justify-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-[#e4002b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {neighborhoodCount ?? 0}
                </div>
                <div className="text-sm uppercase tracking-widest text-gray-400">Quartiers couverts</div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* COMMENT ÇA MARCHE */}
      <AnimatedSection>
        <section id="comment-ca-marche" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-black text-center text-[#111315]">
              Comment ça marche ?
            </h2>
            <p className="text-gray-500 mt-4 text-center text-lg max-w-2xl mx-auto">
              Que vous cherchiez un logement ou que vous soyez propriétaire, c&apos;est simple et gratuit.
            </p>

            {/* Pour les chercheurs */}
            <div className="mt-16">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#e4002b] mb-8 text-center">Pour les chercheurs de logement</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                  <div className="text-6xl font-black text-red-100 mb-4">01</div>
                  <h4 className="text-xl font-bold text-[#111315] mb-3">Créez votre compte</h4>
                  <p className="text-gray-500 leading-relaxed">
                    Inscription gratuite en 2 minutes. Choisissez &quot;Je cherche un logement&quot; et accédez à toutes les annonces.
                  </p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                  <div className="text-6xl font-black text-red-100 mb-4">02</div>
                  <h4 className="text-xl font-bold text-[#111315] mb-3">Explorez &amp; Comparez</h4>
                  <p className="text-gray-500 leading-relaxed">
                    Filtrez par quartier, budget et type de logement. Les annonces vérifiées portent un badge de confiance.
                  </p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                  <div className="text-6xl font-black text-red-100 mb-4">03</div>
                  <h4 className="text-xl font-bold text-[#111315] mb-3">Visitez &amp; Emménagez</h4>
                  <p className="text-gray-500 leading-relaxed">
                    Demandez une visite directement sur la plateforme. Le propriétaire confirme et vous visitez en toute sérénité.
                  </p>
                </div>
              </div>
            </div>

            {/* Pour les propriétaires */}
            <div className="mt-20">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#e4002b] mb-8 text-center">Pour les propriétaires</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                  <div className="text-6xl font-black text-red-100 mb-4">01</div>
                  <h4 className="text-xl font-bold text-[#111315] mb-3">Créez votre compte</h4>
                  <p className="text-gray-500 leading-relaxed">
                    Inscription gratuite. Choisissez &quot;Je suis propriétaire&quot; et accédez à votre espace de gestion.
                  </p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                  <div className="text-6xl font-black text-red-100 mb-4">02</div>
                  <h4 className="text-xl font-bold text-[#111315] mb-3">Publiez gratuitement</h4>
                  <p className="text-gray-500 leading-relaxed">
                    Ajoutez votre logement avec photos et détails. La publication est 100% gratuite, sans engagement.
                  </p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                  <div className="text-6xl font-black text-red-100 mb-4">03</div>
                  <h4 className="text-xl font-bold text-[#111315] mb-3">Recevez des demandes</h4>
                  <p className="text-gray-500 leading-relaxed">
                    Les locataires sérieux vous contactent directement. Gérez vos visites depuis votre tableau de bord.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CERTIFICATION — sans prix */}
      <AnimatedSection>
        <section id="certification" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="bg-[#e4002b]/5 rounded-3xl p-8 sm:p-12 flex items-center justify-center min-h-[400px]">
                {/* Illustration basée sur l'image de référence */}
                <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-6 md:p-8 flex items-center justify-between relative transform hover:scale-105 transition-transform duration-300">
                  
                  {/* Partie Gauche : Grand cercle jaune/doré avec icône */}
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-amber-400 border-[6px] border-amber-500 shadow-inner flex items-center justify-center relative flex-shrink-0">
                     {/* Maison stylisée violette/sombre à l'intérieur du cercle */}
                     <svg className="w-12 h-12 text-[#111315]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3L4 9v12h16V9l-8-6zm0 2.5l5 3.75V19h-3v-5H10v5H7v-9.75l5-3.75z" />
                     </svg>
                  </div>

                  {/* Partie Centrale : Lignes grises */}
                  <div className="flex-1 px-6 flex flex-col justify-center space-y-4">
                     <div className="h-3 md:h-4 w-full bg-slate-400 rounded-full"></div>
                     <div className="h-2.5 md:h-3 w-3/4 bg-slate-300 rounded-full"></div>
                     <div className="h-2.5 md:h-3 w-2/3 bg-slate-300 rounded-full"></div>
                  </div>

                  {/* Partie Droite : Grand Badge Bleu Vérifié */}
                  <div className="flex-shrink-0 mr-2 md:mr-0">
                     <svg viewBox="0 0 24 24" className="w-16 h-16 md:w-20 md:h-20 text-blue-600 drop-shadow-md">
                        <path fill="currentColor" d="M12 2l2.4 2.4 3.4-.6.6 3.4 3.4 1.4-1.4 3.4 1.4 3.4-3.4 1.4-.6 3.4-3.4-.6L12 22l-2.4-2.4-3.4.6-.6-3.4-3.4-1.4 1.4-3.4-1.4-3.4 3.4-1.4.6-3.4 3.4.6L12 2z"/>
                        <path fill="white" d="M10.5 15.5l-3-3 1.4-1.4 1.6 1.6 4.6-4.6 1.4 1.4-6 6z"/>
                     </svg>
                  </div>
                  
                  {/* Élément décoratif type personne en bas à gauche */}
                  <div className="absolute -bottom-8 -left-6 hidden md:block">
                     <svg width="80" height="100" viewBox="0 0 80 100" fill="none">
                        <path d="M20 100C20 70 35 50 60 50C70 50 75 40 70 30C65 20 50 15 40 25" stroke="#111315" strokeWidth="12" strokeLinecap="round" />
                        <circle cx="25" cy="25" r="15" fill="#111315" />
                        <path d="M10 25C10 15 30 5 45 15" stroke="#047857" strokeWidth="12" strokeLinecap="round" />
                     </svg>
                  </div>

                </div>
              </div>
              <div>
                <span className="text-[#e4002b] font-bold text-sm uppercase tracking-widest">
                  Certification terrain
                </span>
                <h2 className="text-4xl font-black text-[#111315] mt-4">
                  La confiance, vérifiée sur place
                </h2>
                <p className="text-gray-500 mt-6 text-lg leading-relaxed">
                  Les logements certifiés ont été visités par notre équipe : photos réelles, contrôle de l&apos;eau et de l&apos;électricité, vérification des équipements. Chaque badge porte une date de vérification.
                </p>
                <ul className="mt-6 space-y-3 text-gray-600">
                  <li className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#e4002b] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Visite physique du logement par un agent
                  </li>
                  <li className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#e4002b] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Photos réelles et checklist complète
                  </li>
                  <li className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#e4002b] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Badge de vérification avec date et niveau
                  </li>
                  <li className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#e4002b] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Plus de visibilité pour les logements certifiés
                  </li>
                </ul>
                <Link
                  href="/certification"
                  className="text-[#e4002b] font-semibold mt-8 inline-flex items-center hover:underline text-lg"
                >
                  Découvrir les forfaits de certification
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA FINAL */}
      <AnimatedSection>
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-black text-[#111315]">
              Prêt à commencer ?
            </h2>
            <p className="text-gray-500 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
              Que vous cherchiez un logement ou que vous soyez propriétaire, créez votre compte gratuitement et rejoignez la communauté KribiLoc.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
              <Link
                href="/inscription"
                className="bg-[#e4002b] text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-[#c5001f] transition-all shadow-lg shadow-red-200"
              >
                Créer mon compte gratuitement
              </Link>
              <Link
                href="/comment-ca-marche"
                className="border-2 border-gray-200 text-gray-600 px-10 py-4 rounded-full font-semibold text-lg hover:border-[#111315] hover:text-[#111315] transition-all"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </>
  );
}

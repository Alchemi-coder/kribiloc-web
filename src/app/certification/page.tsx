'use client';

import Link from 'next/link';
import { AnimatedSection } from '@/components/ui/animated-section';
import { Check } from 'lucide-react';

export default function CertificationPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-[#111315] mb-4">Certification terrain</h1>
        <p className="text-xl text-gray-500">
          Augmentez la confiance et la visibilité de vos logements grâce à notre certification sur le terrain.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={100} className="mb-20">
        <div className="text-center mb-12">
          <p className="text-gray-500 max-w-2xl mx-auto">
            La certification KribiLoc prouve aux futurs locataires que votre bien existe, que les photos sont réelles et que les caractéristiques correspondent à votre annonce.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Standard */}
          <div className="border border-gray-200 rounded-2xl p-8 flex flex-col bg-white">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#111315] mb-2">Standard</h3>
              <div className="text-3xl font-extrabold text-[#111315]">10 000 FCFA</div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Visite terrain</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Checklist de base</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Photos vérifiées</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Badge Standard</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Validité configurable</span>
              </li>
            </ul>
            <Link 
              href="/inscription" 
              className="w-full block text-center py-3 px-4 border border-[#e4002b] text-[#e4002b] rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Choisir ce forfait
            </Link>
          </div>

          {/* Renforcée */}
          <div className="border-2 border-[#e4002b] rounded-2xl p-8 flex flex-col bg-white relative shadow-lg transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#e4002b] text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
              Populaire
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#111315] mb-2">Renforcée</h3>
              <div className="text-3xl font-extrabold text-[#111315]">15 000 FCFA</div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 font-medium">Tout le forfait Standard</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Contrôles supplémentaires</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Dossier enrichi</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Badge Renforcé</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Priorité dans la file d'attente</span>
              </li>
            </ul>
            <Link 
              href="/inscription" 
              className="w-full block text-center py-3 px-4 bg-[#e4002b] text-white rounded-lg font-medium hover:bg-[#c30025] transition-colors"
            >
              Choisir ce forfait
            </Link>
          </div>

          {/* Premium */}
          <div className="border border-gray-200 rounded-2xl p-8 flex flex-col bg-white">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#111315] mb-2">Premium</h3>
              <div className="text-3xl font-extrabold text-[#111315]">20 000 FCFA</div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 font-medium">Tout le forfait Renforcé</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Contenu média renforcé</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Badge Premium</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Mise en avant prioritaire</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Support dédié</span>
              </li>
            </ul>
            <Link 
              href="/inscription" 
              className="w-full block text-center py-3 px-4 border border-[#111315] text-[#111315] rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Choisir ce forfait
            </Link>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={200} className="mb-20 bg-gray-50 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center text-[#111315] mb-12">Comment ça se passe ?</h2>
        <div className="max-w-4xl mx-auto">
          <div className="relative border-l-2 border-gray-200 pl-8 space-y-12">
            <div className="relative">
              <div className="absolute -left-[41px] top-1 bg-[#e4002b] h-5 w-5 rounded-full border-4 border-white"></div>
              <h3 className="text-xl font-bold text-[#111315] mb-2">1. Demande & Paiement</h3>
              <p className="text-gray-500">Depuis votre tableau de bord, sélectionnez l'annonce à certifier, choisissez votre niveau de certification et effectuez le paiement.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[41px] top-1 bg-[#e4002b] h-5 w-5 rounded-full border-4 border-white"></div>
              <h3 className="text-xl font-bold text-[#111315] mb-2">2. Prise de rendez-vous</h3>
              <p className="text-gray-500">Un agent KribiLoc vous contacte dans les 24h pour planifier une visite du logement à votre convenance.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[41px] top-1 bg-[#e4002b] h-5 w-5 rounded-full border-4 border-white"></div>
              <h3 className="text-xl font-bold text-[#111315] mb-2">3. Visite & Audit</h3>
              <p className="text-gray-500">L'agent inspecte le bien selon notre checklist stricte, prend des photos et valide les informations de l'annonce.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[41px] top-1 bg-[#e4002b] h-5 w-5 rounded-full border-4 border-white"></div>
              <h3 className="text-xl font-bold text-[#111315] mb-2">4. Rapport & Badge</h3>
              <p className="text-gray-500">Le rapport de certification est validé en interne et le badge est immédiatement ajouté à votre annonce publique.</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={300} className="mb-20">
        <h2 className="text-3xl font-bold text-center text-[#111315] mb-12">Questions fréquentes</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#111315] mb-2">Combien de temps dure la certification ?</h3>
            <p className="text-gray-500">La validité par défaut est de 6 mois, car l'état d'un bien peut évoluer. Passé ce délai, le badge indique la date de dernière certification.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#111315] mb-2">Que se passe-t-il si mon bien ne passe pas l'audit ?</h3>
            <p className="text-gray-500">Si des non-conformités mineures sont trouvées, vous aurez l'opportunité de mettre à jour votre annonce. En cas de non-conformité majeure, la certification est refusée, mais un remboursement partiel est effectué.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#111315] mb-2">Puis-je certifier plusieurs logements ?</h3>
            <p className="text-gray-500">Oui, absolument. Nous proposons d'ailleurs des tarifs préférentiels si vous faites certifier plusieurs biens le même jour et au même endroit.</p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={400} className="text-center">
        <h2 className="text-2xl font-bold text-[#111315] mb-6">Prêt à valoriser vos biens ?</h2>
        <Link 
          href="/inscription" 
          className="inline-block px-8 py-4 bg-[#e4002b] text-white font-medium rounded-lg hover:bg-[#c30025] transition-colors shadow-lg hover:shadow-xl"
        >
          Créer un compte et certifier
        </Link>
      </AnimatedSection>
    </div>
  );
}

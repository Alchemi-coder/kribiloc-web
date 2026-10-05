import Link from 'next/link';

export const metadata = {
  title: 'Comment ça marche - KribiLoc',
  description: 'Découvrez comment KribiLoc simplifie la recherche et la mise en location de logements à Kribi.',
};

export default function CommentCaMarchePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-[#111315] mb-4">Comment ça marche ?</h1>
        <p className="text-xl text-gray-500">
          Que vous cherchiez un logement ou que vous soyez propriétaire, KribiLoc simplifie tout.
        </p>
      </div>

      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-semibold text-[#111315] mb-8 border-b pb-2">Pour les chercheurs de logement</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-[#e4002b] mb-2">1.</div>
              <h3 className="text-lg font-medium text-[#111315] mb-2">Créez votre compte</h3>
              <p className="text-gray-500">Inscrivez-vous gratuitement en choisissant l'option "Je cherche un logement".</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-[#e4002b] mb-2">2.</div>
              <h3 className="text-lg font-medium text-[#111315] mb-2">Parcourez les annonces</h3>
              <p className="text-gray-500">Filtrez par quartier, budget ou type de logement pour trouver ce qui vous correspond.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-[#e4002b] mb-2">3.</div>
              <h3 className="text-lg font-medium text-[#111315] mb-2">Consultez les détails</h3>
              <p className="text-gray-500">Accédez aux fiches détaillées, aux photos et aux rapports de certification des logements.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-[#e4002b] mb-2">4.</div>
              <h3 className="text-lg font-medium text-[#111315] mb-2">Demandez une visite</h3>
              <p className="text-gray-500">Contactez le propriétaire et demandez une visite directement via la plateforme.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#111315] mb-8 border-b pb-2">Pour les propriétaires</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-[#e4002b] mb-2">1.</div>
              <h3 className="text-lg font-medium text-[#111315] mb-2">Créez votre compte</h3>
              <p className="text-gray-500">Inscrivez-vous gratuitement en choisissant l'option "Je suis propriétaire".</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-[#e4002b] mb-2">2.</div>
              <h3 className="text-lg font-medium text-[#111315] mb-2">Publiez votre annonce</h3>
              <p className="text-gray-500">Ajoutez des photos, des détails et les caractéristiques de votre logement.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-[#e4002b] mb-2">3.</div>
              <h3 className="text-lg font-medium text-[#111315] mb-2">Faites certifier</h3>
              <p className="text-gray-500">Optionnel : optez pour la certification terrain pour rassurer les locataires et augmenter votre visibilité.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-[#e4002b] mb-2">4.</div>
              <h3 className="text-lg font-medium text-[#111315] mb-2">Gérez les demandes</h3>
              <p className="text-gray-500">Recevez les demandes de visite et échangez avec des locataires sérieux.</p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 p-8 rounded-2xl">
          <h2 className="text-2xl font-semibold text-[#111315] mb-6">La certification terrain</h2>
          <div className="mb-6 text-gray-500">
            <p className="mb-4">Le processus de certification est simple et transparent :</p>
            <ol className="list-decimal pl-5 space-y-2 font-medium text-[#111315]">
              <li>Demande de certification depuis votre espace</li>
              <li>Paiement des frais de service</li>
              <li>Visite d'un agent KribiLoc sur place</li>
              <li>Vérification selon une checklist rigoureuse</li>
              <li>Émission du rapport et attribution du badge</li>
            </ol>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-3 mt-8">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-bold text-[#111315] mb-2">Standard</h4>
              <p className="text-sm text-gray-500">Vérification de base et photos confirmées.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#e4002b]">
              <h4 className="font-bold text-[#e4002b] mb-2">Renforcée</h4>
              <p className="text-sm text-gray-500">Contrôles supplémentaires et dossier détaillé.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-bold text-[#111315] mb-2">Premium</h4>
              <p className="text-sm text-gray-500">Média renforcé et visibilité maximale.</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/certification" className="text-[#e4002b] font-medium hover:underline">
              Découvrir les tarifs de certification &rarr;
            </Link>
          </div>
        </section>

        <div className="text-center mt-12">
          <Link 
            href="/inscription" 
            className="inline-block px-8 py-4 bg-[#e4002b] text-white font-medium rounded-lg hover:bg-[#c30025] transition-colors"
          >
            Créer mon compte gratuitement
          </Link>
        </div>
      </div>
    </div>
  );
}

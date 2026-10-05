import Link from 'next/link';

export const metadata = {
  title: 'Conditions d\'utilisation - KribiLoc',
  description: 'Conditions générales d\'utilisation de la plateforme KribiLoc.',
};

export default function ConditionsUtilisationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="text-3xl font-bold text-[#111315] mb-4">Conditions d'utilisation</h1>
      <p className="text-sm text-gray-400 mb-8">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

      <div className="space-y-8 text-gray-500">
        <section>
          <h2 className="text-xl font-bold text-[#111315] mb-4">1. Objet</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions dans lesquelles KribiLoc met à disposition ses services de mise en relation entre propriétaires et chercheurs de logements à Kribi.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#111315] mb-4">2. Inscription</h2>
          <p>
            L'accès à certaines fonctionnalités (publication, mise en favoris, demande de visite) nécessite la création d'un compte. L'utilisateur s'engage à fournir des informations exactes et à jour. Le compte est personnel et non transférable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#111315] mb-4">3. Publication d'annonces</h2>
          <p>
            Les propriétaires s'engagent à publier des annonces décrivant fidèlement la réalité de leur bien. Toute information trompeuse, fausse ou illégale entraînera la suppression immédiate de l'annonce et potentiellement la suspension du compte.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#111315] mb-4">4. Certification terrain</h2>
          <p>
            Le service de certification terrain est une prestation payante. Le paiement ne garantit pas l'obtention du badge si le bien ne respecte pas les critères d'audit lors de la visite. Le rapport de certification reflète l'état du bien à la date de la visite.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#111315] mb-4">5. Responsabilités</h2>
          <p>
            KribiLoc agit en tant qu'intermédiaire technique. Nous ne sommes pas partie prenante aux contrats de location conclus entre les utilisateurs. Bien que nous fassions de notre mieux pour vérifier les profils (notamment via la certification), KribiLoc ne peut être tenu responsable d'éventuels litiges entre locataires et propriétaires.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#111315] mb-4">6. Propriété intellectuelle</h2>
          <p>
            Le contenu de la plateforme KribiLoc (textes, logos, design, code) est protégé par le droit de la propriété intellectuelle. Toute reproduction non autorisée est interdite. En publiant des photos, les propriétaires accordent à KribiLoc une licence non exclusive pour leur diffusion sur la plateforme.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#111315] mb-4">7. Modification des conditions</h2>
          <p>
            KribiLoc se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle. L'utilisation continue de la plateforme après modification vaut acceptation des nouvelles CGU.
          </p>
        </section>
      </div>
    </div>
  );
}

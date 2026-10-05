import Link from 'next/link';

export const metadata = {
  title: 'Politique de confidentialité - KribiLoc',
  description: 'Politique de confidentialité et protection des données personnelles de KribiLoc.',
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="text-3xl font-bold text-[#111315] mb-4">Politique de confidentialité</h1>
      
      <div className="space-y-8 text-gray-500">
        <section>
          <p className="text-lg">
            Chez KribiLoc, la protection de vos données personnelles est une priorité. Cette politique décrit la manière dont nous collectons, utilisons et protégeons vos informations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#111315] mb-4">1. Données collectées</h2>
          <p className="mb-2">Nous collectons les données suivantes :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Informations d'identification (nom, prénom, adresse email, numéro de téléphone)</li>
            <li>Données de profil (rôle propriétaire/chercheur)</li>
            <li>Informations sur les biens (pour les propriétaires)</li>
            <li>Données de navigation et d'utilisation de la plateforme</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#111315] mb-4">2. Utilisation des données</h2>
          <p className="mb-2">Vos données sont utilisées pour :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Gérer votre compte et faciliter la mise en relation</li>
            <li>Traiter les demandes de certification terrain</li>
            <li>Améliorer nos services et votre expérience utilisateur</li>
            <li>Communiquer avec vous (notifications, alertes)</li>
            <li>Garantir la sécurité de la plateforme</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#111315] mb-4">3. Partage des informations</h2>
          <p>
            Nous ne vendons jamais vos données personnelles à des tiers. Les informations de contact (numéro de téléphone, email) peuvent être partagées entre utilisateurs uniquement lors d'une mise en relation acceptée pour une visite.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#111315] mb-4">4. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre l'accès non autorisé, l'altération, la divulgation ou la destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#111315] mb-4">5. Cookies</h2>
          <p>
            Notre plateforme utilise des cookies pour assurer le bon fonctionnement du site, mémoriser vos préférences et analyser le trafic. Vous pouvez gérer vos préférences de cookies depuis les paramètres de votre navigateur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#111315] mb-4">6. Droits des utilisateurs</h2>
          <p>
            Vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles. Vous pouvez exercer ces droits en modifiant votre profil ou en nous contactant.
          </p>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg mt-8">
          <h2 className="text-xl font-bold text-[#111315] mb-4">7. Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, veuillez nous contacter à l'adresse suivante :
            <br />
            <a href="mailto:nguiambamb06@gmail.com" className="text-[#e4002b] hover:underline font-medium">nguiambamb06@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}

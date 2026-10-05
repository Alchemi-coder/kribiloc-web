import Link from 'next/link';

export const metadata = {
  title: 'Sécurité - KribiLoc',
  description: 'Mesures de sécurité et conseils pour utiliser KribiLoc en toute confiance.',
};

export default function SecuritePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="text-3xl font-bold text-[#111315] mb-8">Sécurité sur KribiLoc</h1>
      
      <div className="space-y-12">
        <section>
          <p className="text-lg text-gray-500 mb-8">
            La sécurité de nos utilisateurs est au cœur de la mission de KribiLoc. Nous mettons tout en œuvre pour créer un environnement de confiance pour les recherches immobilières à Kribi.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#111315] mb-6 border-b pb-2">Nos mesures de sécurité</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#111315] mb-2">Chiffrement des données</h3>
              <p className="text-gray-500">Toutes les communications entre votre navigateur et nos serveurs sont chiffrées de bout en bout (HTTPS). Vos données sensibles sont stockées de manière sécurisée.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#111315] mb-2">Authentification sécurisée</h3>
              <p className="text-gray-500">Notre système de connexion utilise des protocoles standards de l'industrie pour protéger l'accès à votre compte.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#111315] mb-2">Protection de la vie privée</h3>
              <p className="text-gray-500">Vos coordonnées de contact ne sont pas publiques. Elles ne sont partagées qu'en cas d'accord mutuel pour une visite.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#e4002b] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#e4002b] text-white px-3 py-1 rounded-bl-lg text-xs font-bold">Atout majeur</div>
              <h3 className="text-lg font-bold text-[#111315] mb-2">La certification terrain</h3>
              <p className="text-gray-500">C'est notre outil de confiance numéro 1. Le badge de certification garantit qu'un de nos agents s'est physiquement rendu sur place pour vérifier l'annonce.</p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-[#111315] mb-6">Conseils de sécurité pour les utilisateurs</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-[#111315] mb-2">1. Privilégiez les annonces certifiées</h3>
              <p className="text-gray-500">Le badge KribiLoc est la meilleure garantie que le logement existe et correspond aux photos. Restez vigilant sur les annonces non certifiées.</p>
            </div>
            
            <div>
              <h3 className="font-bold text-[#111315] mb-2">2. Ne payez jamais d'avance</h3>
              <p className="text-gray-500">Ne transférez jamais d'argent (Mobile Money, Orange Money, etc.) à un propriétaire avant d'avoir visité le logement et signé un contrat de location en bonne et due forme.</p>
            </div>
            
            <div>
              <h3 className="font-bold text-[#111315] mb-2">3. Les visites sont gratuites</h3>
              <p className="text-gray-500">Sauf mention contraire explicite et justifiée, la visite d'un logement doit être gratuite. Méfiez-vous des propriétaires exigeant des frais de visite prohibitifs.</p>
            </div>
            
            <div>
              <h3 className="font-bold text-[#111315] mb-2">4. Protégez vos informations personnelles</h3>
              <p className="text-gray-500">Ne partagez pas vos pièces d'identité ou documents personnels avant d'être sûr de la légitimité du propriétaire.</p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-xl font-bold text-[#111315] mb-4">Signaler un comportement suspect</h2>
          <p className="text-gray-500 mb-6">
            Si vous remarquez une annonce douteuse ou un comportement inapproprié sur la plateforme, n'hésitez pas à nous le signaler.
          </p>
          <a 
            href="mailto:nguiambamb06@gmail.com" 
            className="inline-block px-6 py-3 border border-[#111315] text-[#111315] font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Nous contacter
          </a>
        </section>
      </div>
    </div>
  );
}

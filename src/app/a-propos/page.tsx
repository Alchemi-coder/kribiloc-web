import Link from 'next/link';

export const metadata = {
  title: 'À propos - KribiLoc',
  description: 'Découvrez la mission de KribiLoc, la plateforme dédiée aux locations immobilières à Kribi.',
};

export default function AProposPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="text-3xl font-bold text-[#111315] mb-8">À propos de KribiLoc</h1>
      
      <div className="space-y-8 text-gray-500">
        <section>
          <p className="text-lg">
            KribiLoc est une plateforme web dédiée aux locations immobilières à Kribi, au Cameroun. Notre mission est de réduire le temps perdu, les visites inutiles et le risque perçu grâce à des données structurées et une vérification sur le terrain.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#111315] mb-4">Notre mission</h2>
          <p>
            Devenir la référence locale pour trouver une location fiable à Kribi. Nous travaillons chaque jour pour simplifier et sécuriser la mise en relation entre propriétaires et chercheurs de logements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#111315] mb-4">Pour les chercheurs</h2>
          <p>
            Trouvez un logement correspondant à votre budget, votre quartier et vos critères, avec des informations fiables et datées. Fini les mauvaises surprises lors des visites !
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#111315] mb-4">Pour les propriétaires</h2>
          <p>
            Publiez gratuitement et payez uniquement pour des services à forte valeur : certification et visibilité. Gagnez du temps en ne recevant que des locataires vraiment intéressés par les caractéristiques de votre bien.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#111315] mb-4">Certification terrain</h2>
          <p>
            Notre équipe visite chaque logement certifié pour vérifier les informations publiées. Le badge de certification indique qu'un protocole défini a été exécuté à une date donnée. Cela apporte une tranquillité d'esprit inégalée sur le marché.
          </p>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg mt-12">
          <h2 className="text-xl font-semibold text-[#111315] mb-4">Contactez-nous</h2>
          <p className="mb-2"><strong>Email :</strong> nguiambamb06@gmail.com</p>
          <p><strong>Téléphone :</strong> +237 656169681</p>
        </section>
      </div>
    </div>
  );
}

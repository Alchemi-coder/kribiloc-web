import { redirect } from 'next/navigation'
import { GridOverlay } from '@/components/ui/grid-overlay'

export default async function RequestCertificationPage({
  searchParams,
}: {
  searchParams: { propertyId?: string }
}) {
  const propertyId = searchParams.propertyId
  if (!propertyId) redirect('/dashboard/owner/annonces')

  const initiatePayment = async (formData: FormData) => {
    'use server'
    const packageLevel = formData.get('packageLevel') as string
    
    // 1. Création du Payment en statut 'pending' en BDD
    // 2. Appel à PaymentProvider.initializePayment(...)
    // 3. Redirection vers l'URL de paiement Flutterwave / Mobile Money
    
    redirect('/dashboard/owner/annonces?message=Redirection_Mobile_Money_Simulee')
  }

  return (
    <main className="spread min-h-screen pt-24 pb-24">
      <div className="wrap">
        <div className="grid-system">
          
          <div className="band">
            <div className="col-span-12 md:col-start-3 md:col-span-8">
              <span className="font-mono text-sm text-[#e4002b] uppercase tracking-widest block mb-2">Sécurisation du processus</span>
              <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Demander une certification terrain</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Pack Standard */}
                <div className="border border-border p-6 bg-card flex flex-col justify-between hover:border-[#e4002b] transition-colors">
                  <div>
                    <h3 className="font-bold uppercase tracking-wider mb-2">Certification Standard</h3>
                    <div className="text-4xl font-black mb-4">10 000 <span className="text-lg font-normal text-muted-foreground">FCFA</span></div>
                    <ul className="text-sm space-y-3 mb-8 text-muted-foreground">
                      <li className="flex gap-2"><span>•</span> Visite de 30 minutes par un agent certifié</li>
                      <li className="flex gap-2"><span>•</span> Vérification des documents de propriété</li>
                      <li className="flex gap-2"><span>•</span> Obtention du Badge Standard</li>
                    </ul>
                  </div>
                  <form action={initiatePayment}>
                    <input type="hidden" name="packageLevel" value="standard" />
                    <button className="w-full bg-[#111315] text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-[#e4002b] transition-colors">
                      Payer (Mobile Money)
                    </button>
                  </form>
                </div>

                {/* Pack Premium */}
                <div className="border-2 border-[#e4002b] p-6 bg-card flex flex-col justify-between relative shadow-lg">
                  <div className="absolute top-0 right-0 bg-[#e4002b] text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
                    Recommandé
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-wider mb-2 text-[#e4002b]">Certification Premium</h3>
                    <div className="text-4xl font-black mb-4">20 000 <span className="text-lg font-normal text-muted-foreground">FCFA</span></div>
                    <ul className="text-sm space-y-3 mb-8 text-foreground font-medium">
                      <li className="flex gap-2"><span>•</span> Visite détaillée (1h) avec photos professionnelles</li>
                      <li className="flex gap-2"><span>•</span> Audit humidité, électricité et plomberie</li>
                      <li className="flex gap-2"><span>•</span> Badge Premium (Rouge)</li>
                      <li className="flex gap-2 text-[#e4002b]"><span>•</span> 7 jours de Boost de visibilité inclus</li>
                    </ul>
                  </div>
                  <form action={initiatePayment}>
                    <input type="hidden" name="packageLevel" value="premium" />
                    <button className="w-full bg-[#e4002b] text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-[#e4002b]/90 transition-colors shadow-md">
                      Payer (Mobile Money)
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </div>
          
        </div>
        <GridOverlay />
      </div>
    </main>
  )
}

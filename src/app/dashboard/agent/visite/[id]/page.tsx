import { GridOverlay } from '@/components/ui/grid-overlay'

export default function AgentVisitPage({ params }: { params: { id: string } }) {
  
  const submitChecklist = async (formData: FormData) => {
    'use server'
    // L'agent soumet le rapport (sauvegarde dans certification_checks)
    // Le statut de la demande passe à 'admin_review' (Sera validé par un admin)
  }

  return (
    <main className="spread min-h-screen pt-24 pb-24">
      <div className="wrap">
        <div className="grid-system">
          
          <div className="band">
            <div className="col-span-12 md:col-start-3 md:col-span-8">
              <span className="font-mono text-sm text-[#e4002b] uppercase tracking-widest block mb-2">Application Terrain</span>
              <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Audit de certification</h1>
              
              <div className="border border-border p-8 bg-card">
                <div className="mb-8 border-b border-border pb-8 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-wider mb-2">Villa front de mer (Mpalla)</h2>
                    <p className="text-sm text-muted-foreground">Propriétaire: Jean Dupont • Pack: Premium</p>
                  </div>
                  <div className="font-mono text-xs bg-muted px-2 py-1 border border-border">ID: #{params.id.slice(0, 8)}</div>
                </div>

                <form action={submitChecklist} className="flex flex-col gap-8">
                  
                  {/* Catégorie: Plomberie */}
                  <div>
                    <h3 className="font-bold uppercase tracking-wider mb-4 border-l-4 border-[#e4002b] pl-3">Plomberie & Eau</h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between border border-border p-4 bg-background">
                        <span className="text-sm font-semibold uppercase tracking-wider">Pression de l'eau</span>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 text-sm"><input type="radio" name="water_pressure" value="ok" /> OK</label>
                          <label className="flex items-center gap-2 text-sm"><input type="radio" name="water_pressure" value="issue" /> Problème</label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border border-border p-4 bg-background">
                        <span className="text-sm font-semibold uppercase tracking-wider">Traces d'humidité</span>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 text-sm"><input type="radio" name="humidity" value="ok" /> Non</label>
                          <label className="flex items-center gap-2 text-sm text-[#e4002b] font-bold"><input type="radio" name="humidity" value="issue" /> Oui</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preuves visuelles */}
                  <div>
                    <h3 className="font-bold uppercase tracking-wider mb-4 border-l-4 border-[#e4002b] pl-3">Preuves Visuelles (Appareil photo natif)</h3>
                    <div className="border-2 border-dashed border-border p-8 text-center text-muted-foreground hover:bg-muted transition-colors cursor-pointer font-mono text-xs uppercase tracking-widest flex flex-col items-center gap-2">
                      <span className="text-2xl">+</span>
                      Prendre une photo
                    </div>
                  </div>

                  {/* Notes de l'agent (Pouvoir de l'imperfection) */}
                  <div>
                    <h3 className="font-bold uppercase tracking-wider mb-4 border-l-4 border-[#e4002b] pl-3">Notes publiques</h3>
                    <p className="text-xs text-muted-foreground mb-2">Utilisez le "Pouvoir de l'imperfection" : décrivez les petits défauts de façon transparente.</p>
                    <textarea 
                      name="agent_notes" 
                      rows={4} 
                      className="w-full border border-border bg-background p-4 focus:outline-none focus:border-[#e4002b] text-sm" 
                      placeholder="ex: Légère usure sur le plan de travail de la cuisine..."
                    />
                  </div>

                  <div className="pt-6 border-t border-border flex justify-end">
                    <button type="submit" className="bg-[#111315] text-white px-6 py-4 font-bold hover:bg-[#e4002b] transition-colors uppercase tracking-wider text-sm shadow-md">
                      Soumettre à l'Admin
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>
          
        </div>
        <GridOverlay />
      </div>
    </main>
  )
}

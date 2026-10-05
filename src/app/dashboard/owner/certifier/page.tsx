'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createCertificationRequests, calculateCertificationQuote, CertificationItem } from '@/lib/certification-actions';
import { Shield, CheckCircle, Building2, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';

export default function CertifierPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [buildingGroups, setBuildingGroups] = useState<Record<string, string>>({});
  const [quote, setQuote] = useState<{ items: CertificationItem[], total: number, basePrice: number } | null>(null);
  const [step, setStep] = useState<'select' | 'group' | 'quote' | 'submitting'>('select');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProperties() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: props, error: propsError } = await supabase
          .from('properties')
          .select('id, title, property_type, neighborhood_id')
          .eq('owner_id', user.id)
          .in('availability_status', ['published', 'pending_moderation']);

        if (propsError) throw propsError;

        const { data: existingCerts, error: certsError } = await supabase
          .from('certification_requests')
          .select('property_id')
          .in('status', ['paid', 'queued', 'scheduled', 'in_progress', 'submitted', 'approved'])
          .in('property_id', (props || []).map(p => p.id));

        if (certsError) throw certsError;

        const certifiedIds = new Set((existingCerts || []).map(c => c.property_id));
        setProperties((props || []).filter(p => !certifiedIds.has(p.id)));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, [router]);

  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleNextToGroup = () => {
    if (selectedIds.size === 0) return;
    const initialGroups: Record<string, string> = {};
    selectedIds.forEach(id => {
      initialGroups[id] = buildingGroups[id] || '';
    });
    setBuildingGroups(initialGroups);
    setStep('group');
  };

  const handleNextToQuote = async () => {
    try {
      setLoading(true);
      const items = Array.from(selectedIds).map(id => {
        const prop = properties.find(p => p.id === id);
        return {
          propertyId: id,
          title: prop.title,
          propertyType: prop.property_type,
          buildingGroup: buildingGroups[id] || ''
        };
      });
      const q = await calculateCertificationQuote(items);
      setQuote(q);
      setStep('quote');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!quote) return;
    try {
      setStep('submitting');
      const result = await createCertificationRequests(quote.items);
      if (!result.success) throw new Error(result.error);
      router.push(`/paiement/simulateur?payment_id=${result.paymentId}&total=${quote.total}`);
    } catch (err: any) {
      setError(err.message);
      setStep('quote');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
<main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-[#111315] flex items-center gap-3">
          <Shield className="text-[#e4002b] w-8 h-8" />
          Faire certifier mes biens
        </h1>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
          
          {[
            { id: 'select', label: 'Sélection', num: 1 },
            { id: 'group', label: 'Bâtiments', num: 2 },
            { id: 'quote', label: 'Devis', num: 3 }
          ].map((s) => {
            const isActive = step === s.id || 
                             (step === 'group' && s.id === 'select') || 
                             (step === 'quote' && (s.id === 'select' || s.id === 'group')) ||
                             (step === 'submitting' && true);
            const isCurrent = step === s.id;
            return (
              <div key={s.id} className="flex flex-col items-center bg-gray-50 px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-colors ${isActive ? 'bg-[#e4002b] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {s.num}
                </div>
                <span className={`text-sm font-medium ${isCurrent ? 'text-[#e4002b]' : 'text-gray-500'}`}>{s.label}</span>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {loading && step === 'select' ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#e4002b]" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            {step === 'select' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Choisissez les biens à certifier</h2>
                {properties.length === 0 ? (
                  <p className="text-gray-500 text-center py-10">Aucun bien éligible trouvé.</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {properties.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => toggleSelection(p.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedIds.has(p.id) ? 'border-[#e4002b] bg-red-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-[#111315]">{p.title}</h3>
                            <p className="text-sm text-gray-500 capitalize">{p.property_type}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedIds.has(p.id) ? 'border-[#e4002b] bg-[#e4002b]' : 'border-gray-300'}`}>
                            {selectedIds.has(p.id) && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-8 flex justify-end">
                  <button 
                    disabled={selectedIds.size === 0}
                    onClick={handleNextToGroup}
                    className="bg-[#e4002b] text-white rounded-full px-8 py-3 font-semibold disabled:opacity-50 flex items-center gap-2"
                  >
                    Continuer <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {step === 'group' && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Regroupement par bâtiment</h2>
                <p className="text-gray-600 mb-6">Si plusieurs logements se trouvent dans le même bâtiment, indiquez le même nom d'immeuble pour bénéficier d'une réduction.</p>
                
                <div className="space-y-4">
                  {Array.from(selectedIds).map(id => {
                    const p = properties.find(prop => prop.id === id);
                    return (
                      <div key={id} className="p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-grow">
                          <h3 className="font-semibold text-[#111315]">{p.title}</h3>
                        </div>
                        <div className="w-full md:w-1/2 relative">
                          <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type="text"
                            value={buildingGroups[id]}
                            onChange={(e) => setBuildingGroups({...buildingGroups, [id]: e.target.value})}
                            placeholder="Nom du bâtiment / Adresse (laisser vide si indépendant)"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4002b] focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button 
                    onClick={() => setStep('select')}
                    className="text-gray-600 font-medium px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    Retour
                  </button>
                  <button 
                    onClick={handleNextToQuote}
                    className="bg-[#e4002b] text-white rounded-full px-8 py-3 font-semibold flex items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Voir le devis'} <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {(step === 'quote' || step === 'submitting') && quote && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Récapitulatif de votre devis</h2>
                
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-600">
                        <th className="py-3 px-4 font-medium">Bien</th>
                        <th className="py-3 px-4 font-medium">Immeuble</th>
                        <th className="py-3 px-4 font-medium">Réduction</th>
                        <th className="py-3 px-4 font-medium text-right">Prix (FCFA)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quote.items.map((item, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-0">
                          <td className="py-4 px-4 font-medium text-[#111315]">{item.title}</td>
                          <td className="py-4 px-4 text-gray-600">{item.buildingGroup || '-'}</td>
                          <td className="py-4 px-4">
                            {item.discountRate > 0 ? (
                              <span className="bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs font-bold">
                                -{item.discountRate * 100}%
                              </span>
                            ) : '-'}
                          </td>
                          <td className="py-4 px-4 text-right font-semibold">
                            {item.finalPrice.toLocaleString('fr-FR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-2 border-gray-800 bg-gray-50">
                      <tr>
                        <td colSpan={3} className="py-4 px-4 font-bold text-lg text-right">Total à payer :</td>
                        <td className="py-4 px-4 font-bold text-xl text-[#e4002b] text-right">
                          {quote.total.toLocaleString('fr-FR')} FCFA
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <button 
                    onClick={() => setStep('group')}
                    disabled={step === 'submitting'}
                    className="text-gray-600 font-medium px-4 py-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                  >
                    Retour
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={step === 'submitting'}
                    className="bg-[#e4002b] text-white rounded-full px-8 py-3 font-semibold flex items-center gap-2"
                  >
                    {step === 'submitting' ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Traitement...</>
                    ) : (
                      'Payer maintenant'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
</div>
  );
}

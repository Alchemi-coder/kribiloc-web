'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { simulatePaymentSuccess, simulatePaymentFailure } from '@/lib/certification-actions';
import { Shield, Smartphone, CheckCircle2, XCircle, Lock, Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

function SimulateurPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get('payment_id') || '';
  const total = searchParams.get('total') || '0';
  const [loading, setLoading] = useState(false);

  const handleSuccess = async () => {
    setLoading(true);
    try {
      await simulatePaymentSuccess(paymentId);
      router.push(`/paiement/succes?payment_id=${paymentId}&total=${total}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleFailure = async () => {
    setLoading(true);
    try {
      await simulatePaymentFailure(paymentId);
      router.push(`/paiement/echec?payment_id=${paymentId}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        
        <div className="bg-yellow-400 text-yellow-900 px-4 py-3 text-center text-sm font-bold flex flex-col items-center justify-center">
          <span className="flex items-center gap-2">
            <span className="text-xl">🟡</span> MODE SIMULATION TEST
          </span>
          <span className="text-xs font-normal mt-1 opacity-90">Aucun vrai paiement effectué</span>
        </div>

        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-[#e4002b]" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">KribiLoc Certification</h1>
            <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Paiement sécurisé
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
            <p className="text-gray-500 text-sm mb-1">Montant à payer :</p>
            <p className="text-2xl font-bold text-gray-900 mb-4">{parseInt(total).toLocaleString('fr-FR')} FCFA</p>
            
            <p className="text-gray-500 text-sm mb-1">Référence :</p>
            <p className="font-mono text-sm font-medium text-gray-700 bg-gray-200/50 p-2 rounded truncate">
              {paymentId || 'CERT-DEMO-1234'}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Choisir un opérateur :</label>
            <div className="flex gap-3">
              <div className="flex-1 border-2 border-yellow-400 bg-yellow-50 rounded-lg p-3 text-center cursor-pointer font-bold text-yellow-800">
                MTN MoMo
              </div>
              <div className="flex-1 border border-gray-200 hover:border-orange-500 hover:bg-orange-50 rounded-lg p-3 text-center cursor-pointer font-bold text-gray-600 transition-colors">
                Orange
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Smartphone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="tel" 
                placeholder="Numéro de téléphone" 
                defaultValue="650000000"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4002b] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <button 
            onClick={handleSuccess}
            disabled={loading}
            className="w-full bg-[#e4002b] hover:bg-red-700 text-white font-bold py-4 rounded-xl mb-4 transition-colors flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'CONFIRMER LE PAIEMENT'}
          </button>

          <button 
            onClick={handleFailure}
            disabled={loading}
            className="w-full text-center text-sm font-medium text-gray-500 hover:text-gray-800 py-2 transition-colors"
          >
            Simuler un échec
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SimulateurPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#e4002b] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement du simulateur...</p>
        </div>
      </div>
    }>
      <SimulateurPageInner />
    </Suspense>
  );
}

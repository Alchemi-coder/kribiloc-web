import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { CheckCircle2, FileText, Clock, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PaiementSuccesPage({ searchParams }: { searchParams: Promise<{ payment_id?: string, total?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  
  const paymentId = params.payment_id ?? '';
  let payment = null;
  let errorMsg = null;
  
  if (paymentId) {
    const { data, error } = await supabase.from('payments').select('*').eq('id', paymentId).single();
    if (error) {
      errorMsg = "Impossible de récupérer les détails du paiement.";
    } else {
      payment = data;
    }
  }

  const amount = params.total ? parseInt(params.total) : payment?.amount ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
<main className="flex-grow flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle decorative background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-32 h-32 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="w-full max-w-2xl z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="w-14 h-14 text-green-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Paiement confirmé ! 🎉</h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto">
              Votre demande de certification a bien été payée et est maintenant en file d'attente.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-4 mb-4">Détails de la transaction</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Référence</span>
                <span className="font-mono font-medium text-gray-800">{payment?.reference || paymentId || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Montant payé</span>
                <span className="font-bold text-lg text-gray-900">{amount.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-800">
                  {payment?.created_at ? new Date(payment.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  }) : new Date().toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Prochaines étapes</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-1">Assignation d'un agent</h4>
                  <p className="text-sm text-gray-600">Un agent terrain sera assigné dans les 48h ouvrées.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-purple-100 text-purple-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-1">Visite de certification</h4>
                  <p className="text-sm text-gray-600">L'agent visitera votre bien et remplira un rapport détaillé.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-green-100 text-green-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-1">Badge vérifié</h4>
                  <p className="text-sm text-gray-600">Après validation, votre annonce affichera le badge Certifié.</p>
                </div>
              </div>

            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard/owner/annonces"
              className="px-8 py-3 bg-white text-[#e4002b] border-2 border-[#e4002b] rounded-full font-bold text-center hover:bg-red-50 transition-colors"
            >
              Voir mes annonces
            </Link>
            <Link 
              href="/dashboard/owner"
              className="px-8 py-3 bg-[#e4002b] text-white rounded-full font-bold text-center hover:bg-red-700 transition-colors shadow-md shadow-red-200"
            >
              Tableau de bord
            </Link>
          </div>

        </div>
      </main>
</div>
  );
}

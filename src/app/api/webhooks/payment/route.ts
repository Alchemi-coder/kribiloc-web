import { NextRequest, NextResponse } from 'next/server';
import { CinetPayProvider } from '@/lib/payments/provider';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const transactionId = body.cpm_trans_id;

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID manquant' }, { status: 400 });
    }

    // Vérification serveur-à-serveur (ne jamais se fier au callback seul)
    const provider = new CinetPayProvider();
    const verification = await provider.verifyTransaction(transactionId);

    if (verification.status === 'ACCEPTED') {
      const supabase = await createAdminClient();
      
      // Idempotence : on ne met à jour que si le paiement est encore en 'pending'
      const { data: payment } = await supabase
        .from('payments')
        .update({ 
          status: 'success', 
          paid_at: new Date().toISOString(),
        })
        .eq('external_reference', transactionId)
        .eq('status', 'pending')
        .select()
        .single();

      if (payment) {
        await supabase
          .from('certification_requests')
          .update({ status: 'paid' })
          .eq('payment_id', payment.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook CinetPay error:', err);
    return NextResponse.json({ error: 'Erreur de traitement' }, { status: 500 });
  }
}

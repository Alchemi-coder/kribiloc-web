/**
 * CinetPay — Passerelle de paiement Mobile Money pour le Cameroun
 * Supporte : Orange Money, MTN Mobile Money
 * 
 * Documentation : https://docs.cinetpay.com
 * Dashboard : https://app.cinetpay.com
 * 
 * Pour obtenir vos clés :
 * 1. Créez un compte sur https://app.cinetpay.com/register
 * 2. Allez dans Intégration → API
 * 3. Récupérez votre API Key et votre Site ID
 */

export interface PaymentIntent {
  amount: number;
  currency: string;
  reference: string;
  customerEmail: string;
  customerName: string;
  description: string;
  returnUrl: string;
  notifyUrl: string;
}

export interface PaymentResponse {
  paymentUrl: string;
  transactionId: string;
}

export class CinetPayProvider {
  private apiKey: string;
  private siteId: string;
  private baseUrl = 'https://api-checkout.cinetpay.com/v2';

  constructor() {
    this.apiKey = process.env.CINETPAY_API_KEY || '';
    this.siteId = process.env.CINETPAY_SITE_ID || '';
  }

  async initializePayment(intent: PaymentIntent): Promise<PaymentResponse> {
    const response = await fetch(`${this.baseUrl}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apikey: this.apiKey,
        site_id: this.siteId,
        transaction_id: intent.reference,
        amount: intent.amount,
        currency: intent.currency,
        description: intent.description,
        customer_name: intent.customerName,
        customer_email: intent.customerEmail,
        return_url: intent.returnUrl,
        notify_url: intent.notifyUrl,
        channels: 'MOBILE_MONEY',
        lang: 'FR',
        metadata: JSON.stringify({ source: 'kribiloc' }),
      }),
    });

    const data = await response.json();

    if (data.code !== '201') {
      throw new Error(`CinetPay error: ${data.message}`);
    }

    return {
      paymentUrl: data.data.payment_url,
      transactionId: intent.reference,
    };
  }

  async verifyTransaction(transactionId: string): Promise<{ status: string; amount: number }> {
    const response = await fetch(`${this.baseUrl}/payment/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apikey: this.apiKey,
        site_id: this.siteId,
        transaction_id: transactionId,
      }),
    });

    const data = await response.json();
    return {
      status: data.data?.status ?? 'UNKNOWN',
      amount: data.data?.amount ?? 0,
    };
  }
}

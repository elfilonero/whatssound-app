/**
 * Supabase Edge Function: Stripe Webhook Handler
 * Handles payment confirmations, refunds, and account updates
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 });
  }

  // Initialize Supabase client
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  );

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update tip status
        await supabase
          .from('ws_tips')
          .update({
            payment_status: 'succeeded',
            stripe_charge_id: paymentIntent.latest_charge as string,
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update tip status
        await supabase
          .from('ws_tips')
          .update({ payment_status: 'failed' })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        console.log('Payment failed:', paymentIntent.id);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        
        // Update tip as refunded
        await supabase
          .from('ws_tips')
          .update({
            refunded: true,
            refund_reason: charge.refunds?.data?.[0]?.reason || 'requested_by_customer',
          })
          .eq('stripe_charge_id', charge.id);

        console.log('Charge refunded:', charge.id);
        break;
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        
        // Update DJ's Stripe account status
        await supabase
          .from('ws_dj_stripe_accounts')
          .update({
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled,
            details_submitted: account.details_submitted,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_account_id', account.id);

        console.log('Account updated:', account.id);
        break;
      }

      case 'payout.paid': {
        const payout = event.data.object as Stripe.Payout;
        
        // Update payout status
        await supabase
          .from('ws_dj_payouts')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
          })
          .eq('stripe_payout_id', payout.id);

        console.log('Payout completed:', payout.id);
        break;
      }

      case 'payout.failed': {
        const payout = event.data.object as Stripe.Payout;
        
        await supabase
          .from('ws_dj_payouts')
          .update({ status: 'failed' })
          .eq('stripe_payout_id', payout.id);

        console.log('Payout failed:', payout.id);
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: 'Webhook processing failed' }), { status: 500 });
  }
});

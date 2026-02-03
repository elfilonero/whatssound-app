/**
 * Supabase Edge Function: Create Payment Intent
 * Creates a Stripe PaymentIntent for tips
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, currency, djId, sessionId, senderId, message, metadata } = await req.json();

    // Validate amount
    if (!amount || amount < 100) {
      return new Response(
        JSON.stringify({ error: 'Minimum tip amount is €1.00' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get DJ's Stripe Connect account
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    const { data: djAccount } = await supabase
      .from('ws_dj_stripe_accounts')
      .select('stripe_account_id, charges_enabled')
      .eq('dj_id', djId)
      .single();

    // Calculate platform fee (13%)
    const platformFee = Math.round(amount * 0.13);

    // Create PaymentIntent
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: currency || 'eur',
      metadata: {
        ...metadata,
        message: message || '',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    };

    // If DJ has Stripe Connect, set up transfer
    if (djAccount?.stripe_account_id && djAccount?.charges_enabled) {
      paymentIntentParams.transfer_data = {
        destination: djAccount.stripe_account_id,
        amount: amount - platformFee, // DJ receives amount minus platform fee
      };
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    // Return client secret
    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount,
        platformFee,
        netAmount: amount - platformFee,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Supabase Edge Function: Create Connect Account
 * Creates a Stripe Connect account for DJs and returns onboarding link
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
    const { djId } = await req.json();

    if (!djId) {
      return new Response(
        JSON.stringify({ error: 'DJ ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Check if DJ already has a Stripe account
    const { data: existingAccount } = await supabase
      .from('ws_dj_stripe_accounts')
      .select('stripe_account_id')
      .eq('dj_id', djId)
      .single();

    let stripeAccountId: string;

    if (existingAccount?.stripe_account_id) {
      stripeAccountId = existingAccount.stripe_account_id;
    } else {
      // Get DJ profile
      const { data: djProfile } = await supabase
        .from('ws_profiles')
        .select('display_name, email')
        .eq('id', djId)
        .single();

      // Create new Stripe Connect account
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'ES',
        email: djProfile?.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: {
          dj_id: djId,
          platform: 'whatssound',
        },
      });

      stripeAccountId = account.id;

      // Save to database
      await supabase.from('ws_dj_stripe_accounts').insert({
        dj_id: djId,
        stripe_account_id: account.id,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
      });
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${Deno.env.get('APP_URL') || 'https://whatssound-app.vercel.app'}/settings/dj-profile?refresh=true`,
      return_url: `${Deno.env.get('APP_URL') || 'https://whatssound-app.vercel.app'}/settings/dj-profile?success=true`,
      type: 'account_onboarding',
    });

    return new Response(
      JSON.stringify({
        url: accountLink.url,
        accountId: stripeAccountId,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating connect account:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

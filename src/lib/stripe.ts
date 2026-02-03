/**
 * WhatsSound — Stripe Integration
 * Maneja pagos de propinas y cuentas conectadas de DJs
 */

import { supabase } from './supabase';

// Stripe publishable key (frontend)
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// Platform fee percentage (13%)
export const PLATFORM_FEE_PERCENT = 13;

// Minimum tip amount in cents
export const MIN_TIP_AMOUNT = 100; // €1.00

// Predefined tip amounts
export const TIP_AMOUNTS = [
  { value: 100, label: '€1' },
  { value: 200, label: '€2' },
  { value: 500, label: '€5' },
  { value: 1000, label: '€10' },
  { value: 2000, label: '€20' },
];

/**
 * Check if Stripe is configured
 */
export const isStripeConfigured = (): boolean => {
  return !!STRIPE_PUBLISHABLE_KEY && STRIPE_PUBLISHABLE_KEY.startsWith('pk_');
};

/**
 * Calculate platform fee and net amount
 */
export const calculateFees = (amountCents: number): { 
  platformFee: number; 
  netAmount: number;
  total: number;
} => {
  const platformFee = Math.round(amountCents * (PLATFORM_FEE_PERCENT / 100));
  const netAmount = amountCents - platformFee;
  return { platformFee, netAmount, total: amountCents };
};

/**
 * Format amount for display
 */
export const formatAmount = (cents: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(cents / 100);
};

/**
 * Create a payment intent for a tip (server-side via Edge Function)
 */
export const createTipPaymentIntent = async (params: {
  amount: number; // in cents
  djId: string;
  sessionId: string;
  senderId: string;
  message?: string;
}): Promise<{ clientSecret: string; paymentIntentId: string } | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: {
        amount: params.amount,
        currency: 'eur',
        djId: params.djId,
        sessionId: params.sessionId,
        senderId: params.senderId,
        message: params.message,
        metadata: {
          type: 'tip',
          session_id: params.sessionId,
          dj_id: params.djId,
          sender_id: params.senderId,
        },
      },
    });

    if (error) {
      console.error('Error creating payment intent:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return null;
  }
};

/**
 * Record a successful tip in the database
 */
export const recordTip = async (params: {
  djId: string;
  senderId: string;
  sessionId: string;
  amount: number; // in euros (decimal)
  message?: string;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
}): Promise<boolean> => {
  try {
    const { platformFee, netAmount } = calculateFees(params.amount * 100);
    
    const { error } = await supabase.from('ws_tips').insert({
      dj_id: params.djId,
      sender_id: params.senderId,
      session_id: params.sessionId,
      amount: params.amount,
      message: params.message,
      stripe_payment_intent_id: params.stripePaymentIntentId,
      stripe_charge_id: params.stripeChargeId,
      payment_status: params.stripePaymentIntentId ? 'succeeded' : 'pending',
      platform_fee: platformFee / 100,
      net_amount: netAmount / 100,
    });

    if (error) {
      console.error('Error recording tip:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error recording tip:', error);
    return false;
  }
};

/**
 * Get DJ's Stripe Connect account status
 */
export const getDJStripeAccount = async (djId: string): Promise<{
  hasAccount: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
} | null> => {
  try {
    const { data, error } = await supabase
      .from('ws_dj_stripe_accounts')
      .select('*')
      .eq('dj_id', djId)
      .single();

    if (error || !data) {
      return { hasAccount: false, chargesEnabled: false, payoutsEnabled: false, detailsSubmitted: false };
    }

    return {
      hasAccount: true,
      chargesEnabled: data.charges_enabled,
      payoutsEnabled: data.payouts_enabled,
      detailsSubmitted: data.details_submitted,
    };
  } catch (error) {
    console.error('Error getting DJ Stripe account:', error);
    return null;
  }
};

/**
 * Create Stripe Connect onboarding link for DJ
 */
export const createDJOnboardingLink = async (djId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-connect-account', {
      body: { djId },
    });

    if (error) {
      console.error('Error creating onboarding link:', error);
      return null;
    }

    return data?.url || null;
  } catch (error) {
    console.error('Error creating onboarding link:', error);
    return null;
  }
};

/**
 * Get DJ's balance and payout history
 */
export const getDJBalance = async (djId: string): Promise<{
  totalEarned: number;
  totalPaid: number;
  available: number;
  pending: number;
} | null> => {
  try {
    const { data, error } = await supabase.rpc('get_dj_balance', { dj_uuid: djId });

    if (error) {
      console.error('Error getting DJ balance:', error);
      return null;
    }

    return {
      totalEarned: data?.[0]?.total_earned || 0,
      totalPaid: data?.[0]?.total_paid || 0,
      available: data?.[0]?.available || 0,
      pending: data?.[0]?.pending || 0,
    };
  } catch (error) {
    console.error('Error getting DJ balance:', error);
    return null;
  }
};

/**
 * Get user's saved payment methods
 */
export const getPaymentMethods = async (userId: string): Promise<Array<{
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}>> => {
  try {
    const { data, error } = await supabase
      .from('ws_payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) {
      console.error('Error getting payment methods:', error);
      return [];
    }

    return (data || []).map(pm => ({
      id: pm.id,
      brand: pm.brand || 'card',
      last4: pm.last4 || '****',
      expMonth: pm.exp_month || 0,
      expYear: pm.exp_year || 0,
      isDefault: pm.is_default,
    }));
  } catch (error) {
    console.error('Error getting payment methods:', error);
    return [];
  }
};

/**
 * Set default payment method
 */
export const setDefaultPaymentMethod = async (userId: string, paymentMethodId: string): Promise<boolean> => {
  try {
    // Remove default from all
    await supabase
      .from('ws_payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId);

    // Set new default
    const { error } = await supabase
      .from('ws_payment_methods')
      .update({ is_default: true })
      .eq('id', paymentMethodId)
      .eq('user_id', userId);

    return !error;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return false;
  }
};

/**
 * Delete payment method
 */
export const deletePaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ws_payment_methods')
      .delete()
      .eq('id', paymentMethodId);

    return !error;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return false;
  }
};

/**
 * Mock function for demo mode - simulates successful payment
 */
export const mockPayment = async (params: {
  amount: number;
  djId: string;
  sessionId: string;
  senderId: string;
  message?: string;
}): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Record the tip as successful (mock)
  return recordTip({
    ...params,
    stripePaymentIntentId: `pi_mock_${Date.now()}`,
  });
};

// Export for use in components
export default {
  isStripeConfigured,
  calculateFees,
  formatAmount,
  createTipPaymentIntent,
  recordTip,
  getDJStripeAccount,
  createDJOnboardingLink,
  getDJBalance,
  getPaymentMethods,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  mockPayment,
  TIP_AMOUNTS,
  PLATFORM_FEE_PERCENT,
  MIN_TIP_AMOUNT,
};

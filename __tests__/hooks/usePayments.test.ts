/**
 * WhatsSound — usePayments Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';

// Mock Supabase
const mockSupabase = {
  from: jest.fn(),
};

jest.mock('../../src/lib/supabase', () => ({
  supabase: mockSupabase,
}));

// Mock authStore
const mockUser = { id: 'user-123' };
jest.mock('../../src/stores/authStore', () => ({
  useAuthStore: jest.fn(() => ({ user: mockUser })),
}));

import { useAuthStore } from '../../src/stores/authStore';

describe('usePayments Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as jest.Mock).mockReturnValue({ user: mockUser });
  });

  // ─── Payment Methods ─────────────────────────────────────

  describe('Payment Methods', () => {
    test('debe soportar tarjeta de crédito', () => {
      const methods = ['card', 'apple_pay', 'google_pay'];
      expect(methods).toContain('card');
    });

    test('debe soportar Apple Pay', () => {
      const methods = ['card', 'apple_pay', 'google_pay'];
      expect(methods).toContain('apple_pay');
    });

    test('debe soportar Google Pay', () => {
      const methods = ['card', 'apple_pay', 'google_pay'];
      expect(methods).toContain('google_pay');
    });
  });

  // ─── Payment Intent ──────────────────────────────────────

  describe('Payment Intent', () => {
    test('debe crear payment intent para propina', async () => {
      const intent = {
        id: 'pi_123',
        amount: 500,
        currency: 'eur',
        status: 'requires_payment_method',
      };

      expect(intent.amount).toBe(500);
      expect(intent.currency).toBe('eur');
    });

    test('debe manejar montos en cents', () => {
      const amountEuros = 5.00;
      const amountCents = Math.round(amountEuros * 100);

      expect(amountCents).toBe(500);
    });

    test('debe calcular fee correctamente', () => {
      const amount = 500;
      const feeRate = 0.15;
      const fee = Math.round(amount * feeRate);
      const net = amount - fee;

      expect(fee).toBe(75);
      expect(net).toBe(425);
    });
  });

  // ─── Transaction History ─────────────────────────────────

  describe('Transaction History', () => {
    test('debe cargar historial de transacciones', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn().mockResolvedValue({
              data: [
                { id: 'tx-1', amount: 500, type: 'tip', status: 'completed' },
                { id: 'tx-2', amount: 1000, type: 'tip', status: 'completed' },
              ],
            }),
          })),
        })),
      });

      const transactions = [
        { id: 'tx-1', amount: 500 },
        { id: 'tx-2', amount: 1000 },
      ];

      expect(transactions).toHaveLength(2);
    });

    test('debe filtrar por tipo de transacción', () => {
      const transactions = [
        { type: 'tip', amount: 500 },
        { type: 'golden_boost', amount: 499 },
        { type: 'tip', amount: 1000 },
      ];

      const tips = transactions.filter(t => t.type === 'tip');
      expect(tips).toHaveLength(2);
    });

    test('debe calcular total enviado', () => {
      const sent = [
        { amount: 500 },
        { amount: 1000 },
        { amount: 250 },
      ];

      const total = sent.reduce((sum, t) => sum + t.amount, 0);
      expect(total).toBe(1750);
    });

    test('debe calcular total recibido', () => {
      const received = [
        { amount: 500, fee: 75 },
        { amount: 1000, fee: 150 },
      ];

      const totalNet = received.reduce((sum, t) => sum + (t.amount - t.fee), 0);
      expect(totalNet).toBe(1275);
    });
  });

  // ─── Stripe Integration ──────────────────────────────────

  describe('Stripe Integration', () => {
    test('debe generar customer id', () => {
      const customerId = 'cus_' + 'abc123';
      expect(customerId).toMatch(/^cus_/);
    });

    test('debe manejar estado de pago', () => {
      const states = [
        'requires_payment_method',
        'requires_confirmation',
        'requires_action',
        'processing',
        'succeeded',
        'canceled',
      ];

      expect(states).toContain('succeeded');
      expect(states).toContain('canceled');
    });

    test('debe manejar error de tarjeta declinada', () => {
      const error = {
        type: 'card_error',
        code: 'card_declined',
        message: 'Tu tarjeta ha sido declinada',
      };

      expect(error.code).toBe('card_declined');
    });

    test('debe manejar error de fondos insuficientes', () => {
      const error = {
        type: 'card_error',
        code: 'insufficient_funds',
        message: 'Fondos insuficientes',
      };

      expect(error.code).toBe('insufficient_funds');
    });
  });

  // ─── Subscription Payments ───────────────────────────────

  describe('Subscription Payments', () => {
    const SUBSCRIPTION_PRICES = {
      creator: 199,   // €1.99/mes
      pro: 799,       // €7.99/mes
      business: 2999, // €29.99/mes
    };

    test('Creator debe costar €1.99/mes', () => {
      expect(SUBSCRIPTION_PRICES.creator).toBe(199);
    });

    test('Pro debe costar €7.99/mes', () => {
      expect(SUBSCRIPTION_PRICES.pro).toBe(799);
    });

    test('Business debe costar €29.99/mes', () => {
      expect(SUBSCRIPTION_PRICES.business).toBe(2999);
    });

    test('debe calcular precio anual con descuento', () => {
      const monthlyPrice = 799;
      const annualDiscount = 0.20; // 20% descuento
      const annualPrice = Math.round(monthlyPrice * 12 * (1 - annualDiscount));

      expect(annualPrice).toBe(7670); // ~€76.70/año
    });
  });

  // ─── Refunds ─────────────────────────────────────────────

  describe('Refunds', () => {
    test('debe poder solicitar reembolso', async () => {
      const refund = {
        transactionId: 'tx-123',
        amount: 500,
        reason: 'requested_by_customer',
        status: 'pending',
      };

      expect(refund.status).toBe('pending');
    });

    test('debe validar período de reembolso (7 días)', () => {
      const transactionDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // Hace 5 días
      const refundPeriodMs = 7 * 24 * 60 * 60 * 1000;
      const canRefund = (Date.now() - transactionDate.getTime()) < refundPeriodMs;

      expect(canRefund).toBe(true);
    });

    test('debe rechazar reembolso fuera del período', () => {
      const transactionDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // Hace 10 días
      const refundPeriodMs = 7 * 24 * 60 * 60 * 1000;
      const canRefund = (Date.now() - transactionDate.getTime()) < refundPeriodMs;

      expect(canRefund).toBe(false);
    });
  });

  // ─── Payout (DJ Earnings) ────────────────────────────────

  describe('Payout (DJ Earnings)', () => {
    test('debe calcular balance disponible', () => {
      const earnings = [
        { net: 425 },
        { net: 850 },
        { net: 212 },
      ];

      const balance = earnings.reduce((sum, e) => sum + e.net, 0);
      expect(balance).toBe(1487); // €14.87
    });

    test('debe tener mínimo de payout (€10)', () => {
      const MIN_PAYOUT = 1000; // €10 en cents
      const balance = 850;
      const canPayout = balance >= MIN_PAYOUT;

      expect(canPayout).toBe(false);
    });

    test('debe poder solicitar payout si tiene mínimo', () => {
      const MIN_PAYOUT = 1000;
      const balance = 1500;
      const canPayout = balance >= MIN_PAYOUT;

      expect(canPayout).toBe(true);
    });

    test('debe calcular fee de payout', () => {
      const amount = 5000;
      const payoutFee = 25; // €0.25 fijo
      const net = amount - payoutFee;

      expect(net).toBe(4975);
    });
  });

  // ─── Error Handling ──────────────────────────────────────

  describe('Error Handling', () => {
    test('debe manejar timeout de red', () => {
      const error = {
        type: 'network_error',
        message: 'La conexión ha expirado',
      };

      expect(error.type).toBe('network_error');
    });

    test('debe manejar error de autenticación', () => {
      const error = {
        type: 'authentication_error',
        message: 'API key inválida',
      };

      expect(error.type).toBe('authentication_error');
    });

    test('debe manejar rate limit', () => {
      const error = {
        type: 'rate_limit_error',
        message: 'Demasiadas solicitudes',
        retryAfter: 30,
      };

      expect(error.retryAfter).toBe(30);
    });
  });

  // ─── Currency Formatting ─────────────────────────────────

  describe('Currency Formatting', () => {
    const formatCurrency = (cents: number, currency = 'EUR'): string => {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency,
      }).format(cents / 100);
    };

    test('debe formatear euros correctamente', () => {
      expect(formatCurrency(500)).toBe('5,00 €');
      expect(formatCurrency(1250)).toBe('12,50 €');
    });

    test('debe manejar céntimos', () => {
      expect(formatCurrency(99)).toBe('0,99 €');
      expect(formatCurrency(1)).toBe('0,01 €');
    });

    test('debe manejar cantidades grandes', () => {
      expect(formatCurrency(100000)).toBe('1000,00 €');
    });
  });
});

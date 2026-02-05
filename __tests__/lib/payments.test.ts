/**
 * WhatsSound — Payments Tests
 * Tests para el sistema de pagos
 */

import {
  calculateFees,
  COMMISSION_RATE,
  MIN_TIP_CENTS,
  MAX_TIP_CENTS,
  GOLDEN_BOOST_CENTS,
  PERMANENT_SPONSOR_CENTS,
} from '../../src/lib/payments';

// Mock Supabase
const mockSupabase = {
  from: jest.fn(),
};

jest.mock('../../src/lib/supabase', () => ({
  supabase: mockSupabase,
}));

// Mock rate-limiter
jest.mock('../../src/lib/rate-limiter', () => ({
  checkPaymentRateLimit: jest.fn(() => ({ allowed: true })),
  validatePaymentAmount: jest.fn(() => ({ valid: true })),
}));

describe('Payments System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Constants ───────────────────────────────────────────

  describe('Constants', () => {
    test('COMMISSION_RATE debe ser 15%', () => {
      expect(COMMISSION_RATE).toBe(0.15);
    });

    test('MIN_TIP_CENTS debe ser €1 (100 cents)', () => {
      expect(MIN_TIP_CENTS).toBe(100);
    });

    test('MAX_TIP_CENTS debe ser €50 (5000 cents)', () => {
      expect(MAX_TIP_CENTS).toBe(5000);
    });

    test('GOLDEN_BOOST_CENTS debe ser €4.99 (499 cents)', () => {
      expect(GOLDEN_BOOST_CENTS).toBe(499);
    });

    test('PERMANENT_SPONSOR_CENTS debe ser €19.99 (1999 cents)', () => {
      expect(PERMANENT_SPONSOR_CENTS).toBe(1999);
    });
  });

  // ─── calculateFees ───────────────────────────────────────

  describe('calculateFees', () => {
    describe('propinas (tips)', () => {
      test('debe calcular 15% de comisión para propinas', () => {
        const result = calculateFees(1000, 'tip'); // €10
        
        expect(result.fee).toBe(150);  // €1.50
        expect(result.net).toBe(850);  // €8.50
      });

      test('debe redondear comisión correctamente', () => {
        const result = calculateFees(333, 'tip'); // €3.33
        
        // 333 * 0.15 = 49.95, redondeado = 50
        expect(result.fee).toBe(50);
        expect(result.net).toBe(283);
      });

      test('debe calcular correctamente propina mínima', () => {
        const result = calculateFees(MIN_TIP_CENTS, 'tip'); // €1
        
        expect(result.fee).toBe(15);   // €0.15
        expect(result.net).toBe(85);   // €0.85
      });

      test('debe calcular correctamente propina máxima', () => {
        const result = calculateFees(MAX_TIP_CENTS, 'tip'); // €50
        
        expect(result.fee).toBe(750);   // €7.50
        expect(result.net).toBe(4250);  // €42.50
      });
    });

    describe('golden_boost', () => {
      test('debe tomar 100% como comisión (compra a WhatsSound)', () => {
        const result = calculateFees(GOLDEN_BOOST_CENTS, 'golden_boost');
        
        expect(result.fee).toBe(GOLDEN_BOOST_CENTS);
        expect(result.net).toBe(0);
      });
    });

    describe('permanent_sponsor', () => {
      test('debe tomar 100% como comisión (compra a WhatsSound)', () => {
        const result = calculateFees(PERMANENT_SPONSOR_CENTS, 'permanent_sponsor');
        
        expect(result.fee).toBe(PERMANENT_SPONSOR_CENTS);
        expect(result.net).toBe(0);
      });
    });
  });

  // ─── createTip ───────────────────────────────────────────

  describe('createTip', () => {
    const { createTip } = require('../../src/lib/payments');
    const { checkPaymentRateLimit, validatePaymentAmount } = require('../../src/lib/rate-limiter');

    test('debe rechazar si rate limit excedido', async () => {
      checkPaymentRateLimit.mockReturnValue({ 
        allowed: false, 
        error: 'Demasiadas transacciones' 
      });

      const result = await createTip('user-1', 'user-2', 500);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Demasiadas transacciones');
    });

    test('debe rechazar monto inválido', async () => {
      checkPaymentRateLimit.mockReturnValue({ allowed: true });
      validatePaymentAmount.mockReturnValue({ 
        valid: false, 
        error: 'Monto fuera de rango' 
      });

      const result = await createTip('user-1', 'user-2', 50); // Menos de €1

      expect(result.success).toBe(false);
      expect(result.error).toBe('Monto fuera de rango');
    });

    test('debe rechazar propina a uno mismo', async () => {
      checkPaymentRateLimit.mockReturnValue({ allowed: true });
      validatePaymentAmount.mockReturnValue({ valid: true });

      const result = await createTip('user-1', 'user-1', 500);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No puedes enviarte propina a ti mismo');
    });

    test('debe crear propina correctamente', async () => {
      checkPaymentRateLimit.mockReturnValue({ allowed: true });
      validatePaymentAmount.mockReturnValue({ valid: true });

      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'tx-123',
                type: 'tip',
                status: 'pending',
                amount_cents: 500,
                fee_cents: 75,
                net_cents: 425,
              },
              error: null,
            }),
          })),
        })),
      });

      const result = await createTip(
        'user-1', 
        'user-2', 
        500, 
        '¡Gran sesión!',
        'session-1'
      );

      expect(result.success).toBe(true);
      expect(result.transaction).toBeDefined();
      expect(result.transaction.amount_cents).toBe(500);
    });

    test('debe manejar error de base de datos', async () => {
      checkPaymentRateLimit.mockReturnValue({ allowed: true });
      validatePaymentAmount.mockReturnValue({ valid: true });

      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: new Error('DB error'),
            }),
          })),
        })),
      });

      const result = await createTip('user-1', 'user-2', 500);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al procesar la propina');
    });
  });

  // ─── purchaseGoldenBoost ─────────────────────────────────

  describe('purchaseGoldenBoost', () => {
    const { purchaseGoldenBoost } = require('../../src/lib/payments');

    test('debe crear transacción de golden boost', async () => {
      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'tx-456',
                type: 'golden_boost',
                status: 'pending',
                amount_cents: GOLDEN_BOOST_CENTS,
                fee_cents: GOLDEN_BOOST_CENTS,
                net_cents: 0,
              },
              error: null,
            }),
          })),
        })),
      });

      const result = await purchaseGoldenBoost('user-1');

      expect(result.success).toBe(true);
      expect(result.transaction?.type).toBe('golden_boost');
      expect(result.transaction?.amount_cents).toBe(GOLDEN_BOOST_CENTS);
    });

    test('debe manejar error de compra', async () => {
      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: new Error('Payment failed'),
            }),
          })),
        })),
      });

      const result = await purchaseGoldenBoost('user-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al procesar la compra');
    });
  });

  // ─── Edge Cases ──────────────────────────────────────────

  describe('Edge Cases', () => {
    test('calculateFees con monto 0 debe retornar 0', () => {
      const result = calculateFees(0, 'tip');
      
      expect(result.fee).toBe(0);
      expect(result.net).toBe(0);
    });

    test('calculateFees con monto muy pequeño', () => {
      const result = calculateFees(1, 'tip'); // €0.01
      
      // 1 * 0.15 = 0.15, redondeado = 0
      expect(result.fee).toBe(0);
      expect(result.net).toBe(1);
    });

    test('calculateFees con monto muy grande', () => {
      const result = calculateFees(100000, 'tip'); // €1000
      
      expect(result.fee).toBe(15000);   // €150
      expect(result.net).toBe(85000);   // €850
    });
  });
});

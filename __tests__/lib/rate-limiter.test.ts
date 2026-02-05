/**
 * WhatsSound — Rate Limiter Tests
 */

import {
  checkRateLimit,
  checkPaymentRateLimit,
  validatePaymentAmount,
  RATE_LIMITS,
  cleanupRateLimitStore,
} from '../../src/lib/rate-limiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Limpiar store entre tests
    cleanupRateLimitStore();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ─── RATE_LIMITS Config ──────────────────────────────────

  describe('RATE_LIMITS Configuration', () => {
    test('debe tener límite para payments', () => {
      expect(RATE_LIMITS.payments).toBeDefined();
      expect(RATE_LIMITS.payments.maxRequests).toBe(10);
      expect(RATE_LIMITS.payments.windowMs).toBe(60000);
    });

    test('debe tener límite para goldenBoost', () => {
      expect(RATE_LIMITS.goldenBoost).toBeDefined();
      expect(RATE_LIMITS.goldenBoost.maxRequests).toBe(5);
    });

    test('debe tener límite para chat', () => {
      expect(RATE_LIMITS.chat).toBeDefined();
      expect(RATE_LIMITS.chat.maxRequests).toBe(60);
    });

    test('debe tener límite para reactions', () => {
      expect(RATE_LIMITS.reactions).toBeDefined();
      expect(RATE_LIMITS.reactions.maxRequests).toBe(30);
    });

    test('debe tener límite para api', () => {
      expect(RATE_LIMITS.api).toBeDefined();
      expect(RATE_LIMITS.api.maxRequests).toBe(100);
    });
  });

  // ─── checkRateLimit ──────────────────────────────────────

  describe('checkRateLimit', () => {
    test('debe permitir primera solicitud', () => {
      const result = checkRateLimit('user-1', 'payments');

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9); // 10 - 1
    });

    test('debe decrementar remaining con cada solicitud', () => {
      const result1 = checkRateLimit('user-2', 'payments');
      const result2 = checkRateLimit('user-2', 'payments');
      const result3 = checkRateLimit('user-2', 'payments');

      expect(result1.remaining).toBe(9);
      expect(result2.remaining).toBe(8);
      expect(result3.remaining).toBe(7);
    });

    test('debe bloquear cuando se excede el límite', () => {
      const userId = 'user-spam';

      // Hacer 10 solicitudes (límite de payments)
      for (let i = 0; i < 10; i++) {
        checkRateLimit(userId, 'payments');
      }

      // La siguiente debe ser bloqueada
      const blocked = checkRateLimit(userId, 'payments');

      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
    });

    test('debe resetear después de la ventana de tiempo', () => {
      const userId = 'user-reset';

      // Exceder límite
      for (let i = 0; i < 10; i++) {
        checkRateLimit(userId, 'payments');
      }

      const blocked = checkRateLimit(userId, 'payments');
      expect(blocked.allowed).toBe(false);

      // Avanzar tiempo más allá de la ventana (60s)
      jest.advanceTimersByTime(61000);

      // Ahora debe estar permitido
      const afterReset = checkRateLimit(userId, 'payments');
      expect(afterReset.allowed).toBe(true);
      expect(afterReset.remaining).toBe(9);
    });

    test('debe mantener límites separados por identificador', () => {
      // Usuario 1 hace muchas solicitudes
      for (let i = 0; i < 10; i++) {
        checkRateLimit('user-A', 'payments');
      }

      // Usuario 2 no debe verse afectado
      const resultB = checkRateLimit('user-B', 'payments');

      expect(resultB.allowed).toBe(true);
      expect(resultB.remaining).toBe(9);
    });

    test('debe mantener límites separados por acción', () => {
      // Usuario hace muchas solicitudes de payments
      for (let i = 0; i < 10; i++) {
        checkRateLimit('user-multi', 'payments');
      }

      // Chat debe seguir permitido
      const chatResult = checkRateLimit('user-multi', 'chat');

      expect(chatResult.allowed).toBe(true);
    });

    test('debe incluir resetIn correcto', () => {
      const result = checkRateLimit('user-time', 'payments');

      expect(result.resetIn).toBeGreaterThan(0);
      expect(result.resetIn).toBeLessThanOrEqual(60000);
    });
  });

  // ─── checkPaymentRateLimit ───────────────────────────────

  describe('checkPaymentRateLimit', () => {
    test('debe permitir solicitud normal', () => {
      const result = checkPaymentRateLimit('user-pay-1');

      expect(result.allowed).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('debe bloquear con mensaje de error descriptivo', () => {
      const userId = 'user-pay-spam';

      // Exceder límite
      for (let i = 0; i < 10; i++) {
        checkPaymentRateLimit(userId);
      }

      const blocked = checkPaymentRateLimit(userId);

      expect(blocked.allowed).toBe(false);
      expect(blocked.error).toContain('Demasiadas solicitudes');
      expect(blocked.error).toContain('segundos');
    });
  });

  // ─── validatePaymentAmount ───────────────────────────────

  describe('validatePaymentAmount', () => {
    describe('tips', () => {
      test('debe aceptar monto dentro del rango (€1-€50)', () => {
        const result = validatePaymentAmount(500, 'tip'); // €5

        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      test('debe rechazar monto menor a €1', () => {
        const result = validatePaymentAmount(50, 'tip'); // €0.50

        expect(result.valid).toBe(false);
        expect(result.error).toContain('mínimo');
      });

      test('debe rechazar monto mayor a €50', () => {
        const result = validatePaymentAmount(10000, 'tip'); // €100

        expect(result.valid).toBe(false);
        expect(result.error).toContain('máximo');
      });

      test('debe aceptar monto mínimo exacto (€1)', () => {
        const result = validatePaymentAmount(100, 'tip');

        expect(result.valid).toBe(true);
      });

      test('debe aceptar monto máximo exacto (€50)', () => {
        const result = validatePaymentAmount(5000, 'tip');

        expect(result.valid).toBe(true);
      });
    });

    describe('golden_boost', () => {
      test('debe aceptar precio exacto (€4.99)', () => {
        const result = validatePaymentAmount(499, 'golden_boost');

        expect(result.valid).toBe(true);
      });

      test('debe rechazar precio diferente', () => {
        const result = validatePaymentAmount(500, 'golden_boost');

        expect(result.valid).toBe(false);
      });
    });

    describe('permanent_sponsor', () => {
      test('debe aceptar monto dentro del rango', () => {
        const result = validatePaymentAmount(1999, 'permanent_sponsor'); // €19.99

        expect(result.valid).toBe(true);
      });

      test('debe rechazar monto menor al mínimo', () => {
        const result = validatePaymentAmount(500, 'permanent_sponsor');

        expect(result.valid).toBe(false);
      });
    });

    describe('validaciones generales', () => {
      test('debe rechazar monto 0', () => {
        const result = validatePaymentAmount(0, 'tip');

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Monto inválido');
      });

      test('debe rechazar monto negativo', () => {
        const result = validatePaymentAmount(-100, 'tip');

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Monto inválido');
      });

      test('debe rechazar monto decimal (no entero)', () => {
        const result = validatePaymentAmount(100.5, 'tip');

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Monto inválido');
      });
    });
  });

  // ─── cleanupRateLimitStore ───────────────────────────────

  describe('cleanupRateLimitStore', () => {
    test('debe limpiar entradas expiradas', () => {
      // Crear algunas entradas
      checkRateLimit('cleanup-user-1', 'payments');
      checkRateLimit('cleanup-user-2', 'payments');

      // Avanzar tiempo más allá de la ventana
      jest.advanceTimersByTime(120000); // 2 minutos

      // Limpiar
      cleanupRateLimitStore();

      // Verificar que se limpiaron (nueva solicitud debería tener remaining completo)
      const result = checkRateLimit('cleanup-user-1', 'payments');
      expect(result.remaining).toBe(9); // Como si fuera primera vez
    });
  });

  // ─── Edge Cases ──────────────────────────────────────────

  describe('Edge Cases', () => {
    test('debe manejar identificadores con caracteres especiales', () => {
      const result = checkRateLimit('user@email.com:special!', 'payments');

      expect(result.allowed).toBe(true);
    });

    test('debe manejar identificador vacío', () => {
      const result = checkRateLimit('', 'payments');

      expect(result.allowed).toBe(true);
    });

    test('debe manejar múltiples solicitudes simultáneas', () => {
      const results = [];
      for (let i = 0; i < 15; i++) {
        results.push(checkRateLimit('concurrent-user', 'payments'));
      }

      const allowed = results.filter(r => r.allowed).length;
      const blocked = results.filter(r => !r.allowed).length;

      expect(allowed).toBe(10);
      expect(blocked).toBe(5);
    });
  });
});

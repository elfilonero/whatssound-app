/**
 * WhatsSound — Security Tests: Rate Limiting
 * Verifica que el rate limiting funciona correctamente
 */

import { 
  checkRateLimit, 
  rateLimits, 
  clearRateLimitStore,
  getRateLimitStatus 
} from '../../src/utils/rateLimit';

describe('Rate Limiting', () => {
  beforeEach(() => {
    clearRateLimitStore();
  });

  describe('Basic rate limiting', () => {
    test('permite requests dentro del límite', () => {
      const userId = 'test-user-1';
      
      // 10 requests deberían pasar
      for (let i = 0; i < 10; i++) {
        const result = checkRateLimit(userId, 100, 60000);
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(100 - i - 1);
      }
    });

    test('bloquea después de exceder el límite', () => {
      const userId = 'test-user-2';
      const limit = 5;
      
      // Hacer 5 requests (el límite)
      for (let i = 0; i < limit; i++) {
        checkRateLimit(userId, limit, 60000);
      }
      
      // El siguiente debería ser bloqueado
      const result = checkRateLimit(userId, limit, 60000);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    test('diferentes usuarios tienen límites separados', () => {
      const user1 = 'user-1';
      const user2 = 'user-2';
      
      // User1 hace 5 requests
      for (let i = 0; i < 5; i++) {
        checkRateLimit(user1, 5, 60000);
      }
      
      // User1 está bloqueado
      expect(checkRateLimit(user1, 5, 60000).allowed).toBe(false);
      
      // User2 aún puede hacer requests
      expect(checkRateLimit(user2, 5, 60000).allowed).toBe(true);
    });
  });

  describe('Límites específicos por acción', () => {
    test('login tiene límite de 5/min', () => {
      const userId = 'login-test-user';
      
      // 5 intentos deberían pasar
      for (let i = 0; i < 5; i++) {
        const result = rateLimits.login(userId);
        expect(result.allowed).toBe(true);
      }
      
      // El 6to debería fallar
      const result = rateLimits.login(userId);
      expect(result.allowed).toBe(false);
    });

    test('vote tiene límite de 30/min', () => {
      const userId = 'vote-test-user';
      
      // 30 votos deberían pasar
      for (let i = 0; i < 30; i++) {
        const result = rateLimits.vote(userId);
        expect(result.allowed).toBe(true);
      }
      
      // El 31 debería fallar
      const result = rateLimits.vote(userId);
      expect(result.allowed).toBe(false);
    });

    test('requestSong tiene límite de 10/min', () => {
      const userId = 'song-test-user';
      
      // 10 requests deberían pasar
      for (let i = 0; i < 10; i++) {
        const result = rateLimits.requestSong(userId);
        expect(result.allowed).toBe(true);
      }
      
      // El 11 debería fallar
      const result = rateLimits.requestSong(userId);
      expect(result.allowed).toBe(false);
    });

    test('sendMessage tiene límite de 60/min', () => {
      const userId = 'msg-test-user';
      
      // 60 mensajes deberían pasar
      for (let i = 0; i < 60; i++) {
        rateLimits.sendMessage(userId);
      }
      
      // El 61 debería fallar
      const result = rateLimits.sendMessage(userId);
      expect(result.allowed).toBe(false);
    });
  });

  describe('Status y reset', () => {
    test('getRateLimitStatus devuelve estado correcto', () => {
      const userId = 'status-test-user';
      
      // Sin requests
      let status = getRateLimitStatus(`api:${userId}`);
      expect(status.isBlocked).toBe(false);
      expect(status.requestsRemaining).toBe(100);
      
      // Hacer algunos requests
      for (let i = 0; i < 50; i++) {
        rateLimits.api(userId);
      }
      
      status = getRateLimitStatus(`api:${userId}`);
      expect(status.isBlocked).toBe(false);
      expect(status.requestsRemaining).toBe(50);
    });

    test('clearRateLimitStore resetea todo', () => {
      const userId = 'clear-test-user';
      
      // Bloquear usuario
      for (let i = 0; i < 101; i++) {
        rateLimits.api(userId);
      }
      
      expect(rateLimits.api(userId).allowed).toBe(false);
      
      // Limpiar store
      clearRateLimitStore();
      
      // Debería poder hacer requests de nuevo
      expect(rateLimits.api(userId).allowed).toBe(true);
    });
  });

  describe('Tiempo de bloqueo', () => {
    test('resetIn indica tiempo restante', () => {
      const userId = 'time-test-user';
      
      // Bloquear usuario
      for (let i = 0; i < 6; i++) {
        rateLimits.login(userId);
      }
      
      const result = rateLimits.login(userId);
      expect(result.allowed).toBe(false);
      expect(result.resetIn).toBeGreaterThan(0);
      // El bloqueo es de 5 minutos = 300000ms
      expect(result.resetIn).toBeLessThanOrEqual(5 * 60 * 1000);
    });
  });

  describe('Edge cases', () => {
    test('key vacío funciona', () => {
      const result = checkRateLimit('', 10, 60000);
      expect(result.allowed).toBe(true);
    });

    test('límite de 0 bloquea todo', () => {
      const result = checkRateLimit('zero-limit', 0, 60000);
      expect(result.allowed).toBe(false);
    });

    test('ventana de 0ms siempre permite', () => {
      const userId = 'zero-window';
      
      // Todos deberían pasar porque la ventana es 0
      for (let i = 0; i < 100; i++) {
        const result = checkRateLimit(userId, 5, 0);
        expect(result.allowed).toBe(true);
      }
    });
  });
});

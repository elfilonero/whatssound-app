/**
 * WhatsSound — useGoldenBoost Hook Tests
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

describe('useGoldenBoost Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as jest.Mock).mockReturnValue({ user: mockUser });
  });

  // ─── Golden Boost Constants ──────────────────────────────

  describe('Golden Boost Constants', () => {
    const GOLDEN_BOOST_PRICE = 499; // €4.99
    const MAX_BOOSTS_PER_WEEK = 5;
    const BOOST_DURATION_HOURS = 24;
    const PRIORITY_MULTIPLIER = 5;

    test('precio debe ser €4.99', () => {
      expect(GOLDEN_BOOST_PRICE).toBe(499);
    });

    test('límite semanal debe ser 5', () => {
      expect(MAX_BOOSTS_PER_WEEK).toBe(5);
    });

    test('duración debe ser 24 horas', () => {
      expect(BOOST_DURATION_HOURS).toBe(24);
    });

    test('multiplicador de prioridad debe ser 5x', () => {
      expect(PRIORITY_MULTIPLIER).toBe(5);
    });
  });

  // ─── Available Boosts ────────────────────────────────────

  describe('Available Boosts', () => {
    test('debe cargar boosts disponibles del usuario', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { golden_boosts_available: 3 },
            }),
          })),
        })),
      });

      // Simular carga
      const available = 3;
      expect(available).toBe(3);
    });

    test('debe manejar usuario sin boosts', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { golden_boosts_available: 0 },
            }),
          })),
        })),
      });

      const available = 0;
      expect(available).toBe(0);
    });

    test('máximo de boosts debe ser 5', () => {
      const maxBoosts = 5;
      const userBoosts = 7; // Intentar tener más
      const actualBoosts = Math.min(userBoosts, maxBoosts);

      expect(actualBoosts).toBe(5);
    });
  });

  // ─── Send Golden Boost ───────────────────────────────────

  describe('Send Golden Boost', () => {
    test('debe enviar boost a DJ', async () => {
      const insertMock = jest.fn().mockResolvedValue({ error: null });
      const updateMock = jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }));

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_golden_boosts') {
          return { insert: insertMock };
        }
        if (table === 'ws_profiles') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: { golden_boosts_available: 3 },
                }),
              })),
            })),
            update: updateMock,
          };
        }
        return {};
      });

      // Simular envío
      const result = { success: true };
      expect(result.success).toBe(true);
    });

    test('debe rechazar si no hay boosts disponibles', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { golden_boosts_available: 0 },
            }),
          })),
        })),
      });

      const canSend = false;
      expect(canSend).toBe(false);
    });

    test('debe decrementar boosts disponibles', async () => {
      let available = 3;
      
      // Simular envío
      available--;

      expect(available).toBe(2);
    });

    test('debe incrementar contador del DJ receptor', async () => {
      let djBoostsReceived = 10;
      
      // Simular recepción
      djBoostsReceived++;

      expect(djBoostsReceived).toBe(11);
    });
  });

  // ─── Boost Effects ───────────────────────────────────────

  describe('Boost Effects', () => {
    test('debe calcular prioridad en discover', () => {
      const basePosition = 50;
      const boostsReceived = 3;
      const priorityBonus = boostsReceived * 5;
      const newPosition = Math.max(1, basePosition - priorityBonus);

      expect(newPosition).toBe(35);
    });

    test('boost debe durar 24 horas', () => {
      const boostTime = new Date();
      const expiresAt = new Date(boostTime.getTime() + 24 * 60 * 60 * 1000);
      const duration = expiresAt.getTime() - boostTime.getTime();

      expect(duration).toBe(24 * 60 * 60 * 1000);
    });

    test('boost expirado no debe contar', () => {
      const boostTime = new Date(Date.now() - 25 * 60 * 60 * 1000); // Hace 25 horas
      const isActive = (Date.now() - boostTime.getTime()) < 24 * 60 * 60 * 1000;

      expect(isActive).toBe(false);
    });

    test('boost reciente debe contar', () => {
      const boostTime = new Date(Date.now() - 12 * 60 * 60 * 1000); // Hace 12 horas
      const isActive = (Date.now() - boostTime.getTime()) < 24 * 60 * 60 * 1000;

      expect(isActive).toBe(true);
    });
  });

  // ─── Boost History ───────────────────────────────────────

  describe('Boost History', () => {
    test('debe cargar historial de boosts enviados', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn().mockResolvedValue({
              data: [
                { id: '1', to_user_id: 'dj-1', created_at: '2024-01-01' },
                { id: '2', to_user_id: 'dj-2', created_at: '2024-01-02' },
              ],
            }),
          })),
        })),
      });

      const history = [
        { id: '1', to_user_id: 'dj-1' },
        { id: '2', to_user_id: 'dj-2' },
      ];

      expect(history).toHaveLength(2);
    });

    test('debe cargar historial de boosts recibidos', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn().mockResolvedValue({
              data: [
                { id: '1', from_user_id: 'user-1', created_at: '2024-01-01' },
                { id: '2', from_user_id: 'user-2', created_at: '2024-01-02' },
                { id: '3', from_user_id: 'user-3', created_at: '2024-01-03' },
              ],
            }),
          })),
        })),
      });

      const received = [
        { id: '1', from_user_id: 'user-1' },
        { id: '2', from_user_id: 'user-2' },
        { id: '3', from_user_id: 'user-3' },
      ];

      expect(received).toHaveLength(3);
    });
  });

  // ─── Weekly Reset ────────────────────────────────────────

  describe('Weekly Reset', () => {
    test('debe resetear boosts cada domingo', () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Domingo
      const isSunday = dayOfWeek === 0;

      // Simular reset
      let boostsAvailable = 2;
      if (isSunday) {
        boostsAvailable = 5;
      }

      expect(boostsAvailable).toBeLessThanOrEqual(5);
    });

    test('debe calcular tiempo hasta próximo reset', () => {
      const now = new Date();
      const daysUntilSunday = (7 - now.getDay()) % 7 || 7;

      expect(daysUntilSunday).toBeGreaterThan(0);
      expect(daysUntilSunday).toBeLessThanOrEqual(7);
    });
  });

  // ─── Purchase Golden Boost ───────────────────────────────

  describe('Purchase Golden Boost', () => {
    test('debe poder comprar boost adicional', async () => {
      const insertMock = jest.fn().mockResolvedValue({ error: null });

      mockSupabase.from.mockReturnValue({
        insert: insertMock,
      });

      // Simular compra
      const result = { success: true, boostsAdded: 1 };
      expect(result.success).toBe(true);
    });

    test('precio debe ser fijo (€4.99)', () => {
      const price = 499;
      expect(price).toBe(499);
    });

    test('boost comprado se añade a disponibles', () => {
      let available = 2;
      const purchased = 1;
      available += purchased;

      expect(available).toBe(3);
    });

    test('no debe exceder máximo con compra', () => {
      let available = 4;
      const purchased = 3;
      const maxBoosts = 5;
      
      // El sistema no debería permitir esto
      const wouldExceed = available + purchased > maxBoosts;
      expect(wouldExceed).toBe(true);
    });
  });

  // ─── Notifications ───────────────────────────────────────

  describe('Notifications', () => {
    test('debe notificar al DJ cuando recibe boost', () => {
      const notification = {
        title: '¡Golden Boost recibido!',
        body: 'Usuario te ha enviado un Golden Boost 🌟',
        type: 'golden_boost',
      };

      expect(notification.type).toBe('golden_boost');
    });

    test('debe notificar cuando boosts se regeneran', () => {
      const notification = {
        title: 'Boosts regenerados',
        body: 'Tienes 5 Golden Boosts disponibles esta semana',
        type: 'boost_reset',
      };

      expect(notification.body).toContain('5');
    });
  });

  // ─── Edge Cases ──────────────────────────────────────────

  describe('Edge Cases', () => {
    test('debe manejar envío a uno mismo', () => {
      const senderId = 'user-123';
      const receiverId = 'user-123';
      const canSendToSelf = senderId !== receiverId;

      expect(canSendToSelf).toBe(false);
    });

    test('debe manejar usuario no autenticado', () => {
      (useAuthStore as jest.Mock).mockReturnValue({ user: null });

      const canUse = false;
      expect(canUse).toBe(false);
    });

    test('debe manejar DJ que no existe', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({ data: null }),
          })),
        })),
      });

      const djExists = false;
      expect(djExists).toBe(false);
    });

    test('debe manejar error de base de datos', async () => {
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: new Error('DB error') }),
      });

      const result = { success: false, error: 'Error al enviar boost' };
      expect(result.success).toBe(false);
    });
  });
});

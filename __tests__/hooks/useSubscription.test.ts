/**
 * WhatsSound — useSubscription Hook Tests
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

import {
  useSubscription,
  TIER_FEATURES,
  TIER_PRICES,
  TIER_NAMES,
  TIER_ICONS,
  SubscriptionTier,
} from '../../src/hooks/useSubscription';
import { useAuthStore } from '../../src/stores/authStore';

describe('useSubscription Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as jest.Mock).mockReturnValue({ user: mockUser });
  });

  // ─── TIER Constants ──────────────────────────────────────

  describe('Tier Constants', () => {
    describe('TIER_FEATURES', () => {
      test('free tier debe tener límites básicos', () => {
        expect(TIER_FEATURES.free.maxListeners).toBe(20);
        expect(TIER_FEATURES.free.historyDays).toBe(7);
        expect(TIER_FEATURES.free.canSchedule).toBe(false);
        expect(TIER_FEATURES.free.hasAIAssistant).toBe(false);
      });

      test('creator tier debe tener más features que free', () => {
        expect(TIER_FEATURES.creator.maxListeners).toBeGreaterThan(TIER_FEATURES.free.maxListeners);
        expect(TIER_FEATURES.creator.canSchedule).toBe(true);
      });

      test('pro tier debe tener analytics avanzados', () => {
        expect(TIER_FEATURES.pro.hasAdvancedAnalytics).toBe(true);
        expect(TIER_FEATURES.pro.canExport).toBe(true);
      });

      test('business tier debe tener todas las features', () => {
        expect(TIER_FEATURES.business.hasAIAssistant).toBe(true);
        expect(TIER_FEATURES.business.canMultiSession).toBe(true);
        expect(TIER_FEATURES.business.canCustomBranding).toBe(true);
        expect(TIER_FEATURES.business.hasAPIAccess).toBe(true);
      });

      test('enterprise tier debe tener límites máximos', () => {
        expect(TIER_FEATURES.enterprise.maxListeners).toBeGreaterThan(TIER_FEATURES.business.maxListeners);
        expect(TIER_FEATURES.enterprise.priorityDiscover).toBe(5);
      });
    });

    describe('TIER_PRICES', () => {
      test('free debe costar 0', () => {
        expect(TIER_PRICES.free).toBe(0);
      });

      test('creator debe costar €1.99', () => {
        expect(TIER_PRICES.creator).toBe(1.99);
      });

      test('pro debe costar €7.99', () => {
        expect(TIER_PRICES.pro).toBe(7.99);
      });

      test('business debe costar €29.99', () => {
        expect(TIER_PRICES.business).toBe(29.99);
      });

      test('precios deben ser incrementales', () => {
        expect(TIER_PRICES.creator).toBeGreaterThan(TIER_PRICES.free);
        expect(TIER_PRICES.pro).toBeGreaterThan(TIER_PRICES.creator);
        expect(TIER_PRICES.business).toBeGreaterThan(TIER_PRICES.pro);
      });
    });

    describe('TIER_NAMES', () => {
      test('debe tener nombres descriptivos', () => {
        expect(TIER_NAMES.free).toBe('DJ Social');
        expect(TIER_NAMES.creator).toBe('Creator');
        expect(TIER_NAMES.pro).toBe('Pro');
        expect(TIER_NAMES.business).toBe('Business');
        expect(TIER_NAMES.enterprise).toBe('Enterprise');
      });
    });

    describe('TIER_ICONS', () => {
      test('debe tener emojis para cada tier', () => {
        expect(TIER_ICONS.free).toBe('🎵');
        expect(TIER_ICONS.creator).toBe('⭐');
        expect(TIER_ICONS.pro).toBe('🎧');
        expect(TIER_ICONS.business).toBe('🏢');
        expect(TIER_ICONS.enterprise).toBe('🏆');
      });
    });
  });

  // ─── Hook Initialization ─────────────────────────────────

  describe('Hook Initialization', () => {
    test('debe iniciar en loading true', () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({ data: null }),
          })),
        })),
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.loading).toBe(true);
    });

    test('debe cargar tier free si no hay suscripción', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({ data: null }),
          })),
        })),
      });

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.tier).toBe('free');
    });

    test('debe cargar tier activo del usuario', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { tier: 'pro', status: 'active' },
            }),
          })),
        })),
      });

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.tier).toBe('pro');
      });
    });

    test('debe usar free si suscripción no está activa', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { tier: 'pro', status: 'cancelled' },
            }),
          })),
        })),
      });

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.tier).toBe('free');
      });
    });

    test('debe usar free si no hay usuario', async () => {
      (useAuthStore as jest.Mock).mockReturnValue({ user: null });

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.tier).toBe('free');
    });
  });

  // ─── canAccess ───────────────────────────────────────────

  describe('canAccess', () => {
    test('free no puede acceder a scheduling', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({ data: null }),
          })),
        })),
      });

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.canAccess('canSchedule')).toBe(false);
    });

    test('pro puede acceder a analytics avanzados', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { tier: 'pro', status: 'active' },
            }),
          })),
        })),
      });

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.tier).toBe('pro');
      });

      expect(result.current.canAccess('hasAdvancedAnalytics')).toBe(true);
    });

    test('business puede acceder a AI assistant', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { tier: 'business', status: 'active' },
            }),
          })),
        })),
      });

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.tier).toBe('business');
      });

      expect(result.current.canAccess('hasAIAssistant')).toBe(true);
    });
  });

  // ─── isWithinLimit ───────────────────────────────────────

  describe('isWithinLimit', () => {
    test('free debe aceptar hasta 20 listeners', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({ data: null }),
          })),
        })),
      });

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isWithinLimit(10)).toBe(true);
      expect(result.current.isWithinLimit(19)).toBe(true);
      expect(result.current.isWithinLimit(20)).toBe(false);
      expect(result.current.isWithinLimit(100)).toBe(false);
    });

    test('pro debe aceptar muchos listeners', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { tier: 'pro', status: 'active' },
            }),
          })),
        })),
      });

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.tier).toBe('pro');
      });

      expect(result.current.isWithinLimit(1000)).toBe(true);
      expect(result.current.isWithinLimit(5000)).toBe(true);
    });
  });

  // ─── getUpgradeOffer ─────────────────────────────────────

  describe('getUpgradeOffer', () => {
    test('free debe ofrecer upgrade a creator', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({ data: null }),
          })),
        })),
      });

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const offer = result.current.getUpgradeOffer();

      expect(offer).not.toBeNull();
      expect(offer?.nextTier).toBe('creator');
      expect(offer?.price).toBe(1.99);
    });

    test('creator debe ofrecer upgrade a pro', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { tier: 'creator', status: 'active' },
            }),
          })),
        })),
      });

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.tier).toBe('creator');
      });

      const offer = result.current.getUpgradeOffer();

      expect(offer?.nextTier).toBe('pro');
      expect(offer?.price).toBe(7.99);
    });

    test('business no debe ofrecer upgrade (máximo normal)', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { tier: 'business', status: 'active' },
            }),
          })),
        })),
      });

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.tier).toBe('business');
      });

      const offer = result.current.getUpgradeOffer();

      expect(offer).toBeNull();
    });
  });

  // ─── refresh ─────────────────────────────────────────────

  describe('refresh', () => {
    test('debe recargar suscripción', async () => {
      const selectMock = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
            .mockResolvedValueOnce({ data: { tier: 'free', status: 'active' } })
            .mockResolvedValueOnce({ data: { tier: 'pro', status: 'active' } }),
        })),
      }));

      mockSupabase.from.mockReturnValue({ select: selectMock });

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.tier).toBe('free');
      });

      await act(async () => {
        await result.current.refresh();
      });

      // Después de refresh debería cargar de nuevo
      expect(selectMock).toHaveBeenCalledTimes(2);
    });
  });
});

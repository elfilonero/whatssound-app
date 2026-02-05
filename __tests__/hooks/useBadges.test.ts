/**
 * WhatsSound — useBadges Hook Tests
 * Tests para el sistema de badges y achievements
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
const mockUser = { id: 'user-123', email: 'test@test.com' };
jest.mock('../../src/stores/authStore', () => ({
  useAuthStore: jest.fn(() => ({ user: mockUser })),
}));

import { useBadges, Badge, UserBadge } from '../../src/hooks/useBadges';
import { useAuthStore } from '../../src/stores/authStore';

describe('useBadges Hook', () => {
  const mockBadges: Badge[] = [
    {
      id: 'badge-1',
      name: 'Primer Voto',
      description: 'Vota tu primera canción',
      icon: '🎵',
      requirement: { type: 'votes', count: 1 },
    },
    {
      id: 'badge-2',
      name: 'Votante Experto',
      description: 'Vota 100 canciones',
      icon: '🗳️',
      requirement: { type: 'votes', count: 100 },
    },
    {
      id: 'badge-3',
      name: 'DJ Activo',
      description: 'Crea tu primera sesión',
      icon: '🎧',
      requirement: { type: 'sessions_created', count: 1 },
    },
    {
      id: 'badge-4',
      name: 'Racha Semanal',
      description: 'Escucha 7 días seguidos',
      icon: '🔥',
      requirement: { type: 'streak', days: 7 },
    },
  ];

  const mockUserBadges = [
    {
      badge: mockBadges[0],
      earned_at: '2024-01-15T10:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as jest.Mock).mockReturnValue({ user: mockUser });
  });

  // ─── Loading State ───────────────────────────────────────

  describe('Loading State', () => {
    test('debe iniciar en loading true', () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          order: jest.fn().mockResolvedValue({ data: [], error: null }),
          eq: jest.fn().mockResolvedValue({ data: [], error: null }),
        })),
      });

      const { result } = renderHook(() => useBadges());

      expect(result.current.loading).toBe(true);
    });

    test('debe cambiar a loading false después de cargar', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          order: jest.fn().mockResolvedValue({ data: [], error: null }),
          eq: jest.fn().mockResolvedValue({ data: [], error: null }),
        })),
      });

      const { result } = renderHook(() => useBadges());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    test('debe terminar loading si no hay usuario', async () => {
      (useAuthStore as jest.Mock).mockReturnValue({ user: null });

      const { result } = renderHook(() => useBadges());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  // ─── Load Badges ─────────────────────────────────────────

  describe('Load Badges', () => {
    test('debe cargar todos los badges', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_badges') {
          return {
            select: jest.fn(() => ({
              order: jest.fn().mockResolvedValue({ data: mockBadges, error: null }),
            })),
          };
        }
        if (table === 'ws_user_badges') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn().mockResolvedValue({ data: [], error: null }),
            })),
          };
        }
        return {};
      });

      const { result } = renderHook(() => useBadges());

      await waitFor(() => {
        expect(result.current.allBadges).toHaveLength(4);
      });
    });

    test('debe cargar badges ganados del usuario', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_badges') {
          return {
            select: jest.fn(() => ({
              order: jest.fn().mockResolvedValue({ data: mockBadges, error: null }),
            })),
          };
        }
        if (table === 'ws_user_badges') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn().mockResolvedValue({ data: mockUserBadges, error: null }),
            })),
          };
        }
        return {};
      });

      const { result } = renderHook(() => useBadges());

      await waitFor(() => {
        expect(result.current.earnedBadges).toHaveLength(1);
        expect(result.current.earnedBadges[0].name).toBe('Primer Voto');
      });
    });
  });

  // ─── hasBadge ────────────────────────────────────────────

  describe('hasBadge', () => {
    test('debe retornar true si tiene el badge', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_badges') {
          return {
            select: jest.fn(() => ({
              order: jest.fn().mockResolvedValue({ data: mockBadges, error: null }),
            })),
          };
        }
        if (table === 'ws_user_badges') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn().mockResolvedValue({ data: mockUserBadges, error: null }),
            })),
          };
        }
        return {};
      });

      const { result } = renderHook(() => useBadges());

      await waitFor(() => {
        expect(result.current.hasBadge('Primer Voto')).toBe(true);
      });
    });

    test('debe retornar false si no tiene el badge', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_badges') {
          return {
            select: jest.fn(() => ({
              order: jest.fn().mockResolvedValue({ data: mockBadges, error: null }),
            })),
          };
        }
        if (table === 'ws_user_badges') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn().mockResolvedValue({ data: mockUserBadges, error: null }),
            })),
          };
        }
        return {};
      });

      const { result } = renderHook(() => useBadges());

      await waitFor(() => {
        expect(result.current.hasBadge('Votante Experto')).toBe(false);
      });
    });
  });

  // ─── checkAndAward ───────────────────────────────────────

  describe('checkAndAward', () => {
    test('debe retornar null si no hay usuario', async () => {
      (useAuthStore as jest.Mock).mockReturnValue({ user: null });

      const { result } = renderHook(() => useBadges());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const awarded = await result.current.checkAndAward('votes', 10);
      expect(awarded).toBeNull();
    });

    test('debe no otorgar badge si ya lo tiene', async () => {
      const insertMock = jest.fn();

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_badges') {
          return {
            select: jest.fn(() => ({
              order: jest.fn().mockResolvedValue({ data: mockBadges, error: null }),
            })),
          };
        }
        if (table === 'ws_user_badges') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn().mockResolvedValue({ data: mockUserBadges, error: null }),
            })),
            insert: insertMock,
          };
        }
        return {};
      });

      const { result } = renderHook(() => useBadges());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // El usuario ya tiene "Primer Voto", no debe insertar
      await result.current.checkAndAward('votes', 1);
      expect(insertMock).not.toHaveBeenCalled();
    });

    test('debe otorgar badge si cumple requisito', async () => {
      const insertMock = jest.fn().mockResolvedValue({ error: null });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_badges') {
          return {
            select: jest.fn(() => ({
              order: jest.fn().mockResolvedValue({ data: mockBadges, error: null }),
            })),
          };
        }
        if (table === 'ws_user_badges') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn().mockResolvedValue({ data: [], error: null }), // Sin badges
            })),
            insert: insertMock,
          };
        }
        return {};
      });

      const { result } = renderHook(() => useBadges());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const awarded = await result.current.checkAndAward('votes', 1);

      expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 'user-123',
        badge_id: 'badge-1',
      }));
      expect(awarded?.name).toBe('Primer Voto');
    });

    test('debe no otorgar si no cumple requisito', async () => {
      const insertMock = jest.fn();

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_badges') {
          return {
            select: jest.fn(() => ({
              order: jest.fn().mockResolvedValue({ data: mockBadges, error: null }),
            })),
          };
        }
        if (table === 'ws_user_badges') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn().mockResolvedValue({ data: [], error: null }),
            })),
            insert: insertMock,
          };
        }
        return {};
      });

      const { result } = renderHook(() => useBadges());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Intentar conseguir "Votante Experto" (100 votos) con solo 50
      const awarded = await result.current.checkAndAward('votes', 50);
      
      // Debería obtener "Primer Voto" pero no "Votante Experto"
      expect(awarded?.name).toBe('Primer Voto');
    });

    test('debe manejar requisito de días (streak)', async () => {
      const insertMock = jest.fn().mockResolvedValue({ error: null });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_badges') {
          return {
            select: jest.fn(() => ({
              order: jest.fn().mockResolvedValue({ data: mockBadges, error: null }),
            })),
          };
        }
        if (table === 'ws_user_badges') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn().mockResolvedValue({ data: [], error: null }),
            })),
            insert: insertMock,
          };
        }
        return {};
      });

      const { result } = renderHook(() => useBadges());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const awarded = await result.current.checkAndAward('streak', 7);
      
      expect(awarded?.name).toBe('Racha Semanal');
    });
  });

  // ─── Edge Cases ──────────────────────────────────────────

  describe('Edge Cases', () => {
    test('debe manejar error de carga de badges', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_badges') {
          return {
            select: jest.fn(() => ({
              order: jest.fn().mockResolvedValue({ data: null, error: new Error('DB error') }),
            })),
          };
        }
        if (table === 'ws_user_badges') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn().mockResolvedValue({ data: null, error: new Error('DB error') }),
            })),
          };
        }
        return {};
      });

      const { result } = renderHook(() => useBadges());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // No debe crashear
      expect(result.current.allBadges).toEqual([]);
      expect(result.current.earnedBadges).toEqual([]);
    });

    test('debe manejar error al otorgar badge', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_badges') {
          return {
            select: jest.fn(() => ({
              order: jest.fn().mockResolvedValue({ data: mockBadges, error: null }),
            })),
          };
        }
        if (table === 'ws_user_badges') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn().mockResolvedValue({ data: [], error: null }),
            })),
            insert: jest.fn().mockResolvedValue({ error: new Error('Insert failed') }),
          };
        }
        return {};
      });

      const { result } = renderHook(() => useBadges());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const awarded = await result.current.checkAndAward('votes', 1);
      
      // No debe añadir el badge si hay error
      expect(awarded).toBeNull();
      expect(result.current.earnedBadges).toHaveLength(0);
    });
  });
});

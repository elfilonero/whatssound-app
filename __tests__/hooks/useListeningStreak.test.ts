/**
 * WhatsSound — useListeningStreak Hook Tests
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
  useListeningStreak, 
  getStreakEmoji, 
  getStreakLabel 
} from '../../src/hooks/useListeningStreak';
import { useAuthStore } from '../../src/stores/authStore';

describe('useListeningStreak Hook', () => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as jest.Mock).mockReturnValue({ user: mockUser });
  });

  // ─── Initial Load ────────────────────────────────────────

  describe('Initial Load', () => {
    test('debe cargar streak existente', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: {
                current_streak: 5,
                longest_streak: 10,
                last_listen_date: yesterday,
              },
              error: null,
            }),
          })),
        })),
      });

      const { result } = renderHook(() => useListeningStreak());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.streak.currentStreak).toBe(5);
      expect(result.current.streak.longestStreak).toBe(10);
      expect(result.current.streak.lastListenDate).toBe(yesterday);
    });

    test('debe manejar usuario sin streak', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          })),
        })),
      });

      const { result } = renderHook(() => useListeningStreak());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.streak.currentStreak).toBe(0);
      expect(result.current.streak.longestStreak).toBe(0);
    });

    test('debe terminar loading si no hay usuario', async () => {
      (useAuthStore as jest.Mock).mockReturnValue({ user: null });

      const { result } = renderHook(() => useListeningStreak());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  // ─── recordListen ────────────────────────────────────────

  describe('recordListen', () => {
    test('debe iniciar nueva racha si no hay historial', async () => {
      const upsertMock = jest.fn().mockResolvedValue({ error: null });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_listening_streaks') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({ data: null }),
              })),
            })),
            upsert: upsertMock,
          };
        }
        return {};
      });

      const { result } = renderHook(() => useListeningStreak());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.recordListen();
      });

      expect(upsertMock).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-123',
          current_streak: 1,
          last_listen_date: today,
        }),
        expect.any(Object)
      );
    });

    test('debe extender racha si escuchó ayer', async () => {
      const upsertMock = jest.fn().mockResolvedValue({ error: null });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_listening_streaks') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: {
                    current_streak: 5,
                    longest_streak: 10,
                    last_listen_date: yesterday,
                  },
                }),
              })),
            })),
            upsert: upsertMock,
          };
        }
        return {};
      });

      const { result } = renderHook(() => useListeningStreak());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.recordListen();
      });

      expect(upsertMock).toHaveBeenCalledWith(
        expect.objectContaining({
          current_streak: 6, // 5 + 1
        }),
        expect.any(Object)
      );
    });

    test('debe reiniciar racha si perdió un día', async () => {
      const upsertMock = jest.fn().mockResolvedValue({ error: null });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_listening_streaks') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: {
                    current_streak: 5,
                    longest_streak: 10,
                    last_listen_date: twoDaysAgo, // Perdió ayer
                  },
                }),
              })),
            })),
            upsert: upsertMock,
          };
        }
        return {};
      });

      const { result } = renderHook(() => useListeningStreak());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.recordListen();
      });

      expect(upsertMock).toHaveBeenCalledWith(
        expect.objectContaining({
          current_streak: 1, // Reinicia
        }),
        expect.any(Object)
      );
    });

    test('debe no hacer nada si ya escuchó hoy', async () => {
      const upsertMock = jest.fn();

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_listening_streaks') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: {
                    current_streak: 5,
                    longest_streak: 10,
                    last_listen_date: today, // Ya escuchó hoy
                  },
                }),
              })),
            })),
            upsert: upsertMock,
          };
        }
        return {};
      });

      const { result } = renderHook(() => useListeningStreak());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.recordListen();
      });

      expect(upsertMock).not.toHaveBeenCalled();
    });

    test('debe actualizar longest_streak si supera el récord', async () => {
      const upsertMock = jest.fn().mockResolvedValue({ error: null });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_listening_streaks') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: {
                    current_streak: 10, // Empatado con récord
                    longest_streak: 10,
                    last_listen_date: yesterday,
                  },
                }),
              })),
            })),
            upsert: upsertMock,
          };
        }
        return {};
      });

      const { result } = renderHook(() => useListeningStreak());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.recordListen();
      });

      expect(upsertMock).toHaveBeenCalledWith(
        expect.objectContaining({
          current_streak: 11,
          longest_streak: 11, // Nuevo récord
        }),
        expect.any(Object)
      );
    });
  });
});

// ─── Helper Functions ────────────────────────────────────

describe('Streak Helper Functions', () => {
  describe('getStreakEmoji', () => {
    test('debe retornar diamante para 100+ días', () => {
      expect(getStreakEmoji(100)).toBe('💎');
      expect(getStreakEmoji(365)).toBe('💎');
    });

    test('debe retornar fuego para 30-99 días', () => {
      expect(getStreakEmoji(30)).toBe('🔥');
      expect(getStreakEmoji(50)).toBe('🔥');
      expect(getStreakEmoji(99)).toBe('🔥');
    });

    test('debe retornar rayo para 7-29 días', () => {
      expect(getStreakEmoji(7)).toBe('⚡');
      expect(getStreakEmoji(15)).toBe('⚡');
      expect(getStreakEmoji(29)).toBe('⚡');
    });

    test('debe retornar estrella para 1-6 días', () => {
      expect(getStreakEmoji(1)).toBe('✨');
      expect(getStreakEmoji(3)).toBe('✨');
      expect(getStreakEmoji(6)).toBe('✨');
    });

    test('debe retornar nota musical para 0 días', () => {
      expect(getStreakEmoji(0)).toBe('🎵');
    });
  });

  describe('getStreakLabel', () => {
    test('debe retornar "Leyenda" para 100+ días', () => {
      expect(getStreakLabel(100)).toBe('Leyenda');
      expect(getStreakLabel(500)).toBe('Leyenda');
    });

    test('debe retornar "En llamas" para 30-99 días', () => {
      expect(getStreakLabel(30)).toBe('En llamas');
      expect(getStreakLabel(99)).toBe('En llamas');
    });

    test('debe retornar "En racha" para 7-29 días', () => {
      expect(getStreakLabel(7)).toBe('En racha');
      expect(getStreakLabel(29)).toBe('En racha');
    });

    test('debe retornar "Activo" para 1-6 días', () => {
      expect(getStreakLabel(1)).toBe('Activo');
      expect(getStreakLabel(6)).toBe('Activo');
    });

    test('debe retornar mensaje de inicio para 0 días', () => {
      expect(getStreakLabel(0)).toBe('Empieza tu racha');
    });
  });
});

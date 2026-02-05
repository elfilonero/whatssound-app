/**
 * WhatsSound — useReferrals Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';

// Mock dependencies
jest.mock('react-native', () => ({
  Share: {
    share: jest.fn(),
  },
  Platform: {
    OS: 'ios',
  },
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
}));

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

import { useReferrals } from '../../src/hooks/useReferrals';
import { useAuthStore } from '../../src/stores/authStore';
import { Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';

describe('useReferrals Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as jest.Mock).mockReturnValue({ user: mockUser });
  });

  // ─── Initial Load ────────────────────────────────────────

  describe('Initial Load', () => {
    test('debe cargar código de referido existente', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_profiles') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: { referral_code: 'ABC123' },
                }),
              })),
            })),
          };
        }
        if (table === 'ws_referrals') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                order: jest.fn().mockResolvedValue({ data: [] }),
              })),
            })),
          };
        }
        return {};
      });

      const { result } = renderHook(() => useReferrals());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.myCode).toBe('ABC123');
    });

    test('debe cargar lista de referidos', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_profiles') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: { referral_code: 'XYZ789' },
                }),
              })),
            })),
          };
        }
        if (table === 'ws_referrals') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                order: jest.fn().mockResolvedValue({
                  data: [
                    { id: 'ref-1', referred_id: 'user-A', status: 'completed', created_at: '2024-01-01', completed_at: '2024-01-02' },
                    { id: 'ref-2', referred_id: null, status: 'pending', created_at: '2024-01-05', completed_at: null },
                  ],
                }),
              })),
            })),
          };
        }
        return {};
      });

      const { result } = renderHook(() => useReferrals());

      await waitFor(() => {
        expect(result.current.referrals).toHaveLength(2);
      });

      expect(result.current.referrals[0].status).toBe('completed');
      expect(result.current.referrals[1].status).toBe('pending');
    });

    test('debe terminar loading si no hay usuario', async () => {
      (useAuthStore as jest.Mock).mockReturnValue({ user: null });

      const { result } = renderHook(() => useReferrals());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.myCode).toBeNull();
    });
  });

  // ─── completedCount ──────────────────────────────────────

  describe('completedCount', () => {
    test('debe contar referidos completados', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_profiles') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({ data: { referral_code: 'CODE1' } }),
              })),
            })),
          };
        }
        if (table === 'ws_referrals') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                order: jest.fn().mockResolvedValue({
                  data: [
                    { id: '1', status: 'completed', created_at: '2024-01-01' },
                    { id: '2', status: 'completed', created_at: '2024-01-02' },
                    { id: '3', status: 'pending', created_at: '2024-01-03' },
                    { id: '4', status: 'rewarded', created_at: '2024-01-04' },
                  ],
                }),
              })),
            })),
          };
        }
        return {};
      });

      const { result } = renderHook(() => useReferrals());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // completed + rewarded = 3
      expect(result.current.completedCount).toBe(3);
    });
  });

  // ─── getOrCreateCode ─────────────────────────────────────

  describe('getOrCreateCode', () => {
    test('debe retornar código existente', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_profiles') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: { referral_code: 'EXIST1' },
                }),
              })),
            })),
          };
        }
        if (table === 'ws_referrals') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                order: jest.fn().mockResolvedValue({ data: [] }),
              })),
            })),
          };
        }
        return {};
      });

      const { result } = renderHook(() => useReferrals());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const code = await result.current.getOrCreateCode();

      expect(code).toBe('EXIST1');
    });

    test('debe generar código nuevo si no existe', async () => {
      const updateMock = jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }));

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_profiles') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn()
                  .mockResolvedValueOnce({ data: { referral_code: null } }) // Load
                  .mockResolvedValueOnce({ data: null }), // Check uniqueness
              })),
            })),
            update: updateMock,
          };
        }
        if (table === 'ws_referrals') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                order: jest.fn().mockResolvedValue({ data: [] }),
              })),
            })),
          };
        }
        return {};
      });

      const { result } = renderHook(() => useReferrals());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const code = await result.current.getOrCreateCode();

      expect(code).toHaveLength(6);
      expect(updateMock).toHaveBeenCalled();
    });

    test('debe lanzar error si no hay usuario', async () => {
      (useAuthStore as jest.Mock).mockReturnValue({ user: null });

      const { result } = renderHook(() => useReferrals());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(result.current.getOrCreateCode()).rejects.toThrow('Not authenticated');
    });
  });

  // ─── shareReferral ───────────────────────────────────────

  describe('shareReferral', () => {
    test('debe llamar Share.share con URL correcta', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_profiles') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: { referral_code: 'SHARE1' },
                }),
              })),
            })),
          };
        }
        if (table === 'ws_referrals') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                order: jest.fn().mockResolvedValue({ data: [] }),
              })),
            })),
          };
        }
        return {};
      });

      const { result } = renderHook(() => useReferrals());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.shareReferral();
      });

      expect(Share.share).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('SHARE1'),
      }));
    });
  });

  // ─── copyToClipboard ─────────────────────────────────────

  describe('copyToClipboard', () => {
    test('debe copiar URL al clipboard', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_profiles') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: { referral_code: 'COPY11' },
                }),
              })),
            })),
          };
        }
        if (table === 'ws_referrals') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                order: jest.fn().mockResolvedValue({ data: [] }),
              })),
            })),
          };
        }
        return {};
      });

      const { result } = renderHook(() => useReferrals());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.copyToClipboard();
      });

      expect(Clipboard.setStringAsync).toHaveBeenCalledWith(
        expect.stringContaining('COPY11')
      );
    });
  });

  // ─── applyReferralCode ───────────────────────────────────

  describe('applyReferralCode', () => {
    test('debe aplicar código válido', async () => {
      const insertMock = jest.fn().mockResolvedValue({ error: null });
      const updateMock = jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }));

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_profiles') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn()
                  .mockResolvedValueOnce({ data: { referral_code: null } }) // Load own
                  .mockResolvedValueOnce({ data: { id: 'referrer-id' } }), // Find referrer
              })),
            })),
            update: updateMock,
          };
        }
        if (table === 'ws_referrals') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                order: jest.fn().mockResolvedValue({ data: [] }),
              })),
            })),
            insert: insertMock,
          };
        }
        return {};
      });

      const { result } = renderHook(() => useReferrals());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const success = await result.current.applyReferralCode('VALID1');

      expect(success).toBe(true);
    });

    test('debe rechazar código inválido', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_profiles') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn()
                  .mockResolvedValueOnce({ data: { referral_code: null } })
                  .mockResolvedValueOnce({ data: null }), // No encontrado
              })),
            })),
          };
        }
        if (table === 'ws_referrals') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                order: jest.fn().mockResolvedValue({ data: [] }),
              })),
            })),
          };
        }
        return {};
      });

      const { result } = renderHook(() => useReferrals());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const success = await result.current.applyReferralCode('INVALID');

      expect(success).toBe(false);
    });
  });

  // ─── getReferralUrl ──────────────────────────────────────

  describe('getReferralUrl', () => {
    test('debe generar URL con código', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_profiles') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: { referral_code: 'URLCODE' },
                }),
              })),
            })),
          };
        }
        if (table === 'ws_referrals') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                order: jest.fn().mockResolvedValue({ data: [] }),
              })),
            })),
          };
        }
        return {};
      });

      const { result } = renderHook(() => useReferrals());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const url = result.current.getReferralUrl();

      expect(url).toContain('URLCODE');
      expect(url).toContain('ref=');
    });
  });
});

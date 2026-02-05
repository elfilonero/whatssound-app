/**
 * WhatsSound — Sessions Tests
 * Tests para el sistema de sesiones de DJ
 */

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(),
  channel: jest.fn(() => ({
    on: jest.fn(() => ({
      on: jest.fn(() => ({
        subscribe: jest.fn(),
      })),
    })),
  })),
  removeChannel: jest.fn(),
};

jest.mock('../../src/lib/supabase', () => ({
  supabase: mockSupabase,
}));

jest.mock('../../src/lib/demo', () => ({
  isTestMode: jest.fn(() => false),
  getOrCreateTestUser: jest.fn(),
}));

import {
  createSession,
  endSession,
  joinSession,
  leaveSession,
  getActiveSessions,
  getSessionDetails,
  subscribeToSession,
} from '../../src/lib/sessions';
import { isTestMode, getOrCreateTestUser } from '../../src/lib/demo';

describe('Sessions System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── createSession ───────────────────────────────────────

  describe('createSession', () => {
    test('debe rechazar nombre vacío', async () => {
      const result = await createSession({
        name: '',
        genres: ['house'],
      });

      expect(result.ok).toBe(false);
      expect(result.error).toBe('El nombre de la sesión es obligatorio');
    });

    test('debe rechazar nombre solo con espacios', async () => {
      const result = await createSession({
        name: '   ',
        genres: ['techno'],
      });

      expect(result.ok).toBe(false);
      expect(result.error).toBe('El nombre de la sesión es obligatorio');
    });

    test('debe rechazar si no hay usuario autenticado', async () => {
      (isTestMode as jest.Mock).mockReturnValue(false);
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      const result = await createSession({
        name: 'Mi Sesión',
        genres: ['house'],
      });

      expect(result.ok).toBe(false);
      expect(result.error).toBe('Debes iniciar sesión');
    });

    test('debe rechazar si usuario no es DJ', async () => {
      (isTestMode as jest.Mock).mockReturnValue(false);
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user-123' } } 
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { id: 'user-123', is_dj: false, display_name: 'User' },
            }),
          })),
        })),
      });

      const result = await createSession({
        name: 'Mi Sesión',
        genres: ['house'],
      });

      expect(result.ok).toBe(false);
      expect(result.error).toBe('Solo los DJs pueden crear sesiones');
    });

    test('debe crear sesión correctamente', async () => {
      (isTestMode as jest.Mock).mockReturnValue(false);
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'dj-123' } } 
      });

      const insertMock = jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: {
              id: 'session-new',
              dj_id: 'dj-123',
              name: 'House Night',
              is_active: true,
            },
            error: null,
          }),
        })),
      }));

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'ws_profiles') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: { id: 'dj-123', is_dj: true, display_name: 'DJ Cool' },
                }),
              })),
            })),
          };
        }
        if (table === 'ws_sessions') {
          return { insert: insertMock };
        }
        if (table === 'ws_session_members') {
          return { insert: jest.fn().mockResolvedValue({ error: null }) };
        }
        return {};
      });

      const result = await createSession({
        name: 'House Night',
        description: 'Best house music',
        genres: ['house', 'deep house'],
        isPublic: true,
        allowRequests: true,
        tipsEnabled: true,
      });

      expect(result.ok).toBe(true);
      expect(result.session).toBeDefined();
      expect(result.session?.name).toBe('House Night');
    });

    test('debe usar valores por defecto correctamente', async () => {
      (isTestMode as jest.Mock).mockReturnValue(true);
      (getOrCreateTestUser as jest.Mock).mockResolvedValue({
        id: 'test-dj',
        is_dj: true,
        display_name: 'Test DJ',
      });

      let insertedData: any = null;
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'ws_sessions') {
          return {
            insert: jest.fn((data) => {
              insertedData = data;
              return {
                select: jest.fn(() => ({
                  single: jest.fn().mockResolvedValue({
                    data: { id: 'session-1', ...data },
                    error: null,
                  }),
                })),
              };
            }),
          };
        }
        if (table === 'ws_session_members') {
          return { insert: jest.fn().mockResolvedValue({ error: null }) };
        }
        return {};
      });

      await createSession({
        name: 'Simple Session',
        genres: ['pop'],
      });

      expect(insertedData).toBeDefined();
      expect(insertedData.is_public).toBe(true);
      expect(insertedData.allow_requests).toBe(true);
      expect(insertedData.tips_enabled).toBe(true);
      expect(insertedData.max_songs_per_user).toBe(3);
    });
  });

  // ─── endSession ──────────────────────────────────────────

  describe('endSession', () => {
    test('debe finalizar sesión correctamente', async () => {
      const updateMock = jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }));

      mockSupabase.from.mockReturnValue({ update: updateMock });

      const result = await endSession('session-123');

      expect(result.ok).toBe(true);
      expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({
        is_active: false,
      }));
    });

    test('debe retornar error si falla', async () => {
      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({ error: new Error('DB error') }),
        })),
      });

      const result = await endSession('session-123');

      expect(result.ok).toBe(false);
      expect(result.error).toBe('Error al finalizar la sesión');
    });
  });

  // ─── joinSession ─────────────────────────────────────────

  describe('joinSession', () => {
    test('debe rechazar si no hay usuario', async () => {
      (isTestMode as jest.Mock).mockReturnValue(false);
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      const result = await joinSession('session-123');

      expect(result.ok).toBe(false);
      expect(result.error).toBe('Debes iniciar sesión');
    });

    test('debe retornar ok si ya es miembro', async () => {
      (isTestMode as jest.Mock).mockReturnValue(false);
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user-123' } } 
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              maybeSingle: jest.fn().mockResolvedValue({
                data: { id: 'member-1', left_at: null },
              }),
            })),
          })),
        })),
      });

      const result = await joinSession('session-123');

      expect(result.ok).toBe(true);
    });

    test('debe re-unirse si left_at existe', async () => {
      (isTestMode as jest.Mock).mockReturnValue(false);
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user-123' } } 
      });

      const updateMock = jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }));

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              maybeSingle: jest.fn().mockResolvedValue({
                data: { id: 'member-1', left_at: '2024-01-01' },
              }),
            })),
          })),
        })),
        update: updateMock,
      });

      const result = await joinSession('session-123');

      expect(result.ok).toBe(true);
    });

    test('debe crear nuevo miembro si no existe', async () => {
      (isTestMode as jest.Mock).mockReturnValue(false);
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user-123' } } 
      });

      const insertMock = jest.fn().mockResolvedValue({ error: null });

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              maybeSingle: jest.fn().mockResolvedValue({ data: null }),
            })),
          })),
        })),
        insert: insertMock,
      });

      const result = await joinSession('session-123');

      expect(result.ok).toBe(true);
      expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
        session_id: 'session-123',
        user_id: 'user-123',
        role: 'listener',
      }));
    });
  });

  // ─── leaveSession ────────────────────────────────────────

  describe('leaveSession', () => {
    test('debe marcar left_at correctamente', async () => {
      (isTestMode as jest.Mock).mockReturnValue(false);
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user-123' } } 
      });

      const updateMock = jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({ error: null }),
        })),
      }));

      mockSupabase.from.mockReturnValue({ update: updateMock });

      const result = await leaveSession('session-123');

      expect(result.ok).toBe(true);
      expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({
        left_at: expect.any(String),
      }));
    });
  });

  // ─── getActiveSessions ───────────────────────────────────

  describe('getActiveSessions', () => {
    test('debe retornar sesiones activas', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn().mockResolvedValue({
              data: [
                { id: 'session-1', name: 'Session 1', is_active: true },
                { id: 'session-2', name: 'Session 2', is_active: true },
              ],
              error: null,
            }),
          })),
        })),
      });

      const sessions = await getActiveSessions();

      expect(sessions).toHaveLength(2);
      expect(sessions[0].id).toBe('session-1');
    });

    test('debe retornar array vacío si hay error', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn().mockResolvedValue({
              data: null,
              error: new Error('DB error'),
            }),
          })),
        })),
      });

      const sessions = await getActiveSessions();

      expect(sessions).toEqual([]);
    });
  });

  // ─── getSessionDetails ───────────────────────────────────

  describe('getSessionDetails', () => {
    test('debe retornar detalles de sesión', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'session-1',
                name: 'House Party',
                dj: { display_name: 'DJ Cool' },
                members: [],
                songs: [],
              },
              error: null,
            }),
          })),
        })),
      });

      const session = await getSessionDetails('session-1');

      expect(session).toBeDefined();
      expect(session?.name).toBe('House Party');
    });

    test('debe retornar null si no existe', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: new Error('Not found'),
            }),
          })),
        })),
      });

      const session = await getSessionDetails('nonexistent');

      expect(session).toBeNull();
    });
  });

  // ─── subscribeToSession ──────────────────────────────────

  describe('subscribeToSession', () => {
    test('debe configurar suscripción', () => {
      const subscribeMock = jest.fn();
      const onMock = jest.fn(() => ({ on: jest.fn(() => ({ subscribe: subscribeMock })) }));
      
      mockSupabase.channel.mockReturnValue({ on: onMock });
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({ data: null }),
          })),
        })),
      });

      const callback = jest.fn();
      subscribeToSession('session-1', callback);

      expect(mockSupabase.channel).toHaveBeenCalledWith('session:session-1');
      expect(subscribeMock).toHaveBeenCalled();
    });

    test('debe retornar función de cleanup', () => {
      const channelRef = { 
        on: jest.fn(() => ({ 
          on: jest.fn(() => ({ 
            subscribe: jest.fn() 
          })) 
        })) 
      };
      
      mockSupabase.channel.mockReturnValue(channelRef);
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({ data: null }),
          })),
        })),
      });

      const cleanup = subscribeToSession('session-1', jest.fn());
      
      expect(typeof cleanup).toBe('function');
      
      cleanup();
      expect(mockSupabase.removeChannel).toHaveBeenCalledWith(channelRef);
    });
  });
});

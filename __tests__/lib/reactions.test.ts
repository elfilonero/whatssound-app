/**
 * WhatsSound — Reactions Tests
 * Tests para el sistema de reacciones
 */

import { REACTION_EMOJIS } from '../../src/lib/reactions';

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            maybeSingle: jest.fn(),
          })),
        })),
        maybeSingle: jest.fn(),
      })),
      order: jest.fn(() => ({
        limit: jest.fn(),
      })),
    })),
    insert: jest.fn(),
    delete: jest.fn(() => ({
      eq: jest.fn(),
    })),
  })),
  channel: jest.fn(() => ({
    on: jest.fn(() => ({
      subscribe: jest.fn(),
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

describe('Reactions System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('REACTION_EMOJIS', () => {
    test('debe tener 12 emojis disponibles', () => {
      expect(REACTION_EMOJIS).toHaveLength(12);
    });

    test('debe incluir emojis básicos de música', () => {
      expect(REACTION_EMOJIS).toContain('🔥');
      expect(REACTION_EMOJIS).toContain('❤️');
      expect(REACTION_EMOJIS).toContain('🎵');
      expect(REACTION_EMOJIS).toContain('🎤');
      expect(REACTION_EMOJIS).toContain('🎹');
      expect(REACTION_EMOJIS).toContain('🥁');
      expect(REACTION_EMOJIS).toContain('🎸');
    });

    test('debe incluir emojis de feedback', () => {
      expect(REACTION_EMOJIS).toContain('🙌');
      expect(REACTION_EMOJIS).toContain('👏');
      expect(REACTION_EMOJIS).toContain('😂');
      expect(REACTION_EMOJIS).toContain('💀');
      expect(REACTION_EMOJIS).toContain('🤠');
    });

    test('todos los emojis deben ser únicos', () => {
      const uniqueEmojis = [...new Set(REACTION_EMOJIS)];
      expect(uniqueEmojis).toHaveLength(REACTION_EMOJIS.length);
    });
  });

  describe('sendReaction', () => {
    const { sendReaction } = require('../../src/lib/reactions');
    const { isTestMode, getOrCreateTestUser } = require('../../src/lib/demo');

    test('debe rechazar emoji no válido', async () => {
      const result = await sendReaction({
        sessionId: 'session-1',
        emoji: '🚫', // No está en la lista
      });

      expect(result.ok).toBe(false);
      expect(result.error).toBe('Emoji no válido');
    });

    test('debe rechazar si no hay usuario autenticado', async () => {
      isTestMode.mockReturnValue(false);
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      const result = await sendReaction({
        sessionId: 'session-1',
        emoji: '🔥',
      });

      expect(result.ok).toBe(false);
      expect(result.error).toBe('Debes iniciar sesión');
    });

    test('debe usar test user en modo test', async () => {
      isTestMode.mockReturnValue(true);
      getOrCreateTestUser.mockResolvedValue({ id: 'test-user-id' });
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              eq: jest.fn(() => ({
                maybeSingle: jest.fn().mockResolvedValue({ data: null }),
              })),
            })),
          })),
        })),
        insert: jest.fn().mockResolvedValue({ error: null }),
      });

      const result = await sendReaction({
        sessionId: 'session-1',
        emoji: '🔥',
      });

      expect(getOrCreateTestUser).toHaveBeenCalled();
    });

    test('debe toggle (eliminar) si ya existe reacción', async () => {
      isTestMode.mockReturnValue(false);
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: 'user-123' } } 
      });

      const deleteMock = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              eq: jest.fn(() => ({
                maybeSingle: jest.fn().mockResolvedValue({ 
                  data: { id: 'existing-reaction-id' } 
                }),
              })),
            })),
          })),
        })),
        delete: deleteMock,
      });

      const result = await sendReaction({
        sessionId: 'session-1',
        emoji: '🔥',
      });

      expect(deleteMock).toHaveBeenCalled();
    });
  });

  describe('getReactionCounts', () => {
    const { getReactionCounts } = require('../../src/lib/reactions');

    test('debe retornar counts vacíos si hay error', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({ data: null, error: new Error('DB error') }),
        })),
      });

      const counts = await getReactionCounts('session-1');

      expect(counts).toHaveLength(12);
      counts.forEach(c => {
        expect(c.count).toBe(0);
        expect(c.userReacted).toBe(false);
      });
    });

    test('debe contar reacciones correctamente', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({
            data: [
              { emoji: '🔥', user_id: 'user-1' },
              { emoji: '🔥', user_id: 'user-2' },
              { emoji: '🔥', user_id: 'user-3' },
              { emoji: '❤️', user_id: 'user-1' },
            ],
            error: null,
          }),
        })),
      });

      const counts = await getReactionCounts('session-1', 'user-1');

      const fireCount = counts.find(c => c.emoji === '🔥');
      expect(fireCount?.count).toBe(3);
      expect(fireCount?.userReacted).toBe(true);

      const heartCount = counts.find(c => c.emoji === '❤️');
      expect(heartCount?.count).toBe(1);
      expect(heartCount?.userReacted).toBe(true);
    });

    test('debe marcar userReacted correctamente', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({
            data: [
              { emoji: '🔥', user_id: 'user-1' },
              { emoji: '❤️', user_id: 'user-2' },
            ],
            error: null,
          }),
        })),
      });

      const counts = await getReactionCounts('session-1', 'user-1');

      const fireCount = counts.find(c => c.emoji === '🔥');
      expect(fireCount?.userReacted).toBe(true);

      const heartCount = counts.find(c => c.emoji === '❤️');
      expect(heartCount?.userReacted).toBe(false);
    });
  });

  describe('subscribeToReactions', () => {
    const { subscribeToReactions } = require('../../src/lib/reactions');

    test('debe configurar suscripción de Supabase', () => {
      const subscribeMock = jest.fn();
      const onMock = jest.fn(() => ({ subscribe: subscribeMock }));
      
      mockSupabase.channel.mockReturnValue({ on: onMock });
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({ data: [], error: null }),
        })),
      });

      const callback = jest.fn();
      subscribeToReactions('session-1', callback);

      expect(mockSupabase.channel).toHaveBeenCalledWith('reactions:session-1');
      expect(onMock).toHaveBeenCalledWith(
        'postgres_changes',
        expect.objectContaining({
          event: '*',
          schema: 'public',
          table: 'ws_reactions',
        }),
        expect.any(Function)
      );
      expect(subscribeMock).toHaveBeenCalled();
    });

    test('debe retornar función de cleanup', () => {
      const subscribeMock = jest.fn();
      const onMock = jest.fn(() => ({ subscribe: subscribeMock }));
      const channelRef = { on: onMock };
      
      mockSupabase.channel.mockReturnValue(channelRef);
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({ data: [], error: null }),
        })),
      });

      const cleanup = subscribeToReactions('session-1', jest.fn());
      
      expect(typeof cleanup).toBe('function');
      
      cleanup();
      expect(mockSupabase.removeChannel).toHaveBeenCalledWith(channelRef);
    });
  });
});

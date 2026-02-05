/**
 * WhatsSound — Admin Actions Tests
 */

// Mock Supabase
const mockSupabase = {
  from: jest.fn(),
  auth: {
    admin: {
      deleteUser: jest.fn(),
    },
  },
};

jest.mock('../../src/lib/supabase', () => ({
  supabase: mockSupabase,
}));

describe('Admin Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── User Management ─────────────────────────────────────

  describe('User Management', () => {
    test('debe verificar si usuario es admin', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { role: 'admin' },
            }),
          })),
        })),
      });

      const isAdmin = await checkIsAdmin('user-123');
      expect(isAdmin).toBe(true);
    });

    test('debe retornar false si no es admin', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { role: 'user' },
            }),
          })),
        })),
      });

      const isAdmin = await checkIsAdmin('user-456');
      expect(isAdmin).toBe(false);
    });

    test('debe poder banear usuario', async () => {
      const updateMock = jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }));

      mockSupabase.from.mockReturnValue({
        update: updateMock,
      });

      const result = await banUser('user-to-ban', 'Spam');

      expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({
        is_banned: true,
        ban_reason: 'Spam',
      }));
      expect(result.success).toBe(true);
    });

    test('debe poder desbanear usuario', async () => {
      const updateMock = jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }));

      mockSupabase.from.mockReturnValue({
        update: updateMock,
      });

      const result = await unbanUser('user-to-unban');

      expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({
        is_banned: false,
        ban_reason: null,
      }));
      expect(result.success).toBe(true);
    });
  });

  // ─── Session Management ──────────────────────────────────

  describe('Session Management', () => {
    test('debe poder cerrar sesión activa', async () => {
      const updateMock = jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }));

      mockSupabase.from.mockReturnValue({
        update: updateMock,
      });

      const result = await closeSession('session-123');

      expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({
        is_active: false,
      }));
      expect(result.success).toBe(true);
    });

    test('debe poder eliminar sesión', async () => {
      const deleteMock = jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }));

      mockSupabase.from.mockReturnValue({
        delete: deleteMock,
      });

      const result = await deleteSession('session-to-delete');

      expect(deleteMock).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  // ─── Stats & Analytics ───────────────────────────────────

  describe('Stats & Analytics', () => {
    test('debe obtener estadísticas generales', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'ws_profiles') {
          return {
            select: jest.fn(() => ({
              not: jest.fn().mockResolvedValue({
                data: [{ id: '1' }, { id: '2' }, { id: '3' }],
              }),
            })),
          };
        }
        if (table === 'ws_sessions') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn().mockResolvedValue({
                data: [{ id: '1' }, { id: '2' }],
              }),
            })),
          };
        }
        if (table === 'ws_tips') {
          return {
            select: jest.fn().mockResolvedValue({
              data: [
                { amount: 500 },
                { amount: 1000 },
                { amount: 250 },
              ],
            }),
          };
        }
        return {};
      });

      const stats = await getAdminStats();

      expect(stats.totalUsers).toBe(3);
      expect(stats.activeSessions).toBe(2);
      expect(stats.totalTips).toBe(1750);
    });

    test('debe obtener usuarios más activos', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn().mockResolvedValue({
              data: [
                { id: '1', display_name: 'Top User', session_count: 50 },
                { id: '2', display_name: 'Second', session_count: 30 },
              ],
            }),
          })),
        })),
      });

      const topUsers = await getTopUsers(10);

      expect(topUsers).toHaveLength(2);
      expect(topUsers[0].session_count).toBe(50);
    });

    test('debe obtener sesiones más populares', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn().mockResolvedValue({
                data: [
                  { id: '1', name: 'House Party', listener_count: 150 },
                  { id: '2', name: 'Techno Night', listener_count: 100 },
                ],
              }),
            })),
          })),
        })),
      });

      const topSessions = await getTopSessions(5);

      expect(topSessions).toHaveLength(2);
      expect(topSessions[0].listener_count).toBe(150);
    });
  });

  // ─── Moderation ──────────────────────────────────────────

  describe('Moderation', () => {
    test('debe eliminar mensaje de chat', async () => {
      const deleteMock = jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }));

      mockSupabase.from.mockReturnValue({
        delete: deleteMock,
      });

      const result = await deleteMessage('msg-123');

      expect(deleteMock).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    test('debe eliminar canción de cola', async () => {
      const deleteMock = jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }));

      mockSupabase.from.mockReturnValue({
        delete: deleteMock,
      });

      const result = await deleteSong('song-456');

      expect(deleteMock).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    test('debe poder silenciar usuario en sesión', async () => {
      const insertMock = jest.fn().mockResolvedValue({ error: null });

      mockSupabase.from.mockReturnValue({
        insert: insertMock,
      });

      const result = await muteUserInSession('user-1', 'session-1', 30);

      expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 'user-1',
        session_id: 'session-1',
        duration_minutes: 30,
      }));
      expect(result.success).toBe(true);
    });
  });

  // ─── Data Export ─────────────────────────────────────────

  describe('Data Export', () => {
    test('debe exportar datos de usuario', async () => {
      mockSupabase.from.mockImplementation((table) => {
        const mockData = {
          ws_profiles: [{ id: 'user-1', display_name: 'Test User' }],
          ws_sessions: [{ id: 'session-1', name: 'My Session' }],
          ws_tips: [{ id: 'tip-1', amount: 500 }],
        };

        return {
          select: jest.fn(() => ({
            eq: jest.fn().mockResolvedValue({
              data: mockData[table] || [],
            }),
          })),
        };
      });

      const exportData = await exportUserData('user-1');

      expect(exportData.profile).toBeDefined();
      expect(exportData.sessions).toBeDefined();
      expect(exportData.tips).toBeDefined();
    });

    test('debe exportar estadísticas de sesión', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({
            data: {
              id: 'session-1',
              name: 'Export Test',
              members: [{ id: '1' }, { id: '2' }],
              songs: [{ id: '1', votes: 10 }],
              tips: [{ amount: 500 }],
            },
          }),
        })),
      });

      const sessionStats = await exportSessionStats('session-1');

      expect(sessionStats.memberCount).toBe(2);
      expect(sessionStats.songCount).toBe(1);
      expect(sessionStats.totalVotes).toBe(10);
      expect(sessionStats.totalTips).toBe(500);
    });
  });
});

// Helper functions for tests (simulated implementations)
async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data } = await mockSupabase.from('ws_profiles').select('role').eq('id', userId).single();
  return data?.role === 'admin';
}

async function banUser(userId: string, reason: string): Promise<{ success: boolean }> {
  const { error } = await mockSupabase.from('ws_profiles').update({ is_banned: true, ban_reason: reason }).eq('id', userId);
  return { success: !error };
}

async function unbanUser(userId: string): Promise<{ success: boolean }> {
  const { error } = await mockSupabase.from('ws_profiles').update({ is_banned: false, ban_reason: null }).eq('id', userId);
  return { success: !error };
}

async function closeSession(sessionId: string): Promise<{ success: boolean }> {
  const { error } = await mockSupabase.from('ws_sessions').update({ is_active: false }).eq('id', sessionId);
  return { success: !error };
}

async function deleteSession(sessionId: string): Promise<{ success: boolean }> {
  const { error } = await mockSupabase.from('ws_sessions').delete().eq('id', sessionId);
  return { success: !error };
}

async function getAdminStats() {
  const { data: users } = await mockSupabase.from('ws_profiles').select('id').not('id', 'is', null);
  const { data: sessions } = await mockSupabase.from('ws_sessions').select('id').eq('is_active', true);
  const { data: tips } = await mockSupabase.from('ws_tips').select('amount');
  
  return {
    totalUsers: users?.length || 0,
    activeSessions: sessions?.length || 0,
    totalTips: tips?.reduce((sum, t) => sum + t.amount, 0) || 0,
  };
}

async function getTopUsers(limit: number) {
  const { data } = await mockSupabase.from('ws_profiles').select('*').order('session_count', { ascending: false }).limit(limit);
  return data || [];
}

async function getTopSessions(limit: number) {
  const { data } = await mockSupabase.from('ws_sessions').select('*').eq('is_active', true).order('listener_count', { ascending: false }).limit(limit);
  return data || [];
}

async function deleteMessage(messageId: string): Promise<{ success: boolean }> {
  const { error } = await mockSupabase.from('ws_messages').delete().eq('id', messageId);
  return { success: !error };
}

async function deleteSong(songId: string): Promise<{ success: boolean }> {
  const { error } = await mockSupabase.from('ws_songs').delete().eq('id', songId);
  return { success: !error };
}

async function muteUserInSession(userId: string, sessionId: string, minutes: number): Promise<{ success: boolean }> {
  const { error } = await mockSupabase.from('ws_mutes').insert({
    user_id: userId,
    session_id: sessionId,
    duration_minutes: minutes,
  });
  return { success: !error };
}

async function exportUserData(userId: string) {
  const { data: profile } = await mockSupabase.from('ws_profiles').select('*').eq('id', userId);
  const { data: sessions } = await mockSupabase.from('ws_sessions').select('*').eq('dj_id', userId);
  const { data: tips } = await mockSupabase.from('ws_tips').select('*').eq('from_user_id', userId);
  
  return { profile: profile?.[0], sessions, tips };
}

async function exportSessionStats(sessionId: string) {
  const { data } = await mockSupabase.from('ws_sessions').select('*, members(*), songs(*), tips(*)').eq('id', sessionId);
  
  return {
    memberCount: data?.members?.length || 0,
    songCount: data?.songs?.length || 0,
    totalVotes: data?.songs?.reduce((sum, s) => sum + (s.votes || 0), 0) || 0,
    totalTips: data?.tips?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
  };
}

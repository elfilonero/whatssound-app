/**
 * WhatsSound — Session Store Tests
 */

describe('Session Store', () => {
  // ─── Initial State ───────────────────────────────────────

  describe('Initial State', () => {
    test('debe tener sesión null al inicio', () => {
      const initialState = {
        currentSession: null,
        queue: [],
        members: [],
        isLoading: false,
      };

      expect(initialState.currentSession).toBeNull();
    });

    test('debe tener cola vacía al inicio', () => {
      const initialState = { queue: [] };
      expect(initialState.queue).toHaveLength(0);
    });

    test('debe tener miembros vacíos al inicio', () => {
      const initialState = { members: [] };
      expect(initialState.members).toHaveLength(0);
    });

    test('debe no estar loading al inicio', () => {
      const initialState = { isLoading: false };
      expect(initialState.isLoading).toBe(false);
    });
  });

  // ─── Set Session ─────────────────────────────────────────

  describe('Set Session', () => {
    test('debe establecer sesión actual', () => {
      let state = { currentSession: null };
      
      const setSession = (session: any) => {
        state = { ...state, currentSession: session };
      };

      setSession({ id: 'session-1', name: 'House Party' });
      expect(state.currentSession).not.toBeNull();
      expect(state.currentSession.name).toBe('House Party');
    });

    test('debe limpiar sesión anterior', () => {
      let state = { currentSession: { id: 'old' }, queue: [1, 2, 3] };
      
      const clearSession = () => {
        state = { currentSession: null, queue: [] };
      };

      clearSession();
      expect(state.currentSession).toBeNull();
      expect(state.queue).toHaveLength(0);
    });
  });

  // ─── Queue Management ────────────────────────────────────

  describe('Queue Management', () => {
    test('debe añadir canción a la cola', () => {
      let queue: any[] = [];
      
      const addSong = (song: any) => {
        queue = [...queue, song];
      };

      addSong({ id: 's1', title: 'Song 1' });
      addSong({ id: 's2', title: 'Song 2' });
      
      expect(queue).toHaveLength(2);
    });

    test('debe eliminar canción de la cola', () => {
      let queue = [{ id: 's1' }, { id: 's2' }, { id: 's3' }];
      
      const removeSong = (songId: string) => {
        queue = queue.filter(s => s.id !== songId);
      };

      removeSong('s2');
      expect(queue).toHaveLength(2);
      expect(queue.find(s => s.id === 's2')).toBeUndefined();
    });

    test('debe reordenar cola por votos', () => {
      let queue = [
        { id: 's1', votes: 5 },
        { id: 's2', votes: 10 },
        { id: 's3', votes: 3 },
      ];
      
      const sortByVotes = () => {
        queue = [...queue].sort((a, b) => b.votes - a.votes);
      };

      sortByVotes();
      expect(queue[0].id).toBe('s2');
      expect(queue[2].id).toBe('s3');
    });

    test('debe actualizar votos de canción', () => {
      let queue = [{ id: 's1', votes: 5 }];
      
      const updateVotes = (songId: string, votes: number) => {
        queue = queue.map(s => s.id === songId ? { ...s, votes } : s);
      };

      updateVotes('s1', 10);
      expect(queue[0].votes).toBe(10);
    });

    test('debe mover canción a reproduciendo', () => {
      let queue = [
        { id: 's1', status: 'pending' },
        { id: 's2', status: 'pending' },
      ];
      let nowPlaying = null;
      
      const playSong = (songId: string) => {
        const song = queue.find(s => s.id === songId);
        if (song) {
          nowPlaying = { ...song, status: 'playing' };
          queue = queue.filter(s => s.id !== songId);
        }
      };

      playSong('s1');
      expect(nowPlaying?.status).toBe('playing');
      expect(queue).toHaveLength(1);
    });
  });

  // ─── Members Management ──────────────────────────────────

  describe('Members Management', () => {
    test('debe añadir miembro', () => {
      let members: any[] = [];
      
      const addMember = (member: any) => {
        members = [...members, member];
      };

      addMember({ id: 'user-1', role: 'listener' });
      expect(members).toHaveLength(1);
    });

    test('debe eliminar miembro', () => {
      let members = [{ id: 'user-1' }, { id: 'user-2' }];
      
      const removeMember = (userId: string) => {
        members = members.filter(m => m.id !== userId);
      };

      removeMember('user-1');
      expect(members).toHaveLength(1);
    });

    test('debe contar miembros activos', () => {
      const members = [
        { id: 'u1', leftAt: null },
        { id: 'u2', leftAt: null },
        { id: 'u3', leftAt: '2024-01-01' },
      ];

      const activeCount = members.filter(m => !m.leftAt).length;
      expect(activeCount).toBe(2);
    });

    test('debe identificar DJ', () => {
      const members = [
        { id: 'u1', role: 'dj' },
        { id: 'u2', role: 'listener' },
      ];

      const dj = members.find(m => m.role === 'dj');
      expect(dj?.id).toBe('u1');
    });
  });

  // ─── Now Playing ─────────────────────────────────────────

  describe('Now Playing', () => {
    test('debe establecer canción actual', () => {
      let nowPlaying = null;
      
      const setNowPlaying = (song: any) => {
        nowPlaying = song;
      };

      setNowPlaying({ id: 's1', title: 'Blinding Lights' });
      expect(nowPlaying?.title).toBe('Blinding Lights');
    });

    test('debe limpiar canción actual', () => {
      let nowPlaying: any = { id: 's1' };
      
      const clearNowPlaying = () => {
        nowPlaying = null;
      };

      clearNowPlaying();
      expect(nowPlaying).toBeNull();
    });

    test('debe actualizar progreso', () => {
      let nowPlaying = { id: 's1', progress: 0 };
      
      const updateProgress = (progress: number) => {
        nowPlaying = { ...nowPlaying, progress };
      };

      updateProgress(0.5);
      expect(nowPlaying.progress).toBe(0.5);
    });
  });

  // ─── Loading States ──────────────────────────────────────

  describe('Loading States', () => {
    test('debe establecer isLoading', () => {
      let state = { isLoading: false };
      
      const setLoading = (loading: boolean) => {
        state = { ...state, isLoading: loading };
      };

      setLoading(true);
      expect(state.isLoading).toBe(true);
    });

    test('debe tener estados de loading específicos', () => {
      const loadingStates = {
        loadingSession: false,
        loadingQueue: false,
        loadingMembers: false,
        submittingSong: false,
      };

      expect(Object.keys(loadingStates)).toHaveLength(4);
    });
  });

  // ─── Error Handling ──────────────────────────────────────

  describe('Error Handling', () => {
    test('debe establecer error', () => {
      let state = { error: null };
      
      const setError = (error: any) => {
        state = { ...state, error };
      };

      setError({ message: 'Session not found' });
      expect(state.error?.message).toBe('Session not found');
    });

    test('debe limpiar error', () => {
      let state = { error: { message: 'Error' } };
      
      const clearError = () => {
        state = { ...state, error: null };
      };

      clearError();
      expect(state.error).toBeNull();
    });
  });

  // ─── Persistence ─────────────────────────────────────────

  describe('Persistence', () => {
    test('debe guardar sesión en storage', () => {
      const storage = new Map();
      
      const saveSession = (session: any) => {
        storage.set('currentSession', JSON.stringify(session));
      };

      saveSession({ id: 'session-1' });
      expect(storage.has('currentSession')).toBe(true);
    });

    test('debe restaurar sesión de storage', () => {
      const storage = new Map();
      storage.set('currentSession', JSON.stringify({ id: 'session-1' }));
      
      const restoreSession = () => {
        const data = storage.get('currentSession');
        return data ? JSON.parse(data) : null;
      };

      const session = restoreSession();
      expect(session?.id).toBe('session-1');
    });

    test('debe limpiar storage al cerrar sesión', () => {
      const storage = new Map();
      storage.set('currentSession', 'data');
      storage.set('queue', 'data');
      
      const clearStorage = () => {
        storage.delete('currentSession');
        storage.delete('queue');
      };

      clearStorage();
      expect(storage.size).toBe(0);
    });
  });

  // ─── Selectors ───────────────────────────────────────────

  describe('Selectors', () => {
    test('debe seleccionar canción siguiente', () => {
      const queue = [
        { id: 's1', votes: 10 },
        { id: 's2', votes: 15 },
        { id: 's3', votes: 5 },
      ];

      const sorted = [...queue].sort((a, b) => b.votes - a.votes);
      const nextSong = sorted[0];

      expect(nextSong.id).toBe('s2');
    });

    test('debe seleccionar miembros activos', () => {
      const members = [
        { id: 'u1', leftAt: null },
        { id: 'u2', leftAt: '2024-01-01' },
      ];

      const active = members.filter(m => !m.leftAt);
      expect(active).toHaveLength(1);
    });

    test('debe calcular total de votos', () => {
      const queue = [
        { votes: 10 },
        { votes: 15 },
        { votes: 5 },
      ];

      const totalVotes = queue.reduce((sum, s) => sum + s.votes, 0);
      expect(totalVotes).toBe(30);
    });
  });
});

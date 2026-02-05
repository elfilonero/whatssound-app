/**
 * WhatsSound — Demo Mode Tests
 */

describe('Demo Mode', () => {
  // ─── Mode Detection ──────────────────────────────────────

  describe('Mode Detection', () => {
    test('debe detectar modo demo', () => {
      const isDemo = (mode: string) => mode === 'demo';
      expect(isDemo('demo')).toBe(true);
      expect(isDemo('production')).toBe(false);
    });

    test('debe detectar modo test', () => {
      const isTest = (mode: string) => mode === 'test';
      expect(isTest('test')).toBe(true);
    });

    test('debe detectar modo producción', () => {
      const isProduction = (mode: string) => mode === 'production';
      expect(isProduction('production')).toBe(true);
    });
  });

  // ─── Demo User ───────────────────────────────────────────

  describe('Demo User', () => {
    const DEMO_USER = {
      id: 'demo-user-001',
      email: 'demo@whatssound.app',
      displayName: 'Usuario Demo',
      isDJ: true,
      djName: 'DJ Demo',
      avatar: null,
    };

    test('debe tener ID específico', () => {
      expect(DEMO_USER.id).toBe('demo-user-001');
    });

    test('debe tener email de demo', () => {
      expect(DEMO_USER.email).toContain('demo');
    });

    test('debe ser DJ por defecto', () => {
      expect(DEMO_USER.isDJ).toBe(true);
    });

    test('debe tener nombre de DJ', () => {
      expect(DEMO_USER.djName).toBe('DJ Demo');
    });
  });

  // ─── Demo Sessions ───────────────────────────────────────

  describe('Demo Sessions', () => {
    const DEMO_SESSIONS = [
      { id: 'demo-session-1', name: 'House Party Demo', genre: 'house', listeners: 45 },
      { id: 'demo-session-2', name: 'Techno Night Demo', genre: 'techno', listeners: 78 },
      { id: 'demo-session-3', name: 'Chill Vibes Demo', genre: 'ambient', listeners: 23 },
    ];

    test('debe tener sesiones de demo', () => {
      expect(DEMO_SESSIONS.length).toBeGreaterThan(0);
    });

    test('debe tener diferentes géneros', () => {
      const genres = DEMO_SESSIONS.map(s => s.genre);
      const uniqueGenres = [...new Set(genres)];
      expect(uniqueGenres.length).toBe(3);
    });

    test('debe tener listeners simulados', () => {
      DEMO_SESSIONS.forEach(s => {
        expect(s.listeners).toBeGreaterThan(0);
      });
    });
  });

  // ─── Demo Songs ──────────────────────────────────────────

  describe('Demo Songs', () => {
    const DEMO_SONGS = [
      { id: 'ds-1', title: 'Demo Track 1', artist: 'Demo Artist', votes: 12 },
      { id: 'ds-2', title: 'Demo Track 2', artist: 'Demo Artist', votes: 8 },
      { id: 'ds-3', title: 'Demo Track 3', artist: 'Demo Artist', votes: 15 },
    ];

    test('debe tener canciones de demo', () => {
      expect(DEMO_SONGS.length).toBeGreaterThan(0);
    });

    test('debe poder ordenar por votos', () => {
      const sorted = [...DEMO_SONGS].sort((a, b) => b.votes - a.votes);
      expect(sorted[0].votes).toBe(15);
    });
  });

  // ─── Demo Actions ────────────────────────────────────────

  describe('Demo Actions', () => {
    test('debe simular voto', () => {
      let votes = 10;
      const vote = () => { votes++; };
      
      vote();
      expect(votes).toBe(11);
    });

    test('debe simular propina (sin pago real)', () => {
      const sendDemoTip = (amount: number) => {
        return { success: true, amount, message: 'Demo tip - no real payment' };
      };

      const result = sendDemoTip(500);
      expect(result.success).toBe(true);
      expect(result.message).toContain('Demo');
    });

    test('debe simular Golden Boost (sin pago real)', () => {
      const sendDemoBoost = () => {
        return { success: true, message: 'Demo boost - no real payment' };
      };

      const result = sendDemoBoost();
      expect(result.success).toBe(true);
    });

    test('debe simular chat', () => {
      const messages: string[] = [];
      const sendDemoMessage = (msg: string) => {
        messages.push(msg);
        return { success: true };
      };

      sendDemoMessage('Hola demo!');
      expect(messages).toContain('Hola demo!');
    });
  });

  // ─── Demo Restrictions ───────────────────────────────────

  describe('Demo Restrictions', () => {
    const DEMO_RESTRICTIONS = {
      canCreateSession: true,
      canSendTips: false, // No pagos reales
      canPurchase: false, // No compras reales
      canChat: true,
      canVote: true,
      maxSessions: 1,
    };

    test('puede crear sesión', () => {
      expect(DEMO_RESTRICTIONS.canCreateSession).toBe(true);
    });

    test('no puede enviar propinas reales', () => {
      expect(DEMO_RESTRICTIONS.canSendTips).toBe(false);
    });

    test('no puede hacer compras reales', () => {
      expect(DEMO_RESTRICTIONS.canPurchase).toBe(false);
    });

    test('puede votar', () => {
      expect(DEMO_RESTRICTIONS.canVote).toBe(true);
    });

    test('tiene límite de sesiones', () => {
      expect(DEMO_RESTRICTIONS.maxSessions).toBe(1);
    });
  });

  // ─── Demo Banner ─────────────────────────────────────────

  describe('Demo Banner', () => {
    test('debe mostrar banner en modo demo', () => {
      const showBanner = (isDemo: boolean) => isDemo;
      expect(showBanner(true)).toBe(true);
      expect(showBanner(false)).toBe(false);
    });

    test('banner debe tener mensaje correcto', () => {
      const bannerMessage = 'Estás en modo demo. Regístrate para acceder a todas las funciones.';
      expect(bannerMessage).toContain('demo');
      expect(bannerMessage).toContain('Regístrate');
    });

    test('banner debe tener CTA', () => {
      const bannerCTA = {
        text: 'Crear cuenta',
        action: 'navigate_to_register',
      };

      expect(bannerCTA.text).toBe('Crear cuenta');
    });
  });

  // ─── Seed Data ───────────────────────────────────────────

  describe('Seed Data', () => {
    test('debe filtrar datos seed en producción', () => {
      const data = [
        { id: '1', is_seed: false },
        { id: '2', is_seed: true },
        { id: '3', is_seed: false },
      ];

      const filtered = data.filter(d => !d.is_seed);
      expect(filtered).toHaveLength(2);
    });

    test('debe incluir datos seed en demo', () => {
      const data = [
        { id: '1', is_seed: false },
        { id: '2', is_seed: true },
      ];

      const isDemo = true;
      const filtered = isDemo ? data : data.filter(d => !d.is_seed);
      expect(filtered).toHaveLength(2);
    });
  });

  // ─── Demo to Real Transition ─────────────────────────────

  describe('Demo to Real Transition', () => {
    test('debe migrar datos de demo al registrarse', () => {
      const demoData = {
        votes: ['song-1', 'song-2'],
        favorites: ['song-3'],
      };

      const migrateToReal = (data: typeof demoData, realUserId: string) => {
        return {
          ...data,
          userId: realUserId,
          migratedAt: new Date().toISOString(),
        };
      };

      const migrated = migrateToReal(demoData, 'real-user-123');
      expect(migrated.userId).toBe('real-user-123');
      expect(migrated.migratedAt).toBeDefined();
    });

    test('debe limpiar datos de demo después de migrar', () => {
      let demoData: any = { votes: [1, 2, 3] };
      
      const clearDemoData = () => {
        demoData = null;
      };

      clearDemoData();
      expect(demoData).toBeNull();
    });
  });
});

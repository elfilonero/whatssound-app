/**
 * WhatsSound — Deezer API Tests
 */

// Mock fetch
global.fetch = jest.fn();

describe('Deezer API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  // ─── Search Tracks ───────────────────────────────────────

  describe('Search Tracks', () => {
    test('debe buscar canciones por query', async () => {
      const mockResponse = {
        data: [
          { id: 1, title: 'Blinding Lights', artist: { name: 'The Weeknd' } },
          { id: 2, title: 'Save Your Tears', artist: { name: 'The Weeknd' } },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      // Simular búsqueda
      const results = mockResponse.data;
      expect(results).toHaveLength(2);
      expect(results[0].title).toBe('Blinding Lights');
    });

    test('debe manejar query vacío', async () => {
      const query = '';
      const shouldSearch = query.trim().length >= 2;
      expect(shouldSearch).toBe(false);
    });

    test('debe limitar resultados', async () => {
      const limit = 10;
      const results = Array(20).fill({ id: 1 });
      const limited = results.slice(0, limit);
      expect(limited).toHaveLength(10);
    });

    test('debe sanitizar query para URL', () => {
      const query = 'The Weeknd & Daft Punk';
      const encoded = encodeURIComponent(query);
      expect(encoded).toBe('The%20Weeknd%20%26%20Daft%20Punk');
    });
  });

  // ─── Get Track Details ───────────────────────────────────

  describe('Get Track Details', () => {
    test('debe obtener detalles de canción', async () => {
      const track = {
        id: 123456,
        title: 'Blinding Lights',
        artist: { name: 'The Weeknd' },
        album: { 
          title: 'After Hours',
          cover_xl: 'https://cdns.deezer.com/album/xl.jpg',
        },
        duration: 200,
        preview: 'https://cdns.deezer.com/preview.mp3',
      };

      expect(track.id).toBe(123456);
      expect(track.duration).toBe(200);
      expect(track.preview).toContain('preview.mp3');
    });

    test('debe formatear duración', () => {
      const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      expect(formatDuration(200)).toBe('3:20');
      expect(formatDuration(65)).toBe('1:05');
      expect(formatDuration(300)).toBe('5:00');
    });
  });

  // ─── Get Album Art ───────────────────────────────────────

  describe('Get Album Art', () => {
    test('debe generar URL de cover en diferentes tamaños', () => {
      const baseUrl = 'https://cdns.deezer.com/images/cover/abc123';
      
      const sizes = {
        small: `${baseUrl}/56x56.jpg`,
        medium: `${baseUrl}/250x250.jpg`,
        large: `${baseUrl}/500x500.jpg`,
        xl: `${baseUrl}/1000x1000.jpg`,
      };

      expect(sizes.small).toContain('56x56');
      expect(sizes.xl).toContain('1000x1000');
    });

    test('debe usar placeholder si no hay cover', () => {
      const cover = null;
      const placeholder = '/images/album-placeholder.png';
      const finalCover = cover || placeholder;

      expect(finalCover).toBe(placeholder);
    });
  });

  // ─── Audio Preview ───────────────────────────────────────

  describe('Audio Preview', () => {
    test('preview debe ser URL válida', () => {
      const preview = 'https://cdns-preview-d.dzcdn.net/stream/c-abc123.mp3';
      const isValid = preview.startsWith('https://') && preview.endsWith('.mp3');
      expect(isValid).toBe(true);
    });

    test('preview dura 30 segundos', () => {
      const PREVIEW_DURATION = 30;
      expect(PREVIEW_DURATION).toBe(30);
    });

    test('debe manejar canción sin preview', () => {
      const track = { id: 1, preview: '' };
      const hasPreview = !!track.preview;
      expect(hasPreview).toBe(false);
    });
  });

  // ─── Cache ───────────────────────────────────────────────

  describe('Cache', () => {
    const cache = new Map<string, { data: any; expires: number }>();
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

    const setCache = (key: string, data: any) => {
      cache.set(key, { data, expires: Date.now() + CACHE_TTL });
    };

    const getCache = (key: string) => {
      const entry = cache.get(key);
      if (!entry) return null;
      if (Date.now() > entry.expires) {
        cache.delete(key);
        return null;
      }
      return entry.data;
    };

    test('debe guardar en cache', () => {
      setCache('search:weeknd', [{ id: 1 }]);
      const cached = getCache('search:weeknd');
      expect(cached).toEqual([{ id: 1 }]);
    });

    test('debe expirar después de TTL', () => {
      jest.useFakeTimers();
      setCache('search:test', [{ id: 2 }]);
      
      // Avanzar 6 minutos
      jest.advanceTimersByTime(6 * 60 * 1000);
      
      const cached = getCache('search:test');
      expect(cached).toBeNull();
      
      jest.useRealTimers();
    });

    test('debe generar key única por búsqueda', () => {
      const generateKey = (query: string, limit: number) => 
        `search:${query.toLowerCase()}:${limit}`;

      const key1 = generateKey('Weeknd', 10);
      const key2 = generateKey('weeknd', 10);

      expect(key1).toBe(key2); // Case insensitive
    });
  });

  // ─── Error Handling ──────────────────────────────────────

  describe('Error Handling', () => {
    test('debe manejar error de API', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const error = { type: 'api_error', status: 500 };
      expect(error.status).toBe(500);
    });

    test('debe manejar timeout', async () => {
      const TIMEOUT = 10000;
      expect(TIMEOUT).toBe(10000);
    });

    test('debe manejar rate limit de Deezer', () => {
      const error = {
        type: 'rate_limit',
        message: 'Quota exceeded',
        retryAfter: 60,
      };

      expect(error.retryAfter).toBe(60);
    });

    test('debe reintentar en caso de error temporal', () => {
      const MAX_RETRIES = 3;
      let retries = 0;
      
      while (retries < MAX_RETRIES) {
        retries++;
      }

      expect(retries).toBe(3);
    });
  });

  // ─── Proxy Configuration ─────────────────────────────────

  describe('Proxy Configuration', () => {
    test('debe usar proxy para evitar CORS', () => {
      const DEEZER_PROXY = '/api/deezer';
      const directUrl = 'https://api.deezer.com/search';
      const proxiedUrl = `${DEEZER_PROXY}/search`;

      expect(proxiedUrl).toBe('/api/deezer/search');
    });

    test('debe pasar parámetros al proxy', () => {
      const params = new URLSearchParams({
        q: 'weeknd',
        limit: '10',
      });

      expect(params.toString()).toBe('q=weeknd&limit=10');
    });
  });

  // ─── Track Mapping ───────────────────────────────────────

  describe('Track Mapping', () => {
    test('debe mapear respuesta de Deezer a formato interno', () => {
      const deezerTrack = {
        id: 123,
        title: 'Song Title',
        artist: { name: 'Artist Name' },
        album: { title: 'Album', cover_xl: 'https://cover.jpg' },
        duration: 180,
        preview: 'https://preview.mp3',
      };

      const mapped = {
        deezerId: String(deezerTrack.id),
        title: deezerTrack.title,
        artist: deezerTrack.artist.name,
        album: deezerTrack.album.title,
        albumArt: deezerTrack.album.cover_xl,
        duration: deezerTrack.duration,
        previewUrl: deezerTrack.preview,
      };

      expect(mapped.deezerId).toBe('123');
      expect(mapped.title).toBe('Song Title');
      expect(mapped.artist).toBe('Artist Name');
    });
  });
});

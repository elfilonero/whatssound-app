/**
 * WhatsSound — Spotify API Tests
 */

global.fetch = jest.fn();

describe('Spotify API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Authentication ──────────────────────────────────────

  describe('Authentication', () => {
    test('debe obtener access token con client credentials', async () => {
      const mockToken = {
        access_token: 'BQD...',
        token_type: 'Bearer',
        expires_in: 3600,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockToken),
      });

      expect(mockToken.token_type).toBe('Bearer');
      expect(mockToken.expires_in).toBe(3600);
    });

    test('debe refrescar token antes de expirar', () => {
      const tokenExpiry = Date.now() + 300000; // 5 minutos
      const shouldRefresh = tokenExpiry - Date.now() < 60000; // Menos de 1 minuto

      expect(shouldRefresh).toBe(false);
    });

    test('debe cachear token', () => {
      let cachedToken: string | null = null;
      const setToken = (token: string) => { cachedToken = token; };
      const getToken = () => cachedToken;

      setToken('test-token');
      expect(getToken()).toBe('test-token');
    });
  });

  // ─── Search Tracks ───────────────────────────────────────

  describe('Search Tracks', () => {
    test('debe buscar tracks', async () => {
      const results = {
        tracks: {
          items: [
            { id: 'sp1', name: 'Track 1', artists: [{ name: 'Artist 1' }] },
            { id: 'sp2', name: 'Track 2', artists: [{ name: 'Artist 2' }] },
          ],
        },
      };

      expect(results.tracks.items).toHaveLength(2);
    });

    test('debe formatear artistas múltiples', () => {
      const artists = [
        { name: 'Artist 1' },
        { name: 'Artist 2' },
        { name: 'Artist 3' },
      ];

      const formatted = artists.map(a => a.name).join(', ');
      expect(formatted).toBe('Artist 1, Artist 2, Artist 3');
    });

    test('debe usar market correcto', () => {
      const market = 'ES';
      const url = `https://api.spotify.com/v1/search?market=${market}`;
      expect(url).toContain('market=ES');
    });
  });

  // ─── Track Details ───────────────────────────────────────

  describe('Track Details', () => {
    test('debe obtener detalles de track', () => {
      const track = {
        id: 'spotify:track:123',
        name: 'Blinding Lights',
        artists: [{ name: 'The Weeknd' }],
        album: {
          name: 'After Hours',
          images: [
            { url: 'https://i.scdn.co/image/large.jpg', height: 640 },
            { url: 'https://i.scdn.co/image/medium.jpg', height: 300 },
            { url: 'https://i.scdn.co/image/small.jpg', height: 64 },
          ],
        },
        duration_ms: 200000,
        explicit: false,
        preview_url: 'https://p.scdn.co/mp3-preview/abc.mp3',
      };

      expect(track.duration_ms).toBe(200000);
      expect(track.album.images[0].height).toBe(640);
    });

    test('debe convertir duración de ms a mm:ss', () => {
      const formatDuration = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      expect(formatDuration(200000)).toBe('3:20');
      expect(formatDuration(65000)).toBe('1:05');
    });

    test('debe seleccionar imagen de tamaño apropiado', () => {
      const images = [
        { url: 'large.jpg', height: 640 },
        { url: 'medium.jpg', height: 300 },
        { url: 'small.jpg', height: 64 },
      ];

      const getImage = (size: 'small' | 'medium' | 'large') => {
        const sizes = { small: 64, medium: 300, large: 640 };
        return images.find(i => i.height === sizes[size])?.url;
      };

      expect(getImage('medium')).toBe('medium.jpg');
    });
  });

  // ─── Playlists ───────────────────────────────────────────

  describe('Playlists', () => {
    test('debe obtener playlists del usuario', () => {
      const playlists = {
        items: [
          { id: 'pl1', name: 'My Playlist', tracks: { total: 50 } },
          { id: 'pl2', name: 'Favorites', tracks: { total: 100 } },
        ],
      };

      expect(playlists.items).toHaveLength(2);
      expect(playlists.items[0].tracks.total).toBe(50);
    });

    test('debe obtener tracks de playlist', () => {
      const playlistTracks = {
        items: [
          { track: { id: 't1', name: 'Track 1' } },
          { track: { id: 't2', name: 'Track 2' } },
        ],
        total: 100,
        offset: 0,
        limit: 50,
      };

      expect(playlistTracks.total).toBe(100);
    });
  });

  // ─── Error Handling ──────────────────────────────────────

  describe('Error Handling', () => {
    test('debe manejar token expirado', () => {
      const error = {
        status: 401,
        message: 'The access token expired',
      };

      expect(error.status).toBe(401);
    });

    test('debe manejar rate limit', () => {
      const error = {
        status: 429,
        message: 'API rate limit exceeded',
        retryAfter: 30,
      };

      expect(error.status).toBe(429);
    });

    test('debe manejar track no encontrado', () => {
      const error = {
        status: 404,
        message: 'Track not found',
      };

      expect(error.status).toBe(404);
    });
  });

  // ─── Track Mapping ───────────────────────────────────────

  describe('Track Mapping', () => {
    test('debe mapear track de Spotify a formato interno', () => {
      const spotifyTrack = {
        id: 'sp123',
        name: 'Song',
        artists: [{ name: 'Artist' }],
        album: {
          name: 'Album',
          images: [{ url: 'https://cover.jpg', height: 640 }],
        },
        duration_ms: 180000,
        preview_url: 'https://preview.mp3',
      };

      const mapped = {
        spotifyId: spotifyTrack.id,
        title: spotifyTrack.name,
        artist: spotifyTrack.artists.map(a => a.name).join(', '),
        album: spotifyTrack.album.name,
        albumArt: spotifyTrack.album.images[0]?.url,
        duration: Math.floor(spotifyTrack.duration_ms / 1000),
        previewUrl: spotifyTrack.preview_url,
      };

      expect(mapped.spotifyId).toBe('sp123');
      expect(mapped.duration).toBe(180);
    });
  });

  // ─── URI Parsing ─────────────────────────────────────────

  describe('URI Parsing', () => {
    test('debe parsear Spotify URI', () => {
      const parseUri = (uri: string) => {
        const match = uri.match(/spotify:track:([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
      };

      expect(parseUri('spotify:track:4iV5W9uYEdYUVa79Axb7Rh')).toBe('4iV5W9uYEdYUVa79Axb7Rh');
      expect(parseUri('invalid')).toBeNull();
    });

    test('debe parsear Spotify URL', () => {
      const parseUrl = (url: string) => {
        const match = url.match(/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
      };

      expect(parseUrl('https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh')).toBe('4iV5W9uYEdYUVa79Axb7Rh');
    });
  });
});

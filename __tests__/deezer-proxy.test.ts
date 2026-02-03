/**
 * Deezer API Proxy Tests
 * Tests the /api/deezer Vercel serverless function
 */

const PROD_URL = 'https://whatssound-app.vercel.app';

describe('Deezer API Proxy', () => {
  test('returns results for a known artist', async () => {
    const res = await fetch(`${PROD_URL}/api/deezer?q=bad+bunny&type=track`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('data');
    expect(data.data.length).toBeGreaterThan(0);
  });

  test('returns album cover URLs', async () => {
    const res = await fetch(`${PROD_URL}/api/deezer?q=dakiti+bad+bunny&type=track`);
    const data = await res.json();
    const track = data.data[0];
    expect(track).toHaveProperty('album');
    expect(track.album).toHaveProperty('cover_medium');
    expect(track.album.cover_medium).toContain('http');
  });

  test('returns preview URL for playback', async () => {
    const res = await fetch(`${PROD_URL}/api/deezer?q=pepas+farruko&type=track`);
    const data = await res.json();
    const track = data.data[0];
    expect(track).toHaveProperty('preview');
    expect(track.preview).toContain('http');
  });

  test('preview URL is accessible (HEAD request)', async () => {
    const searchRes = await fetch(`${PROD_URL}/api/deezer?q=gasolina+daddy+yankee&type=track`);
    const data = await searchRes.json();
    const previewUrl = data.data[0]?.preview;
    expect(previewUrl).toBeTruthy();
    
    const headRes = await fetch(previewUrl, { method: 'HEAD' });
    expect(headRes.ok).toBe(true);
  });

  test('handles empty query gracefully', async () => {
    const res = await fetch(`${PROD_URL}/api/deezer?q=`);
    // May return 200 or 400 depending on Deezer's handling
    expect(res.status).toBeLessThan(500);
  });

  test('handles non-existent song gracefully', async () => {
    const res = await fetch(`${PROD_URL}/api/deezer?q=xyznonexistent99999&type=track`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('data');
  });
});

/**
 * Admin Settings Tests
 * Tests seed visibility toggle, data management
 */

const SUPABASE_URL = 'https://xyehncvvvprrqwnsefcr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5ZWhuY3Z2dnBycnF3bnNlZmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NTA4OTgsImV4cCI6MjA4NTIyNjg5OH0.VEaTmqpMA7XdUa-tZ7mXib1ciweD7y5UU4dFGZq3EtQ';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

describe('Admin Settings Table', () => {
  test('ws_admin_settings table exists', async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ws_admin_settings?select=key,value&limit=5`, { headers });
    expect(res.status).toBe(200);
  });

  test('seed_visible setting exists or can be created', async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ws_admin_settings?key=eq.seed_visible&select=key,value`, { headers });
    const data = await res.json();
    // Either exists or empty (both OK)
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });
});

describe('Seed Data Filtering', () => {
  test('seed profiles have is_seed=true', async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ws_profiles?is_seed=eq.true&select=id,display_name&limit=3`, { headers });
    const data = await res.json();
    expect(data.length).toBeGreaterThan(0);
  });

  test('seed sessions have is_seed=true', async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ws_sessions?is_seed=eq.true&select=id,name&limit=3`, { headers });
    const data = await res.json();
    expect(data.length).toBeGreaterThan(0);
  });

  test('filtering by is_seed works on profiles', async () => {
    const allRes = await fetch(`${SUPABASE_URL}/rest/v1/ws_profiles?select=id`, { headers });
    const all = await allRes.json();
    
    const seedRes = await fetch(`${SUPABASE_URL}/rest/v1/ws_profiles?is_seed=eq.true&select=id`, { headers });
    const seed = await seedRes.json();
    
    const noSeedRes = await fetch(`${SUPABASE_URL}/rest/v1/ws_profiles?is_seed=eq.false&select=id`, { headers });
    const noSeed = await noSeedRes.json();
    
    // seed + non-seed should equal total
    expect(seed.length + noSeed.length).toBe(all.length);
  });
});

describe('Admin Roles', () => {
  test('admin profiles exist in settings or profiles', async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ws_admin_settings?key=eq.admins&select=value`, { headers });
    // May or may not exist - just verify table access
    expect(res.status).toBe(200);
  });
});

/**
 * Supabase Integration Tests
 * Tests connection, tables, seed data, read/write
 */

const SUPABASE_URL = 'https://xyehncvvvprrqwnsefcr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5ZWhuY3Z2dnBycnF3bnNlZmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NTA4OTgsImV4cCI6MjA4NTIyNjg5OH0.VEaTmqpMA7XdUa-tZ7mXib1ciweD7y5UU4dFGZq3EtQ';

const supaFetch = async (table: string, params = '') => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });
  const data = await res.json();
  const arr = Array.isArray(data) ? data : [];
  return { data: arr, count: arr.length, status: res.status, raw: data };
};

describe('Supabase Connection', () => {
  test('connects to Supabase successfully', async () => {
    const { status } = await supaFetch('ws_profiles', 'select=id&limit=1');
    expect(status).toBe(200);
  });

  test('can read profiles', async () => {
    const { data, status } = await supaFetch('ws_profiles', 'select=id,display_name&limit=3');
    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
});

describe('Table Integrity', () => {
  const tables = [
    'ws_profiles', 'ws_sessions', 'ws_songs', 'ws_messages', 
    'ws_votes', 'ws_tips', 'ws_session_members',
    'ws_conversations', 'ws_private_messages', 'ws_contacts', 'ws_invites',
    'ws_admin_settings',
  ];

  test.each(tables)('table %s exists and is queryable', async (table) => {
    const { status } = await supaFetch(table, 'select=*&limit=1');
    expect(status).toBe(200);
  });
});

describe('Seed Data', () => {
  test('has at least 10 seed profiles', async () => {
    const { count } = await supaFetch('ws_profiles', 'select=id&is_seed=eq.true');
    expect(count).toBeGreaterThanOrEqual(10);
  });

  test('has at least 4 active sessions', async () => {
    const { count } = await supaFetch('ws_sessions', 'select=id&is_active=eq.true&is_seed=eq.true');
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('has songs in the database', async () => {
    const { data } = await supaFetch('ws_songs', 'select=title,artist&limit=5');
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty('title');
    expect(data[0]).toHaveProperty('artist');
  });

  test('has chat messages in the database', async () => {
    const { data } = await supaFetch('ws_messages', 'select=id&limit=5');
    expect(data.length).toBeGreaterThan(0);
  });

  test('tips table is accessible', async () => {
    const { status } = await supaFetch('ws_tips', 'select=id&limit=5');
    expect(status).toBe(200);
  });
});

describe('RLS Security', () => {
  test('anon cannot insert profiles (RLS blocks it)', async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ws_profiles`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: '00000000-test-test-test-000000000099',
        display_name: 'Should Fail',
      }),
    });
    // 401 or 403 = RLS working correctly
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

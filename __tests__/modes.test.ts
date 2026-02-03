/**
 * App Mode Tests
 * Tests demo mode, test mode, and admin access
 */

const PROD_URL = 'https://whatssound-app.vercel.app';

describe('Demo Mode', () => {
  test('app loads with ?demo=true', async () => {
    const res = await fetch(`${PROD_URL}/?demo=true`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('root');
  });

  test('app loads with ?test=angel', async () => {
    const res = await fetch(`${PROD_URL}/?test=angel`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('root');
  });

  test('app loads without params', async () => {
    const res = await fetch(PROD_URL);
    expect(res.status).toBe(200);
  });
});

describe('Admin Access', () => {
  test('admin dashboard loads with ?admin=kike', async () => {
    const res = await fetch(`${PROD_URL}/admin?admin=kike`);
    expect(res.status).toBe(200);
  });

  test('admin dashboard loads with ?admin=angel', async () => {
    const res = await fetch(`${PROD_URL}/admin?admin=angel`);
    expect(res.status).toBe(200);
  });

  test('admin dashboard loads with ?admin=leo', async () => {
    const res = await fetch(`${PROD_URL}/admin?admin=leo`);
    expect(res.status).toBe(200);
  });

  test('admin health page loads', async () => {
    const res = await fetch(`${PROD_URL}/admin/health?admin=leo`);
    expect(res.status).toBe(200);
  });

  test('admin config page loads', async () => {
    const res = await fetch(`${PROD_URL}/admin/config?admin=kike`);
    expect(res.status).toBe(200);
  });
});

describe('Routes Accessibility', () => {
  const routes = [
    '/',
    '/live',
    '/chats',
    '/groups',
    '/discover',
  ];

  test.each(routes)('route %s returns 200', async (route) => {
    const res = await fetch(`${PROD_URL}${route}`);
    expect(res.status).toBe(200);
  });
});

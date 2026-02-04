// Run SQL via Supabase - multiple connection methods
module.exports = async (req, res) => {
  if (req.method !== 'POST' || req.query.key !== 'ws2026setup') {
    return res.status(403).json({ error: 'forbidden' });
  }
  const sql = req.body?.sql;
  if (!sql) return res.status(400).json({ error: 'no sql' });

  const errors = [];

  // Method 1: Direct connection
  try {
    const { Client } = require('pg');
    const c = new Client({
      host: 'db.xyehncvvvprrqwnsefcr.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'Vertex2026WS!',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
    });
    await c.connect();
    const r = await c.query(sql);
    await c.end();
    return res.json({ ok: true, rows: r.rows || [], rowCount: r.rowCount, method: 'pg-direct' });
  } catch (e1) {
    errors.push({ method: 'direct', error: e1.message });
  }

  // Method 2: Session pooler (port 5432)
  try {
    const { Client } = require('pg');
    const c = new Client({
      connectionString: 'postgresql://postgres.xyehncvvvprrqwnsefcr:Vertex2026WS!@aws-0-eu-west-1.pooler.supabase.com:5432/postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
    });
    await c.connect();
    const r = await c.query(sql);
    await c.end();
    return res.json({ ok: true, rows: r.rows || [], rowCount: r.rowCount, method: 'session-pooler' });
  } catch (e2) {
    errors.push({ method: 'session-pooler', error: e2.message });
  }

  // Method 3: Transaction pooler (port 6543)
  try {
    const { Client } = require('pg');
    const c = new Client({
      connectionString: 'postgresql://postgres.xyehncvvvprrqwnsefcr:Vertex2026WS!@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
    });
    await c.connect();
    const r = await c.query(sql);
    await c.end();
    return res.json({ ok: true, rows: r.rows || [], rowCount: r.rowCount, method: 'transaction-pooler' });
  } catch (e3) {
    errors.push({ method: 'transaction-pooler', error: e3.message });
  }

  return res.status(500).json({ errors });
};

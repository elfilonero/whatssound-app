/**
 * Migración directa a PostgreSQL via pg client
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: 'db.xyehncvvvprrqwnsefcr.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Vertex2026WS!',
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  console.log('🚀 Conectando a PostgreSQL...\n');
  
  const client = await pool.connect();
  
  try {
    // Leer SQL
    const sqlPath = path.join(__dirname, 'apply-golden-boost-migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📜 Ejecutando migración...\n');
    
    // Ejecutar SQL
    await client.query(sql);
    
    console.log('✅ Migración completada!\n');
    
    // Verificar
    const { rows } = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename LIKE 'ws_golden%'
    `);
    console.log('📊 Tablas creadas:', rows.map(r => r.tablename).join(', '));
    
    // Verificar columnas
    const { rows: cols } = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'ws_profiles'
      AND column_name LIKE 'golden%' OR column_name LIKE 'permanent%'
    `);
    console.log('📊 Columnas añadidas:', cols.map(c => c.column_name).join(', '));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();

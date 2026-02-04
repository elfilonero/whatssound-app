/**
 * Ejecutar migración Golden Boost via Supabase JS Client
 * Usa service_role key para tener permisos de admin
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://xyehncvvvprrqwnsefcr.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5ZWhuY3Z2dnBycnF3bnNlZmNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTY1MDg5OCwiZXhwIjoyMDg1MjI2ODk4fQ.ANwuQ-wrlyfEKD2f-f5Tr67UpDOAb--wmEWcnzG02Q8';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function runMigration() {
  console.log('🚀 Iniciando migración Golden Boost...\n');

  try {
    // Verificar conexión
    const { data: test, error: testError } = await supabase
      .from('ws_profiles')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error de conexión:', testError.message);
      return;
    }
    console.log('✅ Conexión a Supabase OK\n');

    // 1. Crear tabla ws_golden_boosts
    console.log('1️⃣ Creando tabla ws_golden_boosts...');
    const { error: e1 } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS ws_golden_boosts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          from_user_id UUID NOT NULL REFERENCES ws_profiles(id) ON DELETE CASCADE,
          to_dj_id UUID NOT NULL REFERENCES ws_profiles(id) ON DELETE CASCADE,
          session_id UUID REFERENCES ws_sessions(id) ON DELETE SET NULL,
          created_at TIMESTAMPTZ DEFAULT now(),
          message TEXT,
          CONSTRAINT no_self_boost CHECK (from_user_id != to_dj_id)
        );
      `
    });
    if (e1) console.log('   (tabla ya existe o error:', e1.message, ')');
    else console.log('   ✅ Tabla creada');

    // 2. Añadir columnas a ws_profiles
    console.log('\n2️⃣ Añadiendo columnas a ws_profiles...');
    const columns = [
      'golden_boost_available INT DEFAULT 1',
      'golden_boost_last_reset TIMESTAMPTZ DEFAULT now()',
      'golden_boosts_received INT DEFAULT 0',
      'golden_boosts_given INT DEFAULT 0',
      'sessions_listened_this_week INT DEFAULT 0',
      'sessions_listened_reset TIMESTAMPTZ DEFAULT now()',
      'golden_badge TEXT DEFAULT \'none\'',
      'permanent_sponsors_count INT DEFAULT 0'
    ];

    for (const col of columns) {
      const colName = col.split(' ')[0];
      const { error } = await supabase.rpc('exec_sql', {
        query: `ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS ${col};`
      });
      if (!error) console.log(`   ✅ ${colName}`);
    }

    // 3. Crear tabla ws_golden_boost_permanent
    console.log('\n3️⃣ Creando tabla ws_golden_boost_permanent...');
    const { error: e3 } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS ws_golden_boost_permanent (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          from_user_id UUID NOT NULL REFERENCES ws_profiles(id) ON DELETE CASCADE,
          to_dj_id UUID NOT NULL REFERENCES ws_profiles(id) ON DELETE CASCADE,
          message TEXT,
          amount_cents INT DEFAULT 1999,
          created_at TIMESTAMPTZ DEFAULT now(),
          display_order INT DEFAULT 0,
          is_highlighted BOOLEAN DEFAULT false,
          CONSTRAINT unique_permanent_sponsor UNIQUE (from_user_id, to_dj_id)
        );
      `
    });
    if (e3) console.log('   (tabla ya existe o error:', e3.message, ')');
    else console.log('   ✅ Tabla creada');

    // 4. Verificar
    console.log('\n4️⃣ Verificando tablas...');
    const { data: tables } = await supabase.rpc('exec_sql', {
      query: `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'ws_golden%';`
    });
    console.log('   Tablas Golden Boost:', tables);

    console.log('\n✅ Migración completada!\n');
    console.log('Nota: Si exec_sql no existe, ejecuta el SQL manualmente en Supabase Dashboard.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Alternativa: Copia el contenido de scripts/apply-golden-boost-migration.sql');
    console.log('   y pégalo en https://supabase.com/dashboard/project/xyehncvvvprrqwnsefcr/sql/new');
  }
}

runMigration();

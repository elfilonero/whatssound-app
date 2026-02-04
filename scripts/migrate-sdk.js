/**
 * Migración via Supabase SDK con service_role
 */
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://xyehncvvvprrqwnsefcr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5ZWhuY3Z2dnBycnF3bnNlZmNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTY1MDg5OCwiZXhwIjoyMDg1MjI2ODk4fQ.ANwuQ-wrlyfEKD2f-f5Tr67UpDOAb--wmEWcnzG02Q8',
  { db: { schema: 'public' } }
);

async function migrate() {
  console.log('🚀 Migrando Golden Boost...\n');

  // 1. Verificar si la tabla existe intentando leer
  const { error: checkError } = await supabase
    .from('ws_golden_boosts')
    .select('id')
    .limit(1);

  if (checkError && checkError.code === '42P01') {
    console.log('❌ Tabla ws_golden_boosts no existe.');
    console.log('📝 Necesitas ejecutar el SQL manualmente en Supabase Dashboard.\n');
    console.log('URL: https://supabase.com/dashboard/project/xyehncvvvprrqwnsefcr/sql/new');
    console.log('Archivo: scripts/apply-golden-boost-migration.sql\n');
    return;
  }

  if (!checkError) {
    console.log('✅ Tabla ws_golden_boosts ya existe!\n');
  }

  // 2. Verificar columnas en ws_profiles
  const { data: profile } = await supabase
    .from('ws_profiles')
    .select('golden_boost_available, golden_boosts_received, golden_badge')
    .limit(1)
    .single();

  if (profile) {
    console.log('✅ Columnas Golden Boost en ws_profiles:', Object.keys(profile).join(', '));
  } else {
    console.log('⚠️ Columnas Golden Boost no encontradas en ws_profiles');
  }

  // 3. Verificar tabla permanente
  const { error: permError } = await supabase
    .from('ws_golden_boost_permanent')
    .select('id')
    .limit(1);

  if (!permError) {
    console.log('✅ Tabla ws_golden_boost_permanent existe!');
  } else {
    console.log('⚠️ Tabla ws_golden_boost_permanent no existe');
  }

  // 4. Contar registros
  const { count: boostCount } = await supabase
    .from('ws_golden_boosts')
    .select('*', { count: 'exact', head: true });
  
  const { count: profileCount } = await supabase
    .from('ws_profiles')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 Estado actual:`);
  console.log(`   - Perfiles: ${profileCount}`);
  console.log(`   - Golden Boosts: ${boostCount || 0}`);
  
  console.log('\n✅ Verificación completada!');
}

migrate().catch(console.error);

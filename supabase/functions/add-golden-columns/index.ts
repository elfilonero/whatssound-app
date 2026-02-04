// Edge Function para añadir columnas Golden Boost a ws_profiles
// Desplegar con: supabase functions deploy add-golden-columns

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Usar conexión directa a Postgres
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { db: { schema: 'public' } }
    )

    // Las columnas que necesitamos añadir
    const columns = [
      { name: 'golden_boost_available', type: 'INT', default: '1' },
      { name: 'golden_boost_last_reset', type: 'TIMESTAMPTZ', default: 'now()' },
      { name: 'golden_boosts_received', type: 'INT', default: '0' },
      { name: 'golden_boosts_given', type: 'INT', default: '0' },
      { name: 'sessions_listened_this_week', type: 'INT', default: '0' },
      { name: 'sessions_listened_reset', type: 'TIMESTAMPTZ', default: 'now()' },
      { name: 'golden_badge', type: 'TEXT', default: "'none'" },
      { name: 'permanent_sponsors_count', type: 'INT', default: '0' },
    ]

    // Verificar qué columnas ya existen
    const { data: profile } = await supabaseAdmin
      .from('ws_profiles')
      .select('*')
      .limit(1)
      .single()

    const existingCols = profile ? Object.keys(profile) : []
    const missingCols = columns.filter(c => !existingCols.includes(c.name))

    return new Response(
      JSON.stringify({
        status: 'info',
        existingColumns: existingCols.filter(c => c.includes('golden') || c.includes('permanent')),
        missingColumns: missingCols.map(c => c.name),
        message: 'Para añadir columnas, ejecuta el SQL en el dashboard',
        sql: missingCols.map(c => 
          `ALTER TABLE ws_profiles ADD COLUMN IF NOT EXISTS ${c.name} ${c.type} DEFAULT ${c.default};`
        ).join('\n')
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

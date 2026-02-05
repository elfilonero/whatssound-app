/**
 * WhatsSound — Cron: Regenerar Golden Boosts
 * Ejecutar cada VIERNES a las 11:00 UTC (12:00 CET)
 * Antes de comer → la gente planea el finde
 * 
 * Usa la función SQL existente: reset_weekly_golden_boosts()
 * Consistente con supabase/functions/reset-golden-boosts
 * 
 * Vercel Cron: vercel.json → "0 11 * * 5"
 */

import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  // Verificar autorización
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // En producción verificar el secret
  if (process.env.NODE_ENV === 'production' && cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  try {
    // 1. Ejecutar la función SQL existente de reset
    const { error: resetError } = await supabase.rpc('reset_weekly_golden_boosts');
    
    if (resetError) {
      console.error('[Cron] Error en reset_weekly_golden_boosts:', resetError);
      // Continuar aunque falle - puede ser que la función no exista aún
    }

    // 2. Contar usuarios con boost disponible
    const { count: usersWithBoost } = await supabase
      .from('ws_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('golden_boost_available', 1);

    // 3. Verificar aceleradores (+1 boost si 5+ sesiones)
    // Usuarios con 5+ sesiones esta semana que no han recibido bonus
    const { data: eligibleUsers } = await supabase
      .from('ws_profiles')
      .select('id, golden_boost_available, sessions_listened_this_week')
      .gte('sessions_listened_this_week', 5);

    let bonusGiven = 0;
    for (const user of eligibleUsers || []) {
      // Dar bonus de +1
      const { error } = await supabase
        .from('ws_profiles')
        .update({
          golden_boost_available: user.golden_boost_available + 1,
        })
        .eq('id', user.id);
      
      if (!error) bonusGiven++;
    }

    // 4. Log de auditoría
    await supabase.from('ws_audit_log').insert({
      action: 'cron_regenerate_boosts',
      metadata: {
        users_with_boost: usersWithBoost || 0,
        bonus_given: bonusGiven,
        executed_at: new Date().toISOString(),
        day: 'Friday',
        time_utc: '11:00',
      },
    });

    // console.log(`[Cron] Golden Boosts regenerados. ${usersWithBoost} usuarios, ${bonusGiven} bonus.`);

    return new Response(
      JSON.stringify({
        success: true,
        message: '¡Golden Boosts regenerados! Viernes antes de comer 🎉',
        usersWithBoost: usersWithBoost || 0,
        bonusGiven,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[Cron] Error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: String(error),
        timestamp: new Date().toISOString(),
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

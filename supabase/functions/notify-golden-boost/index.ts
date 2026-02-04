/**
 * WhatsSound — Notify Golden Boost (Edge Function)
 * 
 * Envía push notification cuando alguien recibe un Golden Boost
 * Se llama desde un database webhook o trigger
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoldenBoostPayload {
  type: 'INSERT';
  table: 'ws_golden_boosts';
  record: {
    id: string;
    from_user_id: string;
    to_dj_id: string;
    session_id?: string;
    message?: string;
    created_at: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse payload del webhook
    const payload: GoldenBoostPayload = await req.json();
    const { from_user_id, to_dj_id, session_id, message } = payload.record;

    // Obtener info del que da el boost
    const { data: giver } = await supabase
      .from('ws_profiles')
      .select('display_name, avatar_url')
      .eq('id', from_user_id)
      .single();

    // Obtener push tokens del DJ
    const { data: djProfile } = await supabase
      .from('ws_profiles')
      .select('push_tokens, display_name')
      .eq('id', to_dj_id)
      .single();

    if (!djProfile?.push_tokens?.length) {
      console.log('[NotifyGoldenBoost] DJ no tiene push tokens registrados');
      return new Response(
        JSON.stringify({ success: true, sent: false, reason: 'no_tokens' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Preparar notificación
    const title = '🏆 ¡Golden Boost!';
    const body = `${giver?.display_name || 'Alguien'} te ha dado un Golden Boost${message ? `: "${message}"` : ''}`;
    
    // Enviar a Expo Push Notifications
    const expoPushUrl = 'https://exp.host/--/api/v2/push/send';
    
    const messages = djProfile.push_tokens.map((token: string) => ({
      to: token,
      sound: 'default',
      title,
      body,
      data: {
        type: 'golden_boost',
        fromUserId: from_user_id,
        sessionId: session_id,
      },
      priority: 'high',
      channelId: 'golden-boost',
    }));

    const pushResponse = await fetch(expoPushUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const pushResult = await pushResponse.json();
    console.log('[NotifyGoldenBoost] Push enviado:', pushResult);

    // Guardar notificación en la base de datos también
    await supabase.from('ws_notifications').insert({
      user_id: to_dj_id,
      type: 'golden_boost',
      title,
      body,
      data: {
        from_user_id,
        from_user_name: giver?.display_name,
        from_user_avatar: giver?.avatar_url,
        session_id,
        message,
      },
      read: false,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: true,
        tokens: djProfile.push_tokens.length,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('[NotifyGoldenBoost] Error:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

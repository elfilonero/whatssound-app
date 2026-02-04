/**
 * WhatsSound — Open Graph Image Generator
 * Genera imágenes dinámicas para compartir sesiones en redes sociales
 * 
 * GET /api/og/session/[id]
 * Returns: PNG image 1200x630 (OG standard)
 */

import { ImageResponse } from '@vercel/og';
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const sessionId = params.id;

  // Fetch session data
  const { data: session } = await supabase
    .from('ws_sessions')
    .select(`
      *,
      dj:ws_profiles!dj_id(dj_name, display_name, avatar_url)
    `)
    .eq('id', sessionId)
    .single();

  // Fallback data if session not found
  const djName = session?.dj?.dj_name || session?.dj?.display_name || 'DJ';
  const sessionName = session?.name || 'Sesión en WhatsSound';
  const genre = session?.genre || 'Música en vivo';
  const listeners = session?.listener_count || 0;
  const isLive = session?.status === 'active';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0f1a',
          backgroundImage: 'linear-gradient(135deg, #0a0f1a 0%, #1a1f2e 50%, #0a0f1a 100%)',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '60px',
          }}
        >
          {/* Live badge */}
          {isLive && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ef4444',
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingTop: '8px',
                paddingBottom: '8px',
                borderRadius: '20px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                }}
              />
              <span style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
                EN VIVO
              </span>
            </div>
          )}

          {/* Session name */}
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'center',
              margin: '0',
              marginBottom: '16px',
              maxWidth: '900px',
            }}
          >
            {sessionName}
          </h1>

          {/* DJ name */}
          <p
            style={{
              fontSize: '36px',
              color: '#8b5cf6',
              margin: '0',
              marginBottom: '24px',
            }}
          >
            {djName}
          </p>

          {/* Genre */}
          <p
            style={{
              fontSize: '24px',
              color: '#9ca3af',
              margin: '0',
              marginBottom: '32px',
            }}
          >
            {genre}
          </p>

          {/* Listeners */}
          {listeners > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#9ca3af',
                fontSize: '22px',
              }}
            >
              <span>👥</span>
              <span>{listeners} escuchando</span>
            </div>
          )}

          {/* WhatsSound branding */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '28px' }}>🎵</span>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#8b5cf6',
              }}
            >
              WhatsSound
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

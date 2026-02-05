/**
 * WhatsSound — usePresence Hook
 * Muestra quién está escuchando una sesión en tiempo real
 * Usa Supabase Presence API
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

// Backoff exponencial: 1s, 2s, 4s, 8s, max 30s
const getBackoffDelay = (attempt: number) => Math.min(1000 * Math.pow(2, attempt), 30000);

export interface PresenceUser {
  id: string;
  name: string;
  avatar: string | null;
  joinedAt: string;
}

interface UsePresenceReturn {
  users: PresenceUser[];
  count: number;
  isConnected: boolean;
}

export function usePresence(sessionId: string | undefined): UsePresenceReturn {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [count, setCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const channelName = `presence:session:${sessionId}`;
    let channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: user?.id || `anon-${Date.now()}`,
        },
      },
    });

    // Función para reconectar con backoff
    const attemptReconnect = () => {
      const delay = getBackoffDelay(reconnectAttempts.current);
      // console.log(`[Presence] Reconectando en ${delay/1000}s (intento ${reconnectAttempts.current + 1})`);
      setIsReconnecting(true);
      
      reconnectTimeout.current = setTimeout(() => {
        reconnectAttempts.current++;
        supabase.removeChannel(channel);
        channel = supabase.channel(channelName, {
          config: { presence: { key: user?.id || `anon-${Date.now()}` } },
        });
        setupChannel();
      }, delay);
    };

    // Configurar listeners del canal
    const setupChannel = () => {
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const presentUsers: PresenceUser[] = [];
          Object.keys(state).forEach(key => {
            const presences = state[key] as any[];
            presences.forEach(presence => {
              if (!presentUsers.find(u => u.id === presence.user_id)) {
                presentUsers.push({
                  id: presence.user_id || key,
                  name: presence.user_name || 'Anónimo',
                  avatar: presence.user_avatar || null,
                  joinedAt: presence.joined_at || new Date().toISOString(),
                });
              }
            });
          });
          presentUsers.sort((a, b) => 
            new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
          );
          setUsers(presentUsers);
          setCount(presentUsers.length);
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
          // console.log('[Presence] Usuario entró:', newPresences);
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }) => {
          // console.log('[Presence] Usuario salió:', leftPresences);
        });

      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          setIsReconnecting(false);
          reconnectAttempts.current = 0; // Reset en conexión exitosa
          
          const presenceData = {
            user_id: user?.id || `anon-${Date.now()}`,
            user_name: user?.user_metadata?.display_name || 'Oyente',
            user_avatar: user?.user_metadata?.avatar_url || null,
            joined_at: new Date().toISOString(),
          };
          
          await channel.track(presenceData);
          // console.log('[Presence] Conectado a sesión:', sessionId);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsConnected(false);
          console.error('[Presence] Error en canal, reconectando...');
          attemptReconnect();
        } else if (status === 'CLOSED') {
          setIsConnected(false);
          // console.log('[Presence] Canal cerrado');
        }
      });
    };

    // Iniciar conexión
    setupChannel();

    // Cleanup al desmontar
    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      channel.untrack();
      supabase.removeChannel(channel);
      setIsConnected(false);
      // console.log('[Presence] Desconectado de sesión:', sessionId);
    };
  }, [sessionId, user?.id, user?.user_metadata?.display_name, user?.user_metadata?.avatar_url]);

  return { users, count, isConnected };
}

/**
 * Hook para obtener solo el conteo (más ligero)
 */
export function usePresenceCount(sessionId: string | undefined): number {
  const { count } = usePresence(sessionId);
  return count;
}

export default usePresence;

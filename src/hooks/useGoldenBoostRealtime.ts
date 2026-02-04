/**
 * WhatsSound — useGoldenBoostRealtime Hook
 * Escucha Golden Boosts en tiempo real para una sesión
 * Muestra animación cuando alguien da un Golden Boost
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface GoldenBoostEvent {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  toDjId: string;
  toDjName: string;
  message?: string;
  createdAt: Date;
}

interface UseGoldenBoostRealtimeOptions {
  /** ID de la sesión a escuchar */
  sessionId: string;
  /** Callback cuando se recibe un Golden Boost */
  onBoostReceived?: (event: GoldenBoostEvent) => void;
  /** Habilitar/deshabilitar */
  enabled?: boolean;
}

export function useGoldenBoostRealtime({
  sessionId,
  onBoostReceived,
  enabled = true,
}: UseGoldenBoostRealtimeOptions) {
  const [lastBoost, setLastBoost] = useState<GoldenBoostEvent | null>(null);
  const [boostHistory, setBoostHistory] = useState<GoldenBoostEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled || !sessionId) return;

    let channel: RealtimeChannel | null = null;

    const setupChannel = async () => {
      // Canal específico para Golden Boosts de esta sesión
      channel = supabase
        .channel(`golden-boosts:${sessionId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'ws_golden_boosts',
            filter: `session_id=eq.${sessionId}`,
          },
          async (payload) => {
            console.log('[GoldenBoostRealtime] Nuevo boost:', payload);
            
            const record = payload.new as {
              id: string;
              from_user_id: string;
              to_dj_id: string;
              message?: string;
              created_at: string;
            };

            // Obtener info de los usuarios
            const [giverResult, djResult] = await Promise.all([
              supabase
                .from('ws_profiles')
                .select('display_name, avatar_url')
                .eq('id', record.from_user_id)
                .single(),
              supabase
                .from('ws_profiles')
                .select('display_name')
                .eq('id', record.to_dj_id)
                .single(),
            ]);

            const event: GoldenBoostEvent = {
              id: record.id,
              fromUserId: record.from_user_id,
              fromUserName: giverResult.data?.display_name || 'Alguien',
              fromUserAvatar: giverResult.data?.avatar_url,
              toDjId: record.to_dj_id,
              toDjName: djResult.data?.display_name || 'DJ',
              message: record.message,
              createdAt: new Date(record.created_at),
            };

            setLastBoost(event);
            setBoostHistory(prev => [event, ...prev].slice(0, 10)); // Mantener últimos 10
            
            onBoostReceived?.(event);
          }
        )
        .subscribe((status) => {
          console.log('[GoldenBoostRealtime] Status:', status);
          setIsConnected(status === 'SUBSCRIBED');
        });
    };

    setupChannel();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [sessionId, enabled, onBoostReceived]);

  /**
   * Enviar evento de Golden Boost a través del canal broadcast
   * Útil para sincronizar animaciones entre todos los clientes
   */
  const broadcastBoostAnimation = useCallback(async (
    event: GoldenBoostEvent
  ): Promise<void> => {
    if (!sessionId) return;

    try {
      const channel = supabase.channel(`session-events:${sessionId}`);
      
      await channel.send({
        type: 'broadcast',
        event: 'golden_boost',
        payload: event,
      });
    } catch (error) {
      console.error('[GoldenBoostRealtime] Error broadcasting:', error);
    }
  }, [sessionId]);

  /**
   * Limpiar el último boost (después de mostrar animación)
   */
  const clearLastBoost = useCallback(() => {
    setLastBoost(null);
  }, []);

  return {
    /** Último Golden Boost recibido */
    lastBoost,
    /** Historial de boosts de la sesión */
    boostHistory,
    /** Si está conectado al canal */
    isConnected,
    /** Limpiar el último boost */
    clearLastBoost,
    /** Broadcast manual (si es necesario) */
    broadcastBoostAnimation,
  };
}

/**
 * Hook simplificado para usar en el componente de sesión
 * Solo dispara la animación y notificación
 */
export function useGoldenBoostNotifications(sessionId: string) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentBoost, setCurrentBoost] = useState<GoldenBoostEvent | null>(null);

  const handleBoostReceived = useCallback((event: GoldenBoostEvent) => {
    setCurrentBoost(event);
    setShowAnimation(true);
    
    // Auto-ocultar después de 4 segundos
    setTimeout(() => {
      setShowAnimation(false);
      setCurrentBoost(null);
    }, 4000);
  }, []);

  const { isConnected } = useGoldenBoostRealtime({
    sessionId,
    onBoostReceived: handleBoostReceived,
    enabled: !!sessionId,
  });

  return {
    showAnimation,
    currentBoost,
    isConnected,
    hideAnimation: () => {
      setShowAnimation(false);
      setCurrentBoost(null);
    },
  };
}

export default useGoldenBoostRealtime;

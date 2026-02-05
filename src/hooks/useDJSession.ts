/**
 * WhatsSound — useDJSession Hook
 * Lógica para el panel de DJ
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getSessionTips } from '../lib/tips';

export interface DJSessionStats {
  listeners: number;
  songs: number;
  tips: number;
  duration: string;
}

export interface DJSessionInfo {
  name: string;
  genre: string;
}

export interface UseDJSessionResult {
  stats: DJSessionStats;
  sessionInfo: DJSessionInfo;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDJSession(sessionId: string | undefined): UseDJSessionResult {
  const [stats, setStats] = useState<DJSessionStats>({
    listeners: 0,
    songs: 0,
    tips: 0,
    duration: '0h 0m',
  });
  const [sessionInfo, setSessionInfo] = useState<DJSessionInfo>({
    name: 'Sesión',
    genre: 'Mix',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }

    try {
      // Cargar sesión
      const { data: session, error: sessionError } = await supabase
        .from('ws_sessions')
        .select('name, genres, started_at')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      if (session) {
        const duration = Math.floor(
          (Date.now() - new Date(session.started_at).getTime()) / 60000
        );
        const hours = Math.floor(duration / 60);
        const mins = duration % 60;

        setSessionInfo({
          name: session.name,
          genre: session.genres?.[0] || 'Mix',
        });

        // Contar miembros, canciones, propinas
        const [membersResult, songsResult, tipsData] = await Promise.all([
          supabase
            .from('ws_session_members')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', sessionId)
            .is('left_at', null),
          supabase
            .from('ws_songs')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', sessionId),
          getSessionTips(sessionId),
        ]);

        setStats({
          listeners: membersResult.count || 0,
          songs: songsResult.count || 0,
          tips: tipsData.total,
          duration: `${hours}h ${mins}m`,
        });
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading session');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    if (sessionId) {
      const interval = setInterval(loadData, 30000); // Actualizar cada 30s
      return () => clearInterval(interval);
    }
  }, [sessionId]);

  return {
    stats,
    sessionInfo,
    isLoading,
    error,
    refresh: loadData,
  };
}

export default useDJSession;

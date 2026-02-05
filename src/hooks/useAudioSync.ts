/**
 * WhatsSound — useAudioSync Hook
 * Synchronizes audio playback across all listeners in a session
 * DJ is the master, listeners sync to DJ's position
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Sync tolerance: don't adjust if within this range (ms)
const SYNC_TOLERANCE_MS = 2000;
// Hard resync if difference exceeds this (ms)
const HARD_RESYNC_MS = 5000;
// How often DJ broadcasts position (ms)
const BROADCAST_INTERVAL_MS = 5000;

export interface SyncState {
  masterTime: number;
  songId: string;
  isPlaying: boolean;
  timestamp: number;
}

export interface UseAudioSyncOptions {
  sessionId: string;
  /** Is this user the DJ (master)? */
  isDJ: boolean;
  /** Current song ID */
  songId?: string;
  /** Current playback position in ms */
  currentTimeMs: number;
  /** Is audio currently playing? */
  isPlaying: boolean;
  /** Callback to seek to a position */
  onSeekTo?: (timeMs: number) => void;
  /** Callback when sync status changes */
  onSyncStatusChange?: (status: 'synced' | 'syncing' | 'disconnected') => void;
  /** Enable/disable sync */
  enabled?: boolean;
}

export interface UseAudioSyncReturn {
  /** Is currently synced with master? */
  isSynced: boolean;
  /** Is currently reconnecting/syncing? */
  isSyncing: boolean;
  /** Last known sync state from master */
  masterState: SyncState | null;
  /** Manually trigger a sync */
  forceSync: () => void;
}

export function useAudioSync(options: UseAudioSyncOptions): UseAudioSyncReturn {
  const {
    sessionId,
    isDJ,
    songId,
    currentTimeMs,
    isPlaying,
    onSeekTo,
    onSyncStatusChange,
    enabled = true,
  } = options;

  const [isSynced, setIsSynced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [masterState, setMasterState] = useState<SyncState | null>(null);
  
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const broadcastIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastBroadcastRef = useRef<number>(0);

  // DJ: Broadcast position to listeners
  const broadcastPosition = useCallback(() => {
    if (!isDJ || !channelRef.current || !songId) return;

    const now = Date.now();
    // Throttle broadcasts
    if (now - lastBroadcastRef.current < BROADCAST_INTERVAL_MS - 100) return;
    lastBroadcastRef.current = now;

    const syncState: SyncState = {
      masterTime: currentTimeMs,
      songId,
      isPlaying,
      timestamp: now,
    };

    channelRef.current.send({
      type: 'broadcast',
      event: 'audio_sync',
      payload: syncState,
    });

    // console.log('[AudioSync] DJ broadcast:', currentTimeMs, 'ms');
  }, [isDJ, songId, currentTimeMs, isPlaying]);

  // Listener: Sync to master position
  const syncToMaster = useCallback((state: SyncState) => {
    if (isDJ || !onSeekTo) return;

    // Calculate expected current position based on when broadcast was sent
    const timeSinceBroadcast = Date.now() - state.timestamp;
    const expectedPosition = state.isPlaying 
      ? state.masterTime + timeSinceBroadcast 
      : state.masterTime;

    const diff = Math.abs(currentTimeMs - expectedPosition);

    if (diff > HARD_RESYNC_MS) {
      // Hard resync - jump directly
      // console.log(`[AudioSync] Hard resync: ${diff}ms difference`);
      setIsSyncing(true);
      onSeekTo(expectedPosition);
      setTimeout(() => {
        setIsSyncing(false);
        setIsSynced(true);
      }, 500);
    } else if (diff > SYNC_TOLERANCE_MS) {
      // Soft resync - gradual adjustment
      // console.log(`[AudioSync] Soft resync: ${diff}ms difference`);
      setIsSyncing(true);
      onSeekTo(expectedPosition);
      setTimeout(() => {
        setIsSyncing(false);
        setIsSynced(true);
      }, 300);
    } else {
      // Within tolerance - considered synced
      setIsSynced(true);
      setIsSyncing(false);
    }
  }, [isDJ, currentTimeMs, onSeekTo]);

  // Force sync (manual trigger)
  const forceSync = useCallback(() => {
    if (masterState) {
      syncToMaster(masterState);
    }
  }, [masterState, syncToMaster]);

  // Setup channel and listeners
  useEffect(() => {
    if (!enabled || !sessionId) return;

    const channel = supabase.channel(`audio_sync:${sessionId}`);
    channelRef.current = channel;

    // Listen for sync broadcasts (listeners only)
    if (!isDJ) {
      channel.on('broadcast', { event: 'audio_sync' }, ({ payload }) => {
        const state = payload as SyncState;
        setMasterState(state);
        syncToMaster(state);
      });
    }

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        // console.log('[AudioSync] Connected to sync channel');
        onSyncStatusChange?.('synced');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('[AudioSync] Channel error');
        onSyncStatusChange?.('disconnected');
        setIsSynced(false);
      }
    });

    return () => {
      if (broadcastIntervalRef.current) {
        clearInterval(broadcastIntervalRef.current);
      }
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [enabled, sessionId, isDJ, syncToMaster, onSyncStatusChange]);

  // DJ: Setup periodic broadcasting
  useEffect(() => {
    if (!enabled || !isDJ || !channelRef.current) return;

    // Broadcast immediately when playing state changes
    if (isPlaying) {
      broadcastPosition();
    }

    // Setup interval for periodic broadcasts while playing
    if (isPlaying) {
      broadcastIntervalRef.current = setInterval(broadcastPosition, BROADCAST_INTERVAL_MS);
    } else {
      if (broadcastIntervalRef.current) {
        clearInterval(broadcastIntervalRef.current);
        broadcastIntervalRef.current = null;
      }
      // Broadcast pause state once
      broadcastPosition();
    }

    return () => {
      if (broadcastIntervalRef.current) {
        clearInterval(broadcastIntervalRef.current);
      }
    };
  }, [enabled, isDJ, isPlaying, broadcastPosition]);

  return {
    isSynced,
    isSyncing,
    masterState,
    forceSync,
  };
}

export default useAudioSync;

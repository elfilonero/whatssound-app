/**
 * WhatsSound — Session Store (Zustand)
 * Maneja sesiones musicales en vivo con Supabase
 */

import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface MusicSession {
  id: string;
  dj_id: string;
  name: string;
  genre: string | null;
  status: 'live' | 'ended' | 'scheduled';
  listener_count: number;
  max_listeners: number;
  current_song: string | null;
  current_artist: string | null;
  started_at: string;
  ended_at: string | null;
  // joined from profiles
  dj_name?: string;
  dj_display_name?: string;
}

export interface QueueItem {
  id: string;
  session_id: string;
  requested_by: string;
  song_name: string;
  artist: string;
  votes: number;
  status: 'pending' | 'playing' | 'played' | 'rejected';
  created_at: string;
  requester_name?: string;
}

interface SessionState {
  sessions: MusicSession[];
  currentSession: MusicSession | null;
  queue: QueueItem[];
  loading: boolean;

  fetchLiveSessions: () => Promise<void>;
  fetchSession: (id: string) => Promise<void>;
  createSession: (name: string, genre: string) => Promise<{ id: string | null; error: string | null }>;
  endSession: (id: string) => Promise<void>;
  fetchQueue: (sessionId: string) => Promise<void>;
  requestSong: (sessionId: string, songName: string, artist: string) => Promise<{ error: string | null }>;
  voteSong: (queueId: string) => Promise<{ error: string | null }>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  currentSession: null,
  queue: [],
  loading: false,

  fetchLiveSessions: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('sessions')
      .select('*, profiles!sessions_dj_id_fkey(display_name, username)')
      .eq('status', 'live')
      .order('started_at', { ascending: false });

    if (!error && data) {
      const sessions = data.map((s: any) => ({
        ...s,
        dj_display_name: s.profiles?.display_name,
        dj_name: s.profiles?.username,
      }));
      set({ sessions });
    }
    set({ loading: false });
  },

  fetchSession: async (id) => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, profiles!sessions_dj_id_fkey(display_name, username)')
      .eq('id', id)
      .single();

    if (!error && data) {
      set({
        currentSession: {
          ...data,
          dj_display_name: data.profiles?.display_name,
          dj_name: data.profiles?.username,
        } as MusicSession,
      });
    }
  },

  createSession: async (name, genre) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { id: null, error: 'No autenticado' };

    const { data, error } = await supabase
      .from('sessions')
      .insert({ dj_id: user.id, name, genre, status: 'live' })
      .select()
      .single();

    if (error) return { id: null, error: error.message };
    return { id: data.id, error: null };
  },

  endSession: async (id) => {
    await supabase
      .from('sessions')
      .update({ status: 'ended', ended_at: new Date().toISOString() })
      .eq('id', id);

    set({ currentSession: null });
    await get().fetchLiveSessions();
  },

  fetchQueue: async (sessionId) => {
    const { data, error } = await supabase
      .from('queue')
      .select('*, profiles!queue_requested_by_fkey(display_name)')
      .eq('session_id', sessionId)
      .order('votes', { ascending: false })
      .order('created_at', { ascending: true });

    if (!error && data) {
      const queue = data.map((q: any) => ({
        ...q,
        requester_name: q.profiles?.display_name,
      }));
      set({ queue });
    }
  },

  requestSong: async (sessionId, songName, artist) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' };

    const { error } = await supabase
      .from('queue')
      .insert({ session_id: sessionId, requested_by: user.id, song_name: songName, artist });

    if (!error) await get().fetchQueue(sessionId);
    return { error: error?.message ?? null };
  },

  voteSong: async (queueId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' };

    // Insert vote
    const { error: voteError } = await supabase
      .from('votes')
      .insert({ user_id: user.id, queue_id: queueId });

    if (voteError) return { error: voteError.message };

    // Increment vote count
    const item = get().queue.find(q => q.id === queueId);
    if (item) {
      await supabase
        .from('queue')
        .update({ votes: item.votes + 1 })
        .eq('id', queueId);
    }

    // Refresh queue
    if (get().currentSession) {
      await get().fetchQueue(get().currentSession!.id);
    }
    return { error: null };
  },
}));

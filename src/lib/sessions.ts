/**
 * WhatsSound — Sessions System
 * Crear, gestionar y unirse a sesiones de DJ
 */

import { supabase } from './supabase';
import { isTestMode, getOrCreateTestUser } from './demo';

// ─── Types ─────────────────────────────────────────────────

export interface Session {
  id: string;
  dj_id: string;
  name: string;
  description?: string;
  cover_url?: string;
  genres: string[];
  is_public: boolean;
  allow_requests: boolean;
  tips_enabled: boolean;
  max_songs_per_user: number;
  is_active: boolean;
  started_at: string;
  ended_at?: string;
  created_at: string;
}

export interface CreateSessionParams {
  name: string;
  description?: string;
  coverUrl?: string;
  genres: string[];
  isPublic?: boolean;
  allowRequests?: boolean;
  tipsEnabled?: boolean;
  maxSongsPerUser?: number;
}

export interface SessionResult {
  ok: boolean;
  session?: Session;
  error?: string;
}

// ─── Create Session ────────────────────────────────────────

export async function createSession(params: CreateSessionParams): Promise<SessionResult> {
  const { 
    name, 
    description, 
    coverUrl, 
    genres, 
    isPublic = true, 
    allowRequests = true, 
    tipsEnabled = true,
    maxSongsPerUser = 3,
  } = params;

  if (!name.trim()) {
    return { ok: false, error: 'El nombre de la sesión es obligatorio' };
  }

  // Obtener DJ id
  let djId: string;
  let djName: string;
  
  if (isTestMode()) {
    const testProfile = await getOrCreateTestUser();
    if (!testProfile) {
      return { ok: false, error: 'No se pudo obtener usuario' };
    }
    if (!testProfile.is_dj) {
      return { ok: false, error: 'Solo los DJs pueden crear sesiones' };
    }
    djId = testProfile.id;
    djName = testProfile.display_name;
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, error: 'Debes iniciar sesión' };
    }
    
    const { data: profile } = await supabase
      .from('ws_profiles')
      .select('id, is_dj, display_name')
      .eq('id', user.id)
      .single();
    
    if (!profile?.is_dj) {
      return { ok: false, error: 'Solo los DJs pueden crear sesiones' };
    }
    djId = profile.id;
    djName = profile.display_name;
  }

  // Crear sesión
  const sessionData = {
    dj_id: djId,
    name: name.trim(),
    description: description?.trim() || null,
    cover_url: coverUrl || null,
    genres,
    is_public: isPublic,
    allow_requests: allowRequests,
    tips_enabled: tipsEnabled,
    max_songs_per_user: maxSongsPerUser,
    is_active: true,
    started_at: new Date().toISOString(),
    is_seed: false,
  };

  const { data, error } = await supabase
    .from('ws_sessions')
    .insert(sessionData)
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error);
    return { ok: false, error: 'Error al crear la sesión' };
  }

  // Añadir al DJ como miembro de su propia sesión
  await supabase
    .from('ws_session_members')
    .insert({
      session_id: data.id,
      user_id: djId,
      role: 'dj',
      is_seed: false,
    });

  return { ok: true, session: data as Session };
}

// ─── End Session ───────────────────────────────────────────

export async function endSession(sessionId: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from('ws_sessions')
    .update({
      is_active: false,
      ended_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (error) {
    return { ok: false, error: 'Error al finalizar la sesión' };
  }

  return { ok: true };
}

// ─── Join Session ──────────────────────────────────────────

export async function joinSession(sessionId: string): Promise<{ ok: boolean; error?: string }> {
  // Obtener user id
  let userId: string;
  
  if (isTestMode()) {
    const testProfile = await getOrCreateTestUser();
    if (!testProfile) {
      return { ok: false, error: 'No se pudo obtener usuario' };
    }
    userId = testProfile.id;
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, error: 'Debes iniciar sesión' };
    }
    userId = user.id;
  }

  // Verificar si ya es miembro
  const { data: existing } = await supabase
    .from('ws_session_members')
    .select('id, left_at')
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    if (existing.left_at) {
      // Re-unirse
      await supabase
        .from('ws_session_members')
        .update({ left_at: null, joined_at: new Date().toISOString() })
        .eq('id', existing.id);
    }
    return { ok: true };
  }

  // Unirse como nuevo miembro
  const { error } = await supabase
    .from('ws_session_members')
    .insert({
      session_id: sessionId,
      user_id: userId,
      role: 'listener',
      is_seed: false,
    });

  if (error) {
    console.error('Error joining session:', error);
    return { ok: false, error: 'Error al unirse a la sesión' };
  }

  return { ok: true };
}

// ─── Leave Session ─────────────────────────────────────────

export async function leaveSession(sessionId: string): Promise<{ ok: boolean; error?: string }> {
  let userId: string;
  
  if (isTestMode()) {
    const testProfile = await getOrCreateTestUser();
    if (!testProfile) return { ok: false, error: 'No se pudo obtener usuario' };
    userId = testProfile.id;
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Debes iniciar sesión' };
    userId = user.id;
  }

  const { error } = await supabase
    .from('ws_session_members')
    .update({ left_at: new Date().toISOString() })
    .eq('session_id', sessionId)
    .eq('user_id', userId);

  if (error) {
    return { ok: false, error: 'Error al salir de la sesión' };
  }

  return { ok: true };
}

// ─── Get Active Sessions ───────────────────────────────────

export async function getActiveSessions(): Promise<Session[]> {
  const { data, error } = await supabase
    .from('ws_sessions')
    .select(`
      *,
      dj:ws_profiles!dj_id(display_name, dj_name, avatar_url),
      members:ws_session_members(id),
      songs:ws_songs(id)
    `)
    .eq('is_active', true)
    .order('started_at', { ascending: false });

  if (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }

  return data as Session[];
}

// ─── Get Session Details ───────────────────────────────────

export async function getSessionDetails(sessionId: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('ws_sessions')
    .select(`
      *,
      dj:ws_profiles!dj_id(display_name, dj_name, avatar_url, is_dj),
      members:ws_session_members(
        id, user_id, role, joined_at,
        user:ws_profiles!user_id(display_name, avatar_url)
      ),
      songs:ws_songs(
        id, title, artist, album_art, votes,
        requested_by:ws_profiles!requested_by(display_name)
      )
    `)
    .eq('id', sessionId)
    .single();

  if (error) {
    console.error('Error fetching session:', error);
    return null;
  }

  return data as Session;
}

// ─── Subscribe to Session ──────────────────────────────────

export function subscribeToSession(
  sessionId: string,
  callback: (session: Session) => void
): () => void {
  // Cargar inicial
  getSessionDetails(sessionId).then(session => {
    if (session) callback(session);
  });

  // Suscribirse a cambios
  const channel = supabase
    .channel(`session:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'ws_sessions',
        filter: `id=eq.${sessionId}`,
      },
      () => {
        getSessionDetails(sessionId).then(session => {
          if (session) callback(session);
        });
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'ws_session_members',
        filter: `session_id=eq.${sessionId}`,
      },
      () => {
        getSessionDetails(sessionId).then(session => {
          if (session) callback(session);
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

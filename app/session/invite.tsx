/**
 * WhatsSound — Invitación a Sesión
 * Conectado a Supabase - carga datos reales y permite unirse
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { supabase } from '../../src/lib/supabase';
import { joinSession } from '../../src/lib/sessions';

interface SessionData {
  id: string;
  name: string;
  genres: string[];
  dj?: { display_name: string; dj_name?: string };
  members?: { id: string }[];
  songs?: { id: string }[];
  now_playing?: { title: string; artist: string };
}

export default function InviteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId?: string }>();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    if (!params.sessionId) {
      setLoading(false);
      return;
    }

    (async () => {
      const { data, error } = await supabase
        .from('ws_sessions')
        .select(`
          id, name, genres,
          dj:ws_profiles!dj_id(display_name, dj_name),
          members:ws_session_members(id),
          songs:ws_songs(id)
        `)
        .eq('id', params.sessionId)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        // Get now playing
        const { data: nowPlaying } = await supabase
          .from('ws_songs')
          .select('title, artist')
          .eq('session_id', params.sessionId)
          .eq('status', 'playing')
          .single();

        setSession({
          ...data,
          now_playing: nowPlaying || undefined,
        } as SessionData);
      }
      setLoading(false);
    })();
  }, [params.sessionId]);

  const handleJoin = async () => {
    if (!params.sessionId) return;
    
    setJoining(true);
    const result = await joinSession(params.sessionId);
    setJoining(false);

    if (result.ok) {
      router.replace(`/session/${params.sessionId}` as any);
    }
  };

  if (loading) {
    return (
      <View style={[s.overlay, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!session) {
    return (
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => router.back()}>
        <View style={s.card}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={s.sessionName}>Sesión no encontrada</Text>
          <Text style={s.genre}>La sesión puede haber terminado</Text>
          <TouchableOpacity style={s.declineBtn} onPress={() => router.back()}>
            <Text style={s.declineText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  const djName = session.dj?.dj_name || session.dj?.display_name || 'DJ';
  const memberCount = session.members?.length || 0;
  const songCount = session.songs?.length || 0;
  const genres = session.genres?.join(' · ') || '';

  return (
    <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => router.back()}>
      <TouchableOpacity style={s.card} activeOpacity={1}>
        <View style={s.djAvatar}>
          <Ionicons name="headset" size={36} color="#fff" />
        </View>
        <Text style={s.inviteText}>{djName} te invita</Text>
        <Text style={s.sessionName}>{session.name}</Text>
        <Text style={s.genre}>{genres}</Text>

        <View style={s.statsRow}>
          <View style={s.stat}>
            <Ionicons name="people" size={16} color={colors.primary} />
            <Text style={s.statText}>{memberCount} personas</Text>
          </View>
          <View style={s.stat}>
            <Ionicons name="musical-notes" size={16} color={colors.primary} />
            <Text style={s.statText}>{songCount} canciones</Text>
          </View>
        </View>

        {session.now_playing && (
          <View style={s.nowPlaying}>
            <Ionicons name="play-circle" size={16} color={colors.primary} />
            <Text style={s.nowPlayingText} numberOfLines={1}>
              Sonando: {session.now_playing.title} — {session.now_playing.artist}
            </Text>
          </View>
        )}

        <View style={s.buttons}>
          <TouchableOpacity style={s.declineBtn} onPress={() => router.back()} disabled={joining}>
            <Text style={s.declineText}>Ahora no</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[s.joinBtn, joining && { opacity: 0.6 }]} 
            onPress={handleJoin}
            disabled={joining}
          >
            {joining ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="headset" size={16} color="#fff" />
                <Text style={s.joinText}>Unirme</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.xl, width: '100%', maxWidth: 340, alignItems: 'center', gap: spacing.sm },
  djAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  inviteText: { ...typography.bodySmall, color: colors.textSecondary, fontSize: 14 },
  sessionName: { ...typography.h2, color: colors.textPrimary, fontSize: 22, textAlign: 'center' },
  genre: { ...typography.caption, color: colors.textMuted, fontSize: 12 },
  statsRow: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.sm },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { ...typography.captionBold, color: colors.textSecondary, fontSize: 12 },
  nowPlaying: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primary + '10', padding: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.lg, marginTop: spacing.sm, maxWidth: '100%' },
  nowPlayingText: { ...typography.caption, color: colors.primary, fontSize: 12, flex: 1 },
  buttons: { flexDirection: 'row', gap: spacing.sm, width: '100%', marginTop: spacing.md },
  declineBtn: { flex: 1, backgroundColor: colors.surfaceLight, borderRadius: borderRadius.lg, paddingVertical: 14, alignItems: 'center' },
  declineText: { ...typography.button, color: colors.textMuted, fontSize: 14 },
  joinBtn: { flex: 1, backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: spacing.xs },
  joinText: { ...typography.button, color: '#fff', fontSize: 14 },
});

/**
 * WhatsSound — Favoritos / Guardados
 * Referencia: 32-favoritos.png
 * Canciones votadas, sesiones guardadas
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing, borderRadius } from '../src/theme/spacing';

const COLORS = ['#E91E63', '#00BCD4', '#FF9800', '#3F51B5', '#009688', '#9C27B0'];

const FAV_SONGS = [
  { title: 'Dakiti', artist: 'Bad Bunny, Jhay Cortez', session: 'Viernes Latino', votes: 24 },
  { title: 'Pepas', artist: 'Farruko', session: 'Reggaeton Mix', votes: 18 },
  { title: 'Titi Me Preguntó', artist: 'Bad Bunny', session: 'Viernes Latino', votes: 15 },
  { title: 'La Noche de Anoche', artist: 'Bad Bunny, Rosalía', session: 'Chill Sunday', votes: 12 },
  { title: 'Yonaguni', artist: 'Bad Bunny', session: 'Techno Nights', votes: 9 },
];

const SAVED_SESSIONS = [
  { name: 'Viernes Latino 🔥', dj: 'DJ Carlos Madrid', listeners: 47 },
  { name: 'Chill & Study Beats', dj: 'Luna DJ', listeners: 203 },
  { name: 'Deep House Sunset', dj: 'Sarah B', listeners: 128 },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'songs' | 'sessions'>('songs');

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Favoritos</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={s.tabs}>
        <TouchableOpacity style={[s.tab, tab === 'songs' && s.tabActive]} onPress={() => setTab('songs')}>
          <Text style={[s.tabText, tab === 'songs' && s.tabTextActive]}>🎵 Canciones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.tab, tab === 'sessions' && s.tabActive]} onPress={() => setTab('sessions')}>
          <Text style={[s.tabText, tab === 'sessions' && s.tabTextActive]}>📡 Sesiones</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.list}>
        {tab === 'songs' ? FAV_SONGS.map((song, i) => (
          <View key={i} style={s.songRow}>
            <View style={[s.albumArt, { backgroundColor: COLORS[i % COLORS.length] }]}>
              <Ionicons name="musical-notes" size={16} color="rgba(255,255,255,0.7)" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.songTitle}>{song.title}</Text>
              <Text style={s.songArtist}>{song.artist}</Text>
              <Text style={s.songSession}>En: {song.session}</Text>
            </View>
            <View style={s.votesRow}>
              <Ionicons name="heart" size={14} color={colors.error} />
              <Text style={s.votesText}>{song.votes}</Text>
            </View>
          </View>
        )) : SAVED_SESSIONS.map((session, i) => (
          <TouchableOpacity key={i} style={s.sessionCard}>
            <View style={s.sessionIcon}>
              <Ionicons name="radio" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.sessionName}>{session.name}</Text>
              <Text style={s.sessionDJ}>{session.dj}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.sessionListeners}>👥 {session.listeners}</Text>
              <View style={s.liveBadge}><Text style={s.liveText}>LIVE</Text></View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  headerTitle: { ...typography.h3, color: colors.textPrimary, fontSize: 18 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { ...typography.bodyBold, color: colors.textMuted, fontSize: 14 },
  tabTextActive: { color: colors.primary },
  list: { padding: spacing.base, paddingBottom: 40 },
  songRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border + '40' },
  albumArt: { width: 44, height: 44, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
  songTitle: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 15 },
  songArtist: { ...typography.caption, color: colors.textSecondary, fontSize: 12 },
  songSession: { ...typography.caption, color: colors.textMuted, fontSize: 11 },
  votesRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  votesText: { ...typography.captionBold, color: colors.textMuted, fontSize: 12 },
  sessionCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.base, marginBottom: spacing.sm },
  sessionIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  sessionName: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 15 },
  sessionDJ: { ...typography.caption, color: colors.textSecondary, fontSize: 12 },
  sessionListeners: { ...typography.caption, color: colors.textMuted, fontSize: 12 },
  liveBadge: { backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 4 },
  liveText: { ...typography.captionBold, color: '#fff', fontSize: 10 },
});

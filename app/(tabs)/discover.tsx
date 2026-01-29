/**
 * WhatsSound — Descubrir
 * DJs reales de Supabase + sesiones próximas + explorar géneros
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { Avatar } from '../../src/components/ui/Avatar';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Input } from '../../src/components/ui/Input';
import { supabase } from '../../src/lib/supabase';

interface DjProfile {
  id: string;
  display_name: string;
  username: string;
  genres: string[];
  is_dj: boolean;
  isReal: boolean;
  isFollowing?: boolean;
}

const MOCK_UPCOMING = [
  { id: '1', name: 'Sábado Urbano', dj: 'DJ Marcos', date: 'Sáb 1 Feb · 22:00', genre: 'Urban', attendees: 34 },
  { id: '2', name: 'Sunday Chill', dj: 'LoFi Girl', date: 'Dom 2 Feb · 17:00', genre: 'Lo-Fi', attendees: 18 },
  { id: '3', name: 'Latin Fever', dj: 'Carlos', date: 'Vie 7 Feb · 21:00', genre: 'Reggaeton', attendees: 56 },
];

const MOCK_DJS: DjProfile[] = [
  { id: 'm1', display_name: 'DJ Marcos', username: 'marcos', genres: ['Urban', 'Latin'], is_dj: true, isReal: false },
  { id: 'm2', display_name: 'MNML_Dave', username: 'mnml', genres: ['Techno'], is_dj: true, isReal: false },
  { id: 'm3', display_name: 'LoFi Girl', username: 'lofi', genres: ['Lo-Fi', 'Chill'], is_dj: true, isReal: false },
];

const GENRES = ['🎵 Reggaeton', '🎸 Rock', '🎹 Techno', '🎷 Jazz', '🎤 Pop', '📻 Lo-Fi', '🪗 Latina', '🥁 Hip Hop'];

export default function DiscoverScreen() {
  const router = useRouter();
  const [djs, setDjs] = useState<DjProfile[]>([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loadingDjs, setLoadingDjs] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const fetchDjs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, username, genres, is_dj')
      .eq('is_dj', true)
      .order('display_name');

    if (!error && data) {
      // Check which ones we follow
      let followedIds: string[] = [];
      if (user) {
        const { data: follows } = await supabase
          .from('followers')
          .select('dj_id')
          .eq('follower_id', user.id);
        followedIds = (follows || []).map((f: any) => f.dj_id);
      }
      setDjs(data.map((d: any) => ({ ...d, isReal: true, isFollowing: followedIds.includes(d.id) })));
    }
  };

  const toggleFollow = async (djId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const dj = djs.find(d => d.id === djId);
    if (!dj) return;

    if (dj.isFollowing) {
      await supabase.from('followers').delete().eq('follower_id', user.id).eq('dj_id', djId);
    } else {
      await supabase.from('followers').insert({ follower_id: user.id, dj_id: djId });
    }
    // Optimistic update
    setDjs(prev => prev.map(d => d.id === djId ? { ...d, isFollowing: !d.isFollowing } : d));
  };

  useEffect(() => { fetchDjs(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDjs();
    setRefreshing(false);
  };

  // Combine real + mock, real first
  const allDjs = [...djs, ...MOCK_DJS.filter(m => !djs.find(d => d.display_name === m.display_name))];
  const filtered = search
    ? allDjs.filter(d => d.display_name.toLowerCase().includes(search.toLowerCase()) ||
        d.genres?.some(g => g.toLowerCase().includes(search.toLowerCase())))
    : allDjs;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <Text style={styles.title}>Descubrir</Text>

      {/* Search */}
      <View style={styles.searchSection}>
        <Input
          placeholder="Buscar DJs, géneros, sesiones..."
          value={search}
          onChangeText={setSearch}
          icon="search"
        />
      </View>

      {/* Genres */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genreRow} contentContainerStyle={styles.genreContent}>
        {GENRES.map(g => (
          <TouchableOpacity key={g} style={styles.genreChip} onPress={() => setSearch(g.slice(2))}>
            <Text style={styles.genreText}>{g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Top DJs */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🎧 Top DJs</Text>
        <Text style={styles.sectionCount}>{allDjs.length} DJs</Text>
      </View>

      {filtered.map(dj => (
        <TouchableOpacity key={dj.id} style={styles.djItem} activeOpacity={0.7}>
          <Avatar name={dj.display_name} size="lg" />
          <View style={styles.djInfo}>
            <View style={styles.djNameRow}>
              <Text style={styles.djName}>{dj.display_name}</Text>
              {dj.isReal && <Badge text="REAL" variant="success" />}
            </View>
            <Text style={styles.djGenre}>{dj.genres?.join(' · ') || 'Varios'}</Text>
            <Text style={styles.djUsername}>@{dj.username}</Text>
          </View>
          <TouchableOpacity
            style={[styles.followBtn, dj.isFollowing && styles.followingBtn]}
            onPress={() => dj.isReal && toggleFollow(dj.id)}
          >
            <Text style={[styles.followText, dj.isFollowing && styles.followingText]}>
              {dj.isFollowing ? 'Siguiendo' : 'Seguir'}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}

      {/* Upcoming */}
      <View style={[styles.sectionHeader, { marginTop: spacing.xl }]}>
        <Text style={styles.sectionTitle}>📅 Próximas sesiones</Text>
      </View>

      {MOCK_UPCOMING.map(event => (
        <Card key={event.id} style={styles.eventCard}>
          <View style={styles.eventInfo}>
            <Text style={styles.eventName}>{event.name}</Text>
            <Text style={styles.eventDj}>{event.dj} · {event.genre}</Text>
            <View style={styles.eventMeta}>
              <Ionicons name="calendar" size={12} color={colors.textMuted} />
              <Text style={styles.eventDate}>{event.date}</Text>
              <Ionicons name="people" size={12} color={colors.textMuted} style={{ marginLeft: spacing.sm }} />
              <Text style={styles.eventDate}>{event.attendees} interesados</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifyBtn}>
            <Ionicons name="notifications-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing['3xl'] },
  title: { ...typography.h1, color: colors.textPrimary, paddingHorizontal: spacing.base, paddingTop: spacing.md },
  searchSection: { paddingHorizontal: spacing.base, marginTop: spacing.md },
  genreRow: { marginTop: spacing.md, marginBottom: spacing.sm },
  genreContent: { paddingHorizontal: spacing.base, gap: spacing.sm },
  genreChip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  genreText: { ...typography.bodySmall, color: colors.textSecondary },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
  },
  sectionTitle: { ...typography.h3, color: colors.textPrimary },
  sectionCount: { ...typography.caption, color: colors.textMuted },
  djItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.base, paddingVertical: spacing.sm,
    borderBottomWidth: 0.5, borderBottomColor: colors.divider,
  },
  djInfo: { flex: 1, gap: 2 },
  djNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  djName: { ...typography.bodyBold, color: colors.textPrimary },
  djGenre: { ...typography.caption, color: colors.textSecondary },
  djUsername: { ...typography.caption, color: colors.textMuted },
  followBtn: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.primary,
  },
  followText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  followingBtn: { backgroundColor: colors.primary, borderColor: colors.primary },
  followingText: { color: colors.textOnPrimary },
  eventCard: { marginHorizontal: spacing.base, marginBottom: spacing.sm, padding: spacing.base, flexDirection: 'row', alignItems: 'center' },
  eventInfo: { flex: 1, gap: 4 },
  eventName: { ...typography.bodyBold, color: colors.textPrimary },
  eventDj: { ...typography.caption, color: colors.textSecondary },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  eventDate: { ...typography.caption, color: colors.textMuted },
  notifyBtn: { padding: spacing.sm },
});

/**
 * WhatsSound — Búsqueda Global
 * Buscar chats, grupos, DJs, sesiones, canciones
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing, borderRadius } from '../src/theme/spacing';
import { Avatar } from '../src/components/ui/Avatar';

const RECENT = ['Viernes Latino', 'DJ Marcos', 'Gasolina', 'Laura'];

const RESULTS = {
  chats: [
    { id: 'c1', name: 'Laura', type: 'person', subtitle: 'Último: Nos vemos a las 9!' },
    { id: 'c2', name: 'Viernes Latino 🔥', type: 'group', subtitle: '47 miembros · Sesión activa' },
  ],
  djs: [
    { id: 'd1', name: 'DJ Marcos', subtitle: 'Urban/Latin · 234 sesiones · ⭐ 4.8', verified: true },
  ],
  sessions: [
    { id: 's1', name: 'Techno Night', subtitle: 'MNML_Dave · 128 escuchando', live: true },
  ],
  songs: [
    { id: 'so1', name: 'Gasolina', subtitle: 'Daddy Yankee · Barrio Fino' },
    { id: 'so2', name: 'Gas Pedal', subtitle: 'Sage the Gemini' },
  ],
};

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const hasQuery = query.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* Search header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar chats, DJs, canciones..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {hasQuery && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!hasQuery ? (
          /* Recent searches */
          <>
            <Text style={styles.sectionTitle}>BÚSQUEDAS RECIENTES</Text>
            {RECENT.map(term => (
              <TouchableOpacity key={term} style={styles.recentItem} onPress={() => setQuery(term)}>
                <Ionicons name="time-outline" size={18} color={colors.textMuted} />
                <Text style={styles.recentText}>{term}</Text>
                <TouchableOpacity>
                  <Ionicons name="close" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            <Text style={styles.sectionTitle}>SUGERENCIAS</Text>
            <View style={styles.suggestionsRow}>
              {['Reggaeton', 'En vivo', 'DJs cerca', 'Nuevos grupos'].map(s => (
                <TouchableOpacity key={s} style={styles.suggestionChip}>
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          /* Search results */
          <>
            <Text style={styles.sectionTitle}>CHATS</Text>
            {RESULTS.chats.map(r => (
              <TouchableOpacity key={r.id} style={styles.resultItem}>
                <Avatar name={r.name} size="md" />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{r.name}</Text>
                  <Text style={styles.resultSub}>{r.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>DJS</Text>
            {RESULTS.djs.map(r => (
              <TouchableOpacity key={r.id} style={styles.resultItem}>
                <Avatar name={r.name} size="md" />
                <View style={styles.resultInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.resultName}>{r.name}</Text>
                    {r.verified && <Ionicons name="checkmark-circle" size={14} color={colors.primary} />}
                  </View>
                  <Text style={styles.resultSub}>{r.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>SESIONES EN VIVO</Text>
            {RESULTS.sessions.map(r => (
              <TouchableOpacity key={r.id} style={styles.resultItem}>
                <View style={styles.liveIcon}>
                  <Ionicons name="radio" size={20} color={colors.error} />
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{r.name}</Text>
                  <Text style={styles.resultSub}>{r.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>CANCIONES</Text>
            {RESULTS.songs.map(r => (
              <TouchableOpacity key={r.id} style={styles.resultItem}>
                <View style={styles.songIcon}>
                  <Ionicons name="musical-note" size={18} color={colors.primary} />
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{r.name}</Text>
                  <Text style={styles.resultSub}>{r.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.base, paddingVertical: spacing.sm,
  },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md, height: 40,
  },
  searchInput: { flex: 1, ...typography.body, color: colors.textPrimary },
  content: { paddingHorizontal: spacing.base, paddingBottom: spacing['3xl'] },
  sectionTitle: { ...typography.captionBold, color: colors.textMuted, letterSpacing: 0.5, marginTop: spacing.lg, marginBottom: spacing.sm },
  recentItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  recentText: { ...typography.body, color: colors.textPrimary, flex: 1 },
  suggestionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  suggestionChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.surface, borderRadius: borderRadius.full },
  suggestionText: { ...typography.bodySmall, color: colors.textPrimary },
  resultItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.divider,
  },
  resultInfo: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  resultName: { ...typography.bodyBold, color: colors.textPrimary },
  resultSub: { ...typography.caption, color: colors.textMuted },
  liveIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.error + '20', alignItems: 'center', justifyContent: 'center' },
  songIcon: { width: 40, height: 40, borderRadius: borderRadius.md, backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center' },
});

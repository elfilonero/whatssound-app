/**
 * WhatsSound — Perfil DJ Público
 * Stats, sesiones recientes, géneros, seguir
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { Avatar } from '../../src/components/ui/Avatar';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [following, setFollowing] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header gradient placeholder */}
      <View style={styles.headerBg}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Profile info */}
      <View style={styles.profileSection}>
        <Avatar name="DJ Marcos" size="xl" />
        <View style={styles.nameRow}>
          <Text style={styles.name}>DJ Marcos</Text>
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
        </View>
        <Text style={styles.bio}>Reggaeton, Latin & Urban vibes 🔥 | Viernes y sábados</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>234</Text>
            <Text style={styles.statLabel}>Sesiones</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>4.8 ⭐</Text>
            <Text style={styles.statLabel}>Valoración</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>12K</Text>
            <Text style={styles.statLabel}>Oyentes</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <Button
            title={following ? 'Siguiendo' : 'Seguir'}
            onPress={() => setFollowing(!following)}
            variant={following ? 'secondary' : 'primary'}
            size="md"
          />
          <Button title="Propina" onPress={() => {}} variant="secondary" size="md" icon={<Ionicons name="cash-outline" size={18} color={colors.primary} />} />
        </View>
      </View>

      {/* Live now */}
      <Card style={styles.liveCard}>
        <View style={styles.liveHeader}>
          <Badge text="EN VIVO AHORA" variant="live" dot />
        </View>
        <Text style={styles.liveSession}>Viernes Latino 🔥</Text>
        <Text style={styles.liveInfo}>47 oyentes · Reggaeton</Text>
        <Button title="Unirse" onPress={() => router.push('/session/1')} size="sm" />
      </Card>

      {/* Genres */}
      <Text style={styles.sectionTitle}>GÉNEROS</Text>
      <View style={styles.genresRow}>
        {['Reggaeton', 'Latin', 'Urban', 'Dancehall'].map(g => (
          <Badge key={g} text={g} variant="primary" />
        ))}
      </View>

      {/* Recent sessions */}
      <Text style={styles.sectionTitle}>SESIONES RECIENTES</Text>
      {[
        { name: 'Viernes Latino 🔥', date: 'Hoy · 2h 15m', listeners: 47 },
        { name: 'Sábado Urbano', date: 'Ayer · 3h 20m', listeners: 62 },
        { name: 'Latin Classics', date: 'Dom · 1h 45m', listeners: 28 },
      ].map((s, i) => (
        <Card key={i} style={styles.sessionCard}>
          <Text style={styles.sessionCardName}>{s.name}</Text>
          <Text style={styles.sessionCardInfo}>{s.date} · {s.listeners} oyentes</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing['3xl'] },
  headerBg: { height: 120, backgroundColor: colors.primary + '30', justifyContent: 'flex-end' },
  backBtn: { position: 'absolute', top: spacing.base, left: spacing.base, padding: spacing.xs, backgroundColor: colors.background + '80', borderRadius: borderRadius.full },
  profileSection: { alignItems: 'center', paddingHorizontal: spacing.xl, marginTop: -40, gap: spacing.sm },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  name: { ...typography.h1, color: colors.textPrimary },
  bio: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl, marginVertical: spacing.lg, paddingVertical: spacing.md, paddingHorizontal: spacing.xl, backgroundColor: colors.surface, borderRadius: borderRadius.xl },
  stat: { alignItems: 'center' },
  statNumber: { ...typography.h3, color: colors.textPrimary },
  statLabel: { ...typography.caption, color: colors.textMuted },
  statDivider: { width: 1, height: 30, backgroundColor: colors.border },
  actionsRow: { flexDirection: 'row', gap: spacing.sm },
  liveCard: { marginHorizontal: spacing.base, marginTop: spacing.lg, padding: spacing.base, gap: spacing.sm },
  liveHeader: { flexDirection: 'row' },
  liveSession: { ...typography.h3, color: colors.textPrimary },
  liveInfo: { ...typography.bodySmall, color: colors.textSecondary },
  sectionTitle: { ...typography.captionBold, color: colors.textMuted, letterSpacing: 0.5, paddingHorizontal: spacing.base, marginTop: spacing.xl, marginBottom: spacing.sm },
  genresRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.base },
  sessionCard: { marginHorizontal: spacing.base, marginBottom: spacing.sm, padding: spacing.md },
  sessionCardName: { ...typography.bodyBold, color: colors.textPrimary },
  sessionCardInfo: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
});

/**
 * WhatsSound — Estadísticas Post-Sesión (DJ)
 * Resumen completo de la sesión terminada para el DJ
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';

export default function SessionStatsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Resumen de sesión</Text>
      <Text style={styles.subtitle}>Viernes Latino 🔥 · Terminada</Text>

      {/* Big stats */}
      <View style={styles.bigStats}>
        <Card style={styles.bigStat}>
          <Ionicons name="people" size={28} color={colors.primary} />
          <Text style={styles.bigNum}>47</Text>
          <Text style={styles.bigLabel}>Oyentes totales</Text>
        </Card>
        <Card style={styles.bigStat}>
          <Ionicons name="time" size={28} color={colors.accent} />
          <Text style={styles.bigNum}>2h 15m</Text>
          <Text style={styles.bigLabel}>Duración</Text>
        </Card>
      </View>

      {/* Detailed stats */}
      <Card style={styles.detailCard}>
        <Text style={styles.sectionLabel}>MÚSICA</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Canciones reproducidas</Text>
          <Text style={styles.detailValue}>24</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Canciones pedidas</Text>
          <Text style={styles.detailValue}>18</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Votos totales</Text>
          <Text style={styles.detailValue}>156</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Canción más votada</Text>
          <Text style={[styles.detailValue, { color: colors.primary }]}>Gasolina (12 votos)</Text>
        </View>
      </Card>

      <Card style={styles.detailCard}>
        <Text style={styles.sectionLabel}>AUDIENCIA</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Pico de oyentes</Text>
          <Text style={styles.detailValue}>47</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Media de oyentes</Text>
          <Text style={styles.detailValue}>32</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mensajes en chat</Text>
          <Text style={styles.detailValue}>89</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Nuevos seguidores</Text>
          <Text style={[styles.detailValue, { color: colors.primary }]}>+8</Text>
        </View>
      </Card>

      <Card style={styles.detailCard}>
        <Text style={styles.sectionLabel}>PROPINAS</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total recibido</Text>
          <Text style={[styles.detailValue, styles.highlight]}>€23</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Propinas recibidas</Text>
          <Text style={styles.detailValue}>7</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Propina media</Text>
          <Text style={styles.detailValue}>€3.28</Text>
        </View>
      </Card>

      {/* Valoración media */}
      <Card style={styles.ratingCard}>
        <Text style={styles.sectionLabel}>VALORACIÓN</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingNum}>4.7</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(s => (
              <Ionicons key={s} name={s <= 4 ? 'star' : 'star-half'} size={20} color={colors.warning} />
            ))}
          </View>
          <Text style={styles.ratingCount}>23 valoraciones</Text>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button title="Compartir resumen" onPress={() => {}} fullWidth icon={<Ionicons name="share-outline" size={20} color={colors.textOnPrimary} />} />
        <Button title="Volver al inicio" onPress={() => router.replace('/')} variant="secondary" fullWidth />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.base, paddingBottom: spacing['3xl'] },
  title: { ...typography.h1, color: colors.textPrimary, textAlign: 'center', marginTop: spacing.xl },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  bigStats: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  bigStat: { flex: 1, alignItems: 'center', padding: spacing.xl, gap: spacing.sm },
  bigNum: { ...typography.h1, color: colors.textPrimary, fontSize: 36 },
  bigLabel: { ...typography.caption, color: colors.textMuted },
  detailCard: { marginBottom: spacing.sm, padding: spacing.base },
  sectionLabel: { ...typography.captionBold, color: colors.textMuted, letterSpacing: 0.5, marginBottom: spacing.md },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.divider },
  detailLabel: { ...typography.body, color: colors.textSecondary },
  detailValue: { ...typography.bodyBold, color: colors.textPrimary },
  highlight: { color: colors.primary, fontSize: 18 },
  ratingCard: { marginBottom: spacing.xl, padding: spacing.base },
  ratingRow: { alignItems: 'center', gap: spacing.sm },
  ratingNum: { ...typography.h1, color: colors.textPrimary, fontSize: 48 },
  starsRow: { flexDirection: 'row', gap: 4 },
  ratingCount: { ...typography.caption, color: colors.textMuted },
  actions: { gap: spacing.sm },
});

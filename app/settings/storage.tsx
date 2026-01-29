/**
 * WhatsSound — Almacenamiento y Caché
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';

const STORAGE_ITEMS = [
  { label: 'Audio en caché', size: '24.3 MB', icon: 'musical-note', color: colors.primary, pct: 58 },
  { label: 'Imágenes', size: '8.1 MB', icon: 'image', color: colors.accent, pct: 19 },
  { label: 'Datos de sesiones', size: '6.2 MB', icon: 'radio', color: colors.warning, pct: 15 },
  { label: 'Otros', size: '3.4 MB', icon: 'folder', color: colors.textMuted, pct: 8 },
];

export default function StorageScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Almacenamiento</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Total usage */}
      <View style={styles.totalCard}>
        <Text style={styles.totalSize}>42 MB</Text>
        <Text style={styles.totalLabel}>Espacio utilizado</Text>
        {/* Bar chart */}
        <View style={styles.barContainer}>
          {STORAGE_ITEMS.map(item => (
            <View key={item.label} style={[styles.barSegment, { flex: item.pct, backgroundColor: item.color }]} />
          ))}
        </View>
      </View>

      {/* Breakdown */}
      <Text style={styles.sectionLabel}>DESGLOSE</Text>
      <View style={styles.section}>
        {STORAGE_ITEMS.map((item, i) => (
          <View key={item.label} style={[styles.row, i < STORAGE_ITEMS.length - 1 && styles.rowBorder]}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <Ionicons name={item.icon as any} size={20} color={item.color} />
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Text style={styles.rowSize}>{item.size}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <Text style={styles.sectionLabel}>ACCIONES</Text>
      <View style={styles.actionsSection}>
        <Button title="Limpiar caché de audio" onPress={() => {}} variant="secondary" fullWidth icon={<Ionicons name="trash-outline" size={18} color={colors.primary} />} />
        <Button title="Limpiar imágenes en caché" onPress={() => {}} variant="secondary" fullWidth icon={<Ionicons name="image-outline" size={18} color={colors.primary} />} />
        <Button title="Borrar todos los datos locales" onPress={() => {}} variant="danger" fullWidth icon={<Ionicons name="warning-outline" size={18} color={colors.error} />} />
      </View>

      <Text style={styles.disclaimer}>
        Limpiar la caché no afecta a tus datos en la nube. Los datos se descargarán de nuevo cuando los necesites.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing['3xl'] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  totalCard: { alignItems: 'center', backgroundColor: colors.surface, marginHorizontal: spacing.base, borderRadius: borderRadius.xl, padding: spacing.xl, gap: spacing.sm },
  totalSize: { ...typography.h1, color: colors.textPrimary, fontSize: 48 },
  totalLabel: { ...typography.body, color: colors.textMuted },
  barContainer: { flexDirection: 'row', width: '100%', height: 8, borderRadius: 4, overflow: 'hidden', marginTop: spacing.sm, gap: 2 },
  barSegment: { borderRadius: 4 },
  sectionLabel: { ...typography.captionBold, color: colors.textMuted, letterSpacing: 0.5, paddingHorizontal: spacing.base, marginTop: spacing.lg, marginBottom: spacing.sm },
  section: { backgroundColor: colors.surface, marginHorizontal: spacing.base, borderRadius: borderRadius.xl, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: colors.divider },
  colorDot: { width: 8, height: 8, borderRadius: 4 },
  rowLabel: { ...typography.body, color: colors.textPrimary, flex: 1 },
  rowSize: { ...typography.bodyBold, color: colors.textSecondary },
  actionsSection: { paddingHorizontal: spacing.base, gap: spacing.sm },
  disclaimer: { ...typography.caption, color: colors.textMuted, textAlign: 'center', paddingHorizontal: spacing.xl, marginTop: spacing.lg, lineHeight: 18 },
});

/**
 * WhatsSound — Config Audio
 * Calidad streaming, auto-play, efectos
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';

const QUALITY_OPTIONS = [
  { id: 'low', label: 'Baja', subtitle: '96 kbps · Menos datos', icon: 'cellular-outline' },
  { id: 'normal', label: 'Normal', subtitle: '160 kbps · Recomendado', icon: 'cellular' },
  { id: 'high', label: 'Alta', subtitle: '320 kbps · Mejor sonido', icon: 'pulse' },
];

export default function AudioScreen() {
  const router = useRouter();
  const [quality, setQuality] = useState('normal');
  const [autoPlay, setAutoPlay] = useState(true);
  const [crossfade, setCrossfade] = useState(true);
  const [normalizeVolume, setNormalizeVolume] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Audio</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.sectionLabel}>CALIDAD DE STREAMING</Text>
      <View style={styles.section}>
        {QUALITY_OPTIONS.map((opt, i) => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.qualityRow, i < QUALITY_OPTIONS.length - 1 && styles.rowBorder]}
            onPress={() => setQuality(opt.id)}
          >
            <Ionicons name={opt.icon as any} size={20} color={quality === opt.id ? colors.primary : colors.textSecondary} />
            <View style={styles.qualityInfo}>
              <Text style={[styles.qualityTitle, quality === opt.id && { color: colors.primary }]}>{opt.label}</Text>
              <Text style={styles.qualitySub}>{opt.subtitle}</Text>
            </View>
            {quality === opt.id && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>REPRODUCCIÓN</Text>
      <View style={styles.section}>
        <View style={styles.toggleRow}>
          <Ionicons name="play-circle" size={20} color={colors.textSecondary} />
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Auto-play</Text>
            <Text style={styles.toggleSub}>Reproducir automáticamente al unirse a sesión</Text>
          </View>
          <Switch value={autoPlay} onValueChange={setAutoPlay} trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }} thumbColor={autoPlay ? colors.primary : colors.textMuted} />
        </View>
        <View style={[styles.toggleRow, styles.rowBorder]} />
        <View style={styles.toggleRow}>
          <Ionicons name="swap-horizontal" size={20} color={colors.textSecondary} />
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Crossfade</Text>
            <Text style={styles.toggleSub}>Transición suave entre canciones (3s)</Text>
          </View>
          <Switch value={crossfade} onValueChange={setCrossfade} trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }} thumbColor={crossfade ? colors.primary : colors.textMuted} />
        </View>
        <View style={styles.toggleRow}>
          <Ionicons name="volume-medium" size={20} color={colors.textSecondary} />
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Normalizar volumen</Text>
            <Text style={styles.toggleSub}>Igualar volumen entre canciones</Text>
          </View>
          <Switch value={normalizeVolume} onValueChange={setNormalizeVolume} trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }} thumbColor={normalizeVolume ? colors.primary : colors.textMuted} />
        </View>
      </View>

      <Text style={styles.sectionLabel}>DATOS</Text>
      <View style={styles.section}>
        <View style={styles.toggleRow}>
          <Ionicons name="wifi" size={20} color={colors.textSecondary} />
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Solo Wi-Fi</Text>
            <Text style={styles.toggleSub}>No usar datos móviles para streaming</Text>
          </View>
          <Switch value={wifiOnly} onValueChange={setWifiOnly} trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }} thumbColor={wifiOnly ? colors.primary : colors.textMuted} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing['3xl'] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  sectionLabel: { ...typography.captionBold, color: colors.textMuted, letterSpacing: 0.5, paddingHorizontal: spacing.base, marginTop: spacing.lg, marginBottom: spacing.sm },
  section: { backgroundColor: colors.surface, marginHorizontal: spacing.base, borderRadius: borderRadius.xl, overflow: 'hidden' },
  qualityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: colors.divider },
  qualityInfo: { flex: 1, gap: 1 },
  qualityTitle: { ...typography.body, color: colors.textPrimary },
  qualitySub: { ...typography.caption, color: colors.textMuted },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  toggleInfo: { flex: 1, gap: 1 },
  toggleTitle: { ...typography.body, color: colors.textPrimary },
  toggleSub: { ...typography.caption, color: colors.textMuted },
});

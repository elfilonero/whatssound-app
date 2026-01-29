/**
 * WhatsSound — Apariencia
 * Tema, tamaño de texto, fondo de chat
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';

const THEMES = [
  { id: 'dark', label: 'Oscuro', icon: 'moon', color: '#1A1D21', active: true },
  { id: 'light', label: 'Claro', icon: 'sunny', color: '#F5F5F5', active: false },
  { id: 'amoled', label: 'AMOLED', icon: 'contrast', color: '#000000', active: false },
  { id: 'system', label: 'Sistema', icon: 'phone-portrait', color: colors.surface, active: false },
];

const FONT_SIZES = ['Pequeño', 'Normal', 'Grande'];

const CHAT_WALLPAPERS = [
  { id: 'default', color: colors.background },
  { id: 'dark-blue', color: '#0D1B2A' },
  { id: 'dark-green', color: '#0D2818' },
  { id: 'dark-purple', color: '#1A0D2B' },
  { id: 'dark-red', color: '#2B0D0D' },
  { id: 'midnight', color: '#0A0A1A' },
];

export default function AppearanceScreen() {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(1);
  const [selectedWallpaper, setSelectedWallpaper] = useState('default');
  const [bubbleCorners, setBubbleCorners] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apariencia</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.sectionLabel}>TEMA</Text>
      <View style={styles.themeGrid}>
        {THEMES.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[styles.themeCard, selectedTheme === t.id && styles.themeCardActive]}
            onPress={() => setSelectedTheme(t.id)}
          >
            <View style={[styles.themePreview, { backgroundColor: t.color }]}>
              <Ionicons name={t.icon as any} size={24} color={selectedTheme === t.id ? colors.primary : colors.textMuted} />
            </View>
            <Text style={[styles.themeLabel, selectedTheme === t.id && { color: colors.primary }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>TAMAÑO DE TEXTO</Text>
      <View style={styles.fontSection}>
        <Text style={styles.fontPreview}>Aa</Text>
        <View style={styles.fontSlider}>
          {FONT_SIZES.map((s, i) => (
            <TouchableOpacity key={s} style={styles.fontOption} onPress={() => setFontSize(i)}>
              <View style={[styles.fontDot, fontSize === i && styles.fontDotActive]} />
              <Text style={[styles.fontLabel, fontSize === i && { color: colors.primary }]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.sectionLabel}>FONDO DE CHAT</Text>
      <View style={styles.wallpaperGrid}>
        {CHAT_WALLPAPERS.map(w => (
          <TouchableOpacity
            key={w.id}
            style={[styles.wallpaperItem, { backgroundColor: w.color }, selectedWallpaper === w.id && styles.wallpaperActive]}
            onPress={() => setSelectedWallpaper(w.id)}
          >
            {selectedWallpaper === w.id && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>OPCIONES</Text>
      <View style={styles.optionCard}>
        <View style={styles.optionRow}>
          <Ionicons name="chatbubble" size={20} color={colors.textSecondary} />
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Burbujas redondeadas</Text>
            <Text style={styles.optionSub}>Esquinas redondeadas en mensajes</Text>
          </View>
          <Switch
            value={bubbleCorners}
            onValueChange={setBubbleCorners}
            trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }}
            thumbColor={bubbleCorners ? colors.primary : colors.textMuted}
          />
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
  themeGrid: { flexDirection: 'row', paddingHorizontal: spacing.base, gap: spacing.sm },
  themeCard: { flex: 1, alignItems: 'center', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.xl, borderWidth: 2, borderColor: 'transparent' },
  themeCardActive: { borderColor: colors.primary },
  themePreview: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  themeLabel: { ...typography.caption, color: colors.textSecondary },
  fontSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.base, gap: spacing.lg, backgroundColor: colors.surface, marginHorizontal: spacing.base, borderRadius: borderRadius.xl, padding: spacing.base },
  fontPreview: { ...typography.h1, color: colors.textPrimary, fontSize: 32 },
  fontSlider: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  fontOption: { alignItems: 'center', gap: spacing.xs },
  fontDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.surfaceLight },
  fontDotActive: { backgroundColor: colors.primary, width: 16, height: 16, borderRadius: 8 },
  fontLabel: { ...typography.caption, color: colors.textMuted },
  wallpaperGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.base, gap: spacing.sm },
  wallpaperItem: { width: 56, height: 56, borderRadius: borderRadius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.divider },
  wallpaperActive: { borderColor: colors.primary, borderWidth: 2 },
  optionCard: { backgroundColor: colors.surface, marginHorizontal: spacing.base, borderRadius: borderRadius.xl, overflow: 'hidden' },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  optionInfo: { flex: 1, gap: 1 },
  optionTitle: { ...typography.body, color: colors.textPrimary },
  optionSub: { ...typography.caption, color: colors.textMuted },
});

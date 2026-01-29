/**
 * WhatsSound — Privacidad
 * Config de quién puede verte, última conexión, etc.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';

interface PrivacyOption {
  title: string;
  value: string;
  icon: string;
}

const OPTIONS: PrivacyOption[] = [
  { title: 'Última conexión', value: 'Todos', icon: 'time-outline' },
  { title: 'Foto de perfil', value: 'Mis contactos', icon: 'image-outline' },
  { title: 'Info / Bio', value: 'Todos', icon: 'information-circle-outline' },
  { title: 'Estado', value: 'Mis contactos', icon: 'ellipse-outline' },
  { title: 'Grupos', value: 'Todos', icon: 'people-outline' },
  { title: 'Sesiones en vivo', value: 'Todos', icon: 'radio-outline' },
];

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacidad</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.sectionLabel}>QUIÉN PUEDE VER MI...</Text>
      <View style={styles.section}>
        {OPTIONS.map((opt, i) => (
          <TouchableOpacity key={opt.title} style={[styles.row, i < OPTIONS.length - 1 && styles.rowBorder]}>
            <Ionicons name={opt.icon as any} size={20} color={colors.textSecondary} />
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>{opt.title}</Text>
              <Text style={styles.rowValue}>{opt.value}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>BLOQUEO</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="ban-outline" size={20} color={colors.textSecondary} />
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Contactos bloqueados</Text>
            <Text style={styles.rowValue}>0</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>SEGURIDAD</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="finger-print-outline" size={20} color={colors.textSecondary} />
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Bloqueo de app</Text>
            <Text style={styles.rowValue}>Desactivado</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]}>
          <Ionicons name="key-outline" size={20} color={colors.textSecondary} />
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Verificación en 2 pasos</Text>
            <Text style={styles.rowValue}>Desactivada</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing['3xl'] },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
  },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  sectionLabel: { ...typography.captionBold, color: colors.textMuted, letterSpacing: 0.5, paddingHorizontal: spacing.base, marginTop: spacing.lg, marginBottom: spacing.sm },
  section: { backgroundColor: colors.surface, marginHorizontal: spacing.base, borderRadius: borderRadius.xl, overflow: 'hidden' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
  },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: colors.divider },
  rowInfo: { flex: 1, gap: 1 },
  rowTitle: { ...typography.body, color: colors.textPrimary },
  rowValue: { ...typography.caption, color: colors.textMuted },
});

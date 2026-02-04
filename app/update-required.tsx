/**
 * WhatsSound — Actualización Requerida
 * Referencia: 35-update-required.png
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing, borderRadius } from '../src/theme/spacing';

export default function UpdateRequiredScreen() {
  return (
    <View style={s.container}>
      <View style={s.iconWrap}>
        <Ionicons name="arrow-up-circle" size={64} color={colors.primary} />
      </View>
      <Text style={s.title}>Actualización disponible</Text>
      <Text style={s.version}>Versión 2.1.0</Text>
      <Text style={s.subtitle}>Hay una nueva versión de WhatsSound con mejoras importantes. Actualiza para seguir usando la app.</Text>
      <View style={s.features}>
        <Text style={s.feature}>✨ Nuevo sistema de decibelios</Text>
        <Text style={s.feature}>🎧 Mejoras en el reproductor</Text>
        <Text style={s.feature}>🐛 Corrección de errores</Text>
      </View>
      <TouchableOpacity style={s.updateBtn}>
        <Text style={s.updateText}>Actualizar ahora</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  iconWrap: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  title: { ...typography.h2, color: colors.textPrimary, fontSize: 22, marginBottom: spacing.xs },
  version: { ...typography.captionBold, color: colors.primary, fontSize: 13, marginBottom: spacing.md },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', fontSize: 15, lineHeight: 22, marginBottom: spacing.lg },
  features: { gap: spacing.sm, marginBottom: spacing.xl, alignSelf: 'stretch', paddingHorizontal: spacing.xl },
  feature: { ...typography.bodySmall, color: colors.textPrimary, fontSize: 14 },
  updateBtn: { backgroundColor: colors.primary, paddingHorizontal: 40, paddingVertical: 16, borderRadius: borderRadius.lg },
  updateText: { ...typography.button, color: '#fff', fontSize: 16 },
});

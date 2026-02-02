/**
 * WhatsSound — Error / Sin Conexión
 * Referencia: 34-error-offline.png
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing, borderRadius } from '../src/theme/spacing';

export default function OfflineScreen() {
  return (
    <View style={s.container}>
      <View style={s.iconWrap}>
        <Ionicons name="cloud-offline" size={64} color={colors.textMuted} />
      </View>
      <Text style={s.title}>Sin conexión</Text>
      <Text style={s.subtitle}>No podemos conectar con el servidor.{'\n'}Comprueba tu conexión a Internet.</Text>
      <TouchableOpacity style={s.retryBtn}>
        <Ionicons name="refresh" size={18} color="#fff" />
        <Text style={s.retryText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  iconWrap: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  title: { ...typography.h2, color: colors.textPrimary, fontSize: 22, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', fontSize: 15, lineHeight: 22, marginBottom: spacing.xl },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primary, paddingHorizontal: 28, paddingVertical: 14, borderRadius: borderRadius.lg },
  retryText: { ...typography.button, color: '#fff', fontSize: 15 },
});

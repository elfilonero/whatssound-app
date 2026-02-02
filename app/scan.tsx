/**
 * WhatsSound — Escanear QR
 * Referencia: 24-escanear-qr.png
 * Camera view con scanner overlay
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing, borderRadius } from '../src/theme/spacing';

export default function ScanScreen() {
  const router = useRouter();

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Escanear QR</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Camera placeholder */}
      <View style={s.cameraArea}>
        {/* Scanner frame */}
        <View style={s.scanFrame}>
          <View style={[s.corner, s.topLeft]} />
          <View style={[s.corner, s.topRight]} />
          <View style={[s.corner, s.bottomLeft]} />
          <View style={[s.corner, s.bottomRight]} />
        </View>
        <Ionicons name="qr-code" size={48} color="rgba(255,255,255,0.15)" style={{ position: 'absolute' }} />
      </View>

      <Text style={s.hint}>Apunta al código QR de la sesión</Text>

      {/* Manual code */}
      <TouchableOpacity style={s.manualBtn}>
        <Ionicons name="keypad" size={18} color={colors.primary} />
        <Text style={s.manualText}>Introducir código manual</Text>
      </TouchableOpacity>

      {/* Flash toggle */}
      <TouchableOpacity style={s.flashBtn}>
        <Ionicons name="flash" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: spacing.md, paddingTop: spacing.xl },
  headerTitle: { ...typography.h3, color: '#fff', fontSize: 18 },
  cameraArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scanFrame: { width: 240, height: 240, position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: colors.primary, borderWidth: 3 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  hint: { ...typography.body, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: spacing.lg, fontSize: 15 },
  manualBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.xl, paddingVertical: spacing.md },
  manualText: { ...typography.bodySmall, color: colors.primary, fontSize: 14 },
  flashBtn: { alignSelf: 'center', width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
});

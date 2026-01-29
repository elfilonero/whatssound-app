/**
 * WhatsSound — Términos y Condiciones / Política de Privacidad
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';

const TABS = ['Términos', 'Privacidad'];

export default function TermsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        {TABS.map((t, i) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === i && styles.tabActive]} onPress={() => setTab(i)}>
            <Text style={[styles.tabText, tab === i && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tab === 0 ? (
          <>
            <Text style={styles.title}>Términos y Condiciones</Text>
            <Text style={styles.updated}>Última actualización: 29 enero 2026</Text>
            <Text style={styles.heading}>1. Aceptación</Text>
            <Text style={styles.body}>Al utilizar WhatsSound aceptas estos términos. Si no estás de acuerdo, no uses la aplicación.</Text>
            <Text style={styles.heading}>2. Uso del servicio</Text>
            <Text style={styles.body}>WhatsSound permite crear y participar en sesiones de música colaborativa. No debes usar el servicio para actividades ilegales, spam o acoso.</Text>
            <Text style={styles.heading}>3. Contenido musical</Text>
            <Text style={styles.body}>La música se reproduce a través de servicios de streaming autorizados. WhatsSound no almacena ni distribuye contenido musical.</Text>
            <Text style={styles.heading}>4. Propinas</Text>
            <Text style={styles.body}>Las propinas son voluntarias y no reembolsables. WhatsSound cobra una comisión del servicio sobre las propinas procesadas.</Text>
            <Text style={styles.heading}>5. Cuenta</Text>
            <Text style={styles.body}>Eres responsable de mantener la seguridad de tu cuenta. No compartas tus credenciales.</Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>Política de Privacidad</Text>
            <Text style={styles.updated}>Última actualización: 29 enero 2026</Text>
            <Text style={styles.heading}>1. Datos que recopilamos</Text>
            <Text style={styles.body}>Número de teléfono, nombre, foto de perfil, actividad en sesiones (canciones pedidas, votos) y mensajes de chat.</Text>
            <Text style={styles.heading}>2. Cómo usamos tus datos</Text>
            <Text style={styles.body}>Para proporcionar el servicio, personalizar tu experiencia, y mejorar la aplicación. No vendemos datos a terceros.</Text>
            <Text style={styles.heading}>3. Almacenamiento</Text>
            <Text style={styles.body}>Tus datos se almacenan de forma segura en servidores en la Unión Europea.</Text>
            <Text style={styles.heading}>4. Tus derechos</Text>
            <Text style={styles.body}>Puedes solicitar acceso, corrección o eliminación de tus datos en cualquier momento desde Ajustes.</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.base, gap: spacing.sm, marginBottom: spacing.md },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { ...typography.body, color: colors.textMuted },
  tabTextActive: { color: colors.primary, fontWeight: '600' },
  content: { paddingHorizontal: spacing.base, paddingBottom: spacing['3xl'] },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs },
  updated: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.xl },
  heading: { ...typography.bodyBold, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.xs },
  body: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
});

/**
 * WhatsSound — Enterprise Contact
 * Página de contacto para planes enterprise
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';

const FEATURES = [
  { icon: 'people', title: 'Usuarios ilimitados', desc: 'Sin límite de DJs ni asistentes' },
  { icon: 'analytics', title: 'Analytics avanzados', desc: 'Métricas detalladas de engagement' },
  { icon: 'shield-checkmark', title: 'SLA garantizado', desc: '99.9% uptime con soporte prioritario' },
  { icon: 'settings', title: 'Personalización', desc: 'Branding y features a medida' },
  { icon: 'card', title: 'Facturación flexible', desc: 'Pagos mensuales o anuales' },
  { icon: 'headset', title: 'Account manager', desc: 'Contacto dedicado para tu cuenta' },
];

export default function EnterpriseScreen() {
  const router = useRouter();

  const handleContact = () => {
    Linking.openURL('mailto:enterprise@whatssound.com?subject=Consulta%20Plan%20Enterprise');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enterprise</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Ionicons name="business" size={64} color={colors.primary} />
        <Text style={styles.heroTitle}>WhatsSound Enterprise</Text>
        <Text style={styles.heroSubtitle}>
          Soluciones personalizadas para festivales, discotecas y grandes eventos
        </Text>
      </View>

      {/* Features */}
      <Text style={styles.sectionTitle}>INCLUYE</Text>
      <View style={styles.featuresGrid}>
        {FEATURES.map((feature, i) => (
          <View key={i} style={styles.featureCard}>
            <Ionicons name={feature.icon as any} size={28} color={colors.primary} />
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDesc}>{feature.desc}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.cta}>
        <Text style={styles.ctaText}>
          Cuéntanos sobre tu evento y te preparamos una propuesta personalizada
        </Text>
        <Button 
          title="Contactar con ventas" 
          onPress={handleContact} 
          fullWidth 
          icon={<Ionicons name="mail" size={20} color="#fff" />}
        />
        <Text style={styles.ctaNote}>
          Respuesta en menos de 24h
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing['3xl'] },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: spacing.base, 
    paddingVertical: spacing.md 
  },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  hero: { 
    alignItems: 'center', 
    paddingVertical: spacing['2xl'], 
    paddingHorizontal: spacing.xl 
  },
  heroTitle: { 
    ...typography.h1, 
    color: colors.textPrimary, 
    marginTop: spacing.md 
  },
  heroSubtitle: { 
    ...typography.body, 
    color: colors.textSecondary, 
    textAlign: 'center', 
    marginTop: spacing.sm 
  },
  sectionTitle: { 
    ...typography.captionBold, 
    color: colors.textMuted, 
    letterSpacing: 0.5, 
    paddingHorizontal: spacing.base, 
    marginTop: spacing.xl, 
    marginBottom: spacing.md 
  },
  featuresGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingHorizontal: spacing.sm 
  },
  featureCard: { 
    width: '50%', 
    padding: spacing.sm 
  },
  featureTitle: { 
    ...typography.bodyBold, 
    color: colors.textPrimary, 
    marginTop: spacing.xs 
  },
  featureDesc: { 
    ...typography.caption, 
    color: colors.textSecondary, 
    marginTop: 2 
  },
  cta: { 
    backgroundColor: colors.surface, 
    marginHorizontal: spacing.base, 
    marginTop: spacing.xl, 
    borderRadius: borderRadius.xl, 
    padding: spacing.xl, 
    alignItems: 'center' 
  },
  ctaText: { 
    ...typography.body, 
    color: colors.textSecondary, 
    textAlign: 'center', 
    marginBottom: spacing.lg 
  },
  ctaNote: { 
    ...typography.caption, 
    color: colors.textMuted, 
    marginTop: spacing.md 
  },
});

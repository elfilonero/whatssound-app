/**
 * WhatsSound — Section & EmptyState Components
 * Componentes comunes para secciones
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface SectionProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  actionText,
  onAction,
  children,
}) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionText && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
    {children}
  </View>
);

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  subtitle,
  actionText,
  onAction,
}) => (
  <View style={styles.empty}>
    <Text style={styles.emptyIcon}>{icon}</Text>
    <Text style={styles.emptyTitle}>{title}</Text>
    {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
    {actionText && onAction && (
      <TouchableOpacity style={styles.emptyBtn} onPress={onAction}>
        <Text style={styles.emptyBtnText}>{actionText}</Text>
      </TouchableOpacity>
    )}
  </View>
);

interface LockedFeatureProps {
  title: string;
  description: string;
  price?: string;
  onUnlock?: () => void;
  onBack?: () => void;
}

export const LockedFeature: React.FC<LockedFeatureProps> = ({
  title,
  description,
  price,
  onUnlock,
  onBack,
}) => (
  <View style={styles.locked}>
    <Text style={styles.lockedIcon}>🔒</Text>
    <Text style={styles.lockedTitle}>{title}</Text>
    <Text style={styles.lockedDesc}>{description}</Text>
    {price && onUnlock && (
      <TouchableOpacity style={styles.unlockBtn} onPress={onUnlock}>
        <Text style={styles.unlockBtnText}>Desbloquear por {price}</Text>
      </TouchableOpacity>
    )}
    {onBack && (
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backLink}>Volver</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  actionText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  empty: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  emptyBtnText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '600',
  },
  locked: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  lockedIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  lockedTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  lockedDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  unlockBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  unlockBtnText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '600',
  },
  backLink: {
    ...typography.body,
    color: colors.primary,
  },
});

export default Section;

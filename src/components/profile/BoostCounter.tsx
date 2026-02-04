/**
 * WhatsSound — BoostCounter
 * Muestra Golden Boosts disponibles del usuario
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface BoostCounterProps {
  available: number;
  total?: number;
  nextRegenDate?: Date;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export function BoostCounter({
  available,
  total = 1,
  nextRegenDate,
  onPress,
  size = 'medium',
  showLabel = true,
}: BoostCounterProps) {
  const sizes = {
    small: { icon: 16, text: 12, padding: spacing.xs },
    medium: { icon: 20, text: 14, padding: spacing.sm },
    large: { icon: 28, text: 18, padding: spacing.md },
  };

  const s = sizes[size];
  const hasBoosts = available > 0;

  const getTimeUntilRegen = () => {
    if (!nextRegenDate) return null;
    const now = new Date();
    const diff = nextRegenDate.getTime() - now.getTime();
    if (diff <= 0) return 'Disponible';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const Container = onPress ? Pressable : View;

  return (
    <Container
      style={[
        styles.container,
        { padding: s.padding },
        hasBoosts ? styles.containerActive : styles.containerEmpty,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Text style={{ fontSize: s.icon }}>⭐</Text>
        {hasBoosts && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{available}</Text>
          </View>
        )}
      </View>

      {showLabel && (
        <View style={styles.textContainer}>
          <Text style={[styles.label, { fontSize: s.text }]}>
            {hasBoosts ? 'Golden Boost' : 'Sin boosts'}
          </Text>
          {!hasBoosts && nextRegenDate && (
            <Text style={styles.regenText}>
              Regenera en {getTimeUntilRegen()}
            </Text>
          )}
          {hasBoosts && (
            <Text style={styles.availableText}>
              {available} disponible{available > 1 ? 's' : ''}
            </Text>
          )}
        </View>
      )}

      {onPress && (
        <Ionicons 
          name="chevron-forward" 
          size={s.icon} 
          color={colors.textSecondary} 
        />
      )}
    </Container>
  );
}

/**
 * Versión compacta para header o navbar
 */
export function BoostBadge({ available }: { available: number }) {
  if (available <= 0) return null;

  return (
    <View style={styles.badgeCompact}>
      <Text style={styles.badgeIcon}>⭐</Text>
      <Text style={styles.badgeCount}>{available}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    gap: spacing.sm,
  },
  containerActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  containerEmpty: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  regenText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  availableText: {
    ...typography.caption,
    color: '#FFD700',
  },
  // Badge compacto
  badgeCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    gap: 4,
  },
  badgeIcon: {
    fontSize: 14,
  },
  badgeCount: {
    ...typography.captionBold,
    color: '#FFD700',
  },
});

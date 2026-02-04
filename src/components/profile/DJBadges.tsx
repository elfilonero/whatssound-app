/**
 * WhatsSound — DJBadges
 * Badges de reconocimiento para DJs
 * 
 * Niveles:
 * - 10 boosts → Rising Star ⭐
 * - 50 boosts → Fan Favorite 🌟
 * - 100 boosts → Verificado ✨
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type BadgeType = 'rising_star' | 'fan_favorite' | 'verified';

interface Badge {
  type: BadgeType;
  name: string;
  icon: string;
  color: string;
  requirement: number;
  description: string;
}

const BADGES: Badge[] = [
  {
    type: 'rising_star',
    name: 'Rising Star',
    icon: '⭐',
    color: '#FFD700',
    requirement: 10,
    description: '10 Golden Boosts recibidos',
  },
  {
    type: 'fan_favorite',
    name: 'Fan Favorite',
    icon: '🌟',
    color: '#FF6B6B',
    requirement: 50,
    description: '50 Golden Boosts recibidos',
  },
  {
    type: 'verified',
    name: 'Verificado',
    icon: '✨',
    color: '#8B5CF6',
    requirement: 100,
    description: '100 Golden Boosts recibidos',
  },
];

/**
 * Obtiene los badges que tiene un DJ según sus boosts
 */
export function getEarnedBadges(totalBoosts: number): Badge[] {
  return BADGES.filter(b => totalBoosts >= b.requirement);
}

/**
 * Obtiene el badge más alto de un DJ
 */
export function getHighestBadge(totalBoosts: number): Badge | null {
  const earned = getEarnedBadges(totalBoosts);
  return earned.length > 0 ? earned[earned.length - 1] : null;
}

/**
 * Obtiene el siguiente badge a conseguir
 */
export function getNextBadge(totalBoosts: number): Badge | null {
  return BADGES.find(b => totalBoosts < b.requirement) || null;
}

interface DJBadgesProps {
  totalBoosts: number;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
}

/**
 * Muestra los badges de un DJ
 */
export function DJBadges({ totalBoosts, showProgress = false, size = 'medium', onPress }: DJBadgesProps) {
  const earnedBadges = getEarnedBadges(totalBoosts);
  const nextBadge = getNextBadge(totalBoosts);

  const sizes = {
    small: { icon: 16, gap: 4 },
    medium: { icon: 20, gap: 6 },
    large: { icon: 28, gap: 8 },
  };

  const s = sizes[size];

  if (earnedBadges.length === 0 && !showProgress) {
    return null;
  }

  const Container = onPress ? Pressable : View;

  return (
    <Container style={[styles.container, { gap: s.gap }]} onPress={onPress}>
      {/* Badges ganados */}
      {earnedBadges.map((badge) => (
        <View
          key={badge.type}
          style={[styles.badge, { backgroundColor: badge.color + '20' }]}
        >
          <Text style={{ fontSize: s.icon }}>{badge.icon}</Text>
        </View>
      ))}

      {/* Progreso al siguiente */}
      {showProgress && nextBadge && (
        <View style={styles.progress}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(totalBoosts / nextBadge.requirement) * 100}%`,
                  backgroundColor: nextBadge.color,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {totalBoosts}/{nextBadge.requirement} → {nextBadge.icon}
          </Text>
        </View>
      )}
    </Container>
  );
}

/**
 * Badge individual grande (para perfil)
 */
export function BadgeCard({ badge, earned }: { badge: Badge; earned: boolean }) {
  return (
    <View style={[styles.card, !earned && styles.cardLocked]}>
      <Text style={[styles.cardIcon, !earned && styles.cardIconLocked]}>
        {badge.icon}
      </Text>
      <Text style={[styles.cardName, !earned && styles.cardTextLocked]}>
        {badge.name}
      </Text>
      <Text style={[styles.cardDesc, !earned && styles.cardTextLocked]}>
        {badge.description}
      </Text>
      {!earned && (
        <View style={styles.lockBadge}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      )}
    </View>
  );
}

/**
 * Grid de todos los badges (para mostrar progreso)
 */
export function BadgeGrid({ totalBoosts }: { totalBoosts: number }) {
  return (
    <View style={styles.grid}>
      {BADGES.map((badge) => (
        <BadgeCard
          key={badge.type}
          badge={badge}
          earned={totalBoosts >= badge.requirement}
        />
      ))}
    </View>
  );
}

/**
 * Badge verificado inline (para mostrar junto al nombre)
 */
export function VerifiedBadge({ totalBoosts }: { totalBoosts: number }) {
  if (totalBoosts < 100) return null;
  
  return (
    <View style={styles.verifiedInline}>
      <Text style={styles.verifiedIcon}>✨</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progress: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  // Card styles
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    position: 'relative',
    minWidth: 100,
  },
  cardLocked: {
    opacity: 0.5,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  cardIconLocked: {
    opacity: 0.3,
  },
  cardName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 12,
  },
  cardDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 10,
  },
  cardTextLocked: {
    color: colors.textMuted,
  },
  lockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  lockIcon: {
    fontSize: 12,
  },
  // Grid
  grid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  // Verified inline
  verifiedInline: {
    marginLeft: 4,
  },
  verifiedIcon: {
    fontSize: 16,
  },
});

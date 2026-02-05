/**
 * WhatsSound — Stats Grid Component
 * Muestra estadísticas de sesión en grid
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export interface Stat {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  value: string;
  label: string;
}

interface StatsGridProps {
  stats: Stat[];
}

const StatCard: React.FC<Stat> = ({ icon, iconColor, value, label }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconBg, { backgroundColor: iconColor + '18' }]}>
      <Ionicons name={icon} size={18} color={iconColor} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <View style={styles.grid}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </View>
  );
};

export const SessionStats: React.FC<{
  listeners: number;
  songs: number;
  tips: number;
  duration: string;
}> = ({ listeners, songs, tips, duration }) => {
  const stats: Stat[] = [
    { icon: 'people', iconColor: colors.primary, value: String(listeners), label: 'Listeners' },
    { icon: 'musical-notes', iconColor: colors.accent, value: String(songs), label: 'Canciones' },
    { icon: 'cash', iconColor: colors.warning, value: `€${tips.toFixed(2)}`, label: 'Tips' },
    { icon: 'time', iconColor: '#A78BFA', value: duration, label: 'Activo' },
  ];

  return <StatsGrid stats={stats} />;
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.md,
  },
  statCard: {
    width: '25%',
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default StatsGrid;

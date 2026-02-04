/**
 * WhatsSound — StreakCard
 * Muestra la racha de sesiones del usuario
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { isDemoMode } from '../../lib/demo';

interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  lastActive: string | null;
  streakAlive: boolean;
  daysThisWeek: number;
}

interface Props {
  userId?: string;
  compact?: boolean;
}

export function StreakCard({ userId, compact = false }: Props) {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<StreakStats>({
    currentStreak: 0,
    bestStreak: 0,
    lastActive: null,
    streakAlive: false,
    daysThisWeek: 0,
  });

  const targetUserId = userId || user?.id;

  useEffect(() => {
    loadStats();
  }, [targetUserId]);

  const loadStats = async () => {
    if (isDemoMode() || !targetUserId) {
      // Demo data
      setStats({
        currentStreak: 5,
        bestStreak: 12,
        lastActive: new Date().toISOString(),
        streakAlive: true,
        daysThisWeek: 3,
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc('get_user_streak_stats', {
        user_uuid: targetUserId
      });

      if (data && data.length > 0) {
        const row = data[0];
        setStats({
          currentStreak: row.current_streak || 0,
          bestStreak: row.best_streak || 0,
          lastActive: row.last_active,
          streakAlive: row.streak_alive || false,
          daysThisWeek: row.days_this_week || 0,
        });
      }
    } catch (error) {
      console.error('[StreakCard] Error:', error);
    }
  };

  // Versión compacta para badges
  if (compact) {
    if (stats.currentStreak === 0) return null;
    
    return (
      <View style={styles.compactBadge}>
        <Text style={styles.compactIcon}>🔥</Text>
        <Text style={styles.compactNumber}>{stats.currentStreak}</Text>
      </View>
    );
  }

  // Versión completa para perfil
  const progress = Math.min(stats.daysThisWeek / 7, 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔥 Tu Racha</Text>
        {stats.streakAlive ? (
          <View style={styles.aliveBadge}>
            <Text style={styles.aliveText}>Activa</Text>
          </View>
        ) : (
          <View style={styles.deadBadge}>
            <Text style={styles.deadText}>Perdida</Text>
          </View>
        )}
      </View>

      <View style={styles.statsRow}>
        {/* Racha actual */}
        <View style={styles.mainStat}>
          <Text style={styles.mainNumber}>{stats.currentStreak}</Text>
          <Text style={styles.mainLabel}>
            {stats.currentStreak === 1 ? 'día' : 'días'}
          </Text>
        </View>

        {/* Separador */}
        <View style={styles.separator} />

        {/* Mejor racha */}
        <View style={styles.secondaryStat}>
          <Text style={styles.secondaryLabel}>Récord</Text>
          <Text style={styles.secondaryNumber}>{stats.bestStreak}</Text>
        </View>
      </View>

      {/* Progreso semanal */}
      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>
          Esta semana: {stats.daysThisWeek}/7 días
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          {/* Marcadores de días */}
          {[...Array(7)].map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.dayMarker, 
                { left: `${(i / 6) * 100}%` },
                i < stats.daysThisWeek && styles.dayMarkerActive
              ]} 
            />
          ))}
        </View>
      </View>

      {/* Mensaje motivacional */}
      <Text style={styles.motivation}>
        {stats.currentStreak === 0 
          ? '¡Escucha una sesión para empezar tu racha!'
          : stats.currentStreak >= 7
            ? '🎉 ¡Increíble! Una semana completa'
            : stats.streakAlive
              ? '¡Vuelve mañana para mantener tu racha!'
              : '¡Escucha hoy para empezar de nuevo!'
        }
      </Text>
    </View>
  );
}

/**
 * Badge de racha para mostrar en mensajes de chat
 */
export function StreakBadge({ streak }: { streak: number }) {
  if (streak < 3) return null; // Solo mostrar si es significativo
  
  return (
    <View style={styles.chatBadge}>
      <Text style={styles.chatBadgeText}>🔥{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginVertical: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    fontSize: 16,
  },
  aliveBadge: {
    backgroundColor: '#22c55e20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  aliveText: {
    ...typography.captionBold,
    color: '#22c55e',
    fontSize: 11,
  },
  deadBadge: {
    backgroundColor: colors.textMuted + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  deadText: {
    ...typography.captionBold,
    color: colors.textMuted,
    fontSize: 11,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  mainStat: {
    flex: 1,
    alignItems: 'center',
  },
  mainNumber: {
    ...typography.h1,
    color: colors.warning,
    fontSize: 48,
    lineHeight: 52,
  },
  mainLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 13,
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  secondaryStat: {
    flex: 1,
    alignItems: 'center',
  },
  secondaryLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  secondaryNumber: {
    ...typography.h2,
    color: colors.textPrimary,
    fontSize: 24,
  },
  progressSection: {
    marginBottom: spacing.sm,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surfaceDark || '#2a2a2a',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.warning,
    borderRadius: 4,
  },
  dayMarker: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted + '40',
    top: 2,
    marginLeft: -2,
  },
  dayMarkerActive: {
    backgroundColor: colors.warning,
  },
  motivation: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  // Compact badge
  compactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    gap: 2,
  },
  compactIcon: {
    fontSize: 10,
  },
  compactNumber: {
    ...typography.captionBold,
    color: colors.warning,
    fontSize: 11,
  },
  // Chat badge
  chatBadge: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 4,
  },
  chatBadgeText: {
    fontSize: 10,
    color: colors.warning,
  },
});

export default StreakCard;

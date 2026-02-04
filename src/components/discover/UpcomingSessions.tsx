/**
 * WhatsSound — UpcomingSessions
 * Lista de sesiones programadas próximas
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { isDemoMode } from '../../lib/demo';

interface ScheduledSession {
  id: string;
  dj_id: string;
  dj_name: string;
  dj_avatar: string | null;
  dj_verified: boolean;
  name: string;
  description: string | null;
  scheduled_at: string;
  genres: string[];
  subscriber_count: number;
  is_subscribed: boolean;
}

// Demo data
const DEMO_SESSIONS: ScheduledSession[] = [
  {
    id: '1',
    dj_id: 'dj1',
    dj_name: 'DJ Carlos Madrid',
    dj_avatar: '🎧',
    dj_verified: true,
    name: 'Viernes Latino 🔥',
    description: '¡La mejor sesión de reggaetón y música latina!',
    scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    genres: ['reggaeton', 'latin'],
    subscriber_count: 47,
    is_subscribed: false,
  },
  {
    id: '2',
    dj_id: 'dj2',
    dj_name: 'Luna DJ',
    dj_avatar: '🌙',
    dj_verified: true,
    name: 'Chill Sunday 🌤️',
    description: 'Música relajada para terminar el finde',
    scheduled_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    genres: ['chill', 'lofi'],
    subscriber_count: 23,
    is_subscribed: true,
  },
];

interface Props {
  limit?: number;
  showTitle?: boolean;
}

export function UpcomingSessions({ limit = 3, showTitle = true }: Props) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<ScheduledSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    if (isDemoMode()) {
      setSessions(DEMO_SESSIONS.slice(0, limit));
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('get_upcoming_sessions', {
        user_uuid: user?.id || null,
        limit_count: limit
      });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('[UpcomingSessions] Error:', error);
      setSessions(DEMO_SESSIONS.slice(0, limit));
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscribe = async (sessionId: string, isSubscribed: boolean) => {
    // Optimistic update
    setSessions(prev => prev.map(s => 
      s.id === sessionId 
        ? { ...s, is_subscribed: !isSubscribed, subscriber_count: s.subscriber_count + (isSubscribed ? -1 : 1) }
        : s
    ));

    if (isDemoMode()) return;

    try {
      if (isSubscribed) {
        await supabase.from('ws_session_subscriptions')
          .delete()
          .eq('scheduled_session_id', sessionId)
          .eq('user_id', user?.id);
      } else {
        await supabase.from('ws_session_subscriptions')
          .insert({ scheduled_session_id: sessionId, user_id: user?.id });
      }
    } catch (error) {
      console.error('[UpcomingSessions] Subscribe error:', error);
      // Revert on error
      setSessions(prev => prev.map(s => 
        s.id === sessionId 
          ? { ...s, is_subscribed: isSubscribed, subscriber_count: s.subscriber_count + (isSubscribed ? 1 : -1) }
          : s
      ));
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Mañana';
    if (days < 7) return date.toLocaleDateString('es-ES', { weekday: 'long' });
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (sessions.length === 0) return null;

  return (
    <View style={styles.container}>
      {showTitle && (
        <View style={styles.header}>
          <Text style={styles.title}>📅 Próximas sesiones</Text>
          <TouchableOpacity onPress={() => router.push('/discover')}>
            <Text style={styles.seeAll}>Ver todas</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.list}>
        {sessions.map((session) => (
          <TouchableOpacity 
            key={session.id}
            style={styles.sessionCard}
            onPress={() => router.push(`/session/scheduled/${session.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.sessionLeft}>
              <View style={styles.dateBlock}>
                <Text style={styles.dateDay}>{formatDate(session.scheduled_at)}</Text>
                <Text style={styles.dateTime}>{formatTime(session.scheduled_at)}</Text>
              </View>
            </View>

            <View style={styles.sessionInfo}>
              <Text style={styles.sessionName} numberOfLines={1}>{session.name}</Text>
              <View style={styles.djRow}>
                {session.dj_avatar && <Text style={styles.djAvatar}>{session.dj_avatar}</Text>}
                <Text style={styles.djName}>{session.dj_name}</Text>
                {session.dj_verified && (
                  <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                )}
              </View>
              <Text style={styles.subscribers}>
                {session.subscriber_count} {session.subscriber_count === 1 ? 'interesado' : 'interesados'}
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.notifyBtn, session.is_subscribed && styles.notifyBtnActive]}
              onPress={() => toggleSubscribe(session.id, session.is_subscribed)}
            >
              <Ionicons 
                name={session.is_subscribed ? 'notifications' : 'notifications-outline'} 
                size={18} 
                color={session.is_subscribed ? colors.primary : colors.textMuted} 
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
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
  seeAll: {
    ...typography.caption,
    color: colors.primary,
    fontSize: 13,
  },
  list: {
    gap: spacing.sm,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '40',
  },
  sessionLeft: {
    marginRight: spacing.md,
  },
  dateBlock: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minWidth: 60,
  },
  dateDay: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 11,
    textTransform: 'capitalize',
  },
  dateTime: {
    ...typography.bodyBold,
    color: colors.primary,
    fontSize: 14,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 14,
  },
  djRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  djAvatar: {
    fontSize: 12,
  },
  djName: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
  },
  subscribers: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  notifyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceDark || '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifyBtnActive: {
    backgroundColor: colors.primary + '20',
  },
});

export default UpcomingSessions;

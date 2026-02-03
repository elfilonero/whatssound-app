/**
 * WhatsSound — Panel de Reacciones (Bottom Sheet)
 * Conectado a Supabase en tiempo real
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { 
  REACTION_EMOJIS, 
  sendReaction, 
  subscribeToReactions,
  ReactionCount 
} from '../../src/lib/reactions';
import { isTestMode, getOrCreateTestUser } from '../../src/lib/demo';
import { supabase } from '../../src/lib/supabase';

export default function ReactionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId?: string; songId?: string }>();
  const [reactions, setReactions] = useState<ReactionCount[]>(
    REACTION_EMOJIS.map(emoji => ({ emoji, count: 0, userReacted: false }))
  );
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');

  // Obtener user id
  useEffect(() => {
    (async () => {
      if (isTestMode()) {
        const testProfile = await getOrCreateTestUser();
        if (testProfile) setUserId(testProfile.id);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setUserId(user.id);
      }
    })();
  }, []);

  // Suscribirse a reacciones
  useEffect(() => {
    if (!params.sessionId || !userId) return;

    const unsubscribe = subscribeToReactions(
      params.sessionId,
      (counts) => {
        setReactions(counts);
        setLoading(false);
      },
      userId
    );

    return unsubscribe;
  }, [params.sessionId, userId]);

  const handleReact = async (emoji: string) => {
    if (!params.sessionId || sending) return;

    setSending(emoji);

    // Optimistic update
    setReactions(prev => prev.map(r => {
      if (r.emoji !== emoji) return r;
      return {
        ...r,
        count: r.userReacted ? r.count - 1 : r.count + 1,
        userReacted: !r.userReacted,
      };
    }));

    const result = await sendReaction({
      sessionId: params.sessionId,
      songId: params.songId,
      emoji,
    });

    if (!result.ok) {
      // Revert on error
      setReactions(prev => prev.map(r => {
        if (r.emoji !== emoji) return r;
        return {
          ...r,
          count: r.userReacted ? r.count - 1 : r.count + 1,
          userReacted: !r.userReacted,
        };
      }));
    }

    setSending(null);
  };

  // Ordenar por popularidad
  const sortedReactions = [...reactions].sort((a, b) => b.count - a.count);
  const popularEmojis = sortedReactions.slice(0, 3).map(r => r.emoji);

  return (
    <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => router.back()}>
      <TouchableOpacity style={s.sheet} activeOpacity={1}>
        <View style={s.handle} />
        <Text style={s.title}>Reacciones</Text>
        
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.xl }} />
        ) : (
          <>
            {/* Popular section */}
            <Text style={s.sectionLabel}>🔥 POPULARES</Text>
            <View style={s.popularRow}>
              {sortedReactions.slice(0, 4).map((r) => (
                <TouchableOpacity
                  key={r.emoji}
                  style={[s.popularBtn, r.userReacted && s.reactionActive]}
                  onPress={() => handleReact(r.emoji)}
                  disabled={sending === r.emoji}
                >
                  <Text style={s.popularEmoji}>{r.emoji}</Text>
                  <Text style={[s.popularCount, r.userReacted && s.countActive]}>
                    {r.count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* All reactions grid */}
            <Text style={s.sectionLabel}>TODAS</Text>
            <View style={s.grid}>
              {reactions.map((r) => {
                const isPopular = popularEmojis.includes(r.emoji);
                const isActive = r.userReacted;
                return (
                  <TouchableOpacity
                    key={r.emoji}
                    style={[
                      s.reactionBtn, 
                      isActive && s.reactionActive,
                      isPopular && !isActive && s.reactionPopular,
                    ]}
                    onPress={() => handleReact(r.emoji)}
                    disabled={sending === r.emoji}
                  >
                    <Text style={s.emoji}>{r.emoji}</Text>
                    <Text style={[
                      s.count, 
                      isActive && s.countActive,
                      isPopular && !isActive && s.countPopular,
                    ]}>
                      {r.count}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* Hint */}
        <Text style={s.hint}>Toca para reaccionar · Las reacciones son visibles para todos</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: spacing.xl, paddingBottom: 40,
  },
  handle: { width: 40, height: 4, backgroundColor: colors.borderLight, borderRadius: 2, alignSelf: 'center', marginBottom: spacing.md },
  title: { ...typography.h3, color: colors.textPrimary, fontSize: 18, textAlign: 'center', marginBottom: spacing.md },
  
  sectionLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  
  popularRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  popularBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  popularEmoji: { fontSize: 28, marginBottom: 4 },
  popularCount: { ...typography.bodyBold, color: colors.textMuted, fontSize: 16 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  reactionBtn: {
    width: '23%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surfaceDark, borderRadius: borderRadius.lg,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  reactionActive: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  reactionPopular: { borderColor: colors.primary + '50' },
  emoji: { fontSize: 28, marginBottom: 4 },
  count: { ...typography.captionBold, color: colors.textMuted, fontSize: 13 },
  countActive: { color: colors.primary },
  countPopular: { color: colors.primary + '90' },
  
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});

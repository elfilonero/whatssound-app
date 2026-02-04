/**
 * WhatsSound — Skeleton Loaders
 * Placeholders animados mientras carga el contenido
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Skeleton base con animación de shimmer
 */
export function Skeleton({ 
  width, 
  height, 
  borderRadius: radius = 4,
  style 
}: SkeletonProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmer.value,
      [0, 0.5, 1],
      [0.3, 0.6, 0.3]
    );
    return { opacity };
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius: radius },
        animatedStyle,
        style,
      ]}
    />
  );
}

/**
 * Skeleton para una tarjeta de sesión
 */
export function SessionCardSkeleton() {
  return (
    <View style={styles.sessionCard}>
      <Skeleton width={56} height={56} borderRadius={28} />
      <View style={styles.sessionCardContent}>
        <Skeleton width="70%" height={16} borderRadius={4} />
        <Skeleton width="45%" height={12} borderRadius={4} style={{ marginTop: 6 }} />
      </View>
      <Skeleton width={50} height={24} borderRadius={12} />
    </View>
  );
}

/**
 * Skeleton para un item de canción
 */
export function SongItemSkeleton() {
  return (
    <View style={styles.songItem}>
      <Skeleton width={48} height={48} borderRadius={6} />
      <View style={styles.songItemContent}>
        <Skeleton width="80%" height={14} borderRadius={4} />
        <Skeleton width="55%" height={12} borderRadius={4} style={{ marginTop: 4 }} />
      </View>
      <Skeleton width={32} height={32} borderRadius={16} />
    </View>
  );
}

/**
 * Skeleton para un mensaje de chat
 */
export function ChatMessageSkeleton({ isMine = false }: { isMine?: boolean }) {
  const width = Math.random() * 100 + 120; // 120-220px
  
  return (
    <View style={[styles.chatMessage, isMine && styles.chatMessageMine]}>
      {!isMine && <Skeleton width={32} height={32} borderRadius={16} />}
      <Skeleton 
        width={width} 
        height={40} 
        borderRadius={16} 
        style={isMine ? styles.bubbleMine : styles.bubble}
      />
    </View>
  );
}

/**
 * Skeleton para un item de la lista de chats
 */
export function ChatListItemSkeleton() {
  return (
    <View style={styles.chatListItem}>
      <Skeleton width={48} height={48} borderRadius={24} />
      <View style={styles.chatListContent}>
        <Skeleton width="60%" height={14} borderRadius={4} />
        <Skeleton width="80%" height={12} borderRadius={4} style={{ marginTop: 4 }} />
      </View>
      <View style={styles.chatListMeta}>
        <Skeleton width={40} height={10} borderRadius={4} />
      </View>
    </View>
  );
}

/**
 * Skeleton para un perfil de usuario
 */
export function ProfileSkeleton() {
  return (
    <View style={styles.profile}>
      <Skeleton width={80} height={80} borderRadius={40} />
      <Skeleton width={150} height={20} borderRadius={4} style={{ marginTop: 12 }} />
      <Skeleton width={100} height={14} borderRadius={4} style={{ marginTop: 6 }} />
    </View>
  );
}

/**
 * Lista de skeletons
 */
export function SkeletonList({ 
  count = 5, 
  type = 'session' 
}: { 
  count?: number; 
  type?: 'session' | 'song' | 'chat' | 'chatList' 
}) {
  const SkeletonComponent = {
    session: SessionCardSkeleton,
    song: SongItemSkeleton,
    chat: ChatMessageSkeleton,
    chatList: ChatListItemSkeleton,
  }[type];

  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.surface,
  },
  // Session card
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  sessionCardContent: {
    flex: 1,
  },
  // Song item
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.md,
  },
  songItemContent: {
    flex: 1,
  },
  // Chat message
  chatMessage: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  chatMessageMine: {
    justifyContent: 'flex-end',
  },
  bubble: {
    backgroundColor: colors.surface,
  },
  bubbleMine: {
    backgroundColor: colors.primary + '40',
  },
  // Chat list
  chatListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  chatListContent: {
    flex: 1,
  },
  chatListMeta: {
    alignItems: 'flex-end',
  },
  // Profile
  profile: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  // List
  list: {
    gap: spacing.xs,
  },
});

export default Skeleton;

/**
 * WhatsSound — LiveBadge
 * Indicador de "en vivo" con punto pulsante
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface Props {
  count: number;
  isConnected?: boolean;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
}

export function LiveBadge({ 
  count, 
  isConnected = true, 
  size = 'medium',
  showIcon = true 
}: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Animación de pulso para el punto
  useEffect(() => {
    if (isConnected) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        false
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        false
      );
    } else {
      scale.value = 1;
      opacity.value = 0.5;
    }
  }, [isConnected]);

  const dotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const sizeConfig = {
    small: { dot: 6, text: 11, padding: spacing.xs, icon: 12 },
    medium: { dot: 8, text: 13, padding: spacing.sm, icon: 14 },
    large: { dot: 10, text: 15, padding: spacing.md, icon: 16 },
  };

  const config = sizeConfig[size];

  return (
    <View style={[styles.container, { paddingHorizontal: config.padding, paddingVertical: config.padding / 2 }]}>
      <Animated.View 
        style={[
          styles.dot, 
          { 
            width: config.dot, 
            height: config.dot, 
            borderRadius: config.dot / 2,
            backgroundColor: isConnected ? '#22c55e' : colors.textMuted,
          },
          dotAnimatedStyle
        ]} 
      />
      <Text style={[styles.text, { fontSize: config.text }]}>
        {count.toLocaleString()}
      </Text>
      {showIcon && (
        <Ionicons 
          name="headset" 
          size={config.icon} 
          color={colors.textMuted} 
        />
      )}
    </View>
  );
}

/**
 * Versión minimalista solo con número
 */
export function LiveCount({ count, isLive = true }: { count: number; isLive?: boolean }) {
  return (
    <View style={styles.countOnly}>
      <View style={[styles.tinyDot, { backgroundColor: isLive ? '#22c55e' : colors.textMuted }]} />
      <Text style={styles.countText}>{count}</Text>
    </View>
  );
}

/**
 * Badge "EN VIVO" para sesiones
 */
export function LiveTag() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.liveTag, animatedStyle]}>
      <View style={styles.liveTagDot} />
      <Text style={styles.liveTagText}>EN VIVO</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
  },
  dot: {
    // Tamaño dinámico
  },
  text: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  // Versión minimal
  countOnly: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tinyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  countText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
  },
  // Live tag
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF535020',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  liveTagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF5350',
  },
  liveTagText: {
    ...typography.captionBold,
    color: '#EF5350',
    fontSize: 10,
    letterSpacing: 0.5,
  },
});

export default LiveBadge;

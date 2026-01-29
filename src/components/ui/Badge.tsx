/**
 * WhatsSound — Badge Component
 * Badge para contadores, estados, chips de género
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

type BadgeVariant = 'primary' | 'accent' | 'muted' | 'live';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  dot?: boolean;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  dot = false,
  style,
}) => {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      {dot && <View style={[styles.dot, styles[`dot_${variant}`]]} />}
      <Text style={[styles.text, styles[`text_${variant}`]]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  primary: {
    backgroundColor: colors.primary + '20',
  },
  accent: {
    backgroundColor: colors.accent + '20',
  },
  muted: {
    backgroundColor: colors.surfaceLight,
  },
  live: {
    backgroundColor: colors.error + '20',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dot_primary: {
    backgroundColor: colors.primary,
  },
  dot_accent: {
    backgroundColor: colors.accent,
  },
  dot_muted: {
    backgroundColor: colors.textMuted,
  },
  dot_live: {
    backgroundColor: colors.error,
  },
  text: {
    ...typography.captionBold,
  },
  text_primary: {
    color: colors.primary,
  },
  text_accent: {
    color: colors.accent,
  },
  text_muted: {
    color: colors.textMuted,
  },
  text_live: {
    color: colors.error,
  },
});

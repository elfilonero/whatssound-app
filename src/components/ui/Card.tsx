/**
 * WhatsSound — Card Component
 * Tarjeta reutilizable para sesiones, canciones, etc.
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  padding = 'base',
}) => {
  const content = (
    <View style={[styles.card, { padding: spacing[padding] }, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
});

/**
 * WhatsSound — Button Component
 * Botón principal reutilizable con variantes
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
}) => {
  const buttonStyles: ViewStyle[] = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`text_${variant}`],
    size === 'sm' && typography.buttonSmall,
    disabled && styles.textDisabled,
  ].filter(Boolean) as TextStyle[];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.textOnPrimary : colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon && icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.lg,
  },
  size_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    minHeight: 36,
  },
  size_md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
  },
  size_lg: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing['2xl'],
    minHeight: 56,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
  text_primary: {
    color: colors.textOnPrimary,
  },
  text_secondary: {
    color: colors.primary,
  },
  text_ghost: {
    color: colors.primary,
  },
  text_danger: {
    color: colors.textOnPrimary,
  },
  textDisabled: {
    opacity: 0.7,
  },
});

/**
 * WhatsSound — Toast Component
 * Notificación tipo toast con variantes y auto-dismiss
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onDismiss: () => void;
  style?: ViewStyle;
}

const iconMap: Record<ToastVariant, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'close-circle',
  warning: 'warning',
  info: 'information-circle',
};

const colorMap: Record<ToastVariant, string> = {
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
  info: colors.accent,
};

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  variant = 'info',
  duration = 3000,
  onDismiss,
  style,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        dismiss();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      translateY.setValue(-100);
      opacity.setValue(0);
    }
  }, [visible]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  };

  if (!visible) return null;

  const accentColor = colorMap[variant];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + spacing.sm,
          borderLeftColor: accentColor,
          transform: [{ translateY }],
          opacity,
        },
        style,
      ]}
    >
      <Ionicons name={iconMap[variant]} size={20} color={accentColor} />
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
      <TouchableOpacity onPress={dismiss} hitSlop={8}>
        <Ionicons name="close" size={16} color={colors.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.base,
    right: spacing.base,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  message: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    flex: 1,
  },
});

/**
 * WhatsSound — Modal Component
 * Modal reutilizable con overlay, título y acciones
 */

import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  dismissOnOverlay?: boolean;
  style?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  dismissOnOverlay = true,
  style,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        style={styles.overlay}
        onPress={dismissOnOverlay ? onClose : undefined}
      >
        <Pressable style={[styles.container, style]} onPress={() => {}}>
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && <Text style={styles.title}>{title}</Text>}
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.body}>{children}</View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
  },
  closeBtn: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  body: {
    padding: spacing.base,
  },
});

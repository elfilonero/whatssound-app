/**
 * WhatsSound — BottomSheet Component
 * Panel inferior deslizable con handle y contenido
 */

import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: number | 'auto';
  style?: ViewStyle;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  height = SCREEN_HEIGHT * 0.5,
  style,
}) => {
  const sheetHeight = height === 'auto' ? SCREEN_HEIGHT * 0.5 : height;
  const translateY = useRef(new Animated.Value(sheetHeight)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      translateY.setValue(sheetHeight);
    }
  }, [visible]);

  const close = () => {
    Animated.timing(translateY, {
      toValue: sheetHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 100 || g.vy > 0.5) {
          close();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={close} statusBarTranslucent>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={close} />
        <Animated.View
          style={[
            styles.sheet,
            { height: sheetHeight, transform: [{ translateY }] },
            style,
          ]}
        >
          <View {...panResponder.panHandlers} style={styles.handleArea}>
            <View style={styles.handle} />
          </View>
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={close} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  handleArea: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.base,
  },
});

/**
 * WhatsSound — BuyBoostModal
 * Modal para comprar Golden Boost extra por €4.99
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { usePayments } from '../../hooks/usePayments';

interface BuyBoostModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type ModalState = 'info' | 'processing' | 'success' | 'error';

export function BuyBoostModal({ visible, onClose, onSuccess }: BuyBoostModalProps) {
  const [state, setState] = useState<ModalState>('info');
  const [errorMessage, setErrorMessage] = useState('');
  const { buyGoldenBoost, goldenBoostPrice } = usePayments();

  const handlePurchase = async () => {
    setState('processing');
    
    const success = await buyGoldenBoost();
    
    if (success) {
      setState('success');
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 2000);
    } else {
      setState('error');
      setErrorMessage('No se pudo procesar la compra. Inténtalo de nuevo.');
    }
  };

  const handleClose = () => {
    setState('info');
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          
          {/* Info State */}
          {state === 'info' && (
            <>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>⭐</Text>
                <View style={styles.plusBadge}>
                  <Ionicons name="add" size={16} color="#000" />
                </View>
              </View>

              <Text style={styles.title}>Comprar Golden Boost</Text>
              
              <Text style={styles.description}>
                ¿Te quedaste sin boosts esta semana? Compra uno extra para 
                apoyar a tu DJ favorito ahora mismo.
              </Text>

              <View style={styles.priceBox}>
                <Text style={styles.priceLabel}>Precio</Text>
                <Text style={styles.price}>{goldenBoostPrice}</Text>
              </View>

              <View style={styles.benefits}>
                <View style={styles.benefitRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.benefitText}>1 Golden Boost extra</Text>
                </View>
                <View style={styles.benefitRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.benefitText}>Úsalo cuando quieras</Text>
                </View>
                <View style={styles.benefitRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.benefitText}>No expira</Text>
                </View>
              </View>

              <Pressable style={styles.buyButton} onPress={handlePurchase}>
                <Text style={styles.buyButtonText}>Comprar {goldenBoostPrice}</Text>
              </Pressable>

              <Pressable onPress={handleClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
            </>
          )}

          {/* Processing State */}
          {state === 'processing' && (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.processingText}>Procesando compra...</Text>
            </View>
          )}

          {/* Success State */}
          {state === 'success' && (
            <View style={styles.centerContent}>
              <View style={styles.successIcon}>
                <Text style={{ fontSize: 64 }}>⭐</Text>
              </View>
              <Text style={styles.successTitle}>¡Boost comprado!</Text>
              <Text style={styles.successText}>
                Ya tienes tu Golden Boost extra disponible
              </Text>
            </View>
          )}

          {/* Error State */}
          {state === 'error' && (
            <View style={styles.centerContent}>
              <Ionicons name="alert-circle" size={64} color="#F44336" />
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorText}>{errorMessage}</Text>
              <Pressable style={styles.retryButton} onPress={() => setState('info')}>
                <Text style={styles.retryButtonText}>Intentar de nuevo</Text>
              </Pressable>
            </View>
          )}

        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 64,
  },
  plusBadge: {
    position: 'absolute',
    bottom: 0,
    right: -8,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  priceBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  priceLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  price: {
    ...typography.h1,
    color: '#FFD700',
  },
  benefits: {
    width: '100%',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  benefitText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  buyButton: {
    backgroundColor: '#FFD700',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  buyButtonText: {
    ...typography.button,
    color: '#000',
  },
  cancelText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  centerContent: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  processingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  successIcon: {
    marginBottom: spacing.md,
  },
  successTitle: {
    ...typography.h2,
    color: '#FFD700',
    marginBottom: spacing.sm,
  },
  successText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  errorTitle: {
    ...typography.h2,
    color: '#F44336',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  retryButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
});

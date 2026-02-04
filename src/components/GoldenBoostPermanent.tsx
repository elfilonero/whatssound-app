/**
 * WhatsSound — GoldenBoostPermanent
 * Compra de patrocinio permanente para un DJ (€19.99)
 * Tu nombre siempre visible en el perfil del DJ
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// LinearGradient reemplazado por View simple (evita dependencia extra)
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

interface GoldenBoostPermanentProps {
  djId: string;
  djName: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

const PRICE_CENTS = 1999; // €19.99
const HIGHLIGHT_PRICE_CENTS = 999; // €9.99 extra para destacar

export function GoldenBoostPermanent({
  djId,
  djName,
  onSuccess,
  onClose,
}: GoldenBoostPermanentProps) {
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'info' | 'message' | 'payment' | 'success'>('info');

  const totalPrice = PRICE_CENTS + (isHighlighted ? HIGHLIGHT_PRICE_CENTS : 0);
  const formattedPrice = `€${(totalPrice / 100).toFixed(2)}`;

  const handlePurchase = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión');
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: Integrar con Stripe para pago real
      // Por ahora, simulamos el pago exitoso

      // Insertar el patrocinio permanente
      const { error } = await supabase
        .from('ws_golden_boost_permanent')
        .insert({
          from_user_id: user.id,
          to_dj_id: djId,
          message: message.trim() || null,
          amount_cents: totalPrice,
          is_highlighted: isHighlighted,
        });

      if (error) {
        if (error.code === '23505') {
          Alert.alert('Ya eres patrocinador', `Ya tienes un Golden Boost Permanente para ${djName}`);
        } else {
          throw error;
        }
        return;
      }

      setStep('success');
      onSuccess?.();
    } catch (error) {
      console.error('[GoldenBoostPermanent] Error:', error);
      Alert.alert('Error', 'No se pudo completar la compra. Intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderInfoStep = () => (
    <View style={styles.content}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconGradient, { backgroundColor: '#FFD700' }]}>
          <Ionicons name="diamond" size={48} color="#FFF" />
        </View>
      </View>

      <Text style={styles.title}>Golden Boost Permanente</Text>
      <Text style={styles.subtitle}>Tu nombre siempre en el perfil de {djName}</Text>

      <View style={styles.benefits}>
        <View style={styles.benefitRow}>
          <Ionicons name="checkmark-circle" size={20} color="#FFD700" />
          <Text style={styles.benefitText}>Tu nombre visible para siempre</Text>
        </View>
        <View style={styles.benefitRow}>
          <Ionicons name="checkmark-circle" size={20} color="#FFD700" />
          <Text style={styles.benefitText}>Mensaje personalizado opcional</Text>
        </View>
        <View style={styles.benefitRow}>
          <Ionicons name="checkmark-circle" size={20} color="#FFD700" />
          <Text style={styles.benefitText}>Badge exclusivo de patrocinador</Text>
        </View>
        <View style={styles.benefitRow}>
          <Ionicons name="checkmark-circle" size={20} color="#FFD700" />
          <Text style={styles.benefitText}>Apoyas directamente al DJ</Text>
        </View>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>€19.99</Text>
        <Text style={styles.priceNote}>Pago único · Para siempre</Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => setStep('message')}
      >
        <Text style={styles.primaryButtonText}>Continuar</Text>
        <Ionicons name="arrow-forward" size={20} color="#000" />
      </Pressable>
    </View>
  );

  const renderMessageStep = () => (
    <View style={styles.content}>
      <Text style={styles.stepTitle}>Mensaje personalizado</Text>
      <Text style={styles.stepSubtitle}>
        Añade un mensaje que aparecerá junto a tu nombre (opcional)
      </Text>

      <TextInput
        style={styles.messageInput}
        value={message}
        onChangeText={setMessage}
        placeholder="Ej: ¡El mejor DJ de reggaetón! 🔥"
        placeholderTextColor={colors.textMuted}
        maxLength={100}
        multiline
      />
      <Text style={styles.charCount}>{message.length}/100</Text>

      <Pressable
        style={[styles.highlightOption, isHighlighted && styles.highlightOptionActive]}
        onPress={() => setIsHighlighted(!isHighlighted)}
      >
        <View style={styles.highlightCheck}>
          {isHighlighted && <Ionicons name="checkmark" size={16} color="#FFD700" />}
        </View>
        <View style={styles.highlightInfo}>
          <Text style={styles.highlightTitle}>⭐ Destacar mi patrocinio</Text>
          <Text style={styles.highlightDesc}>Aparece primero con borde dorado</Text>
        </View>
        <Text style={styles.highlightPrice}>+€9.99</Text>
      </Pressable>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalPrice}>{formattedPrice}</Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={() => setStep('info')}>
          <Text style={styles.secondaryButtonText}>Atrás</Text>
        </Pressable>
        <Pressable
          style={[styles.primaryButton, styles.flex1]}
          onPress={handlePurchase}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Ionicons name="card" size={20} color="#000" />
              <Text style={styles.primaryButtonText}>Pagar {formattedPrice}</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );

  const renderSuccessStep = () => (
    <View style={styles.content}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark-circle" size={80} color="#FFD700" />
      </View>

      <Text style={styles.successTitle}>¡Eres Patrocinador Permanente!</Text>
      <Text style={styles.successSubtitle}>
        Tu nombre ahora aparece en el perfil de {djName} para siempre 💎
      </Text>

      <Pressable style={styles.primaryButton} onPress={onClose}>
        <Text style={styles.primaryButtonText}>Cerrar</Text>
      </Pressable>
    </View>
  );

  return (
    <Modal visible animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </Pressable>

          {step === 'info' && renderInfoStep()}
          {step === 'message' && renderMessageStep()}
          {step === 'success' && renderSuccessStep()}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl + 20,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 1,
    padding: spacing.sm,
  },
  content: {
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  benefits: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  benefitText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  price: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFD700',
  },
  priceNote: {
    ...typography.caption,
    color: colors.textMuted,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    gap: spacing.sm,
    width: '100%',
  },
  primaryButtonText: {
    ...typography.button,
    color: '#000',
  },
  stepTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  stepSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  messageInput: {
    width: '100%',
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: spacing.xs,
  },
  charCount: {
    ...typography.caption,
    color: colors.textMuted,
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  highlightOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: spacing.md,
    borderRadius: 12,
    width: '100%',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  highlightOptionActive: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255,215,0,0.1)',
  },
  highlightCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  highlightInfo: {
    flex: 1,
  },
  highlightTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  highlightDesc: {
    ...typography.caption,
    color: colors.textMuted,
  },
  highlightPrice: {
    ...typography.body,
    color: '#FFD700',
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFD700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    ...typography.button,
    color: colors.textSecondary,
  },
  flex1: {
    flex: 1,
  },
  successIcon: {
    marginBottom: spacing.lg,
  },
  successTitle: {
    ...typography.h2,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});

export default GoldenBoostPermanent;

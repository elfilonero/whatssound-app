/**
 * WhatsSound — DecibelModal
 * Modal para dar decibelios (volumen) a DJs
 * Reemplaza TipModal - sin dinero real
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useDecibels } from '../hooks/useDecibels';

interface DecibelModalProps {
  visible: boolean;
  onClose: () => void;
  djId: string;
  djName: string;
  sessionId?: string;
}

const DB_PRESETS = [10, 25, 50, 100]; // Decibelios

type ModalState = 'select' | 'processing' | 'success' | 'error';

export function DecibelModal({ visible, onClose, djId, djName, sessionId }: DecibelModalProps) {
  const [modalState, setModalState] = useState<ModalState>('select');
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [errorMessage, setErrorMessage] = useState('');

  const { state: decibelState, giveDecibels, loading } = useDecibels();

  const canAfford = decibelState.available >= selectedAmount;

  const handleSend = async () => {
    if (!canAfford || !sessionId) return;

    setModalState('processing');
    
    const success = await giveDecibels(djId, sessionId, selectedAmount);
    
    if (success) {
      setModalState('success');
      setTimeout(() => {
        handleClose();
      }, 2000);
    } else {
      setModalState('error');
      setErrorMessage('No tienes suficientes decibelios');
    }
  };

  const handleClose = () => {
    setModalState('select');
    setSelectedAmount(25);
    setErrorMessage('');
    onClose();
  };

  // Select amount view
  const SelectView = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>🔊 Dar Volumen</Text>
        <Text style={styles.subtitle}>a {djName}</Text>
      </View>

      <View style={styles.balanceRow}>
        <Ionicons name="volume-high" size={16} color={colors.primary} />
        <Text style={styles.balanceText}>
          Tienes <Text style={styles.balanceAmount}>{decibelState.available} dB</Text> disponibles
        </Text>
      </View>

      <View style={styles.presets}>
        {DB_PRESETS.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.presetBtn,
              selectedAmount === amount && styles.presetBtnActive,
              decibelState.available < amount && styles.presetBtnDisabled,
            ]}
            onPress={() => setSelectedAmount(amount)}
            disabled={decibelState.available < amount}
          >
            <Text style={[
              styles.presetAmount,
              selectedAmount === amount && styles.presetAmountActive,
              decibelState.available < amount && styles.presetAmountDisabled,
            ]}>
              {amount}
            </Text>
            <Text style={[
              styles.presetUnit,
              selectedAmount === amount && styles.presetUnitActive,
              decibelState.available < amount && styles.presetUnitDisabled,
            ]}>
              dB
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
        <Text style={styles.infoText}>
          Ganas 1 dB por cada minuto escuchando
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.sendBtn, !canAfford && styles.sendBtnDisabled]}
        onPress={handleSend}
        disabled={!canAfford}
      >
        <Ionicons name="volume-high" size={20} color="#fff" />
        <Text style={styles.sendBtnText}>
          Dar {selectedAmount} dB
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
        <Text style={styles.cancelBtnText}>Cancelar</Text>
      </TouchableOpacity>
    </>
  );

  // Processing view
  const ProcessingView = () => (
    <View style={styles.centerView}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.processingText}>Enviando volumen...</Text>
    </View>
  );

  // Success view
  const SuccessView = () => (
    <View style={styles.centerView}>
      <Text style={styles.successEmoji}>🔊</Text>
      <Text style={styles.successTitle}>¡Volumen enviado!</Text>
      <Text style={styles.successSubtitle}>
        {djName} recibió {selectedAmount} dB
      </Text>
    </View>
  );

  // Error view
  const ErrorView = () => (
    <View style={styles.centerView}>
      <Ionicons name="alert-circle" size={48} color={colors.error} />
      <Text style={styles.errorTitle}>Error</Text>
      <Text style={styles.errorSubtitle}>{errorMessage}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={() => setModalState('select')}>
        <Text style={styles.retryBtnText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.content} onPress={e => e.stopPropagation()}>
          {modalState === 'select' && <SelectView />}
          {modalState === 'processing' && <ProcessingView />}
          {modalState === 'success' && <SuccessView />}
          {modalState === 'error' && <ErrorView />}
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
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '85%',
    maxWidth: 340,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    fontSize: 22,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
    backgroundColor: colors.primary + '15',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  balanceText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  balanceAmount: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  presets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  presetBtn: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    marginHorizontal: 4,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  presetBtnDisabled: {
    opacity: 0.4,
  },
  presetAmount: {
    ...typography.h2,
    color: colors.textPrimary,
    fontSize: 24,
  },
  presetAmountActive: {
    color: colors.primary,
  },
  presetAmountDisabled: {
    color: colors.textMuted,
  },
  presetUnit: {
    ...typography.caption,
    color: colors.textMuted,
  },
  presetUnitActive: {
    color: colors.primary,
  },
  presetUnitDisabled: {
    color: colors.textMuted,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  infoText: {
    ...typography.caption,
    color: colors.textMuted,
    flex: 1,
  },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  sendBtnDisabled: {
    backgroundColor: colors.textMuted,
  },
  sendBtnText: {
    ...typography.button,
    color: '#fff',
  },
  cancelBtn: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  cancelBtnText: {
    ...typography.body,
    color: colors.textMuted,
  },
  centerView: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  processingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  successTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  successSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  errorTitle: {
    ...typography.h2,
    color: colors.error,
    marginTop: spacing.md,
  },
  errorSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  retryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  retryBtnText: {
    ...typography.button,
    color: '#fff',
  },
});

export default DecibelModal;

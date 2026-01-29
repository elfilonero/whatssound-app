/**
 * WhatsSound — Valorar Sesión
 * Post-sesión: valorar DJ, experiencia, compartir
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { Avatar } from '../../src/components/ui/Avatar';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';

export default function RateSessionScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={64} color={colors.primary} />
          <Text style={styles.successTitle}>¡Gracias!</Text>
          <Text style={styles.successSub}>Tu valoración ayuda a otros usuarios</Text>
          <Button title="Volver al inicio" onPress={() => router.replace('/')} variant="secondary" size="lg" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.title}>Sesión terminada 🎧</Text>

        {/* Session summary */}
        <View style={styles.summaryCard}>
          <Avatar name="DJ Marcos" size="lg" />
          <Text style={styles.sessionName}>Viernes Latino 🔥</Text>
          <Text style={styles.djName}>DJ Marcos</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>2h 15m</Text>
              <Text style={styles.statLabel}>Duración</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>24</Text>
              <Text style={styles.statLabel}>Canciones</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>47</Text>
              <Text style={styles.statLabel}>Oyentes</Text>
            </View>
          </View>
        </View>

        {/* Rating */}
        <Text style={styles.rateLabel}>¿Cómo fue la sesión?</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={40}
                color={star <= rating ? colors.warning : colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingText}>
          {rating === 0 ? 'Toca para valorar' :
           rating <= 2 ? 'Puede mejorar' :
           rating <= 3 ? 'Estuvo bien' :
           rating <= 4 ? '¡Muy buena!' : '¡Increíble! 🔥'}
        </Text>

        {/* Comment */}
        <Input
          label="Comentario (opcional)"
          placeholder="¿Qué te pareció?"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={3}
          maxLength={200}
        />

        {/* Submit */}
        <Button
          title="Enviar valoración"
          onPress={() => setSent(true)}
          fullWidth
          size="lg"
          disabled={rating === 0}
        />

        <TouchableOpacity style={styles.skipBtn} onPress={() => router.replace('/')}>
          <Text style={styles.skipText}>Saltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'center' },
  title: { ...typography.h2, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.xl },
  summaryCard: {
    alignItems: 'center', gap: spacing.sm,
    padding: spacing.xl, backgroundColor: colors.surface, borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
  },
  sessionName: { ...typography.h3, color: colors.textPrimary },
  djName: { ...typography.body, color: colors.textSecondary },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl, marginTop: spacing.md },
  stat: { alignItems: 'center' },
  statNum: { ...typography.bodyBold, color: colors.textPrimary },
  statLabel: { ...typography.caption, color: colors.textMuted },
  statDivider: { width: 1, height: 24, backgroundColor: colors.border },
  rateLabel: { ...typography.bodyBold, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.md },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md, marginBottom: spacing.sm },
  ratingText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  skipBtn: { alignItems: 'center', paddingVertical: spacing.md },
  skipText: { ...typography.body, color: colors.textMuted },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  successTitle: { ...typography.h2, color: colors.textPrimary },
  successSub: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
});

/**
 * WhatsSound — Acciones de Cuenta
 * Cerrar sesión y eliminar cuenta con confirmación
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';

export default function AccountActionsScreen() {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (confirmDelete) {
    return (
      <View style={styles.container}>
        <View style={styles.confirmContainer}>
          <Ionicons name="warning" size={64} color={colors.error} />
          <Text style={styles.confirmTitle}>¿Eliminar tu cuenta?</Text>
          <Text style={styles.confirmBody}>
            Esta acción es irreversible. Se borrarán todos tus datos:{'\n\n'}
            • Tu perfil y foto{'\n'}
            • Historial de sesiones{'\n'}
            • Mensajes y grupos{'\n'}
            • Propinas recibidas pendientes{'\n'}
            • Seguidores y seguidos
          </Text>
          <View style={styles.confirmActions}>
            <Button title="Sí, eliminar mi cuenta" onPress={() => router.replace('/(auth)/login')} variant="danger" fullWidth size="lg" />
            <Button title="Cancelar" onPress={() => setConfirmDelete(false)} variant="secondary" fullWidth />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cuenta</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Logout */}
        <Card style={styles.actionCard}>
          <Ionicons name="log-out-outline" size={32} color={colors.warning} />
          <Text style={styles.actionTitle}>Cerrar sesión</Text>
          <Text style={styles.actionBody}>
            Podrás volver a iniciar sesión con tu número de teléfono. Tus datos se mantienen.
          </Text>
          <Button
            title="Cerrar sesión"
            onPress={() => router.replace('/(auth)/login')}
            variant="secondary"
            fullWidth
          />
        </Card>

        {/* Delete */}
        <Card style={styles.actionCard}>
          <Ionicons name="trash-outline" size={32} color={colors.error} />
          <Text style={styles.actionTitle}>Eliminar cuenta</Text>
          <Text style={styles.actionBody}>
            Eliminación permanente de todos tus datos. Esta acción no se puede deshacer.
          </Text>
          <Button
            title="Eliminar cuenta"
            onPress={() => setConfirmDelete(true)}
            variant="danger"
            fullWidth
          />
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  content: { paddingHorizontal: spacing.base, gap: spacing.md },
  actionCard: { padding: spacing.xl, alignItems: 'center', gap: spacing.md },
  actionTitle: { ...typography.h3, color: colors.textPrimary },
  actionBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  confirmContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, gap: spacing.md },
  confirmTitle: { ...typography.h2, color: colors.error },
  confirmBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  confirmActions: { width: '100%', gap: spacing.sm, marginTop: spacing.lg },
});

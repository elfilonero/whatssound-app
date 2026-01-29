/**
 * WhatsSound — Login Screen (Supabase Auth)
 * Email + Password login
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { useAuthStore } from '../../src/stores/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { signInWithEmail, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Introduce email y contraseña');
      return;
    }

    const result = await signInWithEmail(email.trim(), password);
    if (result.error) {
      setError(result.error);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.logoSmall}>
          <Ionicons name="headset" size={48} color={colors.primary} />
        </View>

        <Text style={styles.title}>WhatsSound</Text>
        <Text style={styles.subtitle}>
          Inicia sesión para continuar
        </Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Input
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          icon={<Ionicons name="mail-outline" size={20} color={colors.textMuted} />}
        />

        <Input
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          icon={<Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />}
        />

        <Button
          title="Iniciar sesión"
          onPress={handleLogin}
          fullWidth
          size="lg"
          loading={loading}
          disabled={!email.trim() || !password.trim()}
        />

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          title="Crear cuenta nueva"
          onPress={() => router.push('/(auth)/create-profile')}
          variant="secondary"
          fullWidth
        />

        <Text style={styles.terms}>
          Al continuar, aceptas nuestros{' '}
          <Text style={styles.link}>Términos de Servicio</Text> y{' '}
          <Text style={styles.link}>Política de Privacidad</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1, justifyContent: 'center',
    paddingHorizontal: spacing.xl, gap: spacing.sm,
  },
  logoSmall: { alignSelf: 'center', marginBottom: spacing.sm },
  title: { ...typography.h1, color: colors.textPrimary, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.error + '20', padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  errorText: { ...typography.bodySmall, color: colors.error, flex: 1 },
  forgotBtn: { alignSelf: 'center', paddingVertical: spacing.sm },
  forgotText: { ...typography.bodySmall, color: colors.accent },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.sm },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: colors.divider },
  dividerText: { ...typography.caption, color: colors.textMuted },
  terms: {
    ...typography.caption, color: colors.textMuted,
    textAlign: 'center', marginTop: spacing.md, lineHeight: 18,
  },
  link: { color: colors.accent },
});

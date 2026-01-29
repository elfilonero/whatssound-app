/**
 * WhatsSound — Crear Perfil
 * Nombre, avatar y bio del usuario
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';

export default function CreateProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1000);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Crea tu perfil</Text>
      <Text style={styles.subtitle}>
        Así te verán los demás en las sesiones
      </Text>

      {/* Avatar picker */}
      <TouchableOpacity style={styles.avatarPicker}>
        <View style={styles.avatarCircle}>
          <Ionicons name="camera" size={32} color={colors.textMuted} />
        </View>
        <Text style={styles.avatarLabel}>Añadir foto</Text>
      </TouchableOpacity>

      {/* Form */}
      <Input
        label="Nombre"
        placeholder="Tu nombre o apodo"
        value={name}
        onChangeText={setName}
        maxLength={25}
      />

      <Input
        label="Bio"
        placeholder="Cuéntanos algo sobre ti..."
        value={bio}
        onChangeText={setBio}
        maxLength={120}
        multiline
        numberOfLines={3}
      />

      {/* Géneros favoritos */}
      <Text style={styles.sectionLabel}>GÉNEROS FAVORITOS</Text>
      <View style={styles.genreChips}>
        {['Reggaeton', 'Pop', 'Rock', 'Techno', 'Lo-Fi', 'Hip Hop', 'Indie', 'Jazz', 'Clásica', 'Latina'].map(
          (genre) => (
            <TouchableOpacity key={genre} style={styles.chip}>
              <Text style={styles.chipText}>{genre}</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Crear perfil"
          onPress={handleCreate}
          fullWidth
          size="lg"
          loading={loading}
          disabled={!name.trim()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing['4xl'],
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  avatarPicker: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  avatarLabel: {
    ...typography.bodySmall,
    color: colors.accent,
    marginTop: spacing.sm,
  },
  sectionLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  genreChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
});

/**
 * WhatsSound — Editar Perfil
 * Editar nombre, bio, avatar, género favorito
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing, borderRadius } from '../src/theme/spacing';
import { Avatar } from '../src/components/ui/Avatar';
import { Button } from '../src/components/ui/Button';
import { Input } from '../src/components/ui/Input';
import { useAuthStore } from '../src/stores/authStore';

const GENRES = ['Reggaeton', 'Pop', 'Rock', 'Techno', 'Lo-Fi', 'Hip Hop', 'Indie', 'Jazz', 'Latina', 'Electrónica'];

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useAuthStore();
  const [name, setName] = useState(profile?.display_name || '');
  const [username, setUsername] = useState(profile?.username ? `@${profile.username}` : '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(profile?.genres || []);
  const [saving, setSaving] = useState(false);

  const toggleGenre = (g: string) => {
    setSelectedGenres(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : prev.length < 3 ? [...prev, g] : prev
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar perfil</Text>
        <TouchableOpacity onPress={async () => {
          setSaving(true);
          await updateProfile({
            display_name: name,
            username: username.replace('@', ''),
            bio,
            genres: selectedGenres,
          });
          setSaving(false);
          router.back();
        }}>
          <Text style={styles.save}>{saving ? 'Guardando...' : 'Guardar'}</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <Avatar name={name} size="xl" />
        <TouchableOpacity style={styles.changePhoto}>
          <Ionicons name="camera" size={16} color={colors.textOnPrimary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.changeText}>Cambiar foto</Text>
        </TouchableOpacity>
      </View>

      {/* Fields */}
      <Input label="Nombre" value={name} onChangeText={setName} maxLength={20} />
      <Input label="Usuario" value={username} onChangeText={setUsername} maxLength={20} />
      <Input label="Bio" value={bio} onChangeText={setBio} maxLength={100} multiline numberOfLines={3} />

      {/* Genres */}
      <Text style={styles.sectionLabel}>GÉNEROS FAVORITOS (máx. 3)</Text>
      <View style={styles.genresGrid}>
        {GENRES.map(g => (
          <TouchableOpacity
            key={g}
            style={[styles.genreChip, selectedGenres.includes(g) && styles.genreChipSelected]}
            onPress={() => toggleGenre(g)}
          >
            <Text style={[styles.genreText, selectedGenres.includes(g) && styles.genreTextSelected]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* DJ section */}
      <Text style={styles.sectionLabel}>PERFIL DE DJ</Text>
      <TouchableOpacity style={styles.djCard}>
        <Ionicons name="headset" size={24} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.djCardTitle}>Activar perfil de DJ</Text>
          <Text style={styles.djCardSub}>Crea sesiones musicales, recibe propinas</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing['3xl'] },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  cancel: { ...typography.body, color: colors.textSecondary },
  save: { ...typography.bodyBold, color: colors.primary },
  avatarSection: { alignItems: 'center', marginVertical: spacing.xl, position: 'relative' },
  changePhoto: {
    position: 'absolute', bottom: 28, right: '35%',
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.background,
  },
  changeText: { ...typography.bodySmall, color: colors.primary, marginTop: spacing.sm },
  sectionLabel: { ...typography.captionBold, color: colors.textSecondary, letterSpacing: 0.5, marginBottom: spacing.sm, marginTop: spacing.lg },
  genresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  genreChip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full, backgroundColor: colors.surface,
    borderWidth: 1.5, borderColor: colors.border,
  },
  genreChipSelected: { backgroundColor: colors.primary + '20', borderColor: colors.primary },
  genreText: { ...typography.bodySmall, color: colors.textSecondary },
  genreTextSelected: { color: colors.primary, fontWeight: '600' },
  djCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.base, backgroundColor: colors.surface, borderRadius: borderRadius.xl,
  },
  djCardTitle: { ...typography.bodyBold, color: colors.textPrimary },
  djCardSub: { ...typography.caption, color: colors.textMuted },
});

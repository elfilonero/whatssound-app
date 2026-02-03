/**
 * WhatsSound — Editar Perfil
 * Conectado a Supabase
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing, borderRadius } from '../src/theme/spacing';
import { supabase } from '../src/lib/supabase';
import { isTestMode, getOrCreateTestUser } from '../src/lib/demo';

const AVAILABLE_GENRES = ['Reggaetón', 'Latin House', 'Electrónica', 'Pop', 'Techno', 'Hip Hop', 'Salsa', 'Bachata', 'Lo-fi', 'Deep House'];

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [djName, setDjName] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Cargar perfil actual
  useEffect(() => {
    (async () => {
      let uid = '';
      if (isTestMode()) {
        const testProfile = await getOrCreateTestUser();
        if (testProfile) uid = testProfile.id;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) uid = user.id;
      }

      if (!uid) {
        setLoading(false);
        return;
      }

      setUserId(uid);

      const { data, error } = await supabase
        .from('ws_profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (!error && data) {
        setName(data.display_name || '');
        setUsername(data.username || '');
        setBio(data.bio || '');
        setDjName(data.dj_name || '');
        setSelectedGenres(data.favorite_genres || []);
      }
      setLoading(false);
    })();
  }, []);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleSave = async () => {
    if (!userId) return;

    setSaving(true);
    const { error } = await supabase
      .from('ws_profiles')
      .update({
        display_name: name,
        username: username.toLowerCase(),
        bio,
        dj_name: djName,
        favorite_genres: selectedGenres,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    setSaving(false);

    if (error) {
      Alert.alert('Error', 'No se pudo guardar el perfil');
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Editar perfil</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={[s.saveText, saving && { opacity: 0.5 }]}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        {/* Avatar */}
        <TouchableOpacity style={s.avatarContainer}>
          <View style={s.avatar}>
            <Text style={s.avatarInitials}>
              {name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={s.changePhoto}>Cambiar foto</Text>
        </TouchableOpacity>

        {/* Fields */}
        <Text style={s.label}>Nombre</Text>
        <TextInput 
          style={s.input} 
          value={name} 
          onChangeText={setName}
          placeholder="Tu nombre"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={s.label}>Usuario</Text>
        <TextInput 
          style={s.input} 
          value={username} 
          onChangeText={setUsername} 
          autoCapitalize="none"
          placeholder="@usuario"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={s.label}>Bio</Text>
        <TextInput 
          style={[s.input, { minHeight: 80, textAlignVertical: 'top' }]} 
          value={bio} 
          onChangeText={setBio} 
          multiline 
          maxLength={150}
          placeholder="Cuéntanos sobre ti..."
          placeholderTextColor={colors.textMuted}
        />

        <Text style={s.label}>Nombre DJ (opcional)</Text>
        <TextInput 
          style={s.input} 
          value={djName} 
          onChangeText={setDjName}
          placeholder="Si eres DJ, tu nombre artístico"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={s.label}>Géneros favoritos</Text>
        <View style={s.genresWrap}>
          {AVAILABLE_GENRES.map(g => (
            <TouchableOpacity 
              key={g} 
              style={[s.genrePill, selectedGenres.includes(g) && s.genrePillSelected]}
              onPress={() => toggleGenre(g)}
            >
              <Text style={[s.genreText, selectedGenres.includes(g) && s.genreTextSelected]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  headerTitle: { ...typography.h3, color: colors.textPrimary, fontSize: 18 },
  cancelText: { ...typography.body, color: colors.textMuted, fontSize: 15 },
  saveText: { ...typography.bodyBold, color: colors.primary, fontSize: 15 },
  content: { padding: spacing.base, paddingBottom: 40 },
  avatarContainer: { alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { ...typography.h2, color: colors.primary, fontSize: 28 },
  changePhoto: { ...typography.bodySmall, color: colors.primary, fontSize: 14 },
  label: { ...typography.caption, color: colors.textSecondary, fontSize: 13, marginBottom: spacing.xs, marginTop: spacing.md },
  input: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, color: colors.textPrimary, fontSize: 15, borderWidth: 1, borderColor: colors.border },
  genresWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  genrePill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: borderRadius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  genrePillSelected: { backgroundColor: colors.primary + '20', borderColor: colors.primary },
  genreText: { ...typography.captionBold, color: colors.textSecondary, fontSize: 12 },
  genreTextSelected: { color: colors.primary },
});

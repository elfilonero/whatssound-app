/**
 * WhatsSound — Editar Perfil
 * Referencia: 36-editar-perfil.png
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing, borderRadius } from '../src/theme/spacing';

export default function EditProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('Carlos Mendoza');
  const [username, setUsername] = useState('carlosmendoza');
  const [bio, setBio] = useState('Amante de la música y DJ amateur 🎧');
  const [djName, setDjName] = useState('DJ Carlos');

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Editar perfil</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.saveText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        {/* Avatar */}
        <TouchableOpacity style={s.avatarContainer}>
          <View style={s.avatar}>
            <Ionicons name="person" size={40} color={colors.textMuted} />
          </View>
          <Text style={s.changePhoto}>Cambiar foto</Text>
        </TouchableOpacity>

        {/* Fields */}
        <Text style={s.label}>Nombre</Text>
        <TextInput style={s.input} value={name} onChangeText={setName} />

        <Text style={s.label}>Usuario</Text>
        <TextInput style={s.input} value={username} onChangeText={setUsername} autoCapitalize="none" />

        <Text style={s.label}>Bio</Text>
        <TextInput style={[s.input, { minHeight: 80 }]} value={bio} onChangeText={setBio} multiline maxLength={150} />

        <Text style={s.label}>Nombre DJ</Text>
        <TextInput style={s.input} value={djName} onChangeText={setDjName} />

        <Text style={s.label}>Géneros favoritos</Text>
        <View style={s.genresWrap}>
          {['Reggaetón', 'Latin House', 'Electrónica', 'Pop', 'Techno'].map(g => (
            <View key={g} style={s.genrePill}>
              <Text style={s.genreText}>{g}</Text>
            </View>
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
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  changePhoto: { ...typography.bodySmall, color: colors.primary, fontSize: 14 },
  label: { ...typography.caption, color: colors.textSecondary, fontSize: 13, marginBottom: spacing.xs, marginTop: spacing.md },
  input: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, color: colors.textPrimary, fontSize: 15, borderWidth: 1, borderColor: colors.border },
  genresWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  genrePill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: borderRadius.full, backgroundColor: colors.primary + '20' },
  genreText: { ...typography.captionBold, color: colors.primary, fontSize: 12 },
});

/**
 * WhatsSound — Crear Grupo
 * Nuevo grupo de chat (que opcionalmente puede tener sesión musical)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { Avatar } from '../../src/components/ui/Avatar';

const CONTACTS = [
  { id: '1', name: 'Laura', status: 'Disponible' },
  { id: '2', name: 'Carlos', status: 'En una sesión 🎧' },
  { id: '3', name: 'Ana', status: 'Hey there!' },
  { id: '4', name: 'Paco', status: 'En el gym 💪' },
  { id: '5', name: 'Marta', status: 'Viajando 🇵🇹' },
  { id: '6', name: 'DJ Marcos', status: 'DJ verificado ✓' },
  { id: '7', name: 'Javi', status: 'Disponible' },
  { id: '8', name: 'Sara', status: '🎂 Cumpleañera' },
];

export default function CreateGroupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filtered = CONTACTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear grupo</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Group info */}
        <View style={styles.groupInfo}>
          <TouchableOpacity style={styles.photoBtn}>
            <Ionicons name="camera" size={28} color={colors.textMuted} />
          </TouchableOpacity>
          <Input
            placeholder="Nombre del grupo"
            value={name}
            onChangeText={setName}
            maxLength={25}
          />
        </View>

        {/* Selected chips */}
        {selected.length > 0 && (
          <View style={styles.selectedRow}>
            {selected.map(id => {
              const c = CONTACTS.find(x => x.id === id)!;
              return (
                <TouchableOpacity key={id} style={styles.selectedChip} onPress={() => toggle(id)}>
                  <Avatar name={c.name} size="xs" />
                  <Text style={styles.selectedName}>{c.name}</Text>
                  <Ionicons name="close-circle" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Search */}
        <Input
          placeholder="Buscar contactos..."
          value={search}
          onChangeText={setSearch}
          icon={<Ionicons name="search" size={18} color={colors.textMuted} />}
        />

        {/* Contact list */}
        <Text style={styles.sectionLabel}>CONTACTOS EN WHATSSOUND</Text>
        {filtered.map(contact => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactItem}
            onPress={() => toggle(contact.id)}
          >
            <Avatar name={contact.name} size="md" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactStatus}>{contact.status}</Text>
            </View>
            <View style={[styles.checkbox, selected.includes(contact.id) && styles.checkboxSelected]}>
              {selected.includes(contact.id) && (
                <Ionicons name="checkmark" size={16} color={colors.textOnPrimary} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom button */}
      <View style={styles.bottom}>
        <Button
          title={`Crear grupo${selected.length > 0 ? ` (${selected.length})` : ''}`}
          onPress={() => router.back()}
          fullWidth
          size="lg"
          disabled={!name.trim() || selected.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
  },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  content: { paddingHorizontal: spacing.base, paddingBottom: spacing['3xl'] },
  groupInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  photoBtn: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border,
  },
  selectedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  selectedChip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.surface, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  selectedName: { ...typography.caption, color: colors.textPrimary },
  sectionLabel: { ...typography.captionBold, color: colors.textMuted, letterSpacing: 0.5, marginTop: spacing.lg, marginBottom: spacing.sm },
  contactItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.divider,
  },
  contactInfo: { flex: 1, gap: 2 },
  contactName: { ...typography.bodyBold, color: colors.textPrimary },
  contactStatus: { ...typography.caption, color: colors.textMuted },
  checkbox: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  bottom: { paddingHorizontal: spacing.base, paddingBottom: spacing.xl },
});

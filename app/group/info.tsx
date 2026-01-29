/**
 * WhatsSound — Info de Grupo
 * Detalles del grupo: miembros, media, config, sesión musical
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { Avatar } from '../../src/components/ui/Avatar';
import { Badge } from '../../src/components/ui/Badge';

const MEMBERS = [
  { id: '1', name: 'Tú', role: 'admin', online: true },
  { id: '2', name: 'Carlos', role: 'admin', online: true },
  { id: '3', name: 'Laura', role: 'member', online: true },
  { id: '4', name: 'Ana', role: 'member', online: false },
  { id: '5', name: 'Paco', role: 'member', online: false },
  { id: '6', name: 'DJ Marcos', role: 'dj', online: true },
  { id: '7', name: 'Marta', role: 'member', online: false },
  { id: '8', name: 'Javi', role: 'member', online: false },
];

export default function GroupInfoScreen() {
  const router = useRouter();
  const [muted, setMuted] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Group avatar + name */}
      <View style={styles.groupHeader}>
        <Avatar name="Viernes Latino" size="xl" />
        <Text style={styles.groupName}>Viernes Latino 🔥</Text>
        <Text style={styles.groupDesc}>Grupo · 47 miembros</Text>
      </View>

      {/* Music session status */}
      <TouchableOpacity style={styles.musicCard}>
        <View style={styles.musicCardLeft}>
          <Ionicons name="headset" size={24} color={colors.primary} />
          <View>
            <Text style={styles.musicCardTitle}>Sesión musical activa</Text>
            <Text style={styles.musicCardSub}>Gasolina - Daddy Yankee · 32 escuchando</Text>
          </View>
        </View>
        <Badge text="Unirse" variant="primary" />
      </TouchableOpacity>

      {/* Quick actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.actionIcon}><Ionicons name="search" size={20} color={colors.primary} /></View>
          <Text style={styles.actionLabel}>Buscar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.actionIcon}><Ionicons name="headset" size={20} color={colors.primary} /></View>
          <Text style={styles.actionLabel}>Sesión DJ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.actionIcon}><Ionicons name="link" size={20} color={colors.primary} /></View>
          <Text style={styles.actionLabel}>Invitar</Text>
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <View style={styles.settingRow}>
          <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.settingText}>Silenciar</Text>
          <Switch
            value={muted}
            onValueChange={setMuted}
            trackColor={{ false: colors.surfaceLight, true: colors.primary + '60' }}
            thumbColor={muted ? colors.primary : colors.textMuted}
          />
        </View>
        <TouchableOpacity style={styles.settingRow}>
          <Ionicons name="images-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.settingText}>Media, enlaces y docs</Text>
          <View style={styles.settingRight}>
            <Text style={styles.settingCount}>142</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRow}>
          <Ionicons name="star-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.settingText}>Mensajes destacados</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Members */}
      <View style={styles.membersHeader}>
        <Text style={styles.sectionTitle}>{MEMBERS.length} MIEMBROS</Text>
        <TouchableOpacity><Ionicons name="search" size={18} color={colors.textMuted} /></TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.memberItem}>
        <View style={styles.addMemberIcon}><Ionicons name="person-add" size={20} color={colors.primary} /></View>
        <Text style={styles.addMemberText}>Añadir miembros</Text>
      </TouchableOpacity>
      {MEMBERS.map(member => (
        <TouchableOpacity key={member.id} style={styles.memberItem}>
          <View style={styles.memberAvatar}>
            <Avatar name={member.name} size="md" />
            {member.online && <View style={styles.onlineDot} />}
          </View>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{member.name}</Text>
            {member.role !== 'member' && (
              <Badge
                text={member.role === 'admin' ? 'Admin' : member.role === 'dj' ? 'DJ' : ''}
                variant={member.role === 'dj' ? 'primary' : 'muted'}
              />
            )}
          </View>
        </TouchableOpacity>
      ))}

      {/* Danger */}
      <View style={[styles.section, { marginTop: spacing.xl }]}>
        <TouchableOpacity style={styles.dangerRow}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.dangerText}>Salir del grupo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerRow}>
          <Ionicons name="alert-circle-outline" size={20} color={colors.error} />
          <Text style={styles.dangerText}>Reportar grupo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing['3xl'] },
  header: { paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  groupHeader: { alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  groupName: { ...typography.h2, color: colors.textPrimary },
  groupDesc: { ...typography.body, color: colors.textSecondary },
  musicCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: spacing.base, marginBottom: spacing.lg,
    padding: spacing.md, backgroundColor: colors.primary + '15', borderRadius: borderRadius.xl,
  },
  musicCardLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  musicCardTitle: { ...typography.bodyBold, color: colors.primary },
  musicCardSub: { ...typography.caption, color: colors.textSecondary },
  actionsRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xl, marginBottom: spacing.xl },
  actionItem: { alignItems: 'center', gap: spacing.xs },
  actionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { ...typography.caption, color: colors.textSecondary },
  section: { backgroundColor: colors.surface, marginHorizontal: spacing.base, borderRadius: borderRadius.xl, overflow: 'hidden' },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
    borderBottomWidth: 0.5, borderBottomColor: colors.divider,
  },
  settingText: { ...typography.body, color: colors.textPrimary, flex: 1 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  settingCount: { ...typography.body, color: colors.textMuted },
  sectionTitle: { ...typography.captionBold, color: colors.textMuted, letterSpacing: 0.5 },
  membersHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.base, marginTop: spacing.xl, marginBottom: spacing.sm,
  },
  memberItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.base, paddingVertical: spacing.sm },
  memberAvatar: { position: 'relative' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.background },
  memberInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  memberName: { ...typography.body, color: colors.textPrimary },
  addMemberIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center' },
  addMemberText: { ...typography.body, color: colors.primary },
  dangerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  dangerText: { ...typography.body, color: colors.error },
});

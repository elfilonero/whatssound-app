/**
 * WhatsSound — Grupos (estilo WhatsApp + sesiones música)
 * Lista de grupos con último mensaje, indicador de sesión activa
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { Avatar } from '../../src/components/ui/Avatar';
import { Badge } from '../../src/components/ui/Badge';

interface Group {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageBy: string;
  time: string;
  unread: number;
  members: number;
  musicSession?: { song: string; listeners: number };
  muted?: boolean;
}

const GROUPS: Group[] = [
  {
    id: '1',
    name: 'Viernes Latino 🔥',
    lastMessage: 'Jajaja eso estuvo buenísimo',
    lastMessageBy: 'Carlos',
    time: '19:42',
    unread: 12,
    members: 47,
    musicSession: { song: 'Gasolina - Daddy Yankee', listeners: 32 },
  },
  {
    id: '2',
    name: 'Colegas del curro',
    lastMessage: '¿Quedamos para cañas el viernes?',
    lastMessageBy: 'Laura',
    time: '18:15',
    unread: 3,
    members: 8,
  },
  {
    id: '3',
    name: 'Familia Alonso',
    lastMessage: '📷 Foto',
    lastMessageBy: 'Mamá',
    time: '17:30',
    unread: 0,
    members: 12,
  },
  {
    id: '4',
    name: 'Gym Bros 💪',
    lastMessage: 'Mañana a las 7?',
    lastMessageBy: 'Paco',
    time: '16:05',
    unread: 0,
    members: 5,
    muted: true,
  },
  {
    id: '5',
    name: 'Cumple Sara 🎂',
    lastMessage: 'Yo llevo las bebidas',
    lastMessageBy: 'Tú',
    time: 'Ayer',
    unread: 0,
    members: 15,
    musicSession: { song: 'Happy - Pharrell', listeners: 9 },
  },
  {
    id: '6',
    name: 'Roadtrip Portugal 🇵🇹',
    lastMessage: '🎵 Audio (0:34)',
    lastMessageBy: 'Marta',
    time: 'Ayer',
    unread: 0,
    members: 6,
  },
  {
    id: '7',
    name: 'After Office',
    lastMessage: 'Buena esa playlist tío',
    lastMessageBy: 'Javi',
    time: 'Lun',
    unread: 0,
    members: 22,
  },
];

const GroupItem = ({ group, onPress }: { group: Group; onPress: () => void }) => (
  <TouchableOpacity style={styles.groupItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.avatarContainer}>
      <Avatar name={group.name} size="lg" />
      {group.musicSession && (
        <View style={styles.musicIndicator}>
          <Ionicons name="musical-note" size={10} color={colors.textOnPrimary} />
        </View>
      )}
    </View>
    <View style={styles.groupInfo}>
      <View style={styles.topRow}>
        <View style={styles.nameRow}>
          <Text style={styles.groupName} numberOfLines={1}>{group.name}</Text>
          {group.muted && <Ionicons name="volume-mute" size={14} color={colors.textMuted} />}
        </View>
        <Text style={[styles.time, group.unread > 0 && styles.timeUnread]}>{group.time}</Text>
      </View>
      <View style={styles.bottomRow}>
        <View style={{ flex: 1 }}>
          {group.musicSession ? (
            <View style={styles.musicRow}>
              <Ionicons name="headset" size={14} color={colors.primary} />
              <Text style={styles.musicText} numberOfLines={1}>
                🎧 {group.musicSession.song} · {group.musicSession.listeners} escuchando
              </Text>
            </View>
          ) : (
            <Text style={styles.lastMessage} numberOfLines={1}>
              <Text style={styles.senderName}>{group.lastMessageBy}: </Text>
              {group.lastMessage}
            </Text>
          )}
        </View>
        {group.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{group.unread}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

export default function GroupsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Grupos</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="search" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active music sessions banner */}
      <TouchableOpacity style={styles.activeBanner}>
        <Ionicons name="radio" size={18} color={colors.primary} />
        <Text style={styles.activeBannerText}>2 grupos con música activa</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </TouchableOpacity>

      {/* Group list */}
      <FlatList
        data={GROUPS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <GroupItem group={item} onPress={() => router.push(`/group/${item.id}`)} />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
  },
  headerTitle: { ...typography.h1, color: colors.textPrimary },
  headerActions: { flexDirection: 'row', gap: spacing.md },
  headerBtn: { padding: spacing.xs },
  activeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginHorizontal: spacing.base, marginBottom: spacing.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    backgroundColor: colors.primary + '15', borderRadius: borderRadius.lg,
  },
  activeBannerText: { ...typography.bodySmall, color: colors.primary, flex: 1 },
  list: { paddingBottom: spacing['3xl'] },
  groupItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
  },
  avatarContainer: { position: 'relative' },
  musicIndicator: {
    position: 'absolute', bottom: -2, right: -2,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.background,
  },
  groupInfo: { flex: 1, gap: 4 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flex: 1, marginRight: spacing.sm },
  groupName: { ...typography.bodyBold, color: colors.textPrimary },
  time: { ...typography.caption, color: colors.textMuted },
  timeUnread: { color: colors.primary },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  lastMessage: { ...typography.bodySmall, color: colors.textMuted },
  senderName: { color: colors.textSecondary },
  musicRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  musicText: { ...typography.bodySmall, color: colors.primary },
  unreadBadge: {
    minWidth: 20, height: 20, borderRadius: 10,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { ...typography.captionBold, color: colors.textOnPrimary, fontSize: 11 },
  separator: { height: 0.5, backgroundColor: colors.divider, marginLeft: 76 },
});

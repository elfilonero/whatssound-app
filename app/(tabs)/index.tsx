/**
 * WhatsSound — Chats (pestaña principal)
 * Lista de conversaciones estilo WhatsApp: 1a1 + grupos
 * Si un grupo tiene sesión activa, se muestra indicador sutil
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

interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
  lastMessage: string;
  lastBy?: string;
  time: string;
  unread: number;
  muted?: boolean;
  musicActive?: boolean;
  online?: boolean;
}

const CHATS: Chat[] = [
  { id: 'g1', name: 'Viernes Latino 🔥', isGroup: true, lastMessage: 'Jajaja eso estuvo buenísimo', lastBy: 'Carlos', time: '19:42', unread: 12, musicActive: true },
  { id: 'u1', name: 'Laura', isGroup: false, lastMessage: 'Nos vemos a las 9!', time: '19:30', unread: 2, online: true },
  { id: 'g2', name: 'Colegas del curro', isGroup: true, lastMessage: '¿Quedamos para cañas el viernes?', lastBy: 'Laura', time: '18:15', unread: 3 },
  { id: 'u2', name: 'Mamá', isGroup: false, lastMessage: '📷 Foto', time: '17:50', unread: 0 },
  { id: 'g3', name: 'Familia Alonso', isGroup: true, lastMessage: 'Feliz cumple tío!! 🎂', lastBy: 'Mamá', time: '17:30', unread: 0 },
  { id: 'u3', name: 'Paco', isGroup: false, lastMessage: 'Mañana gym a las 7?', time: '16:05', unread: 0 },
  { id: 'g4', name: 'Cumple Sara 🎂', isGroup: true, lastMessage: 'Yo llevo las bebidas', lastBy: 'Tú', time: 'Ayer', unread: 0, musicActive: true },
  { id: 'u4', name: 'DJ Marcos', isGroup: false, lastMessage: 'Buena sesión tío! 🎧', time: 'Ayer', unread: 0, online: true },
  { id: 'g5', name: 'Roadtrip Portugal 🇵🇹', isGroup: true, lastMessage: '🎵 Audio (0:34)', lastBy: 'Marta', time: 'Ayer', unread: 0 },
  { id: 'u5', name: 'Ana', isGroup: false, lastMessage: 'Ok perfecto 👍', time: 'Lun', unread: 0 },
];

const ChatItem = ({ chat, onPress }: { chat: Chat; onPress: () => void }) => (
  <TouchableOpacity style={styles.chatItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.avatarWrap}>
      <Avatar name={chat.name} size="lg" />
      {chat.musicActive && (
        <View style={styles.musicDot}>
          <Ionicons name="musical-note" size={10} color={colors.textOnPrimary} />
        </View>
      )}
      {chat.online && !chat.isGroup && (
        <View style={styles.onlineDot} />
      )}
    </View>
    <View style={styles.chatInfo}>
      <View style={styles.topRow}>
        <Text style={styles.chatName} numberOfLines={1}>{chat.name}</Text>
        <Text style={[styles.time, chat.unread > 0 && styles.timeActive]}>{chat.time}</Text>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.lastMsg} numberOfLines={1}>
          {chat.isGroup && chat.lastBy ? <Text style={styles.sender}>{chat.lastBy}: </Text> : null}
          {chat.lastMessage}
        </Text>
        {chat.unread > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{chat.unread}</Text>
          </View>
        )}
        {chat.muted && <Ionicons name="volume-mute" size={14} color={colors.textMuted} />}
      </View>
    </View>
  </TouchableOpacity>
);

export default function ChatsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
        <View style={styles.headerBtns}>
          <TouchableOpacity><Ionicons name="search" size={22} color={colors.textSecondary} /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="create-outline" size={22} color={colors.primary} /></TouchableOpacity>
        </View>
      </View>

      {/* Chat list */}
      <FlatList
        data={CHATS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChatItem
            chat={item}
            onPress={() => router.push(item.isGroup ? `/group/${item.id}` : `/chat/${item.id}`)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={styles.list}
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
  title: { ...typography.h1, color: colors.textPrimary },
  headerBtns: { flexDirection: 'row', gap: spacing.md },
  list: { paddingBottom: spacing['3xl'] },
  chatItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  avatarWrap: { position: 'relative' },
  musicDot: {
    position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.background,
  },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6,
    backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.background,
  },
  chatInfo: { flex: 1, gap: 4 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatName: { ...typography.bodyBold, color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
  time: { ...typography.caption, color: colors.textMuted },
  timeActive: { color: colors.primary },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  lastMsg: { ...typography.bodySmall, color: colors.textMuted, flex: 1 },
  sender: { color: colors.textSecondary },
  badge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  badgeText: { ...typography.captionBold, color: colors.textOnPrimary, fontSize: 11 },
  sep: { height: 0.5, backgroundColor: colors.divider, marginLeft: 76 },
});

/**
 * WhatsSound — Notificaciones
 * Centro de notificaciones: sesiones, propinas, menciones, invitaciones
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing, borderRadius } from '../src/theme/spacing';

interface Notification {
  id: string;
  type: 'session' | 'tip' | 'mention' | 'invite' | 'follow' | 'event';
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
  iconColor: string;
}

const NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'session', title: 'Viernes Latino 🔥', body: 'Carlos ha iniciado una sesión en tu grupo', time: 'Ahora', read: false, icon: 'headset', iconColor: colors.primary },
  { id: '2', type: 'tip', title: 'Propina recibida!', body: 'Laura te ha enviado €5 con mensaje: "Sube mi canción!"', time: '5 min', read: false, icon: 'cash', iconColor: colors.warning },
  { id: '3', type: 'mention', title: 'Te mencionaron', body: 'Paco en Gym Bros: "@tú mañana a las 7?"', time: '15 min', read: false, icon: 'at', iconColor: colors.accent },
  { id: '4', type: 'invite', title: 'Invitación a grupo', body: 'Ana te ha invitado a "Cumple Sara 🎂"', time: '1h', read: true, icon: 'people', iconColor: colors.primary },
  { id: '5', type: 'follow', title: 'Nuevo seguidor', body: 'DJ Marcos ahora te sigue', time: '2h', read: true, icon: 'person-add', iconColor: colors.primary },
  { id: '6', type: 'event', title: 'Evento mañana', body: 'Sábado Urbano con DJ Marcos empieza en 24h', time: '3h', read: true, icon: 'calendar', iconColor: colors.accent },
  { id: '7', type: 'session', title: 'Sesión finalizada', body: 'Techno Night ha terminado · 2h 45m · 128 oyentes', time: '5h', read: true, icon: 'stop-circle', iconColor: colors.textMuted },
  { id: '8', type: 'tip', title: 'Propina recibida!', body: 'Carlos te ha enviado €2', time: 'Ayer', read: true, icon: 'cash', iconColor: colors.warning },
];

const NotifItem = ({ notif }: { notif: Notification }) => (
  <TouchableOpacity style={[styles.notifItem, !notif.read && styles.notifUnread]}>
    <View style={[styles.iconWrap, { backgroundColor: notif.iconColor + '20' }]}>
      <Ionicons name={notif.icon as any} size={20} color={notif.iconColor} />
    </View>
    <View style={styles.notifInfo}>
      <Text style={styles.notifTitle}>{notif.title}</Text>
      <Text style={styles.notifBody} numberOfLines={2}>{notif.body}</Text>
      <Text style={styles.notifTime}>{notif.time}</Text>
    </View>
    {!notif.read && <View style={styles.unreadDot} />}
  </TouchableOpacity>
);

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <TouchableOpacity>
          <Text style={styles.markAll}>Marcar leídas</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <NotifItem notif={item} />}
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
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  markAll: { ...typography.bodySmall, color: colors.primary },
  list: { paddingBottom: spacing['3xl'] },
  notifItem: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
  },
  notifUnread: { backgroundColor: colors.primary + '08' },
  iconWrap: {
    width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
  },
  notifInfo: { flex: 1, gap: 2 },
  notifTitle: { ...typography.bodyBold, color: colors.textPrimary },
  notifBody: { ...typography.bodySmall, color: colors.textSecondary },
  notifTime: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: spacing.sm },
  sep: { height: 0.5, backgroundColor: colors.divider, marginLeft: 76 },
});

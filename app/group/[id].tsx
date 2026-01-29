/**
 * WhatsSound — Chat de Grupo (estilo WhatsApp)
 * Mensajes normales + banner de sesión musical activa
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { Avatar } from '../../src/components/ui/Avatar';

interface Message {
  id: string;
  text: string;
  sender: string;
  time: string;
  isMe: boolean;
  type?: 'text' | 'image' | 'audio' | 'system';
}

const MESSAGES: Message[] = [
  { id: '1', text: 'Carlos ha iniciado una sesión musical 🎧', sender: '', time: '19:00', isMe: false, type: 'system' },
  { id: '2', text: 'Ey gente! Ya está la sesión, uníos!', sender: 'Carlos', time: '19:01', isMe: false },
  { id: '3', text: 'Voy! Ponme reggaeton', sender: 'Ana', time: '19:02', isMe: false },
  { id: '4', text: 'Dale, voy entrando 🔥', sender: 'Tú', time: '19:03', isMe: true },
  { id: '5', text: 'Jajaja quién ha pedido esa canción??', sender: 'Laura', time: '19:15', isMe: false },
  { id: '6', text: 'Fui yo 😂 es un clásico', sender: 'Paco', time: '19:16', isMe: false },
  { id: '7', text: 'Este DJ es buenísimo tío', sender: 'Carlos', time: '19:20', isMe: false },
  { id: '8', text: 'Le he dejado propina jaja', sender: 'Tú', time: '19:22', isMe: true },
  { id: '9', text: '📷 Foto', sender: 'Ana', time: '19:30', isMe: false },
  { id: '10', text: 'Qué ambiente!! Mañana repetimos?', sender: 'Laura', time: '19:35', isMe: false },
  { id: '11', text: 'Jajaja eso estuvo buenísimo', sender: 'Carlos', time: '19:42', isMe: false },
];

const MessageBubble = ({ msg }: { msg: Message }) => {
  if (msg.type === 'system') {
    return (
      <View style={styles.systemMsg}>
        <Text style={styles.systemText}>{msg.text}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.bubbleRow, msg.isMe && styles.bubbleRowMe]}>
      {!msg.isMe && <Avatar name={msg.sender} size="sm" />}
      <View style={[styles.bubble, msg.isMe ? styles.bubbleMe : styles.bubbleOther]}>
        {!msg.isMe && <Text style={styles.senderName}>{msg.sender}</Text>}
        <Text style={styles.msgText}>{msg.text}</Text>
        <Text style={styles.msgTime}>{msg.time}</Text>
      </View>
    </View>
  );
};

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const hasMusic = true;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Avatar name="Viernes Latino" size="sm" />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>Viernes Latino 🔥</Text>
          <Text style={styles.headerMembers}>47 miembros · 12 en línea</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="call-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Music session banner */}
      {hasMusic && (
        <TouchableOpacity style={styles.musicBanner} onPress={() => router.push('/session/1')}>
          <View style={styles.musicBannerLeft}>
            <Ionicons name="headset" size={20} color={colors.textOnPrimary} />
            <View>
              <Text style={styles.musicBannerTitle}>🎧 Sesión activa</Text>
              <Text style={styles.musicBannerSong}>Gasolina - Daddy Yankee · 32 escuchando</Text>
            </View>
          </View>
          <Text style={styles.musicBannerJoin}>Unirse</Text>
        </TouchableOpacity>
      )}

      {/* Messages */}
      <FlatList
        data={MESSAGES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <MessageBubble msg={item} />}
        contentContainerStyle={styles.messageList}
        inverted={false}
      />

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity>
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mensaje"
            placeholderTextColor={colors.textMuted}
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity>
            <Ionicons name="happy-outline" size={22} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sendBtn}>
          {message.trim() ? (
            <Ionicons name="send" size={20} color={colors.textOnPrimary} />
          ) : (
            <Ionicons name="mic" size={22} color={colors.textOnPrimary} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.sm,
    backgroundColor: colors.surface, borderBottomWidth: 0.5, borderBottomColor: colors.divider,
  },
  headerInfo: { flex: 1 },
  headerName: { ...typography.bodyBold, color: colors.textPrimary },
  headerMembers: { ...typography.caption, color: colors.textMuted },
  musicBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
  },
  musicBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  musicBannerTitle: { ...typography.captionBold, color: colors.textOnPrimary },
  musicBannerSong: { ...typography.caption, color: colors.textOnPrimary + 'CC' },
  musicBannerJoin: { ...typography.bodyBold, color: colors.textOnPrimary },
  messageList: { padding: spacing.sm, gap: spacing.xs },
  systemMsg: { alignSelf: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, backgroundColor: colors.surface, borderRadius: borderRadius.full, marginVertical: spacing.xs },
  systemText: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs, marginBottom: spacing.xs },
  bubbleRowMe: { flexDirection: 'row-reverse' },
  bubble: { maxWidth: '75%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.lg },
  bubbleMe: { backgroundColor: colors.primary + '30', borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: colors.surface, borderBottomLeftRadius: 4 },
  senderName: { ...typography.captionBold, color: colors.primary, marginBottom: 2 },
  msgText: { ...typography.body, color: colors.textPrimary },
  msgTime: { ...typography.caption, color: colors.textMuted, alignSelf: 'flex-end', marginTop: 2, fontSize: 10 },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.sm,
    backgroundColor: colors.surface, borderTopWidth: 0.5, borderTopColor: colors.divider,
  },
  inputContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceLight, borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md, gap: spacing.sm,
  },
  input: { flex: 1, ...typography.body, color: colors.textPrimary, paddingVertical: spacing.sm },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
});

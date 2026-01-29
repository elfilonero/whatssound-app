/**
 * WhatsSound — Chat 1 a 1
 * Conversación privada estilo WhatsApp
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
  time: string;
  isMe: boolean;
  read?: boolean;
}

const MESSAGES: Message[] = [
  { id: '1', text: 'Ey! Has visto la sesión de Marcos?', time: '18:50', isMe: false },
  { id: '2', text: 'Sii está genial! Vamos?', time: '18:51', isMe: true, read: true },
  { id: '3', text: 'Dale! Invito a Ana y Paco', time: '18:52', isMe: false },
  { id: '4', text: 'Perfecto 👌', time: '18:53', isMe: true, read: true },
  { id: '5', text: 'Oye y el cumple de Sara qué?', time: '19:10', isMe: false },
  { id: '6', text: 'El sábado en mi casa, ya tengo la playlist', time: '19:12', isMe: true, read: true },
  { id: '7', text: 'Jajaja la vas a montar como DJ?? 🎧', time: '19:13', isMe: false },
  { id: '8', text: 'Claro! Ya tengo WhatsSound instalado para eso 😂', time: '19:15', isMe: true, read: true },
  { id: '9', text: 'Jajajaja qué crack', time: '19:16', isMe: false },
  { id: '10', text: 'Nos vemos a las 9!', time: '19:30', isMe: false },
];

const MessageBubble = ({ msg }: { msg: Message }) => (
  <View style={[styles.bubbleRow, msg.isMe && styles.bubbleRowMe]}>
    <View style={[styles.bubble, msg.isMe ? styles.bubbleMe : styles.bubbleOther]}>
      <Text style={styles.msgText}>{msg.text}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.msgTime}>{msg.time}</Text>
        {msg.isMe && (
          <Ionicons
            name={msg.read ? 'checkmark-done' : 'checkmark'}
            size={14}
            color={msg.read ? colors.primary : colors.textMuted}
          />
        )}
      </View>
    </View>
  </View>
);

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('');

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
        <Avatar name="Laura" size="sm" />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>Laura</Text>
          <Text style={styles.headerStatus}>en línea</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="call-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="videocam-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={MESSAGES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <MessageBubble msg={item} />}
        contentContainerStyle={styles.messageList}
      />

      {/* Input */}
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
            <Ionicons name="camera-outline" size={22} color={colors.textMuted} />
          </TouchableOpacity>
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
  headerStatus: { ...typography.caption, color: colors.primary },
  messageList: { padding: spacing.sm, gap: spacing.xs },
  bubbleRow: { flexDirection: 'row', marginBottom: spacing.xs },
  bubbleRowMe: { flexDirection: 'row-reverse' },
  bubble: { maxWidth: '75%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.lg },
  bubbleMe: { backgroundColor: colors.primary + '30', borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: colors.surface, borderBottomLeftRadius: 4 },
  msgText: { ...typography.body, color: colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 2 },
  msgTime: { ...typography.caption, color: colors.textMuted, fontSize: 10 },
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

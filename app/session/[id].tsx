/**
 * WhatsSound — Pantalla de Sesión
 * Vista completa: header DJ, chat, player mini, pedir canción
 * Conectada a Supabase para mensajes en tiempo real
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { Avatar } from '../../src/components/ui/Avatar';
import { Badge } from '../../src/components/ui/Badge';
import { supabase } from '../../src/lib/supabase';
import { useSessionStore } from '../../src/stores/sessionStore';

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  isSystem: boolean;
  isDJ: boolean;
  time: string;
  fromDB?: boolean;
}

// Mock messages as fallback
const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'mock-1', user: 'DJ Marcos', text: '¡Bienvenidos a Viernes Latino! 🔥', isSystem: false, isDJ: true, time: '04:02' },
  { id: 'mock-2', user: 'Sistema', text: 'María se ha unido a la sesión', isSystem: true, isDJ: false, time: '04:03' },
  { id: 'mock-3', user: 'Carlos', text: 'Ponme Gasolina porfa! 🎶', isSystem: false, isDJ: false, time: '04:05' },
  { id: 'mock-4', user: 'María', text: '¡Qué buena sesión!', isSystem: false, isDJ: false, time: '04:06' },
  { id: 'mock-5', user: 'DJ Marcos', text: 'Va Gasolina para Carlos 💪', isSystem: false, isDJ: true, time: '04:07' },
  { id: 'mock-6', user: 'Sistema', text: '🎵 Ahora suena: Gasolina — Daddy Yankee', isSystem: true, isDJ: false, time: '04:08' },
  { id: 'mock-7', user: 'Pedro', text: 'Tremenda! 🔥🔥🔥', isSystem: false, isDJ: false, time: '04:09' },
  { id: 'mock-8', user: 'Laura', text: 'Después ponme algo de Bad Bunny', isSystem: false, isDJ: false, time: '04:10' },
  { id: 'mock-9', user: 'Carlos', text: 'Gracias DJ!! 🙌', isSystem: false, isDJ: false, time: '04:11' },
  { id: 'mock-10', user: 'DJ Marcos', text: 'La siguiente es Dákiti 🐰', isSystem: false, isDJ: true, time: '04:12' },
];

const MOCK_SESSION = {
  name: 'Viernes Latino 🔥',
  dj: 'DJ Marcos',
  genre: 'Reggaeton',
  listeners: 47,
  currentSong: 'Gasolina',
  currentArtist: 'Daddy Yankee',
  progress: 0.65,
};

const MessageBubble = ({ message }: { message: ChatMessage }) => {
  if (message.isSystem) {
    return (
      <View style={styles.systemMessage}>
        <Text style={styles.systemText}>{message.text}</Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.bubble,
      message.isDJ && styles.bubbleDJ,
      message.fromDB && styles.bubbleFromDB,
    ]}>
      <View style={styles.bubbleHeader}>
        <Text style={[styles.userName, message.isDJ && styles.userNameDJ]}>
          {message.user}
        </Text>
        <Text style={styles.messageTime}>{message.time}</Text>
      </View>
      <Text style={styles.messageText}>{message.text}</Text>
    </View>
  );
};

export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const flatListRef = useRef<FlatList>(null);
  const { currentSession, fetchSession } = useSessionStore();

  // Fetch real session data
  useEffect(() => {
    if (id) fetchSession(id);
  }, [id]);

  // Derive header info from real session or fallback to mock
  const sessionName = currentSession?.name || MOCK_SESSION.name;
  const djName = currentSession?.dj_display_name || MOCK_SESSION.dj;
  const listenerCount = currentSession?.listener_count ?? MOCK_SESSION.listeners;
  const currentSong = currentSession?.current_song || MOCK_SESSION.currentSong;
  const currentArtist = currentSession?.current_artist || MOCK_SESSION.currentArtist;

  // Fetch real messages from Supabase
  useEffect(() => {
    if (!id) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('id, content, created_at, user_id, is_system, profiles!messages_user_id_fkey(display_name, username)')
        .eq('session_id', id)
        .order('created_at', { ascending: true })
        .limit(100);

      if (!error && data && data.length > 0) {
        const dbMessages: ChatMessage[] = data.map((m: any) => ({
          id: m.id,
          user: m.profiles?.display_name || m.profiles?.username || 'Anónimo',
          text: m.content,
          isSystem: m.is_system || false,
          isDJ: false, // Could be enriched with session.dj_id check
          time: new Date(m.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          fromDB: true,
        }));
        // DB messages first, then mock as fallback padding
        setMessages([...dbMessages, ...MOCK_MESSAGES]);
      }
      // If no DB messages, keep mock
    };

    fetchMessages();

    // Realtime subscription for new messages
    const channel = supabase
      .channel(`session-chat-${id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `session_id=eq.${id}`,
      }, async (payload: any) => {
        const m = payload.new;
        // Fetch profile name
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, username')
          .eq('id', m.user_id)
          .single();

        const newMsg: ChatMessage = {
          id: m.id,
          user: profile?.display_name || profile?.username || 'Anónimo',
          text: m.content,
          isSystem: m.is_system || false,
          isDJ: false,
          time: new Date(m.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          fromDB: true,
        };

        setMessages(prev => {
          // Avoid duplicates (optimistic add)
          if (prev.find(p => p.id === m.id)) return prev;
          // Also skip if it's our local temp message
          return [...prev, newMsg];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const text = message.trim();
    const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    // Optimistic local add
    const tempId = `local-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: tempId,
      user: 'Tú',
      text,
      isSystem: false,
      isDJ: false,
      time,
      fromDB: true,
    };
    setMessages(prev => [...prev, newMsg]);
    setMessage('');

    // Persist to Supabase
    if (id) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            session_id: id,
            user_id: user.id,
            content: text,
          })
          .select('id')
          .single();

        // Replace temp ID with real ID
        if (!error && data) {
          setMessages(prev => prev.map(m => m.id === tempId ? { ...m, id: data.id } : m));
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Avatar name={MOCK_SESSION.dj} size="sm" online />
        <View style={styles.headerInfo}>
          <Text style={styles.sessionName}>{MOCK_SESSION.name}</Text>
          <Text style={styles.djName}>{MOCK_SESSION.dj} · {MOCK_SESSION.listeners} oyentes</Text>
        </View>
        <Badge text="EN VIVO" variant="live" dot />
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/session/queue')}>
          <Ionicons name="musical-notes" size={22} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/session/dj-panel')}>
          <Ionicons name="disc" size={22} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {/* Chat */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Mini player */}
        <View style={styles.miniPlayer}>
          <View style={styles.playerLeft}>
            <View style={styles.albumArt}>
              <Ionicons name="musical-note" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.songName}>{MOCK_SESSION.currentSong}</Text>
              <Text style={styles.artistName}>{MOCK_SESSION.currentArtist}</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${MOCK_SESSION.progress * 100}%` }]} />
          </View>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.inputBtn}>
            <Ionicons name="add-circle" size={28} color={colors.primary} />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={colors.textMuted}
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.inputBtn} onPress={sendMessage}>
            <Ionicons
              name={message.trim() ? 'send' : 'mic'}
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    gap: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: spacing.xs,
  },
  headerInfo: {
    flex: 1,
  },
  sessionName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 15,
  },
  djName: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  headerBtn: {
    padding: spacing.xs,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  systemMessage: {
    alignSelf: 'center',
    backgroundColor: colors.bubbleSystem,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginVertical: spacing.xs,
  },
  systemText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  bubble: {
    backgroundColor: colors.bubbleOther,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  bubbleDJ: {
    backgroundColor: colors.bubbleOwn,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  bubbleFromDB: {
    borderLeftWidth: 2,
    borderLeftColor: '#22c55e',
  },
  bubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
    gap: spacing.sm,
  },
  userName: {
    ...typography.captionBold,
    color: colors.accent,
  },
  userNameDJ: {
    color: colors.primary,
  },
  messageTime: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  messageText: {
    ...typography.body,
    color: colors.textPrimary,
    fontSize: 15,
  },
  miniPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  playerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  albumArt: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  songName: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  artistName: {
    ...typography.caption,
    color: colors.textMuted,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.progressTrack,
  },
  progress: {
    height: 2,
    backgroundColor: colors.progressBar,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    gap: spacing.xs,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  inputBtn: {
    padding: spacing.xs,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    fontSize: 15,
  },
});

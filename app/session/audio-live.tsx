/**
 * WhatsSound — Audio en Directo (Walkie-talkie DJ)
 * Referencia: 33-audio-directo.png
 * DJ habla en directo a la sesión
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { supabase } from '../../src/lib/supabase';
import { useLocalSearchParams } from 'expo-router';

export default function AudioLiveScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId?: string }>();
  const [speaking, setSpeaking] = useState(false);
  const [listenerCount, setListenerCount] = useState(0);

  // Cargar número de oyentes
  React.useEffect(() => {
    if (!params.sessionId) return;

    const loadListeners = async () => {
      const { count } = await supabase
        .from('ws_session_members')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', params.sessionId)
        .is('left_at', null);
      setListenerCount(count || 0);
    };

    loadListeners();

    // Suscripción
    const channel = supabase
      .channel(`audio-listeners:${params.sessionId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ws_session_members', filter: `session_id=eq.${params.sessionId}` }, () => loadListeners())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [params.sessionId]);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Audio en directo</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={s.center}>
        {/* Waveform visualization placeholder */}
        <View style={[s.waveContainer, speaking && s.waveActive]}>
          {[...Array(12)].map((_, i) => (
            <View key={i} style={[s.waveBar, { height: speaking ? 20 + Math.random() * 40 : 8 }]} />
          ))}
        </View>

        <Text style={s.status}>{speaking ? '🔴 En directo' : 'Mantén pulsado para hablar'}</Text>
        <Text style={s.listeners}>{listenerCount} personas escuchando</Text>

        {/* Push-to-talk button */}
        <TouchableOpacity
          style={[s.talkBtn, speaking && s.talkBtnActive]}
          onPressIn={() => setSpeaking(true)}
          onPressOut={() => setSpeaking(false)}
          activeOpacity={0.8}
        >
          <Ionicons name="mic" size={48} color={speaking ? '#fff' : colors.textMuted} />
        </TouchableOpacity>
        <Text style={s.hint}>Mantén pulsado para hablar</Text>

        {/* Settings */}
        <View style={s.settingsRow}>
          <TouchableOpacity style={s.settingBtn}>
            <Ionicons name="volume-high" size={20} color={colors.textSecondary} />
            <Text style={s.settingText}>Altavoz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.settingBtn}>
            <Ionicons name="musical-notes" size={20} color={colors.textSecondary} />
            <Text style={s.settingText}>Bajar música</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.settingBtn}>
            <Ionicons name="recording" size={20} color={colors.textSecondary} />
            <Text style={s.settingText}>Grabar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.base, paddingVertical: spacing.md },
  headerTitle: { ...typography.h3, color: colors.textPrimary, fontSize: 18 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  waveContainer: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 60, marginBottom: spacing.md },
  waveActive: {},
  waveBar: { width: 4, backgroundColor: colors.primary, borderRadius: 2, opacity: 0.6 },
  status: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 16 },
  listeners: { ...typography.bodySmall, color: colors.textSecondary, fontSize: 13 },
  talkBtn: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: colors.surface, borderWidth: 3, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl,
  },
  talkBtnActive: { backgroundColor: colors.error, borderColor: colors.error },
  hint: { ...typography.caption, color: colors.textMuted, fontSize: 12 },
  settingsRow: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.xl },
  settingBtn: { alignItems: 'center', gap: 4 },
  settingText: { ...typography.caption, color: colors.textMuted, fontSize: 11 },
});

/**
 * WhatsSound — Valorar Sesión / DJ
 * Conectado a Supabase
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { supabase } from '../../src/lib/supabase';
import { isTestMode, getOrCreateTestUser } from '../../src/lib/demo';

export default function RateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId?: string }>();
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<{ name: string; djName: string } | null>(null);

  // Cargar info de la sesión
  useEffect(() => {
    if (!params.sessionId) return;

    (async () => {
      const { data } = await supabase
        .from('ws_sessions')
        .select('name, dj:ws_profiles!dj_id(display_name, dj_name)')
        .eq('id', params.sessionId)
        .single();

      if (data) {
        setSessionInfo({
          name: data.name,
          djName: (data.dj as any)?.dj_name || (data.dj as any)?.display_name || 'DJ',
        });
      }
    })();
  }, [params.sessionId]);

  const handleSend = async () => {
    if (stars === 0 || !params.sessionId) return;

    setLoading(true);

    try {
      // Obtener user id
      let userId: string;
      
      if (isTestMode()) {
        const testProfile = await getOrCreateTestUser();
        if (!testProfile) {
          setLoading(false);
          return;
        }
        userId = testProfile.id;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }
        userId = user.id;
      }

      // Guardar valoración
      const { error } = await supabase
        .from('ws_ratings')
        .upsert({
          session_id: params.sessionId,
          user_id: userId,
          stars,
          comment: comment.trim() || null,
        });

      if (error) {
        // Si la tabla no existe, crear una básica o ignorar
        console.warn('Rating error (may not have table):', error);
      }

      setSent(true);
    } catch (e) {
      console.error('Error sending rating:', e);
    }

    setLoading(false);
  };

  if (sent) {
    return (
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => router.back()}>
        <View style={s.card}>
          <Ionicons name="checkmark-circle" size={56} color={colors.primary} />
          <Text style={s.successTitle}>¡Gracias!</Text>
          <Text style={s.successSub}>Tu valoración ayuda a otros usuarios</Text>
          <TouchableOpacity style={s.doneBtn} onPress={() => router.back()}>
            <Text style={s.doneText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  const starLabels = ['', 'Malo', 'Regular', 'Bien', 'Muy bien', '¡Increíble!'];

  return (
    <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => router.back()}>
      <TouchableOpacity style={s.card} activeOpacity={1}>
        <Text style={s.title}>¿Qué te pareció la sesión?</Text>
        {sessionInfo && (
          <>
            <Text style={s.djName}>{sessionInfo.djName}</Text>
            <Text style={s.sessionName}>{sessionInfo.name}</Text>
          </>
        )}

        <View style={s.starsRow}>
          {[1,2,3,4,5].map(n => (
            <TouchableOpacity key={n} onPress={() => setStars(n)}>
              <Ionicons 
                name={n <= stars ? 'star' : 'star-outline'} 
                size={40} 
                color={n <= stars ? colors.warning : colors.textMuted} 
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={s.starsLabel}>
          {stars === 0 ? 'Toca para valorar' : starLabels[stars]}
        </Text>

        <TextInput
          style={s.input}
          placeholder="Deja un comentario (opcional)"
          placeholderTextColor={colors.textMuted}
          value={comment}
          onChangeText={setComment}
          multiline
          maxLength={200}
        />
        <Text style={s.charCount}>{comment.length}/200</Text>

        <View style={s.buttons}>
          <TouchableOpacity style={s.skipBtn} onPress={() => router.back()} disabled={loading}>
            <Text style={s.skipText}>Saltar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[s.sendBtn, (stars === 0 || loading) && { opacity: 0.4 }]} 
            onPress={handleSend}
            disabled={stars === 0 || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={s.sendText}>Enviar</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.xl, width: '100%', maxWidth: 340, alignItems: 'center', gap: spacing.sm },
  title: { ...typography.h3, color: colors.textPrimary, fontSize: 18 },
  djName: { ...typography.bodyBold, color: colors.primary, fontSize: 15 },
  sessionName: { ...typography.bodySmall, color: colors.textSecondary, fontSize: 13 },
  starsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  starsLabel: { ...typography.caption, color: colors.textMuted, fontSize: 13, height: 20 },
  input: { width: '100%', backgroundColor: colors.surfaceDark, borderRadius: borderRadius.lg, padding: spacing.md, color: colors.textPrimary, fontSize: 14, minHeight: 70, textAlignVertical: 'top', marginTop: spacing.sm },
  charCount: { ...typography.caption, color: colors.textMuted, alignSelf: 'flex-end', marginTop: -4 },
  buttons: { flexDirection: 'row', gap: spacing.sm, width: '100%', marginTop: spacing.md },
  skipBtn: { flex: 1, backgroundColor: colors.surfaceLight, borderRadius: borderRadius.lg, paddingVertical: 14, alignItems: 'center' },
  skipText: { ...typography.button, color: colors.textMuted, fontSize: 14 },
  sendBtn: { flex: 1, backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: 14, alignItems: 'center' },
  sendText: { ...typography.button, color: '#fff', fontSize: 14 },
  successTitle: { ...typography.h2, color: colors.textPrimary, fontSize: 22 },
  successSub: { ...typography.bodySmall, color: colors.textSecondary, fontSize: 14, textAlign: 'center' },
  doneBtn: { backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: 12, paddingHorizontal: 32, marginTop: spacing.md },
  doneText: { ...typography.button, color: '#fff', fontSize: 14 },
});

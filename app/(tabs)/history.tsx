/**
 * WhatsSound — Historial (accesible desde perfil, no tab directa)
 * Historial de sesiones pasadas del usuario
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { Card } from '../../src/components/ui/Card';
import { Avatar } from '../../src/components/ui/Avatar';

interface PastSession {
  id: string;
  name: string;
  dj: string;
  date: string;
  duration: string;
  listeners: number;
  songs: number;
  genre: string;
  wasDJ: boolean;
}

const HISTORY: PastSession[] = [
  { id: '1', name: 'Viernes Latino 🔥', dj: 'Carlos', date: 'Hoy 19:00', duration: '2h 15m', listeners: 47, songs: 24, genre: 'Reggaeton', wasDJ: false },
  { id: '2', name: 'Cumple Sara 🎂', dj: 'DJ Marcos', date: 'Ayer 21:00', duration: '3h 20m', listeners: 15, songs: 38, genre: 'Pop', wasDJ: false },
  { id: '3', name: 'Mi primera sesión', dj: 'Tú', date: 'Sáb 25 Ene', duration: '1h 45m', listeners: 8, songs: 12, genre: 'Lo-Fi', wasDJ: true },
  { id: '4', name: 'After Office', dj: 'Javi', date: 'Vie 24 Ene', duration: '2h', listeners: 22, songs: 18, genre: 'Electrónica', wasDJ: false },
  { id: '5', name: 'Techno Night', dj: 'MNML_Dave', date: 'Jue 23 Ene', duration: '4h 10m', listeners: 128, songs: 52, genre: 'Techno', wasDJ: false },
];

export default function HistoryScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial</Text>
      <Text style={styles.subtitle}>{HISTORY.length} sesiones · Último mes</Text>

      <FlatList
        data={HISTORY}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardLeft}>
                <Avatar name={item.dj} size="md" />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <Text style={styles.cardDj}>
                    {item.wasDJ ? '🎧 Fuiste DJ' : `DJ: ${item.dj}`} · {item.genre}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardDate}>{item.date}</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                <Text style={styles.statText}>{item.duration}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="people-outline" size={14} color={colors.textMuted} />
                <Text style={styles.statText}>{item.listeners}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="musical-notes-outline" size={14} color={colors.textMuted} />
                <Text style={styles.statText}>{item.songs} canciones</Text>
              </View>
            </View>
          </Card>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.base },
  title: { ...typography.h1, color: colors.textPrimary, marginTop: spacing.md },
  subtitle: { ...typography.bodySmall, color: colors.textMuted, marginBottom: spacing.lg },
  list: { paddingBottom: spacing['3xl'] },
  card: { marginBottom: spacing.sm, padding: spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  cardLeft: { flexDirection: 'row', gap: spacing.md, flex: 1 },
  cardInfo: { flex: 1, gap: 2 },
  cardName: { ...typography.bodyBold, color: colors.textPrimary },
  cardDj: { ...typography.caption, color: colors.textSecondary },
  cardDate: { ...typography.caption, color: colors.textMuted },
  statsRow: { flexDirection: 'row', gap: spacing.lg },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  statText: { ...typography.caption, color: colors.textMuted },
});

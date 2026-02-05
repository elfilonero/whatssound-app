/**
 * WhatsSound — DJ Dashboard Creator
 * Métricas avanzadas para tier Creator (€1,99/mes)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { useSubscription, TIER_NAMES, TIER_ICONS } from '../../src/hooks';
import { useAuthStore } from '../../src/stores/authStore';
import { styles } from '../../src/styles/creator.styles';

const { width } = Dimensions.get('window');

// Mock data para gráficos
const WEEKLY_DATA = [
  { day: 'Lun', listeners: 12 },
  { day: 'Mar', listeners: 28 },
  { day: 'Mié', listeners: 15 },
  { day: 'Jue', listeners: 45 },
  { day: 'Vie', listeners: 78 },
  { day: 'Sáb', listeners: 92 },
  { day: 'Dom', listeners: 65 },
];

const TOP_SONGS = [
  { title: 'Pepas', artist: 'Farruko', votes: 124 },
  { title: 'Gasolina', artist: 'Daddy Yankee', votes: 98 },
  { title: 'Dákiti', artist: 'Bad Bunny', votes: 87 },
  { title: 'La Bicicleta', artist: 'Shakira', votes: 72 },
  { title: 'Bailando', artist: 'Enrique Iglesias', votes: 65 },
];

const StatCard = ({ icon, value, label, color, trend }: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  color: string;
  trend?: string;
}) => (
  <View style={styles.statCard}>
    <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    {trend && (
      <Text style={[styles.statTrend, { color: trend.startsWith('+') ? '#10B981' : colors.error }]}>
        {trend}
      </Text>
    )}
  </View>
);

const MiniBarChart = ({ data }: { data: typeof WEEKLY_DATA }) => {
  const max = Math.max(...data.map(d => d.listeners));
  return (
    <View style={styles.chartContainer}>
      <View style={styles.barsRow}>
        {data.map((d, i) => (
          <View key={i} style={styles.barColumn}>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  { height: `${(d.listeners / max) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.barLabel}>{d.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function DJDashboardCreator() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { tier, features } = useSubscription();
  const [refreshing, setRefreshing] = useState(false);

  // Verificar acceso
  const hasAccess = ['creator', 'pro', 'business', 'enterprise'].includes(tier);

  if (!hasAccess) {
    return (
      <View style={styles.container}>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedEmoji}>🔒</Text>
          <Text style={styles.lockedTitle}>Dashboard Creator</Text>
          <Text style={styles.lockedDesc}>
            Accede a métricas avanzadas, historial de 30 días y más
          </Text>
          <TouchableOpacity
            style={styles.unlockBtn}
            onPress={() => router.push('/subscription')}
          >
            <Text style={styles.unlockBtnText}>Desbloquear por €1,99/mes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Volver al dashboard básico</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular carga
    await new Promise(r => setTimeout(r, 1000));
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Dashboard Creator</Text>
          <View style={[styles.tierBadge, { backgroundColor: '#F59E0B20' }]}>
            <Text style={[styles.tierText, { color: '#F59E0B' }]}>⭐ Creator</Text>
          </View>
        </View>
        {tier !== 'pro' && tier !== 'business' && (
          <TouchableOpacity onPress={() => router.push('/subscription')} style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>Pro →</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Stats principales */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="people"
            value={335}
            label="Oyentes (30d)"
            color={colors.primary}
            trend="+23%"
          />
          <StatCard
            icon="radio"
            value={12}
            label="Sesiones"
            color="#F59E0B"
            trend="+4"
          />
          <StatCard
            icon="volume-high"
            value="1.2K"
            label="dB recibidos"
            color="#8B5CF6"
            trend="+340"
          />
          <StatCard
            icon="star"
            value={4.8}
            label="Rating"
            color="#10B981"
          />
        </View>

        {/* Gráfico semanal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Oyentes esta semana</Text>
          <View style={styles.chartCard}>
            <MiniBarChart data={WEEKLY_DATA} />
            <View style={styles.chartStats}>
              <View style={styles.chartStat}>
                <Text style={styles.chartStatValue}>92</Text>
                <Text style={styles.chartStatLabel}>Pico máximo</Text>
              </View>
              <View style={styles.chartStat}>
                <Text style={styles.chartStatValue}>48</Text>
                <Text style={styles.chartStatLabel}>Promedio</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Canciones más votadas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Canciones más votadas</Text>
          <View style={styles.songsCard}>
            {TOP_SONGS.map((song, idx) => (
              <View key={idx} style={styles.songRow}>
                <Text style={styles.songRank}>#{idx + 1}</Text>
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle}>{song.title}</Text>
                  <Text style={styles.songArtist}>{song.artist}</Text>
                </View>
                <View style={styles.songVotes}>
                  <Ionicons name="heart" size={14} color={colors.primary} />
                  <Text style={styles.songVotesText}>{song.votes}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Programar sesión (feature Creator) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Programar sesión</Text>
          <TouchableOpacity style={styles.scheduleCard}>
            <Ionicons name="calendar" size={32} color={colors.primary} />
            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleTitle}>Nueva sesión programada</Text>
              <Text style={styles.scheduleDesc}>
                Avisa a tus seguidores con notificación push
              </Text>
            </View>
            <Ionicons name="add-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Notificaciones enviadas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Notificaciones push</Text>
          <View style={styles.notifCard}>
            <View style={styles.notifStat}>
              <Text style={styles.notifValue}>3</Text>
              <Text style={styles.notifLabel}>Enviadas este mes</Text>
            </View>
            <View style={styles.notifStat}>
              <Text style={styles.notifValue}>87%</Text>
              <Text style={styles.notifLabel}>Tasa de apertura</Text>
            </View>
            <View style={styles.notifStat}>
              <Text style={styles.notifValue}>234</Text>
              <Text style={styles.notifLabel}>Seguidores</Text>
            </View>
          </View>
        </View>

        {/* Upgrade a Pro */}
        {tier === 'creator' && (
          <TouchableOpacity
            style={styles.ctaCard}
            onPress={() => router.push('/subscription')}
          >
            <Text style={styles.ctaEmoji}>🎧</Text>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Pasa a Pro</Text>
              <Text style={styles.ctaDesc}>
                Oyentes ilimitados, exportar datos, perfil profesional
              </Text>
            </View>
            <Text style={styles.ctaPrice}>€7,99/mes</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

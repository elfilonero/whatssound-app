/**
 * WhatsSound — DJ Dashboard Pro
 * Analytics completo para tier Pro (€7,99/mes)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  
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
import { useSubscription } from '../../src/hooks';
import { styles } from '../../src/styles/djPro.styles';

const { width } = Dimensions.get('window');

// Mock data avanzado
const MONTHLY_DATA = [
  { week: 'Sem 1', listeners: 245, sessions: 3, decibels: 420 },
  { week: 'Sem 2', listeners: 312, sessions: 4, decibels: 580 },
  { week: 'Sem 3', listeners: 428, sessions: 5, decibels: 720 },
  { week: 'Sem 4', listeners: 567, sessions: 6, decibels: 890 },
];

const AUDIENCE_INSIGHTS = [
  { metric: 'Hora pico', value: '22:00 - 00:00', icon: 'time' },
  { metric: 'Día más activo', value: 'Sábado', icon: 'calendar' },
  { metric: 'Sesión promedio', value: '1h 45m', icon: 'timer' },
  { metric: 'Retención', value: '78%', icon: 'trending-up' },
];

const RETENTION_DATA = [
  { minute: '0', percent: 100 },
  { minute: '15', percent: 92 },
  { minute: '30', percent: 85 },
  { minute: '45', percent: 78 },
  { minute: '60', percent: 72 },
  { minute: '75', percent: 65 },
  { minute: '90', percent: 58 },
];

const TOP_SUPPORTERS = [
  { name: 'María G.', decibels: 340, sessions: 12 },
  { name: 'Pablo R.', decibels: 280, sessions: 10 },
  { name: 'Ana L.', decibels: 220, sessions: 8 },
  { name: 'Carlos M.', decibels: 180, sessions: 15 },
  { name: 'Lucía F.', decibels: 150, sessions: 7 },
];

export default function DJDashboardPro() {
  const router = useRouter();
  const { tier, features } = useSubscription();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'audience' | 'content'>('overview');

  // Verificar acceso
  const hasAccess = ['pro', 'business', 'enterprise'].includes(tier);

  if (!hasAccess) {
    return (
      <View style={styles.container}>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedEmoji}>🔒</Text>
          <Text style={styles.lockedTitle}>Dashboard Pro</Text>
          <Text style={styles.lockedDesc}>
            Oyentes ilimitados, analytics completo, exportar datos y perfil profesional
          </Text>
          <TouchableOpacity
            style={styles.unlockBtn}
            onPress={() => router.push('/subscription')}
          >
            <Text style={styles.unlockBtnText}>Desbloquear por €7,99/mes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1000));
    setRefreshing(false);
  };

  const TabButton = ({ tab, label }: { tab: typeof activeTab; label: string }) => (
    <TouchableOpacity
      style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Dashboard Pro</Text>
          <View style={[styles.tierBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.tierText, { color: colors.primary }]}>🎧 Pro</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.exportBtn}>
          <Ionicons name="download-outline" size={20} color={colors.primary} />
          <Text style={styles.exportBtnText}>Exportar</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TabButton tab="overview" label="General" />
        <TabButton tab="audience" label="Audiencia" />
        <TabButton tab="content" label="Contenido" />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {activeTab === 'overview' && (
          <>
            {/* KPIs principales */}
            <View style={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiValue}>1,552</Text>
                <Text style={styles.kpiLabel}>Oyentes (mes)</Text>
                <Text style={styles.kpiTrend}>+34% vs mes anterior</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiValue}>18</Text>
                <Text style={styles.kpiLabel}>Sesiones</Text>
                <Text style={styles.kpiTrend}>+6 vs mes anterior</Text>
              </View>
            </View>

            <View style={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiValue}>2.6K</Text>
                <Text style={styles.kpiLabel}>dB recibidos</Text>
                <Text style={styles.kpiTrend}>+890 esta semana</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiValue}>4.9</Text>
                <Text style={styles.kpiLabel}>Rating ⭐</Text>
                <Text style={styles.kpiTrend}>Top 5% DJs</Text>
              </View>
            </View>

            {/* Gráfico mensual */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📈 Tendencia mensual</Text>
              <View style={styles.chartCard}>
                <View style={styles.lineChart}>
                  {MONTHLY_DATA.map((d, i) => (
                    <View key={i} style={styles.linePoint}>
                      <View
                        style={[
                          styles.pointDot,
                          { bottom: `${(d.listeners / 600) * 80}%` },
                        ]}
                      />
                      <Text style={styles.lineLabel}>{d.week}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                    <Text style={styles.legendText}>Oyentes</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Top supporters */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>❤️ Top supporters</Text>
              <View style={styles.supportersCard}>
                {TOP_SUPPORTERS.map((s, idx) => (
                  <View key={idx} style={styles.supporterRow}>
                    <Text style={styles.supporterRank}>#{idx + 1}</Text>
                    <Text style={styles.supporterName}>{s.name}</Text>
                    <View style={styles.supporterStats}>
                      <Text style={styles.supporterDB}>{s.decibels} dB</Text>
                      <Text style={styles.supporterSessions}>{s.sessions} sesiones</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {activeTab === 'audience' && (
          <>
            {/* Insights de audiencia */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎯 Insights de audiencia</Text>
              <View style={styles.insightsGrid}>
                {AUDIENCE_INSIGHTS.map((insight, idx) => (
                  <View key={idx} style={styles.insightCard}>
                    <Ionicons name={insight.icon as any} size={24} color={colors.primary} />
                    <Text style={styles.insightValue}>{insight.value}</Text>
                    <Text style={styles.insightLabel}>{insight.metric}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Retención */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Retención por minuto</Text>
              <View style={styles.chartCard}>
                <View style={styles.retentionChart}>
                  {RETENTION_DATA.map((d, i) => (
                    <View key={i} style={styles.retentionBar}>
                      <View style={styles.retentionBarWrapper}>
                        <View
                          style={[
                            styles.retentionFill,
                            { height: `${d.percent}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.retentionLabel}>{d.minute}m</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.chartNote}>
                  💡 El 72% de tu audiencia se queda más de 1 hora
                </Text>
              </View>
            </View>

            {/* Perfil profesional */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>👤 Perfil profesional</Text>
              <TouchableOpacity style={styles.profileCard}>
                <View style={styles.profilePreview}>
                  <Text style={styles.profileEmoji}>🎧</Text>
                  <View>
                    <Text style={styles.profileName}>Tu perfil Pro</Text>
                    <Text style={styles.profileDesc}>Visible en Descubrir con prioridad</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.editProfileBtn}>
                  <Text style={styles.editProfileText}>Editar</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </>
        )}

        {activeTab === 'content' && (
          <>
            {/* Performance de canciones */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎵 Performance de canciones</Text>
              <View style={styles.contentCard}>
                <View style={styles.contentRow}>
                  <Text style={styles.contentLabel}>Canciones reproducidas</Text>
                  <Text style={styles.contentValue}>847</Text>
                </View>
                <View style={styles.contentRow}>
                  <Text style={styles.contentLabel}>Canciones pedidas</Text>
                  <Text style={styles.contentValue}>234</Text>
                </View>
                <View style={styles.contentRow}>
                  <Text style={styles.contentLabel}>% peticiones aceptadas</Text>
                  <Text style={styles.contentValue}>78%</Text>
                </View>
                <View style={styles.contentRow}>
                  <Text style={styles.contentLabel}>Género más popular</Text>
                  <Text style={styles.contentValue}>Reggaetón</Text>
                </View>
              </View>
            </View>

            {/* Co-DJs (feature Pro) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>👥 Co-DJs</Text>
              <TouchableOpacity style={styles.coDJCard}>
                <Ionicons name="people" size={32} color={colors.primary} />
                <View style={styles.coDJContent}>
                  <Text style={styles.coDJTitle}>Invitar Co-DJ</Text>
                  <Text style={styles.coDJDesc}>
                    Comparte el control de la sesión con otro DJ
                  </Text>
                </View>
                <Ionicons name="add-circle" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Upgrade a Business */}
        {tier === 'pro' && (
          <TouchableOpacity
            style={styles.ctaCard}
            onPress={() => router.push('/subscription')}
          >
            <Text style={styles.ctaEmoji}>🏢</Text>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Pasa a Business</Text>
              <Text style={styles.ctaDesc}>
                Multi-sesión, IA asistente, branding personalizado
              </Text>
            </View>
            <Text style={styles.ctaPrice}>€29,99/mes</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

export default DJProDashboard;

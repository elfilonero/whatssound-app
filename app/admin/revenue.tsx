/**
 * WhatsSound — Revenue Dashboard
 * Propinas en tiempo real desde Supabase
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { supabase } from '../../src/lib/supabase';
import { PLATFORM_FEE_PERCENT, getPaymentStatus } from '../../src/lib/tips';

const isWide = Platform.OS === 'web' ? (typeof window !== 'undefined' ? window.innerWidth > 768 : true) : Dimensions.get('window').width > 768;

interface TipData {
  id: string;
  amount: number;
  platform_fee: number;
  net_amount: number;
  status: string;
  created_at: string;
  sender?: { display_name: string };
  receiver?: { display_name: string; dj_name?: string };
  session?: { name: string };
}

export default function RevenuePage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tips, setTips] = useState<TipData[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPlatformFees: 0,
    totalTips: 0,
    avgTipPerSession: 0,
    conversionRate: 0,
    // Golden Boost Permanente
    permanentSponsors: 0,
    permanentRevenue: 0,
    highlightedSponsors: 0,
  });
  const [tipsByDJ, setTipsByDJ] = useState<Array<{ dj: string; total: number; count: number; avg: number }>>([]);
  const [topTippers, setTopTippers] = useState<Array<{ name: string; total: number; count: number; avg: number }>>([]);

  const paymentStatus = getPaymentStatus();

  const loadData = async () => {
    try {
      // Cargar todas las propinas
      const { data: tipsData, error } = await supabase
        .from('ws_tips')
        .select(`
          *,
          sender:ws_profiles!sender_id(display_name),
          receiver:ws_profiles!receiver_id(display_name, dj_name),
          session:ws_sessions!session_id(name)
        `)
        .in('status', ['test', 'completed'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      const allTips = (tipsData || []) as TipData[];
      setTips(allTips);

      // Calcular estadísticas
      const totalRevenue = allTips.reduce((sum, t) => sum + Number(t.amount), 0);
      const totalPlatformFees = allTips.reduce((sum, t) => sum + Number(t.platform_fee || 0), 0);
      
      // Contar sesiones únicas
      const uniqueSessions = new Set(allTips.map(t => t.session?.name).filter(Boolean));
      const avgTipPerSession = uniqueSessions.size > 0 ? totalRevenue / uniqueSessions.size : 0;

      // Obtener total de usuarios para calcular conversión
      const { count: totalUsers } = await supabase
        .from('ws_profiles')
        .select('*', { count: 'exact', head: true });
      
      // Usuarios únicos que han enviado propinas
      const uniqueTippers = new Set(allTips.map(t => t.sender?.display_name).filter(Boolean));
      const conversionRate = totalUsers ? (uniqueTippers.size / totalUsers) * 100 : 0;

      // Golden Boost Permanente stats
      let permanentSponsors = 0;
      let permanentRevenue = 0;
      let highlightedSponsors = 0;
      try {
        const { data: permanentData } = await supabase
          .from('ws_golden_boost_permanent')
          .select('amount_cents, is_highlighted');
        
        if (permanentData) {
          permanentSponsors = permanentData.length;
          permanentRevenue = permanentData.reduce((sum, p) => sum + (p.amount_cents || 1999), 0) / 100;
          highlightedSponsors = permanentData.filter(p => p.is_highlighted).length;
        }
      } catch (e) {
        // Tabla puede no existir todavía
        // console.log('Permanent sponsors table not ready');
      }

      setStats({
        totalRevenue,
        totalPlatformFees,
        totalTips: allTips.length,
        avgTipPerSession,
        conversionRate,
        permanentSponsors,
        permanentRevenue,
        highlightedSponsors,
      });

      // Agrupar por DJ
      const djMap = new Map<string, { total: number; count: number }>();
      allTips.forEach(t => {
        const djName = t.receiver?.dj_name || t.receiver?.display_name || 'Unknown DJ';
        const current = djMap.get(djName) || { total: 0, count: 0 };
        djMap.set(djName, {
          total: current.total + Number(t.amount),
          count: current.count + 1,
        });
      });
      setTipsByDJ(
        Array.from(djMap.entries())
          .map(([dj, data]) => ({
            dj,
            total: data.total,
            count: data.count,
            avg: data.total / data.count,
          }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5)
      );

      // Agrupar por tipper
      const tipperMap = new Map<string, { total: number; count: number }>();
      allTips.forEach(t => {
        const tipperName = t.sender?.display_name || 'Anónimo';
        const current = tipperMap.get(tipperName) || { total: 0, count: 0 };
        tipperMap.set(tipperName, {
          total: current.total + Number(t.amount),
          count: current.count + 1,
        });
      });
      setTopTippers(
        Array.from(tipperMap.entries())
          .map(([name, data]) => ({
            name,
            total: data.total,
            count: data.count,
            avg: data.total / data.count,
          }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5)
      );

    } catch (e) {
      console.error('Error loading revenue data:', e);
    }
    
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();

    // Suscripción a nuevas propinas en tiempo real
    const channel = supabase
      .channel('admin-tips')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ws_tips' },
        () => {
          loadData(); // Recargar cuando hay nueva propina
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={[s.main, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={s.main} 
      contentContainerStyle={s.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      <View style={s.header}>
        <Text style={s.title}>💰 Revenue</Text>
        {!paymentStatus.enabled && (
          <View style={s.testBadge}>
            <Ionicons name="flask" size={14} color={colors.warning} />
            <Text style={s.testBadgeText}>Modo demo</Text>
          </View>
        )}
      </View>

      <View style={s.statsGrid}>
        <View style={s.stat}>
          <View style={[s.statIcon, {backgroundColor: colors.warning+'18'}]}>
            <Ionicons name="cash" size={20} color={colors.warning}/>
          </View>
          <Text style={s.statVal}>€{stats.totalRevenue.toFixed(2)}</Text>
          <Text style={s.statLabel}>Revenue total</Text>
          <Text style={[s.statTrend, {color: colors.primary}]}>{stats.totalTips} propinas</Text>
        </View>
        <View style={s.stat}>
          <View style={[s.statIcon, {backgroundColor: colors.primary+'18'}]}>
            <Ionicons name="trending-up" size={20} color={colors.primary}/>
          </View>
          <Text style={s.statVal}>€{stats.totalPlatformFees.toFixed(2)}</Text>
          <Text style={s.statLabel}>Comisión WhatsSound</Text>
          <Text style={[s.statTrend, {color: colors.textMuted}]}>{(PLATFORM_FEE_PERCENT * 100).toFixed(0)}% del total</Text>
        </View>
        <View style={s.stat}>
          <View style={[s.statIcon, {backgroundColor: '#FB923C18'}]}>
            <Ionicons name="gift" size={20} color="#FB923C"/>
          </View>
          <Text style={s.statVal}>€{stats.avgTipPerSession.toFixed(2)}</Text>
          <Text style={s.statLabel}>Propina media/sesión</Text>
        </View>
        <View style={s.stat}>
          <View style={[s.statIcon, {backgroundColor: '#A78BFA18'}]}>
            <Ionicons name="people" size={20} color="#A78BFA"/>
          </View>
          <Text style={s.statVal}>{stats.conversionRate.toFixed(1)}%</Text>
          <Text style={s.statLabel}>Tasa de conversión</Text>
          <Text style={s.statLabel}>(envían propina)</Text>
        </View>
      </View>

      {/* Golden Boost Revenue */}
      <Text style={[s.title, {fontSize: 18, marginTop: spacing.lg}]}>🏆 Golden Boosts</Text>
      <View style={s.statsGrid}>
        <View style={s.stat}>
          <View style={[s.statIcon, {backgroundColor: '#FFD70018'}]}>
            <Ionicons name="trophy" size={20} color="#FFD700"/>
          </View>
          <Text style={s.statVal}>€0.00</Text>
          <Text style={s.statLabel}>Revenue GB extras</Text>
          <Text style={[s.statTrend, {color: colors.textMuted}]}>Compras €4.99/€9.99</Text>
        </View>
        <View style={s.stat}>
          <View style={[s.statIcon, {backgroundColor: '#FFD70018'}]}>
            <Ionicons name="diamond" size={20} color="#FFD700"/>
          </View>
          <Text style={s.statVal}>€{stats.permanentRevenue.toFixed(2)}</Text>
          <Text style={s.statLabel}>Revenue GB permanentes</Text>
          <Text style={[s.statTrend, {color: '#FFD700'}]}>{stats.permanentSponsors} patrocinadores</Text>
        </View>
        <View style={s.stat}>
          <View style={[s.statIcon, {backgroundColor: '#FFD70018'}]}>
            <Ionicons name="star" size={20} color="#FFD700"/>
          </View>
          <Text style={s.statVal}>{stats.highlightedSponsors}</Text>
          <Text style={s.statLabel}>Destacados (+€9.99)</Text>
        </View>
        <View style={s.stat}>
          <View style={[s.statIcon, {backgroundColor: '#FFD70018'}]}>
            <Ionicons name="pie-chart" size={20} color="#FFD700"/>
          </View>
          <Text style={s.statVal}>0%</Text>
          <Text style={s.statLabel}>Conversión compra GB</Text>
          <Text style={s.statLabel}>(de gratis a pago)</Text>
        </View>
      </View>

      <View style={isWide ? s.twoCol : undefined}>
        {/* Tips by DJ */}
        <View style={[s.tableCard, isWide ? {flex:1, marginRight: spacing.md} : {marginBottom: spacing.md}]}>
          <Text style={s.tableTitle}>🎧 Revenue por DJ</Text>
          {tipsByDJ.length === 0 ? (
            <Text style={s.emptyText}>Sin propinas aún</Text>
          ) : (
            <>
              <View style={s.tableHead}>
                {['DJ','Total','Propinas','Media'].map(h => 
                  <Text key={h} style={[s.th, h==='DJ'?{flex:2}:{}]}>{h}</Text>
                )}
              </View>
              {tipsByDJ.map((d,i) => (
                <View key={i} style={[s.tr, i%2===0 && s.trAlt]}>
                  <Text style={[s.td, {flex:2, fontWeight:'600'}]}>{d.dj}</Text>
                  <Text style={[s.td, {color: colors.warning, fontWeight:'700'}]}>€{d.total.toFixed(2)}</Text>
                  <Text style={s.td}>{d.count}</Text>
                  <Text style={s.td}>€{d.avg.toFixed(2)}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Top Tippers */}
        <View style={[s.tableCard, isWide ? {flex:1} : {marginBottom: spacing.md}]}>
          <Text style={s.tableTitle}>⭐ Top Tippers</Text>
          {topTippers.length === 0 ? (
            <Text style={s.emptyText}>Sin propinas aún</Text>
          ) : (
            <>
              <View style={s.tableHead}>
                {['Usuario','Total','Propinas','Media'].map(h => 
                  <Text key={h} style={[s.th, h==='Usuario'?{flex:2}:{}]}>{h}</Text>
                )}
              </View>
              {topTippers.map((t,i) => (
                <View key={i} style={[s.tr, i%2===0 && s.trAlt]}>
                  <Text style={[s.td, {flex:2, fontWeight:'600'}]}>{t.name}</Text>
                  <Text style={[s.td, {color: colors.warning, fontWeight:'700'}]}>€{t.total.toFixed(2)}</Text>
                  <Text style={s.td}>{t.count}</Text>
                  <Text style={s.td}>€{t.avg.toFixed(2)}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </View>

      {/* Recent Tips */}
      <View style={s.tableCard}>
        <Text style={s.tableTitle}>📋 Propinas recientes</Text>
        {tips.length === 0 ? (
          <Text style={s.emptyText}>Sin propinas aún</Text>
        ) : (
          <>
            <View style={s.tableHead}>
              {['De', 'Para', 'Sesión', 'Cantidad', 'Fecha'].map(h => 
                <Text key={h} style={[s.th, {flex: 1}]}>{h}</Text>
              )}
            </View>
            {tips.slice(0, 10).map((t, i) => (
              <View key={t.id} style={[s.tr, i%2===0 && s.trAlt]}>
                <Text style={[s.td, {flex: 1}]}>{t.sender?.display_name || 'Anónimo'}</Text>
                <Text style={[s.td, {flex: 1}]}>{t.receiver?.dj_name || t.receiver?.display_name || 'DJ'}</Text>
                <Text style={[s.td, {flex: 1}]}>{t.session?.name || '—'}</Text>
                <Text style={[s.td, {flex: 1, color: colors.warning, fontWeight: '700'}]}>€{Number(t.amount).toFixed(2)}</Text>
                <Text style={[s.td, {flex: 1, fontSize: 11}]}>
                  {new Date(t.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                </Text>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  main: { flex: 1 },
  content: { padding: isWide ? spacing.xl : spacing.md, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  title: { ...typography.h2, color: colors.textPrimary, fontSize: 24 },
  testBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.warning + '15',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: borderRadius.full,
  },
  testBadgeText: { ...typography.caption, color: colors.warning },
  statsGrid: { gap: spacing.sm, marginBottom: spacing.lg, ...(Platform.OS === 'web' ? { display: 'grid' as any, gridTemplateColumns: isWide ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)' } : { flexDirection: 'row', flexWrap: 'wrap' }) },
  stat: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth:1, borderColor: colors.border, gap: 4 },
  statIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  statVal: { ...typography.h2, color: colors.textPrimary, fontSize: 22 },
  statLabel: { ...typography.caption, color: colors.textMuted, fontSize: 11 },
  statTrend: { ...typography.captionBold, fontSize: 11 },
  twoCol: { flexDirection: 'row' },
  tableCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth:1, borderColor: colors.border, marginBottom: spacing.md },
  tableTitle: { ...typography.h3, color: colors.textPrimary, fontSize: 15, marginBottom: spacing.sm },
  tableHead: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: spacing.sm },
  th: { ...typography.captionBold, color: colors.textMuted, fontSize: 11, width: 80 },
  tr: { flexDirection: 'row', paddingVertical: spacing.sm, alignItems: 'center' },
  trAlt: { backgroundColor: '#0d132180' },
  td: { ...typography.bodySmall, color: colors.textPrimary, fontSize: 13, width: 80 },
  emptyText: { ...typography.body, color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.xl },
});

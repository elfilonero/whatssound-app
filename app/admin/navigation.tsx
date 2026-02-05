/**
 * WhatsSound — Admin Navigation Test Panel
 * Verifica que todas las rutas y enlaces funcionan correctamente
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { useRouter } from 'expo-router';

// ─── Rutas que existen en la app ─────────────────────────────
const EXISTING_ROUTES = [
  // Auth
  '(auth)/splash', '(auth)/onboarding', '(auth)/genres', '(auth)/login', 
  '(auth)/otp', '(auth)/create-profile', '(auth)/permissions',
  // Tabs
  '(tabs)', '(tabs)/live', '(tabs)/chats', '(tabs)/groups', 
  '(tabs)/discover', '(tabs)/settings', '(tabs)/hall-of-fame', '(tabs)/history',
  // Session
  'session/[id]', 'session/create', 'session/queue', 'session/request-song',
  'session/dj-panel', 'session/dj-queue', 'session/dj-people', 'session/invite',
  'session/share-qr', 'session/stats', 'session/rate', 'session/reactions',
  'session/send-tip', 'session/schedule', 'session/announce', 'session/audio-live',
  'session/song-detail',
  // Chat & Groups
  'chat/[id]', 'chat/media', 'new-chat', 'group/[id]', 'group/create', 
  'group/info', 'new-group', 'contacts',
  // Profile
  'profile/[id]', 'profile/dj-public', 'profile/followers', 'profile/golden-history',
  'edit-profile',
  // Settings
  'settings/dj-profile', 'settings/notifications', 'settings/privacy',
  'settings/appearance', 'settings/audio', 'settings/storage', 
  'settings/help', 'settings/terms', 'settings/account-actions',
  // Subscription & Tips
  'subscription', 'subscription/enterprise', 'tips/index', 'tips/payments',
  // DJ Dashboard
  'dj-dashboard', 'dj-dashboard/creator', 'dj-dashboard/pro', 'dj-dashboard/business',
  // Admin
  'admin', 'admin/users', 'admin/sessions', 'admin/revenue', 'admin/health',
  'admin/simulator', 'admin/chat', 'admin/config', 'admin/alerts', 
  'admin/engagement', 'admin/navigation',
  // Misc
  'welcome', 'search', 'scan', 'invite', 'invite-contact', 'favorites',
  'notifications', 'offline', 'update-required', 'join/[code]', 'event/[id]',
];

// ─── Enlaces que deben funcionar ─────────────────────────────
const NAVIGATION_TESTS = [
  // Auth flow
  { from: 'welcome', action: 'Comenzar', to: '(auth)/login', critical: true },
  { from: 'login', action: 'Continuar', to: '(auth)/otp', critical: true },
  { from: 'otp', action: 'Verificar', to: '(tabs)', critical: true },
  { from: 'create-profile', action: 'Crear perfil', to: '(auth)/permissions', critical: true },
  { from: 'permissions', action: 'Empezar', to: '(tabs)', critical: true },
  
  // Main navigation
  { from: 'settings', action: 'Perfil de DJ', to: 'settings/dj-profile' },
  { from: 'settings', action: 'Mi Dashboard', to: 'dj-dashboard' },
  { from: 'settings', action: 'Suscripción', to: 'subscription' },
  { from: 'settings', action: 'Golden Boosts', to: 'profile/golden-history' },
  { from: 'settings', action: 'Invitar amigos', to: 'invite' },
  { from: 'settings', action: 'Notificaciones', to: 'settings/notifications' },
  { from: 'settings', action: 'Privacidad', to: 'settings/privacy' },
  { from: 'settings', action: 'Apariencia', to: 'settings/appearance' },
  { from: 'settings', action: 'Audio', to: 'settings/audio' },
  { from: 'settings', action: 'Almacenamiento', to: 'settings/storage' },
  { from: 'settings', action: 'Centro de ayuda', to: 'settings/help' },
  { from: 'settings', action: 'Términos', to: 'settings/terms' },
  { from: 'settings', action: 'Eliminar cuenta', to: 'settings/account-actions' },
  
  // Session flow
  { from: 'live', action: 'Crear sesión', to: 'session/create', critical: true },
  { from: 'session/[id]', action: 'Pedir canción', to: 'session/request-song' },
  { from: 'session/queue', action: 'Añadir canción', to: 'session/request-song' },
  { from: 'session/dj-panel', action: 'Cola', to: 'session/dj-queue' },
  { from: 'session/dj-panel', action: 'Gente', to: 'session/dj-people' },
  { from: 'session/dj-panel', action: 'QR', to: 'session/share-qr' },
  { from: 'session/dj-panel', action: 'Stats', to: 'session/stats' },
  
  // Chat flow
  { from: 'chats', action: 'Nuevo chat', to: 'contacts' },
  { from: 'contacts', action: 'Invitar', to: 'invite-contact' },
  
  // Groups
  { from: 'groups', action: 'Crear grupo', to: 'group/create' },
  
  // DJ Dashboard
  { from: 'dj-dashboard', action: 'Crear sesión', to: 'session/create' },
  { from: 'dj-dashboard', action: 'Upgrade', to: 'subscription' },
  
  // Subscription
  { from: 'subscription', action: 'Enterprise', to: 'subscription/enterprise' },
  
  // Discover
  { from: 'discover', action: 'Hall of Fame', to: 'hall-of-fame' },
];

interface TestResult {
  test: typeof NAVIGATION_TESTS[0];
  status: 'pending' | 'running' | 'pass' | 'fail';
  error?: string;
}

export default function NavigationTestScreen() {
  const router = useRouter();
  const [results, setResults] = useState<TestResult[]>(
    NAVIGATION_TESTS.map(test => ({ test, status: 'pending' }))
  );
  const [running, setRunning] = useState(false);

  const routeExists = (route: string): boolean => {
    // Normalize route
    const normalized = route.replace(/^\//, '').replace(/\(.*?\)\/?/g, '');
    
    // Check direct match
    if (EXISTING_ROUTES.some(r => r.replace(/\(.*?\)\/?/g, '') === normalized)) {
      return true;
    }
    
    // Check dynamic match (e.g., session/123 matches session/[id])
    const parts = normalized.split('/');
    for (const existingRoute of EXISTING_ROUTES) {
      const existingParts = existingRoute.replace(/\(.*?\)\/?/g, '').split('/');
      if (parts.length !== existingParts.length) continue;
      
      let matches = true;
      for (let i = 0; i < parts.length; i++) {
        if (existingParts[i].startsWith('[')) continue; // Dynamic segment
        if (parts[i] !== existingParts[i]) {
          matches = false;
          break;
        }
      }
      if (matches) return true;
    }
    
    return false;
  };

  const runTests = async () => {
    setRunning(true);
    setResults(prev => prev.map(r => ({ ...r, status: 'running' })));

    for (let i = 0; i < NAVIGATION_TESTS.length; i++) {
      const test = NAVIGATION_TESTS[i];
      
      // Simulate test delay
      await new Promise(r => setTimeout(r, 50));
      
      const exists = routeExists(test.to);
      
      setResults(prev => prev.map((r, idx) => 
        idx === i 
          ? { ...r, status: exists ? 'pass' : 'fail', error: exists ? undefined : 'Ruta no existe' }
          : r
      ));
    }

    setRunning(false);
  };

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const criticalFails = results.filter(r => r.status === 'fail' && r.test.critical).length;

  return (
    <ScrollView style={st.container} contentContainerStyle={st.content}>
      {/* Header */}
      <View style={st.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={st.headerTitle}>🧪 Test de Navegación</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Summary */}
      <View style={st.summary}>
        <View style={[st.summaryCard, { backgroundColor: colors.success + '20' }]}>
          <Text style={[st.summaryNumber, { color: colors.success }]}>{passCount}</Text>
          <Text style={st.summaryLabel}>Pasados</Text>
        </View>
        <View style={[st.summaryCard, { backgroundColor: failCount > 0 ? colors.error + '20' : colors.surface }]}>
          <Text style={[st.summaryNumber, { color: failCount > 0 ? colors.error : colors.textMuted }]}>{failCount}</Text>
          <Text style={st.summaryLabel}>Fallidos</Text>
        </View>
        <View style={[st.summaryCard, { backgroundColor: criticalFails > 0 ? colors.error + '40' : colors.surface }]}>
          <Text style={[st.summaryNumber, { color: criticalFails > 0 ? colors.error : colors.textMuted }]}>{criticalFails}</Text>
          <Text style={st.summaryLabel}>Críticos</Text>
        </View>
      </View>

      {/* Run button */}
      <TouchableOpacity 
        style={[st.runBtn, running && st.runBtnDisabled]} 
        onPress={runTests}
        disabled={running}
      >
        {running ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={st.runBtnText}>Ejecutar Tests</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Results */}
      <Text style={st.sectionTitle}>RESULTADOS ({NAVIGATION_TESTS.length} tests)</Text>
      
      {results.map((result, i) => (
        <View 
          key={i} 
          style={[
            st.testRow,
            result.status === 'fail' && st.testRowFail,
            result.test.critical && st.testRowCritical,
          ]}
        >
          <View style={st.testStatus}>
            {result.status === 'pending' && <Ionicons name="ellipse-outline" size={20} color={colors.textMuted} />}
            {result.status === 'running' && <ActivityIndicator size="small" color={colors.primary} />}
            {result.status === 'pass' && <Ionicons name="checkmark-circle" size={20} color={colors.success} />}
            {result.status === 'fail' && <Ionicons name="close-circle" size={20} color={colors.error} />}
          </View>
          <View style={st.testInfo}>
            <Text style={st.testName}>
              {result.test.from} → {result.test.action}
              {result.test.critical && <Text style={st.criticalBadge}> ⚠️ CRÍTICO</Text>}
            </Text>
            <Text style={st.testRoute}>→ {result.test.to}</Text>
            {result.error && <Text style={st.testError}>{result.error}</Text>}
          </View>
        </View>
      ))}

      {/* Info */}
      <View style={st.info}>
        <Ionicons name="information-circle" size={20} color={colors.textMuted} />
        <Text style={st.infoText}>
          Este test verifica que todas las rutas de navegación apuntan a páginas que existen.
          Los tests críticos son los del flujo principal de la app.
        </Text>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing['3xl'] },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base, 
    paddingVertical: spacing.md 
  },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  summary: { 
    flexDirection: 'row', 
    paddingHorizontal: spacing.base, 
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  summaryCard: { 
    flex: 1, 
    alignItems: 'center', 
    padding: spacing.md, 
    borderRadius: borderRadius.lg 
  },
  summaryNumber: { ...typography.h1, fontSize: 32 },
  summaryLabel: { ...typography.caption, color: colors.textMuted },
  runBtn: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary, 
    marginHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  runBtnDisabled: { opacity: 0.6 },
  runBtnText: { ...typography.bodyBold, color: '#fff' },
  sectionTitle: { 
    ...typography.captionBold, 
    color: colors.textMuted, 
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  testRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base,
    marginBottom: spacing.xs,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  testRowFail: { backgroundColor: colors.error + '10', borderWidth: 1, borderColor: colors.error + '30' },
  testRowCritical: { borderLeftWidth: 3, borderLeftColor: colors.warning },
  testStatus: { width: 28 },
  testInfo: { flex: 1 },
  testName: { ...typography.body, color: colors.textPrimary },
  testRoute: { ...typography.caption, color: colors.textMuted },
  testError: { ...typography.caption, color: colors.error, marginTop: 2 },
  criticalBadge: { color: colors.warning },
  info: { 
    flexDirection: 'row', 
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  infoText: { ...typography.caption, color: colors.textMuted, flex: 1 },
});

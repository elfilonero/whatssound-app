/**
 * WhatsSound — Debug Overlay
 * Muestra logs en pantalla durante pruebas
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { debugLog } from '../../lib/debugToast';
import { colors } from '../../theme/colors';

export function DebugOverlay() {
  const [messages, setMessages] = useState<string[]>([]);
  const [minimized, setMinimized] = useState(true);

  useEffect(() => {
    // Cargar mensajes existentes
    setMessages(debugLog.getQueue());

    // Suscribirse a nuevos mensajes
    const unsubscribe = debugLog.subscribe((msg) => {
      setMessages(prev => [...prev.slice(-9), msg]);
      // Auto-expandir en errores
      if (msg.startsWith('❌')) {
        setMinimized(false);
      }
    });

    return unsubscribe;
  }, []);

  if (messages.length === 0) return null;

  const hasErrors = messages.some(m => m.startsWith('❌'));

  if (minimized) {
    return (
      <TouchableOpacity 
        style={[styles.badge, hasErrors && styles.badgeError]}
        onPress={() => setMinimized(false)}
      >
        <Text style={styles.badgeText}>
          {hasErrors ? '❌' : '📋'} {messages.length}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔍 Debug Logs</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => { debugLog.clear(); setMessages([]); }}>
            <Text style={styles.action}>Limpiar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMinimized(true)}>
            <Text style={styles.action}>Minimizar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.logs}>
        {messages.map((msg, i) => (
          <Text 
            key={i} 
            style={[
              styles.log,
              msg.startsWith('❌') && styles.logError,
              msg.startsWith('✅') && styles.logSuccess,
              msg.startsWith('⚠️') && styles.logWarn,
            ]}
          >
            {msg}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 10,
    right: 10,
    maxHeight: 200,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 12,
    padding: 10,
    zIndex: 9999,
    ...(Platform.OS === 'web' ? { position: 'fixed' as any } : {}),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 8,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  action: {
    color: colors.primary,
    fontSize: 12,
  },
  logs: {
    maxHeight: 140,
  },
  log: {
    color: '#ccc',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 4,
  },
  logError: {
    color: '#ff6b6b',
  },
  logSuccess: {
    color: '#51cf66',
  },
  logWarn: {
    color: '#fcc419',
  },
  badge: {
    position: 'absolute',
    bottom: 90,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 9999,
    ...(Platform.OS === 'web' ? { position: 'fixed' as any } : {}),
  },
  badgeError: {
    backgroundColor: 'rgba(255,0,0,0.8)',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
});

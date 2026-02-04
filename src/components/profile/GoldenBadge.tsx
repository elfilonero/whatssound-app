/**
 * WhatsSound — GoldenBadge Component
 * Muestra el badge y contador de Golden Boosts en el perfil
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface GoldenBadgeProps {
  /** Número total de Golden Boosts recibidos */
  count: number;
  /** Badge actual */
  badge: 'none' | 'rising_star' | 'fan_favorite' | 'verified' | 'hall_of_fame';
  /** Tamaño del componente */
  size?: 'small' | 'medium' | 'large';
  /** Mostrar como clickeable para ir al historial */
  interactive?: boolean;
  /** ID del usuario para navegar al historial */
  userId?: string;
}

const BADGE_CONFIG = {
  none: { icon: null, name: null, color: '#666' },
  rising_star: { icon: '🌟', name: 'Rising Star', color: '#FFD700' },
  fan_favorite: { icon: '⭐', name: 'Fan Favorite', color: '#FFA500' },
  verified: { icon: '✓', name: 'Verificado', color: '#00BFFF' },
  hall_of_fame: { icon: '🏆', name: 'Hall of Fame', color: '#FFD700' },
};

export function GoldenBadge({
  count,
  badge,
  size = 'medium',
  interactive = true,
  userId,
}: GoldenBadgeProps) {
  const config = BADGE_CONFIG[badge];
  
  const sizes = {
    small: { icon: 14, text: 12, padding: 4, gap: 3 },
    medium: { icon: 18, text: 14, padding: 8, gap: 6 },
    large: { icon: 24, text: 18, padding: 12, gap: 8 },
  };
  const s = sizes[size];

  const handlePress = () => {
    if (interactive && userId) {
      router.push('/profile/golden-history');
    }
  };

  // No mostrar si no tiene Golden Boosts
  if (count === 0 && badge === 'none') {
    return null;
  }

  const Container = interactive ? Pressable : View;

  return (
    <Container
      style={[
        styles.container,
        {
          padding: s.padding,
          gap: s.gap,
          borderColor: config.color + '40',
        },
      ]}
      onPress={interactive ? handlePress : undefined}
    >
      {/* Icono de trofeo */}
      <Ionicons name="trophy" size={s.icon} color="#FFD700" />
      
      {/* Contador */}
      <Text style={[styles.count, { fontSize: s.text }]}>
        {count}
      </Text>
      
      {/* Badge si tiene */}
      {config.icon && (
        <Text style={{ fontSize: s.icon }}>{config.icon}</Text>
      )}
    </Container>
  );
}

/**
 * Versión inline para mostrar en listas o cards pequeñas
 */
export function GoldenBadgeInline({
  count,
  badge,
}: Pick<GoldenBadgeProps, 'count' | 'badge'>) {
  const config = BADGE_CONFIG[badge];
  
  if (count === 0 && badge === 'none') {
    return null;
  }

  return (
    <View style={styles.inline}>
      <Ionicons name="trophy" size={12} color="#FFD700" />
      <Text style={styles.inlineCount}>{count}</Text>
      {config.icon && <Text style={styles.inlineIcon}>{config.icon}</Text>}
    </View>
  );
}

/**
 * Badge completo con nombre para mostrar en perfil
 */
export function GoldenBadgeFull({
  count,
  badge,
  showProgress = false,
}: GoldenBadgeProps & { showProgress?: boolean }) {
  const config = BADGE_CONFIG[badge];
  
  // Calcular progreso al siguiente badge
  const getProgress = () => {
    if (count < 10) return { current: count, target: 10, next: 'Rising Star' };
    if (count < 50) return { current: count, target: 50, next: 'Fan Favorite' };
    if (count < 100) return { current: count, target: 100, next: 'Verificado' };
    if (count < 500) return { current: count, target: 500, next: 'Hall of Fame' };
    return null;
  };
  
  const progress = showProgress ? getProgress() : null;

  return (
    <View style={styles.fullContainer}>
      <View style={styles.fullHeader}>
        <Ionicons name="trophy" size={28} color="#FFD700" />
        <View style={styles.fullInfo}>
          <Text style={styles.fullCount}>{count} Golden Boosts</Text>
          {config.name && (
            <View style={styles.fullBadgeRow}>
              <Text style={{ fontSize: 16 }}>{config.icon}</Text>
              <Text style={[styles.fullBadgeName, { color: config.color }]}>
                {config.name}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Barra de progreso al siguiente badge */}
      {progress && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Próximo: {progress.next}
            </Text>
            <Text style={styles.progressValue}>
              {progress.current}/{progress.target}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(progress.current / progress.target) * 100}%` }
              ]} 
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
  },
  count: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  // Inline
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  inlineCount: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inlineIcon: {
    fontSize: 10,
  },
  // Full
  fullContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFD70033',
  },
  fullHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fullInfo: {
    flex: 1,
  },
  fullCount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fullBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  fullBadgeName: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressSection: {
    marginTop: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#888',
    fontSize: 12,
  },
  progressValue: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
});

export default GoldenBadge;

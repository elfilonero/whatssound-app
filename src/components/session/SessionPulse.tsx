/**
 * WhatsSound — SessionPulse
 * Indicador visual que late con la actividad de la sesión
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { supabase } from '../../lib/supabase';

type ActivityLevel = 'low' | 'medium' | 'high';

interface Props {
  sessionId: string;
  size?: number;
  color?: string;
}

const ACTIVITY_CONFIG = {
  low: { 
    duration: 2000, 
    maxScale: 1.15, 
    maxOpacity: 0.4,
    glowSize: 0,
  },
  medium: { 
    duration: 1200, 
    maxScale: 1.25, 
    maxOpacity: 0.6,
    glowSize: 4,
  },
  high: { 
    duration: 600, 
    maxScale: 1.4, 
    maxOpacity: 0.85,
    glowSize: 8,
  },
};

export function SessionPulse({ sessionId, size = 24, color = colors.primary }: Props) {
  const [level, setLevel] = useState<ActivityLevel>('low');
  const eventCount = useRef(0);
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);
  const glowOpacity = useSharedValue(0);

  // Escuchar eventos de la sesión para calcular actividad
  useEffect(() => {
    if (!sessionId) return;

    // Calcular nivel cada 10 segundos
    const interval = setInterval(() => {
      const eventsPerMinute = eventCount.current * 6; // Extrapolado a minuto
      
      if (eventsPerMinute < 5) {
        setLevel('low');
      } else if (eventsPerMinute < 20) {
        setLevel('medium');
      } else {
        setLevel('high');
      }
      
      eventCount.current = 0;
    }, 10000);

    // Escuchar cambios en la sesión
    const channel = supabase
      .channel(`pulse:${sessionId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ws_messages', filter: `session_id=eq.${sessionId}` },
        () => { eventCount.current++; }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'ws_votes', filter: `session_id=eq.${sessionId}` },
        () => { eventCount.current++; }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'ws_tips', filter: `session_id=eq.${sessionId}` },
        () => { eventCount.current += 3; } // Propinas pesan más
      )
      .on('broadcast', { event: 'reaction' }, () => { eventCount.current++; })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Actualizar animación cuando cambia el nivel
  useEffect(() => {
    const config = ACTIVITY_CONFIG[level];
    
    // Cancelar animaciones anteriores
    cancelAnimation(scale);
    cancelAnimation(opacity);
    cancelAnimation(glowOpacity);

    // Nueva animación
    scale.value = withRepeat(
      withSequence(
        withTiming(config.maxScale, { duration: config.duration / 2 }),
        withTiming(1, { duration: config.duration / 2 })
      ),
      -1,
      false
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(config.maxOpacity, { duration: config.duration / 2 }),
        withTiming(0.2, { duration: config.duration / 2 })
      ),
      -1,
      false
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(level === 'high' ? 0.5 : 0, { duration: config.duration / 2 }),
        withTiming(0, { duration: config.duration / 2 })
      ),
      -1,
      false
    );
  }, [level]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const coreSize = size * 0.5;
  const config = ACTIVITY_CONFIG[level];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Glow exterior (solo en high) */}
      <Animated.View 
        style={[
          styles.glow, 
          { 
            width: size + config.glowSize * 2, 
            height: size + config.glowSize * 2,
            borderRadius: (size + config.glowSize * 2) / 2,
            backgroundColor: color,
          },
          glowStyle
        ]} 
      />
      
      {/* Pulso */}
      <Animated.View 
        style={[
          styles.pulse, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            backgroundColor: color,
          },
          pulseStyle
        ]} 
      />
      
      {/* Core sólido */}
      <View 
        style={[
          styles.core, 
          { 
            width: coreSize, 
            height: coreSize, 
            borderRadius: coreSize / 2,
            backgroundColor: color,
          }
        ]} 
      />
    </View>
  );
}

/**
 * Hook para obtener nivel de actividad
 */
export function useSessionActivity(sessionId: string): ActivityLevel {
  const [level, setLevel] = useState<ActivityLevel>('low');
  const eventCount = useRef(0);

  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(() => {
      const rate = eventCount.current * 6;
      setLevel(rate < 5 ? 'low' : rate < 20 ? 'medium' : 'high');
      eventCount.current = 0;
    }, 10000);

    const channel = supabase
      .channel(`activity:${sessionId}`)
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        eventCount.current++;
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return level;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  pulse: {
    position: 'absolute',
  },
  core: {
    // Sólido, sin animación
  },
});

export default SessionPulse;

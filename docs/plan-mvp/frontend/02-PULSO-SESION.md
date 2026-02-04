# 🎨 PULSO DE LA SESIÓN — Arquitecto Frontend

**Prioridad:** 🟡 Alta  
**Esfuerzo:** 4 horas  
**Dependencias:** Ninguna

---

## 🎯 Objetivo

Un indicador visual que "late" con la actividad de la sesión. Cuando hay muchos votos, propinas y mensajes, el pulso se intensifica.

---

## 🎬 Comportamiento

```
Actividad baja  → Pulso lento, sutil
Actividad media → Pulso normal
Actividad alta  → Pulso rápido, intenso, brilla
```

---

## 📋 Implementación

```typescript
// src/components/session/SessionPulse.tsx

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

interface Props {
  activityLevel: 'low' | 'medium' | 'high';
}

export function SessionPulse({ activityLevel }: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);

  const config = {
    low: { duration: 2000, maxScale: 1.1, maxOpacity: 0.3 },
    medium: { duration: 1000, maxScale: 1.2, maxOpacity: 0.5 },
    high: { duration: 500, maxScale: 1.4, maxOpacity: 0.8 },
  };

  const { duration, maxScale, maxOpacity } = config[activityLevel];

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(maxScale, { duration: duration / 2 }),
        withTiming(1, { duration: duration / 2 })
      ),
      -1,
      false
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(maxOpacity, { duration: duration / 2 }),
        withTiming(0.2, { duration: duration / 2 })
      ),
      -1,
      false
    );
  }, [activityLevel]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pulse, animatedStyle]} />
      <View style={styles.core} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  core: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
});
```

### Hook para calcular nivel de actividad

```typescript
// src/hooks/useSessionActivity.ts

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSessionActivity(sessionId: string) {
  const [level, setLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [eventsPerMinute, setEventsPerMinute] = useState(0);

  useEffect(() => {
    let eventCount = 0;
    const interval = setInterval(() => {
      // Calcular nivel basado en eventos/minuto
      if (eventCount < 5) setLevel('low');
      else if (eventCount < 20) setLevel('medium');
      else setLevel('high');
      
      setEventsPerMinute(eventCount);
      eventCount = 0;
    }, 60000);

    // Escuchar eventos
    const channel = supabase
      .channel(`activity:${sessionId}`)
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        eventCount++;
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return { level, eventsPerMinute };
}
```

---

## ✅ Checklist

- [ ] Componente SessionPulse creado
- [ ] Hook useSessionActivity creado
- [ ] 3 niveles de intensidad funcionan
- [ ] Animación suave entre niveles
- [ ] Integrado en header de sesión

---

**Firma:** 🎨 Arquitecto Frontend

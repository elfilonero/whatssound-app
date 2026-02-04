# 🎨 REACCIONES FLOTANTES — Arquitecto Frontend

**Prioridad:** 🟡 Alta  
**Esfuerzo:** 6 horas  
**Dependencias:** Ninguna  
**Impacto:** Alto (feedback visual inmediato)

---

## 🎯 Objetivo

Cuando alguien reacciona (🔥❤️👏😂🎵), la reacción flota desde abajo hacia arriba como en TikTok Live o Instagram Live.

---

## 🎬 Comportamiento

```
Usuario pulsa 🔥
    ↓
Emoji aparece en esquina inferior derecha
    ↓
Flota hacia arriba con movimiento ondulante
    ↓
Se desvanece al llegar arriba
    ↓
Duración total: ~2 segundos
```

---

## 📋 Implementación

### 1. Crear componente FloatingReaction

```typescript
// src/components/session/FloatingReaction.tsx

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

interface Props {
  emoji: string;
  onComplete: () => void;
  startX: number;
}

export function FloatingReaction({ emoji, onComplete, startX }: Props) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // Escala de entrada
    scale.value = withSequence(
      withTiming(1.2, { duration: 150 }),
      withTiming(1, { duration: 100 })
    );

    // Movimiento hacia arriba
    translateY.value = withTiming(-400, {
      duration: 2000,
      easing: Easing.out(Easing.cubic),
    });

    // Movimiento ondulante horizontal
    translateX.value = withSequence(
      withTiming(20, { duration: 500 }),
      withTiming(-20, { duration: 500 }),
      withTiming(15, { duration: 500 }),
      withTiming(0, { duration: 500 })
    );

    // Fade out al final
    opacity.value = withDelay(
      1500,
      withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(onComplete)();
        }
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text 
      style={[
        styles.emoji, 
        { left: startX },
        animatedStyle
      ]}
    >
      {emoji}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  emoji: {
    position: 'absolute',
    bottom: 100,
    fontSize: 32,
  },
});
```

### 2. Crear container de reacciones

```typescript
// src/components/session/FloatingReactionsContainer.tsx

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { FloatingReaction } from './FloatingReaction';

const { width } = Dimensions.get('window');

interface Reaction {
  id: string;
  emoji: string;
  x: number;
}

export function FloatingReactionsContainer() {
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const addReaction = useCallback((emoji: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const x = width - 80 + Math.random() * 40; // Zona derecha con variación

    setReactions(prev => [...prev, { id, emoji, x }]);
  }, []);

  const removeReaction = useCallback((id: string) => {
    setReactions(prev => prev.filter(r => r.id !== id));
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {reactions.map(reaction => (
        <FloatingReaction
          key={reaction.id}
          emoji={reaction.emoji}
          startX={reaction.x}
          onComplete={() => removeReaction(reaction.id)}
        />
      ))}
    </View>
  );
}

// Exportar función para añadir reacciones desde fuera
export const floatingReactionsRef = {
  addReaction: (emoji: string) => {},
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
});
```

### 3. Integrar con Supabase Realtime

```typescript
// En la pantalla de sesión, escuchar reacciones de otros:

useEffect(() => {
  const channel = supabase
    .channel(`reactions:${sessionId}`)
    .on('broadcast', { event: 'reaction' }, ({ payload }) => {
      // Mostrar reacción flotante
      floatingReactionsRef.addReaction(payload.emoji);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [sessionId]);

// Cuando el usuario reacciona:
const handleReaction = async (emoji: string) => {
  // Mostrar mi propia reacción localmente
  floatingReactionsRef.addReaction(emoji);

  // Broadcast a otros
  await supabase.channel(`reactions:${sessionId}`).send({
    type: 'broadcast',
    event: 'reaction',
    payload: { emoji, userId: user.id },
  });

  // Guardar en BD
  await supabase.from('ws_reactions').insert({
    session_id: sessionId,
    user_id: user.id,
    emoji,
  });
};
```

---

## 🎨 Variaciones de Diseño

### Opción A: Columna derecha (TikTok style)
- Todas las reacciones suben por el lado derecho
- Simple, limpio

### Opción B: Posición aleatoria (Instagram style)
- Reacciones aparecen en posiciones aleatorias
- Más caótico, más "fiesta"

### Opción C: Híbrido
- Reacciones propias a la derecha
- Reacciones de otros en posiciones variadas

**Recomendación:** Empezar con Opción A, iterar después.

---

## 📊 Performance

- **Límite:** Máximo 20 reacciones simultáneas
- **Throttle:** Máximo 5 reacciones/segundo por usuario
- **Cleanup:** Eliminar reacciones que completaron animación

```typescript
// Throttle de reacciones
const lastReactionTime = useRef(0);
const THROTTLE_MS = 200;

const handleReaction = (emoji: string) => {
  const now = Date.now();
  if (now - lastReactionTime.current < THROTTLE_MS) return;
  lastReactionTime.current = now;
  // ... enviar reacción
};
```

---

## ✅ Checklist

- [ ] Componente FloatingReaction creado
- [ ] Container con gestión de estado
- [ ] Animación de subida funciona
- [ ] Movimiento ondulante funciona
- [ ] Fade out al final
- [ ] Integrado con Supabase Broadcast
- [ ] Throttle implementado
- [ ] Probado con múltiples reacciones simultáneas

---

## 📁 Archivos

```
src/components/session/
├── FloatingReaction.tsx        ← CREAR
├── FloatingReactionsContainer.tsx ← CREAR
└── ReactionBar.tsx             ← MODIFICAR (añadir handler)

app/session/[id].tsx            ← MODIFICAR (añadir container)
```

---

**Firma:** 🎨 Arquitecto Frontend  
**Fuentes:** William Candillon (Reanimated), TikTok Live, Instagram Live

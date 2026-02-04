# 🎨 SKELETON LOADERS — Arquitecto Frontend

**Prioridad:** 🟢 Media  
**Esfuerzo:** 4 horas

---

## 🎯 Objetivo

Reemplazar spinners genéricos con skeleton loaders que muestran la forma del contenido mientras carga.

---

## 📋 Implementación

```typescript
// src/components/ui/Skeleton.tsx

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

interface Props {
  width: number | string;
  height: number;
  borderRadius?: number;
}

export function Skeleton({ width, height, borderRadius = 4 }: Props) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.surface,
  },
});
```

### Skeletons específicos

```typescript
// SessionCardSkeleton
<View style={styles.card}>
  <Skeleton width={48} height={48} borderRadius={24} />
  <View style={{ flex: 1, gap: 8 }}>
    <Skeleton width="70%" height={16} />
    <Skeleton width="40%" height={12} />
  </View>
</View>

// SongItemSkeleton
<View style={styles.song}>
  <Skeleton width={40} height={40} borderRadius={4} />
  <View style={{ flex: 1, gap: 4 }}>
    <Skeleton width="80%" height={14} />
    <Skeleton width="50%" height={12} />
  </View>
</View>

// ChatMessageSkeleton
<View style={styles.message}>
  <Skeleton width={32} height={32} borderRadius={16} />
  <Skeleton width={200} height={40} borderRadius={12} />
</View>
```

---

## ✅ Pantallas a actualizar

- [ ] live.tsx (lista de sesiones)
- [ ] chats.tsx (lista de chats)
- [ ] queue.tsx (cola de canciones)
- [ ] session/[id].tsx (contenido de sesión)
- [ ] discover.tsx (explorar)

---

**Firma:** 🎨 Arquitecto Frontend

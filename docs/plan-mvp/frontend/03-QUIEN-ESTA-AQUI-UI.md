# 🎨 QUIÉN ESTÁ AQUÍ — UI — Arquitecto Frontend

**Prioridad:** 🔴 Alta  
**Esfuerzo:** 6 horas  
**Dependencias:** Realtime/Presence API

---

## 🎯 Objetivo

Mostrar visualmente quién está escuchando la sesión con avatares y contador.

---

## 🎬 Diseño

```
┌──────────────────────────────────────┐
│  [👤][👤][👤][👤][👤] +42    🟢 47  │
│                              escuchando│
└──────────────────────────────────────┘
```

---

## 📋 Componentes

### 1. AvatarStack

```typescript
// src/components/ui/AvatarStack.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface User {
  id: string;
  name: string;
  avatar: string | null;
}

interface Props {
  users: User[];
  maxVisible?: number;
  size?: number;
}

export function AvatarStack({ users, maxVisible = 5, size = 32 }: Props) {
  const visible = users.slice(0, maxVisible);
  const extra = users.length - maxVisible;

  return (
    <View style={styles.container}>
      {visible.map((user, i) => (
        <View
          key={user.id}
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: i > 0 ? -size / 4 : 0,
              zIndex: maxVisible - i,
            },
          ]}
        >
          {user.avatar ? (
            <Text style={{ fontSize: size / 2 }}>{user.avatar}</Text>
          ) : (
            <Text style={[styles.initial, { fontSize: size / 2.5 }]}>
              {user.name.charAt(0)}
            </Text>
          )}
        </View>
      ))}
      {extra > 0 && (
        <View style={[styles.avatar, styles.extra, { marginLeft: -size / 4 }]}>
          <Text style={styles.extraText}>+{extra}</Text>
        </View>
      )}
    </View>
  );
}
```

### 2. LiveBadge

```typescript
// src/components/ui/LiveBadge.tsx

export function LiveBadge({ count }: { count: number }) {
  return (
    <View style={styles.badge}>
      <View style={styles.dot} />
      <Text style={styles.text}>{count} escuchando</Text>
    </View>
  );
}
```

### 3. Animación de entrada

Cuando alguien nuevo entra:
1. Su avatar aparece con scale 0 → 1
2. Toast sutil: "María se unió 🎧"
3. Contador incrementa con animación

---

## ✅ Checklist

- [ ] AvatarStack creado
- [ ] LiveBadge creado  
- [ ] Animación de entrada
- [ ] Toast de nuevo usuario
- [ ] Integrado con usePresence
- [ ] Probado con 50+ usuarios

---

**Firma:** 🎨 Arquitecto Frontend

# ⚡ PRESENCE API — Experto Realtime

**Prioridad:** 🔴 BLOQUEANTE  
**Esfuerzo:** 8 horas  
**Dependencias:** Ninguna  
**Bloquea a:** Frontend (UI "Quién está aquí")

---

## 🎯 Objetivo

Mostrar en tiempo real quién está escuchando una sesión. El "47 escuchando ahora" con avatares.

---

## 🧠 Concepto

Supabase Realtime incluye **Presence** que permite:
- Saber quién está conectado a un canal
- Recibir eventos cuando alguien entra/sale
- Sincronizar estado entre usuarios

```
Usuario entra a sesión "Viernes Latino"
    ↓
Se une al canal presence:session:uuid
    ↓
Broadcast de su presencia a todos
    ↓
Todos ven "48 escuchando" (antes 47)
```

---

## 📋 Implementación

### 1. Crear hook usePresence

```typescript
// src/hooks/usePresence.ts

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

interface PresenceUser {
  id: string;
  name: string;
  avatar: string | null;
  joinedAt: string;
}

export function usePresence(sessionId: string) {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!sessionId || !user) return;

    const channel = supabase.channel(`presence:session:${sessionId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Track mi presencia
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const presentUsers: PresenceUser[] = [];
      
      Object.keys(state).forEach(key => {
        const presences = state[key] as any[];
        presences.forEach(presence => {
          presentUsers.push({
            id: presence.user_id,
            name: presence.user_name,
            avatar: presence.user_avatar,
            joinedAt: presence.joined_at,
          });
        });
      });

      setUsers(presentUsers);
      setCount(presentUsers.length);
    });

    // Suscribirse a cambios
    channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      console.log('Usuario entró:', newPresences);
    });

    channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      console.log('Usuario salió:', leftPresences);
    });

    // Entrar al canal con mi info
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: user.id,
          user_name: user.display_name || 'Anónimo',
          user_avatar: user.avatar_url,
          joined_at: new Date().toISOString(),
        });
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [sessionId, user]);

  return { users, count };
}
```

### 2. Crear componente PresenceBar

```typescript
// src/components/session/PresenceBar.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePresence } from '../../hooks/usePresence';
import { colors } from '../../theme/colors';

interface Props {
  sessionId: string;
}

export function PresenceBar({ sessionId }: Props) {
  const { users, count } = usePresence(sessionId);

  // Mostrar máximo 5 avatares
  const visibleUsers = users.slice(0, 5);
  const extraCount = count - 5;

  return (
    <View style={styles.container}>
      <View style={styles.avatars}>
        {visibleUsers.map((user, index) => (
          <View 
            key={user.id} 
            style={[
              styles.avatar,
              { marginLeft: index > 0 ? -8 : 0, zIndex: 5 - index }
            ]}
          >
            {user.avatar ? (
              <Text style={styles.avatarEmoji}>{user.avatar}</Text>
            ) : (
              <Text style={styles.avatarInitial}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
        ))}
        {extraCount > 0 && (
          <View style={[styles.avatar, styles.extraAvatar, { marginLeft: -8 }]}>
            <Text style={styles.extraText}>+{extraCount}</Text>
          </View>
        )}
      </View>
      <View style={styles.countContainer}>
        <View style={styles.liveDot} />
        <Text style={styles.countText}>{count} escuchando</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  avatarEmoji: {
    fontSize: 16,
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  extraAvatar: {
    backgroundColor: colors.surfaceDark,
  },
  extraText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  countText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
});
```

### 3. Integrar en pantalla de sesión

```typescript
// app/session/[id].tsx — Añadir después del header

import { PresenceBar } from '../../src/components/session/PresenceBar';

// Dentro del componente, después del header:
<PresenceBar sessionId={id} />
```

### 4. Añadir animación de entrada/salida

```typescript
// Cuando alguien entra, mostrar toast sutil:
// "María se unió 🎧"

// Implementar con react-native-toast o similar
```

---

## 📊 Límites y Escalado

| Usuarios | Comportamiento |
|----------|----------------|
| 1-100 | Mostrar todos los avatares |
| 100-1000 | Mostrar 5 + contador |
| 1000+ | Considerar sampling |

**Supabase Presence soporta ~10,000 conexiones por canal.** Suficiente para MVP.

---

## 🧪 Testing

### Test manual
1. Abrir sesión en 2 navegadores diferentes
2. Usar `?test=usuario1` y `?test=usuario2`
3. Verificar que ambos ven al otro
4. Cerrar una pestaña
5. Verificar que el contador baja

### Test automatizado
```typescript
// __tests__/presence.test.ts

describe('Presence', () => {
  it('should show correct count when user joins', async () => {
    // Mock Supabase channel
    // Assert count updates
  });

  it('should update when user leaves', async () => {
    // Simulate disconnect
    // Assert count decreases
  });
});
```

---

## 📁 Archivos a Crear/Modificar

```
src/
├── hooks/
│   └── usePresence.ts          ← CREAR
├── components/
│   └── session/
│       └── PresenceBar.tsx     ← CREAR
app/
└── session/
    └── [id].tsx                ← MODIFICAR (añadir PresenceBar)
```

---

## ✅ Checklist

- [ ] Hook usePresence creado
- [ ] Componente PresenceBar creado
- [ ] Integrado en pantalla de sesión
- [ ] Avatares se muestran correctamente
- [ ] Contador actualiza en tiempo real
- [ ] Punto verde "live" visible
- [ ] Animación de entrada/salida
- [ ] Probado con múltiples usuarios

---

## 🔗 Referencias

- [Supabase Presence Docs](https://supabase.com/docs/guides/realtime/presence)
- Discord Engineering (millones de conexiones)
- Spotify "Friend Activity" (inspiración UX)

---

**Firma:** ⚡ Experto Realtime  
**Fuentes:** Discord Engineering, Supabase Team, Martin Kleppmann

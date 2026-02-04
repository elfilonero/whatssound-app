# 🎨 COMPARTIR MOMENTO — Arquitecto Frontend

**Prioridad:** 🟢 Media  
**Esfuerzo:** 2 horas

---

## 🎯 Objetivo

Botón para compartir "Estoy escuchando X en WhatsSound" con link directo a la sesión.

---

## 📋 Implementación

```typescript
// src/components/session/ShareButton.tsx

import React from 'react';
import { TouchableOpacity, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  sessionId: string;
  sessionName: string;
  currentSong?: string;
}

export function ShareButton({ sessionId, sessionName, currentSong }: Props) {
  const handleShare = async () => {
    const url = `https://whatssound-app.vercel.app/join/${sessionId}`;
    
    const message = currentSong
      ? `🎧 Estoy escuchando "${currentSong}" en ${sessionName}\n\n¡Únete! ${url}`
      : `🎧 Estoy en la sesión ${sessionName}\n\n¡Únete! ${url}`;

    try {
      await Share.share({
        message,
        url, // iOS usa esto para preview
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir');
    }
  };

  return (
    <TouchableOpacity onPress={handleShare} style={styles.button}>
      <Ionicons name="share-outline" size={24} color={colors.textPrimary} />
    </TouchableOpacity>
  );
}
```

---

## 🎬 Texto compartido

```
🎧 Estoy escuchando "Dakiti" en Viernes Latino 🔥

¡Únete! https://whatssound-app.vercel.app/join/abc123
```

---

## ✅ Checklist

- [ ] Componente ShareButton creado
- [ ] Share API nativa funciona
- [ ] Mensaje incluye canción actual
- [ ] Link funciona y abre la sesión
- [ ] Añadido al header de sesión

---

**Firma:** 🎨 Arquitecto Frontend

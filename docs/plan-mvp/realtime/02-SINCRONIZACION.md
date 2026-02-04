# ⚡ SINCRONIZACIÓN — Experto Realtime

**Prioridad:** 🟢 Media  
**Esfuerzo:** 4 horas

---

## 🎯 Objetivo

Todos ven el mismo estado de la sesión: canción actual, posición, cola.

---

## 📋 Implementación

### 1. Broadcast de estado del DJ

El DJ es la fuente de verdad. Cada 5 segundos envía:

```typescript
// En el panel del DJ
useEffect(() => {
  const interval = setInterval(() => {
    supabase.channel(`sync:${sessionId}`).send({
      type: 'broadcast',
      event: 'sync',
      payload: {
        currentSong: nowPlaying,
        position: audioRef.current?.currentTime || 0,
        isPlaying: !isPaused,
        timestamp: Date.now(),
      },
    });
  }, 5000);

  return () => clearInterval(interval);
}, [sessionId, nowPlaying, isPaused]);
```

### 2. Recepción en oyentes

```typescript
// En la vista del oyente
useEffect(() => {
  const channel = supabase
    .channel(`sync:${sessionId}`)
    .on('broadcast', { event: 'sync' }, ({ payload }) => {
      // Ajustar posición si difiere mucho
      const drift = Math.abs(audioRef.current.currentTime - payload.position);
      if (drift > 2) {
        audioRef.current.currentTime = payload.position;
      }

      // Sincronizar play/pause
      if (payload.isPlaying && audioRef.current.paused) {
        audioRef.current.play();
      } else if (!payload.isPlaying && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [sessionId]);
```

### 3. Cambio de canción

```typescript
// Cuando el DJ cambia de canción
const handleSongChange = async (newSong: Song) => {
  // Actualizar BD
  await supabase
    .from('ws_now_playing')
    .upsert({ session_id: sessionId, song_id: newSong.id });

  // Broadcast inmediato
  supabase.channel(`sync:${sessionId}`).send({
    type: 'broadcast',
    event: 'song_changed',
    payload: { song: newSong },
  });
};
```

---

## 📊 Tolerancia de Drift

- **<1 segundo:** No ajustar (imperceptible)
- **1-3 segundos:** Ajustar gradualmente
- **>3 segundos:** Salto directo a posición correcta

---

## ✅ Checklist

- [ ] Broadcast de DJ cada 5s
- [ ] Oyentes reciben sync
- [ ] Ajuste de drift funciona
- [ ] Play/pause sincronizado
- [ ] Cambio de canción instantáneo
- [ ] Probado con latencia alta

---

**Firma:** ⚡ Experto Realtime

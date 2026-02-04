# 🎯 RACHA DE SESIONES — Experto Producto

**Prioridad:** 🟢 Media  
**Esfuerzo:** 4 horas

---

## 🎯 Objetivo

Gamificación simple: "Has escuchado 3 sesiones esta semana 🔥". Genera hábito de volver.

---

## 🎬 Diseño

### En perfil del usuario
```
┌─────────────────────────────────────┐
│  🔥 Tu racha                        │
│                                     │
│  Esta semana: 3 sesiones            │
│  ████████░░░░░░░░  3/7              │
│                                     │
│  Récord: 12 sesiones (Ene 2026)     │
└─────────────────────────────────────┘
```

### Notificación de racha
```
🔥 ¡3 días seguidos escuchando!
Vuelve hoy para mantener tu racha.
```

### Badge de racha en chat
Usuarios con racha activa tienen badge:
```
[🔥5] María: ¡Qué buena canción!
```

---

## 📋 Modelo de Datos

```sql
-- Añadir a ws_profiles
ALTER TABLE ws_profiles ADD COLUMN
  streak_current INTEGER DEFAULT 0,
  streak_best INTEGER DEFAULT 0,
  streak_last_date DATE;

-- Trigger para actualizar racha
CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- Lógica de actualización de racha
  -- Si escuchó ayer: streak_current++
  -- Si no escuchó ayer: streak_current = 1
  -- Actualizar streak_best si supera récord
END;
$$ LANGUAGE plpgsql;
```

---

## ✅ Checklist

- [ ] Campos de racha en ws_profiles
- [ ] Trigger de actualización
- [ ] Componente StreakCard
- [ ] Badge en mensajes de chat
- [ ] Notificación de racha
- [ ] Animación al subir racha

---

**Firma:** 🎯 Experto Producto

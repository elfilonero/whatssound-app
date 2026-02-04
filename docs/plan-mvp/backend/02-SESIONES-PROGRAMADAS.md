# ⚙️ SESIONES PROGRAMADAS — Arquitecto Backend

**Prioridad:** 🟢 Media  
**Esfuerzo:** 8 horas

---

## 🎯 Objetivo

Permitir a DJs anunciar sesiones futuras. Los seguidores reciben notificación cuando empieza.

---

## 📋 Modelo de Datos

```sql
-- Nueva tabla
CREATE TABLE ws_scheduled_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dj_id UUID NOT NULL REFERENCES ws_profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  genres TEXT[],
  cover_image TEXT,
  status TEXT DEFAULT 'scheduled', -- scheduled, live, ended, cancelled
  session_id UUID REFERENCES ws_sessions(id), -- Se llena cuando empieza
  notify_before_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_scheduled_upcoming 
  ON ws_scheduled_sessions(scheduled_at) 
  WHERE status = 'scheduled';
```

---

## 📋 Endpoints

### Crear sesión programada
```typescript
// POST /api/sessions/schedule
{
  name: "Viernes Latino 🔥",
  scheduled_at: "2026-02-07T22:00:00Z",
  genres: ["reggaeton", "latin"],
  notify_before: 15
}
```

### Listar próximas sesiones
```typescript
// GET /api/sessions/upcoming
// Devuelve sesiones de los DJs que sigo + destacadas
```

---

## 🔔 Notificaciones

15 minutos antes:
```
🎧 DJ Carlos empieza en 15 min!
"Viernes Latino 🔥" comienza pronto.
[Ver sesión]
```

Al empezar:
```
🔴 EN VIVO: Viernes Latino 🔥
DJ Carlos acaba de empezar. ¡Únete!
[Entrar ahora]
```

---

## ✅ Checklist

- [ ] Tabla ws_scheduled_sessions creada
- [ ] UI para programar sesión (DJ)
- [ ] Lista de próximas sesiones (Discover)
- [ ] Notificación 15 min antes
- [ ] Notificación al empezar
- [ ] Conversión a sesión real al iniciar

---

**Firma:** ⚙️ Arquitecto Backend

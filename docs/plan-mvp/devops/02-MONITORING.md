# 🚀 MONITORING — Experto DevOps

**Prioridad:** 🟢 Media  
**Esfuerzo:** 4 horas

---

## 🎯 Objetivo

Sentry para errores, PostHog para analytics.

---

## 📋 Sentry (Errores)

### Instalación
```bash
npx expo install @sentry/react-native
```

### Configuración
```typescript
// app/_layout.tsx

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://xxx@sentry.io/xxx',
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 0.2,
});
```

---

## 📋 PostHog (Analytics)

### Instalación
```bash
npm install posthog-react-native
```

### Configuración
```typescript
// src/lib/analytics.ts

import PostHog from 'posthog-react-native';

export const posthog = new PostHog('phc_xxx', {
  host: 'https://app.posthog.com',
});

// Eventos importantes
posthog.capture('session_joined', { session_id: 'xxx' });
posthog.capture('tip_sent', { amount: 5 });
posthog.capture('song_requested', { song_id: 'xxx' });
```

---

## 📊 Eventos a Trackear

| Evento | Cuándo |
|--------|--------|
| `app_opened` | Al abrir app |
| `session_joined` | Al entrar a sesión |
| `session_left` | Al salir de sesión |
| `song_requested` | Al pedir canción |
| `song_voted` | Al votar canción |
| `tip_sent` | Al enviar propina |
| `reaction_sent` | Al reaccionar |
| `share_clicked` | Al compartir |

---

## ✅ Checklist

- [ ] Sentry configurado
- [ ] PostHog configurado
- [ ] Eventos básicos trackeados
- [ ] Dashboard de métricas creado
- [ ] Alertas de errores configuradas

---

**Firma:** 🚀 Experto DevOps

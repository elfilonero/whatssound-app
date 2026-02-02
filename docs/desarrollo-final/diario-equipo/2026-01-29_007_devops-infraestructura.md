# 🛠️ DevOps & Infraestructura — WhatsSound MVP

**Fecha:** 2026-01-29  
**Autor:** DevOps Engineer  
**Estado:** Definido

---

## 1. Stack de Infraestructura

| Capa | Servicio | Plan | Coste/mes |
|---|---|---|---|
| **Base de datos + Auth + Realtime + Storage** | Supabase | Free → Pro ($25) | $0–25 |
| **Edge Functions** | Supabase Edge Functions | Incluido en Supabase | $0 |
| **Frontend Web** | Vercel | Hobby (Free) | $0 |
| **App nativa** | Expo / EAS | Free (30 builds/mes) | $0 |
| **CI/CD** | GitHub Actions | Free (2000 min/mes) | $0 |
| **Pagos** | Stripe Connect | Pay-as-you-go | Solo comisiones |
| **Música** | Spotify API | Free | $0 |
| **Dominio** | Cloudflare | — | ~$10/año |
| **Monitoreo** | Sentry (Free) + Supabase Dashboard | Free | $0 |

### 💰 Coste total estimado

| Fase | Coste/mes |
|---|---|
| **Desarrollo (0-100 usuarios)** | **$0** |
| **Lanzamiento (100-1000 usuarios)** | **$25** (Supabase Pro) |
| **Crecimiento (1000-10K usuarios)** | **~$50** (Supabase Pro + Vercel Pro) |
| **Escala (10K+ usuarios)** | **~$100-200** (Supabase Pro + extras) |

---

## 2. Environments

| Entorno | Supabase | Frontend | Branch | Propósito |
|---|---|---|---|---|
| **dev** | Supabase CLI local | `expo start` | feature/* | Desarrollo diario |
| **staging** | Proyecto Supabase "staging" | Vercel Preview | develop | QA, testing integración |
| **prod** | Proyecto Supabase "prod" | Vercel Production + EAS | main | Usuarios reales |

### Flujo de branches:
```
feature/* → PR → develop (staging auto-deploy) → PR → main (prod)
```

### Variables por entorno:
- **dev:** `.env` local (copiado de `.env.example`)
- **staging:** GitHub Secrets con prefijo `PREVIEW_`
- **prod:** GitHub Secrets + Vercel Environment Variables + EAS Secrets

---

## 3. Pipeline CI/CD

### En cada Push / PR:
```
┌─────────┐    ┌──────┐    ┌───────────┐
│  Lint   │───▶│ Test │───▶│ Build Web │
│  + TSC  │    │      │    │ (artifact)│
└─────────┘    └──────┘    └───────────┘
```

### En PR (adicional):
```
┌──────────────────┐    ┌─────────────────┐
│ Deploy Vercel    │    │ EAS Update      │
│ Preview (web)    │    │ (OTA preview)   │
│ → Comment PR URL │    │ → branch pr-N   │
└──────────────────┘    └─────────────────┘
```

### En merge a main:
```
┌──────────────────┐    ┌─────────────────┐
│ Vercel auto-     │    │ EAS Build       │
│ deploy prod      │    │ (Android APK)   │
└──────────────────┘    └─────────────────┘
```

### Secrets necesarios en GitHub:
- `EXPO_TOKEN` — Para EAS builds y updates
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — Deploy web
- `PREVIEW_SUPABASE_URL`, `PREVIEW_SUPABASE_ANON_KEY` — Staging
- `STRIPE_SECRET_KEY` — Para Edge Functions

---

## 4. Desarrollo Local — Quick Start

```bash
# 1. Clonar y configurar
git clone <repo>
cd whatssound-app
cp .env.example .env
npm install

# 2. Levantar Supabase local
npx supabase init          # solo la primera vez
npx supabase start         # levanta DB, Auth, Realtime, Studio
# → Studio en http://localhost:54323
# → API en http://localhost:54321

# 3. Aplicar migraciones
npx supabase db push       # o: npx supabase migration up

# 4. Iniciar app
npx expo start

# 5. (Opcional) Stripe webhooks locales
docker compose --profile stripe up
```

---

## 5. Monitoreo y Alertas

### Gratis (MVP):
| Qué | Herramienta | Cómo |
|---|---|---|
| **Crashes app** | Sentry (Free: 5K events/mes) | `sentry-expo` SDK |
| **DB performance** | Supabase Dashboard | Métricas built-in |
| **API errors** | Supabase Edge Function logs | Dashboard + CLI |
| **Uptime web** | UptimeRobot (Free: 50 monitores) | Ping cada 5 min |
| **Build failures** | GitHub Actions | Email notifications |

### Alertas recomendadas:
1. **Sentry** → Slack/Discord cuando crash > 5 en 1h
2. **UptimeRobot** → Email si web down > 2 min
3. **Supabase** → Alerta si DB connections > 80% del límite
4. **Stripe** → Webhook failures dashboard

### Cuando escalar (post-MVP):
- **Supabase Observability** (incluido en Pro) — Query performance, slow queries
- **Vercel Analytics** ($10/mes) — Web Vitals, real user monitoring
- **Expo Updates** — OTA rollback si algo va mal

---

## 6. Seguridad — Checklist

- [x] Variables sensibles en GitHub Secrets, nunca en código
- [x] `.env` en `.gitignore`
- [x] RLS activado en todas las tablas de Supabase
- [x] Edge Functions validan auth token (Supabase JWT)
- [x] Stripe webhooks verifican firma
- [x] HTTPS everywhere (Supabase + Vercel lo dan gratis)
- [ ] Dependabot activado para PRs de seguridad automáticas
- [ ] Rate limiting en Edge Functions críticas (OTP, tips)

---

## 7. Decisiones y Trade-offs

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| Supabase CLI local (no Docker custom) | Más fácil, incluye todo | docker-compose completo de Supabase (24 containers) |
| Vercel para web | Zero-config con Expo web export | Cloudflare Pages (viable, pero menos integración) |
| EAS Free para builds | 30 builds/mes suficiente para MVP | Build local (lento, requiere Mac para iOS) |
| GitHub Actions Free | 2000 min/mes sobra para equipo pequeño | CircleCI (innecesario) |
| Sentry Free | 5K events cubren MVP | LogRocket (más caro) |
| Sin Kubernetes | Supabase maneja todo el backend | Overkill total para MVP |

---

> **Filosofía:** $0 hasta tener usuarios reales. Supabase Free + Vercel Free + Expo Free + GitHub Free = stack completo sin gastar un euro. Primer coste real: $25/mes cuando necesitemos Supabase Pro (>500MB DB o >50K auth users/mes).

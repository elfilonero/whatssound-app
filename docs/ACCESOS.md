# Accesos WhatsSound

## Supabase

**Project ref:** `xyehncvvvprrqwnsefcr`
**Dashboard:** https://supabase.com/dashboard/project/xyehncvvvprrqwnsefcr

### REST API (queries a tablas)
```bash
curl "https://xyehncvvvprrqwnsefcr.supabase.co/rest/v1/TABLA" \
  -H "apikey: $SUPABASE_ANON_KEY"
```

### Management API (DDL: CREATE, ALTER, migraciones)
```bash
curl -X POST "https://api.supabase.com/v1/projects/xyehncvvvprrqwnsefcr/database/query" \
  -H "Authorization: Bearer sbp_0092face347e9bd5c50f23676829ca454105ede3" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT 1"}'
```

### Keys (en .env)
- `EXPO_PUBLIC_SUPABASE_URL` - URL del proyecto
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Key pública (anon)
- `SUPABASE_SERVICE_ROLE_KEY` - Key privada (service role)
- `SUPABASE_DB_PASSWORD` - Password de PostgreSQL

### Cuenta
- **GitHub:** elfilonero
- **Email:** vertexdeveloperchina@gmail.com

---

## Vercel

**Proyecto:** whatssound-app
**URL:** https://whatssound-app.vercel.app
**Dashboard:** https://vercel.com/elfiloneros-projects/whatssound-app

### Deploy
```bash
git push origin main  # Auto-deploy
```

### Cuenta
- **GitHub:** elfilonero

---

## GitHub

**Repo:** https://github.com/elfilonero/whatssound-app
**Usuario:** elfilonero
**Email:** vertexdeveloperchina@gmail.com

---

## Deezer API

**App ID:** En .env como `DEEZER_APP_ID`
**Endpoint:** `https://api.deezer.com/search?q=...`

No requiere auth para búsquedas básicas.

---

## Stripe (pendiente configurar)

Dashboard: https://dashboard.stripe.com
Documentación: `docs/plan-mvp/backend/01-STRIPE-CONFIGURACION.md`

---

## Notas

1. **Management API** es la forma de ejecutar DDL (CREATE TABLE, ALTER) sin necesidad de login al dashboard
2. **Service Role Key** tiene acceso total - nunca exponer en cliente
3. **Anon Key** es segura para cliente - RLS la protege

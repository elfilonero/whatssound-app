# 🗄️ MIGRACIÓN A PRODUCCIÓN — Experto Datos

**Prioridad:** 🟡 Alta  
**Esfuerzo:** 4 horas

---

## 🎯 Objetivo

Ejecutar migración 006 en Supabase producción y verificar integridad.

---

## 📋 Pasos

### 1. Backup antes de migrar
```sql
-- En Supabase Dashboard → SQL Editor
-- Exportar tablas críticas
SELECT * FROM ws_profiles INTO OUTFILE 'backup_profiles.csv';
SELECT * FROM ws_sessions INTO OUTFILE 'backup_sessions.csv';
SELECT * FROM ws_tips INTO OUTFILE 'backup_tips.csv';
```

### 2. Ejecutar migración 006
```sql
-- Copiar contenido de:
-- supabase/migrations/006_ratings_payments_stats.sql

-- Ejecutar en SQL Editor
-- Verificar que no hay errores
```

### 3. Verificar tablas creadas
```sql
-- Deben existir:
SELECT COUNT(*) FROM ws_session_ratings;      -- Nueva
SELECT COUNT(*) FROM ws_payment_methods;      -- Nueva
SELECT COUNT(*) FROM ws_dj_stripe_accounts;   -- Nueva
SELECT COUNT(*) FROM ws_dj_payouts;           -- Nueva
SELECT COUNT(*) FROM ws_hourly_stats;         -- Nueva

-- Verificar columnas añadidas a ws_tips
SELECT stripe_payment_intent_id, payment_status 
FROM ws_tips LIMIT 1;
```

### 4. Verificar funciones
```sql
-- Test get_dj_balance
SELECT * FROM get_dj_balance('uuid-de-un-dj');

-- Test get_dj_average_rating
SELECT get_dj_average_rating('uuid-de-un-dj');
```

### 5. Limpiar datos de prueba (opcional)
```sql
-- Si hay datos de desarrollo mezclados
DELETE FROM ws_session_ratings WHERE created_at < '2026-02-01';
-- etc.
```

---

## ✅ Checklist

- [ ] Backup realizado
- [ ] Migración ejecutada sin errores
- [ ] 5 nuevas tablas existen
- [ ] Columnas de ws_tips actualizadas
- [ ] Funciones SQL funcionan
- [ ] RLS activo en nuevas tablas
- [ ] Índices creados

---

**Firma:** 🗄️ Experto Datos

# 🏆 Aplicar Migración Golden Boost

## Pasos

### 1. Abrir Supabase Dashboard
https://supabase.com/dashboard/project/xyehncvvvprrqwnsefcr

### 2. Ir a SQL Editor
Click en "SQL Editor" en el menú lateral

### 3. Copiar y pegar el script
Copiar TODO el contenido de:
```
scripts/apply-golden-boost-migration.sql
```

### 4. Ejecutar
Click en "Run" o Cmd+Enter

### 5. Verificar
Ejecutar esta query para confirmar:
```sql
SELECT COUNT(*) as total FROM ws_golden_boosts;
SELECT golden_boost_available, golden_badge FROM ws_profiles LIMIT 5;
```

---

## Qué crea la migración

| Elemento | Descripción |
|----------|-------------|
| Tabla `ws_golden_boosts` | Registro de boosts dados |
| 7 campos en `ws_profiles` | Contadores y badges |
| 4 RLS policies | Seguridad |
| 3 funciones | Reset, acelerador, badges |
| 1 trigger | Auto-actualización |
| 1 vista | Leaderboard |

---

## Verificación rápida

Después de aplicar, el dashboard admin mostrará las métricas de Golden Boost automáticamente.

---

*Una vez aplicado, hacer deploy a Vercel y probar el botón Golden Boost en una sesión.*

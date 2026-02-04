# ⚙️ DJ DEL MOMENTO — Arquitecto Backend

**Prioridad:** 🟢 Media  
**Esfuerzo:** 6 horas

---

## 🎯 Objetivo

Ranking semanal de DJs por propinas y oyentes. Visible en Discover.

---

## 📋 Query SQL

```sql
-- Top DJs de la semana
WITH weekly_stats AS (
  SELECT 
    s.dj_id,
    COUNT(DISTINCT sm.user_id) as total_listeners,
    COALESCE(SUM(t.amount), 0) as total_tips,
    COUNT(DISTINCT s.id) as sessions_count
  FROM ws_sessions s
  LEFT JOIN ws_session_members sm ON s.id = sm.session_id
  LEFT JOIN ws_tips t ON s.id = t.session_id
  WHERE s.created_at > NOW() - INTERVAL '7 days'
  GROUP BY s.dj_id
)
SELECT 
  p.id,
  p.display_name,
  p.avatar_url,
  p.dj_verified,
  ws.total_listeners,
  ws.total_tips,
  ws.sessions_count,
  (ws.total_listeners * 0.5 + ws.total_tips * 2 + ws.sessions_count * 10) as score
FROM weekly_stats ws
JOIN ws_profiles p ON ws.dj_id = p.id
ORDER BY score DESC
LIMIT 10;
```

---

## 🎬 UI en Discover

```
┌─────────────────────────────────────┐
│  🏆 DJs del Momento                 │
├─────────────────────────────────────┤
│  1. 🥇 DJ Carlos    847 👥  €234   │
│  2. 🥈 DJ María     623 👥  €189   │
│  3. 🥉 DJ Pablo     512 👥  €156   │
│  4.    DJ Ana       401 👥  €98    │
│  5.    DJ Luis      356 👥  €87    │
└─────────────────────────────────────┘
```

---

## ✅ Checklist

- [ ] Query SQL optimizada
- [ ] Función RPC en Supabase
- [ ] Componente DJRanking creado
- [ ] Integrado en Discover
- [ ] Actualización cada hora (caché)

---

**Firma:** ⚙️ Arquitecto Backend

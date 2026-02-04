# Changelog - WhatsSound

## [4.0.0] - 2026-02-04 — Golden Boost System

### 🌟 Nueva Funcionalidad: Golden Boost
Sistema de reconocimiento inspirado en el "Botón de Oro" de Got Talent.

#### Mecánica
- **1 Golden Boost por semana** (regenera domingos a medianoche)
- **+1 extra** si escuchas 5 sesiones diferentes en la semana
- **Compra opcional** de boosts adicionales (€4.99)
- **Patrocinio Permanente** (€19.99) - Apareces siempre en el perfil del DJ

#### Badges de Reconocimiento
| Boosts Recibidos | Badge |
|------------------|-------|
| 10+ | 🌟 Rising Star |
| 50+ | ⭐ Fan Favorite |
| 100+ | 👑 Legend |

#### Componentes Añadidos
- `GoldenBoostButton` - Botón animado en sesiones
- `GoldenBoostShare` - Compartir logros
- `GoldenBoostPermanent` - Modal de patrocinio
- `PermanentSponsors` - Lista en perfil DJ
- `GoldenBadgeFull` - Badge con progreso

#### Pantallas Actualizadas
- `session/[id].tsx` - Botón Golden Boost
- `profile/[id].tsx` - Badge y patrocinadores
- `settings.tsx` - Historial de boosts
- `discover.tsx` - Banner Hall of Fame
- `hall-of-fame.tsx` - Nueva pantalla de ranking

#### Dashboard Admin
- KPIs de Golden Boost (total, esta semana, comprados)
- Revenue por Golden Boost
- Métricas de engagement

#### Base de Datos
```sql
-- Nuevas columnas en ws_profiles
golden_boost_available INT DEFAULT 1
golden_boost_last_reset TIMESTAMPTZ
golden_boosts_received INT DEFAULT 0
golden_boosts_given INT DEFAULT 0
golden_badge TEXT DEFAULT 'none'
permanent_sponsors_count INT DEFAULT 0

-- Nueva tabla
ws_golden_boost_permanent (patrocinadores permanentes)
```

### 🎧 Background Audio
- Música continúa con pantalla bloqueada
- Soporte iOS (UIBackgroundModes) y Android (FOREGROUND_SERVICE)

### 📋 Proceso de Desarrollo
Este release fue desarrollado siguiendo el **Protocolo de Equipos Virtuales de Vertex Developer**:

1. **Reunión de Equipo Virtual** (7 superexpertos)
   - Revisión crítica de V3
   - Diseño del sistema Golden Boost
   - Documentación en `docs/reuniones/2026-02-04-*.md`

2. **Implementación** (~4 horas)
   - Componentes UI con animaciones
   - Integración Supabase realtime
   - Dashboard admin

3. **Migración** via Supabase Management API

---

## [3.0.0] - 2026-02-03 — Full Supabase Integration

- 16/16 pantallas conectadas a Supabase
- Sistema de propinas funcional
- Chat en tiempo real
- Cola de canciones con votación
- Dashboard admin completo

---

## [2.0.0] - 2026-02-02 — Core Features

- Onboarding con OTP
- Creación de sesiones
- Sistema de roles (DJ, VIP, Moderador)
- Integración Deezer para búsqueda

---

## [1.0.0] - 2026-02-01 — Initial Release

- Estructura base Expo + React Native
- Diseño de componentes UI
- Navegación y rutas

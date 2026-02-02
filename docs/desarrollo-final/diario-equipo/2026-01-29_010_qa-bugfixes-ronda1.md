# 🔧 QA Bugfixes — Ronda 1
**Fecha:** 2026-01-29  
**QA Engineer:** Agente QA  
**Referencia:** `2026-01-29_003_qa-revision-pantallas.md`

---

## ✅ Bugs corregidos en esta ronda

### 1. `(auth)/otp.tsx` — Countdown nunca arrancaba
- **Bug:** `countdown` se inicializaba en 30 pero no había lógica para decrementarlo
- **Fix:** Añadido `useEffect` con `setInterval` que decrementa `countdown` de 30 a 0 (1 segundo por tick). Se limpia el intervalo al llegar a 0 o al desmontar. Se añadió import de `useEffect`.

### 2. `(auth)/splash.tsx` — Animated values se recreaban cada render
- **Bug:** `fadeAnim` y `scaleAnim` se creaban con `new Animated.Value()` directamente en el cuerpo del componente
- **Fix:** Envueltos con `useRef(...).current` para persistir entre renders. Se añadió import de `useRef`.

### 3. `(tabs)/live.tsx` — filterChip con doble margen
- **Bug:** `filtersContent` tenía `gap: spacing.sm` Y cada `filterChip` tenía `marginRight: spacing.sm`, duplicando el espacio
- **Fix:** Eliminado `marginRight: spacing.sm` del estilo `filterChip`. El `gap` del contenedor es suficiente.

### 4. `(tabs)/groups.tsx` — Import `Image` sin usar
- **Bug:** `Image` importado de `react-native` pero nunca utilizado
- **Fix:** Eliminado `Image` del import destructurado.

### 5. `notifications.tsx` — Import `Avatar` sin usar
- **Bug:** `Avatar` importado de componentes UI pero nunca utilizado en el render
- **Fix:** Eliminada la línea de import completa.

### 6. `_layout.tsx` (root) — Header visible por defecto en rutas no declaradas
- **Bug:** Las rutas no declaradas explícitamente en el Stack (notifications, chat, group, profile, etc.) mostraban el header blanco por defecto de React Navigation
- **Fix:** Añadido `headerShown: false` en `screenOptions` del Stack raíz para ocultar el header globalmente. Las pantallas que necesiten header custom ya lo implementan internamente.

---

## 📋 Resumen

| # | Archivo | Tipo de fix | Severidad original |
|---|---------|-------------|-------------------|
| 1 | `(auth)/otp.tsx` | Lógica (useEffect + setInterval) | 🔴 Crítico |
| 2 | `(auth)/splash.tsx` | Performance (useRef) | 🔴 Crítico |
| 3 | `(tabs)/live.tsx` | Estilo (doble margen) | 🟡 Moderado |
| 4 | `(tabs)/groups.tsx` | Limpieza (import) | 🟡 Moderado |
| 5 | `notifications.tsx` | Limpieza (import) | 🟡 Moderado |
| 6 | `_layout.tsx` | UX (header global) | 🟡 Moderado |

**Total: 6 bugs corregidos** (2 críticos + 4 moderados)

---

## ⏳ Bugs previamente corregidos (no tocados)
- ✅ `Avatar` — size="xs" añadido al sizeMap
- ✅ `Input` — prop `icon` ahora soportada

---

*Reporte generado por QA Engineer — WhatsSound Team*

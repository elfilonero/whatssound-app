# 🔍 Revisión de Calidad Visual — Sprint 021
**Fecha:** 2026-01-29  
**Revisado por:** QA Visual (Dev de Calidad)  
**Estado:** 6 puntos revisados, hallazgos documentados

---

## 1. Consistencia de Badges ⚠️

**Archivo:** `src/components/ui/Badge.tsx`

**Hallazgo:** El tipo `BadgeVariant` solo admite `'primary' | 'accent' | 'muted' | 'live'`. **No existe variant `"success"`**.

- En `queue.tsx`, el badge "DB" se renderiza con estilos inline hardcodeados (`dbBadge` / `dbBadgeText`) con fondo `#22c55e` y texto blanco — **no usa el componente `Badge`**.
- En `[id].tsx` (chat), los mensajes de DB tienen `borderLeftColor: '#22c55e'` hardcodeado.
- No se encontró un badge "REAL" en los archivos revisados, pero si existe debería usar `Badge` también.

**Recomendación:**
1. Añadir variant `"success"` a `Badge.tsx` con color `#22c55e` (green-500).
2. Reemplazar el badge inline de `queue.tsx` (`dbBadge`/`dbBadgeText`) por `<Badge text="DB" variant="success" />`.
3. Usar `<Badge text="REAL" variant="success" />` donde corresponda.

**Severidad:** Media — inconsistencia visual, fácil de arreglar.

---

## 2. Tipografía Consistente ✅

**Archivo:** `src/theme/typography.ts`

**Hallazgo:** El sistema tipográfico está bien definido con `h1-h3`, `body`, `bodyBold`, `bodySmall`, `caption`, `captionBold`, `button`, `buttonSmall`, `tab`.

Revisando las pantallas principales:
- ✅ `[id].tsx` — usa `typography.bodyBold`, `typography.caption`, `typography.body`, etc.
- ✅ `queue.tsx` — usa `typography.h3`, `typography.bodyBold`, `typography.bodySmall`, `typography.caption`, `typography.captionBold`
- ✅ `login.tsx` — usa `typography.h1`, `typography.body`, `typography.bodySmall`, `typography.caption`
- ✅ `edit-profile.tsx` — usa correctamente el theme

**⚠️ Nota menor:** En `queue.tsx` línea del `dbBadgeText`, el `fontSize: 9` y `fontWeight: '700'` no corresponden a ningún token del theme. Debería usar `typography.caption` o crear un token `micro` si se necesita algo más pequeño.

**Severidad:** Baja.

---

## 3. Safe Areas ❌ Problema detectado

| Pantalla | SafeAreaView | Estado |
|----------|-------------|--------|
| `session/[id].tsx` | ✅ `SafeAreaView` | OK |
| `session/queue.tsx` | ❌ Solo `View` | **BUG** |
| `(auth)/login.tsx` | ❌ Solo `KeyboardAvoidingView` | **BUG** |
| `edit-profile.tsx` | ❌ Solo `ScrollView` | **BUG** |
| `session/request-song.tsx` | ❌ Solo `View` | **BUG** |

**Hallazgo:** Solo la pantalla de sesión (chat) usa `SafeAreaView`. Las demás 4 pantallas NO lo usan, lo que significa que el contenido quedará tapado por el notch/status bar en iPhones con notch.

**Recomendación:** Envolver el contenedor raíz de cada pantalla en `SafeAreaView` o usar `useSafeAreaInsets()` de `react-native-safe-area-context` para aplicar padding dinámico.

**Severidad:** Alta — afecta UX en todos los iPhones modernos.

---

## 4. Keyboard Avoiding ⚠️ Parcial

| Pantalla | KeyboardAvoidingView | Estado |
|----------|---------------------|--------|
| `session/[id].tsx` (chat) | ✅ `behavior='padding'` en iOS | OK |
| `(auth)/login.tsx` | ✅ `behavior='padding'` en iOS, `'height'` en Android | OK |
| `edit-profile.tsx` | ❌ No implementado | **BUG** |
| `session/request-song.tsx` | ❌ No implementado | **BUG** |

**Hallazgo:** `edit-profile.tsx` usa `ScrollView` (que ayuda algo), pero no tiene `KeyboardAvoidingView`. `request-song.tsx` tiene `TextInput` para búsqueda pero tampoco lo implementa.

**Recomendación:** Añadir `KeyboardAvoidingView` en ambas pantallas, o usar `KeyboardAwareScrollView` de `react-native-keyboard-aware-scroll-view`.

**Severidad:** Media — el teclado puede tapar inputs en dispositivos pequeños.

---

## 5. Scroll to Bottom (Chat) ✅ Implementado

**Archivo:** `app/session/[id].tsx`

**Hallazgo:** 
- ✅ `FlatList` tiene `ref={flatListRef}` 
- ✅ `onContentSizeChange` llama `flatListRef.current?.scrollToEnd({ animated: true })`
- Esto hace auto-scroll al cargar y cuando llegan mensajes nuevos (el `setMessages` cambia el contenido → trigger de `onContentSizeChange`)

**⚠️ Mejora sugerida:** Añadir `onLayout` para scroll inicial y considerar NO hacer auto-scroll si el usuario ha scrolleado hacia arriba (para no interrumpir lectura de mensajes antiguos):
```tsx
const isAtBottom = useRef(true);
// onScroll → detectar si está cerca del final
// solo scrollToEnd si isAtBottom.current === true
```

**Severidad:** Baja — funciona, pero la mejora evitaría interrupciones de UX.

---

## 6. Haptic/Visual Feedback en Votación ❌ No implementado

**Archivo:** `app/session/queue.tsx`

**Hallazgo:** El `handleVote` hace un toggle optimista (`userVoted` + sort), pero NO hay:
- ❌ Feedback háptico (`expo-haptics`)
- ❌ Animación de escala (scale bounce)
- ❌ Flash de color
- El cambio de icono (filled vs outline) y color es el único feedback visual

**Recomendación:**
1. Añadir `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)` al votar
2. Envolver el botón de voto en `Animated.View` con animación de scale (0.8 → 1.1 → 1.0, ~200ms)
3. Ejemplo rápido:
```tsx
import * as Haptics from 'expo-haptics';
import { Animated } from 'react-native';

// En SongItem:
const scaleAnim = useRef(new Animated.Value(1)).current;
const animateVote = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  Animated.sequence([
    Animated.timing(scaleAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
  ]).start();
  onVote();
};
```

**Severidad:** Baja — polish, pero mejora mucho la sensación de interactividad.

---

## Resumen

| # | Aspecto | Estado | Severidad |
|---|---------|--------|-----------|
| 1 | Badge "success" variant | ⚠️ Falta | Media |
| 2 | Tipografía consistente | ✅ OK (1 detalle menor) | Baja |
| 3 | Safe Areas | ❌ 4 pantallas sin SafeAreaView | **Alta** |
| 4 | Keyboard Avoiding | ⚠️ 2 pantallas sin KAV | Media |
| 5 | Scroll to bottom | ✅ Implementado | Baja (mejora sugerida) |
| 6 | Haptic feedback votación | ❌ No implementado | Baja |

**Prioridad de fix:** 3 → 1 → 4 → 6 → 5 → 2

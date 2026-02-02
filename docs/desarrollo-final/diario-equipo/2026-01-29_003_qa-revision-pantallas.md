# 🔍 QA Review — Revisión Exhaustiva de Pantallas WhatsSound
**Fecha:** 2026-01-29  
**QA Lead:** Agente QA  
**Archivos revisados:** 26 (.tsx) + 5 componentes UI + 4 archivos theme  

---

## 🐛 BUGS ENCONTRADOS

### 🔴 Críticos

| # | Archivo | Bug | Detalle |
|---|---------|-----|---------|
| 1 | `notifications.tsx` | **Import sin usar** | Importa `Avatar` pero nunca lo usa en el componente |
| 2 | `(auth)/splash.tsx` | **Animated values recreadas en cada render** | `fadeAnim` y `scaleAnim` se crean con `new Animated.Value()` directamente en el cuerpo del componente, no con `useRef`. Se recrean en cada render, rompiendo la animación si hay re-renders |
| 3 | `(auth)/otp.tsx` | **Countdown no funciona** | `countdown` se inicializa en 30 pero nunca hay un `useEffect` con `setInterval` para decrementarlo. Siempre mostrará "Reenviar código en 30s" |
| 4 | `chat/[id].tsx` | **Burbujas con `maxWidth: '75%'`** | Valor string porcentual pasado a `maxWidth` en StyleSheet — funciona en RN pero puede dar warning de tipo en TS estricto |
| 5 | `group/[id].tsx` | **Mismo issue con `maxWidth: '75%'`** |  |
| 6 | `session/[id].tsx` | **`maxWidth: '85%'`** | Mismo patrón |
| 7 | `session/queue.tsx` | **Fragment `<>` dentro de `renderItem` de FlatList** | El section label "SIGUIENTES" se renderiza dentro de `renderItem` usando un Fragment con condicional `index === 1`. Esto es un antipatrón — debería usarse `SectionList` o `ListHeaderComponent` |
| 8 | `Input.tsx` (componente) | **Prop `icon` no existe** | `discover.tsx` y `group/create.tsx` pasan `icon={...}` al Input, pero el componente acepta `leftIcon` / `rightIcon`, NO `icon`. **Las búsquedas no mostrarán el icono** |

### 🟡 Moderados

| # | Archivo | Bug | Detalle |
|---|---------|-----|---------|
| 9 | `(auth)/splash.tsx` | **`useEffect` sin deps correctos** | Incluye `fadeAnim` y `scaleAnim` en el scope pero no en deps (el lint daría warning). Con `useRef` se resolvería |
| 10 | `(tabs)/groups.tsx` | **Import `Image` sin usar** | Importa `Image` de react-native pero no lo utiliza |
| 11 | `(tabs)/discover.tsx` | **`sectionTitle` doble margin** | Estilo `sectionTitle` tiene `marginTop: spacing.lg` y `sectionHeader` tiene `marginTop: spacing.xl`. Cuando se usa `sectionTitle` dentro de `sectionHeader`, se acumula doble margin top |
| 12 | `(tabs)/live.tsx` | **filterChip con doble margen** | `filtersContent` tiene `gap: spacing.sm` Y cada `filterChip` tiene `marginRight: spacing.sm`. Espacio duplicado entre chips |
| 13 | `session/[id].tsx` | **`Avatar` con prop `online`** | Pasa `online` como boolean directo, pero Avatar acepta `online?: boolean` y muestra un dot cuando `online !== undefined`. Funciona, pero siempre mostrará el dot de estado |
| 14 | `_layout.tsx` (root) | **Rutas de sesión incompletas** | Solo registra `session/[id]` en el Stack. Las rutas `session/create`, `session/dj-panel`, `session/queue`, `session/request-song`, `session/send-tip`, `session/share-qr` no están declaradas. Expo Router las auto-descubre, pero no tienen `screenOptions` (header visible por defecto con fondo blanco, inconsistente) |
| 15 | `_layout.tsx` (root) | **Rutas faltantes en Stack** | `notifications`, `chat/[id]`, `group/[id]`, `group/create`, `profile/[id]` no están declaradas en el Stack — usarán header por defecto (correcto estilo por `screenOptions`, pero sin customización) |
| 16 | `dj-panel.tsx` | **Badge variant="muted"** | El Badge recibe `variant="muted"` cuando `!isLive`, lo cual funciona, pero el texto será gris apagado — podría ser confuso para el DJ |
| 17 | `Card.tsx` | **Doble padding** | Card aplica `padding: spacing[padding]` por defecto (`base` = 16). Pero muchas pantallas pasan `style={styles.eventCard}` con su propio `padding`. Esto causa que el padding del prop se aplique primero y el del style lo sobreescriba — funciona, pero es confuso |

### 🟢 Menores

| # | Archivo | Bug | Detalle |
|---|---------|-----|---------|
| 18 | `(auth)/splash.tsx` | **Literal `gap: 16`** en logoContainer | Debería usar `spacing.base` (que es 16) por consistencia |
| 19 | `(auth)/splash.tsx` | **Literal `marginTop: 12`** en tagline | Debería ser `spacing.md` (12) |
| 20 | `(tabs)/history.tsx` | **Literal `marginTop: 8`** | Debería ser `spacing.sm` |
| 21 | `chat/[id].tsx` | **`bubbleMe` usa `colors.primary + '30'`** | El chat 1a1 usa `primary + '30'` como fondo de burbuja propia, pero el theme define `colors.bubbleOwn` (`#005C4B`). Inconsistente con session/[id] que sí usa `bubbleOwn` |
| 22 | `group/[id].tsx` | **Mismo issue con bubbleMe** | Usa `colors.primary + '30'` en vez de `colors.bubbleOwn` |

---

## 🎨 INCONSISTENCIAS DE DISEÑO

### Colores de burbujas
- `chat/[id].tsx` y `group/[id].tsx` usan `colors.primary + '30'` para burbuja propia
- `session/[id].tsx` usa `colors.bubbleOwn` (definido en theme)
- **Solución:** Usar `colors.bubbleOwn` en todos

### Headers custom vs Stack headers
- Todas las pantallas (chat, grupo, sesión, notificaciones, etc.) implementan su propio header manualmente
- El root `_layout.tsx` configura `screenOptions` para el Stack, pero la mayoría de pantallas lo oculta
- **No es un bug**, pero sería más consistente usar `headerShown: false` globalmente y mantener headers custom

### Input con icon vs leftIcon
- `discover.tsx` → `<Input icon={...} />` ❌
- `group/create.tsx` → `<Input icon={...} />` ❌
- `Input.tsx` acepta `leftIcon` y `rightIcon`
- **Bug funcional:** Los iconos de búsqueda NO se renderizan

### Section labels
- `sectionLabel` vs `sectionTitle` vs `sectionHeader` — tres nombres distintos para el mismo patrón visual (CAPS, bold, muted)
- Algunos usan `colors.textSecondary`, otros `colors.textMuted` para el mismo tipo de label
  - `create-profile.tsx` → `textSecondary`
  - `discover.tsx` → `textMuted`
  - `session/create.tsx` → `textSecondary`
  - `dj-panel.tsx` → mezcla ambos (`sectionLabel` = textMuted, `sectionTitle` = textSecondary)

### Separadores
- Patrón consistente ✅: `marginLeft: 76` para separadores en listas de chat/grupo (76px = avatar + gap)
- `discover.tsx` usa `borderBottomWidth` en items en lugar de `ItemSeparatorComponent` — diferente patrón

### Tab bar
- Solo 4 tabs visibles (Chats, En Vivo, Descubrir, Ajustes)
- `groups` y `history` están como tabs ocultos (`href: null`)
- No hay forma de navegar a Groups desde la UI (no hay botón visible)

### Avatar sizes
- `xs` no está definido en el Avatar component (`sizeMap` solo tiene sm/md/lg/xl)
- `group/create.tsx` usa `<Avatar name={c.name} size="xs" />` — **TypeScript error en runtime: `sizeMap['xs']` es `undefined`**, lo que causará `width: undefined, height: undefined`

---

## 📱 PANTALLAS QUE FALTAN PARA FLUJO COMPLETO

### Flujo Auth
- ✅ Splash → ✅ Onboarding → ✅ Login → ✅ OTP → ✅ Create Profile → ✅ Tabs
- **Falta:** Pantalla de selección de país/código telefónico (el selector de país es un botón estático `🇪🇸 +34`)

### Flujo Tabs Principal
- ✅ Chats, ✅ En Vivo, ✅ Descubrir, ✅ Ajustes
- **Falta:** No hay navegación visible a Groups (está como tab oculto)
- **Falta:** History está como placeholder vacío

### Flujo Chat
- ✅ Lista chats → ✅ Chat 1a1 → ✅ Chat grupo
- **Falta:** Pantalla de info de contacto / info de grupo (al tocar el header)
- **Falta:** Pantalla de medios compartidos
- **Falta:** Enviar imagen/audio/adjuntos (botones existen pero no hacen nada)

### Flujo Sesión Musical
- ✅ Ver sesiones en vivo → ✅ Unirse a sesión → ✅ Cola de canciones → ✅ Pedir canción → ✅ Enviar propina → ✅ Compartir QR → ✅ Panel DJ → ✅ Crear sesión
- **Falta:** Navegación del session screen al DJ panel (no hay botón para acceder)
- **Falta:** Pantalla de estadísticas post-sesión (resumen al terminar)

### Flujo Perfil
- ✅ Perfil DJ público
- **Falta:** Editar perfil propio (Settings dice "Editar perfil →" pero no navega)
- **Falta:** Pantalla de seguidores/siguiendo
- **Falta:** Perfil de DJ configuración (Settings lo menciona)

### Flujo Pagos
- ✅ Enviar propina
- **Falta:** Historial de propinas recibidas/enviadas
- **Falta:** Configurar método de pago
- **Falta:** Retirar fondos

### Flujo Notificaciones
- ✅ Centro de notificaciones
- **Falta:** Configuración de notificaciones (Settings lo menciona pero no navega)

### Otras pantallas necesarias
- **Falta:** Pantalla de ajustes de apariencia/tema
- **Falta:** Pantalla de almacenamiento/caché
- **Falta:** Pantalla de ayuda/soporte
- **Falta:** Pantalla de términos y condiciones
- **Falta:** Pantalla de confirmación de eliminar cuenta
- **Falta:** Pantalla de confirmación de cerrar sesión
- **Falta:** Modal/pantalla de reporte de usuario

---

## 💡 SUGERENCIAS DE MEJORA

### Arquitectura
1. **Crear un `useTheme()` hook** que exporte colors, typography, spacing juntos. Simplificaría imports (actualmente 3 imports separados en cada pantalla)
2. **Extraer componentes repetidos**: Header custom, InputBar de chat, MessageBubble, SongItem — se repiten entre pantallas con variaciones mínimas
3. **Crear `SectionHeader` como componente UI compartido** — el patrón "CAPS BOLD MUTED" se repite en 8+ pantallas con nombres distintos

### UX/Funcional
4. **OTP countdown**: Implementar el timer con `useEffect` + `setInterval`
5. **Splash animations**: Usar `useRef` para los `Animated.Value`
6. **Avatar `xs` size**: Añadir al sizeMap (`xs: 24`)
7. **Input `icon` prop**: Añadir como alias de `leftIcon` para conveniencia, o corregir los consumidores
8. **FlatList inverted en chats**: Los chats deberían usar `inverted={true}` para scroll natural (los más recientes abajo)
9. **SafeArea consistency**: Solo `session/[id].tsx` usa `SafeAreaView`. Debería aplicarse consistentemente en todas las pantallas de primer nivel
10. **Keyboard handling**: Solo algunas pantallas usan `KeyboardAvoidingView`. Los chats lo tienen, pero las pantallas de formulario (create-profile, create-session) no

### Performance
11. **`queryClient` en root layout**: Se recrea en cada render. Debería estar fuera del componente o en un `useMemo`/módulo separado
12. **Flatlist `keyExtractor`**: Correcto en todas las pantallas ✅
13. **Memoización**: Ningún componente de lista usa `React.memo()` — los items de chat/sesión/cola deberían memoizarse para evitar re-renders innecesarios

### TypeScript
14. **`Ionicons name` casting**: Múltiples archivos usan `as any` para los nombres de iconos (`settings.tsx`, `notifications.tsx`). Debería usarse el tipo correcto de Ionicons
15. **Interfaces no exportadas**: Las interfaces locales (Chat, Group, Notification, Song, etc.) podrían centralizarse en un `src/types/` para reutilización

---

## 📊 RESUMEN EJECUTIVO

| Categoría | Cantidad |
|-----------|----------|
| 🔴 Bugs críticos | 8 |
| 🟡 Bugs moderados | 9 |
| 🟢 Bugs menores | 5 |
| 🎨 Inconsistencias de diseño | 7 |
| 📱 Pantallas faltantes | ~15 |
| 💡 Sugerencias de mejora | 15 |

### Veredicto
**El código está sorprendentemente bien estructurado** para un primer sprint. El design system se usa consistentemente en la gran mayoría de pantallas. Los bugs críticos más urgentes son:

1. **`Avatar size="xs"` no definido** → crash visual en crear grupo
2. **`Input icon` prop no existe** → iconos de búsqueda invisibles en discover y crear grupo
3. **OTP countdown roto** → el timer nunca arranca
4. **Splash animations se recrean** → comportamiento errático

**Prioridad de fix:** 1 > 2 > 3 > 4

---
*Reporte generado por QA Lead — WhatsSound Team*

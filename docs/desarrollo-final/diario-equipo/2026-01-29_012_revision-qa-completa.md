# 🔍 Revisión QA Completa — WhatsSound App

**Fecha:** 29 enero 2026  
**Revisado por:** QA Lead  
**Archivos revisados:** 43 archivos .tsx en `app/`  
**Theme files:** `colors.ts`, `typography.ts`, `spacing.ts`, `index.ts`  
**Componentes UI:** Button, Input, Avatar, Badge, Card (+ BottomSheet, EmptyState, Modal, Toast)

---

## 📊 Resumen Ejecutivo

| Severidad | Hallazgos |
|-----------|-----------|
| 🔴 Crítico | 5 |
| 🟡 Medio | 12 |
| 🟢 Menor | 14 |

**Veredicto general:** El código es sólido en estructura y consistencia de diseño. Los problemas críticos son de lógica/UX, no de crashes. El design system se usa de forma consistente en el 95% de pantallas. Hay una excepción notable (`dj-profile.tsx`) que diverge del patrón.

---

## 🔴 Críticos (5)

### C1. `app/(tabs)/groups.tsx` y `app/(tabs)/history.tsx` — Importan `Badge` sin usarla
**Archivo:** `(tabs)/groups.tsx`  
**Detalle:** Importa `Badge` de `../../src/components/ui/Badge` pero nunca la usa en el JSX.  
**Impacto:** Bundle innecesariamente más grande. Tree-shaking puede no eliminarla en todos los bundlers.

### C2. `app/chat/[id].tsx` — Burbujas de chat propias usan `colors.primary + '30'` en vez de `colors.bubbleOwn`
**Archivo:** `chat/[id].tsx` línea `bubbleMe`  
**Detalle:** El design system define `bubbleOwn: '#005C4B'` y `bubbleOther: '#1F2C34'` específicamente para burbujas de chat. Sin embargo, el chat 1a1 usa `colors.primary + '30'` (verde con 30% opacidad) en vez de `colors.bubbleOwn`. El chat de grupo (`group/[id].tsx`) tiene el mismo problema.  
**Impacto:** Inconsistencia visual entre lo que define el design system y lo que se renderiza. Las burbujas no coinciden con el estándar WhatsApp-dark que el tema intenta replicar.

### C3. `app/session/[id].tsx` — `Avatar` recibe prop `online` que no existe en el componente
**Archivo:** `session/[id].tsx`  
**Detalle:** `<Avatar name={MOCK_SESSION.dj} size="sm" online />` — La interfaz del Avatar no expone prop `online` según el patrón de uso en otros archivos (solo `name` y `size`). Esto generará un warning de TypeScript o será ignorado silenciosamente.  
**Impacto:** Indicador de estado online del DJ no se muestra.

### C4. `app/profile/followers.tsx` — `Avatar` recibe `size={44}` (número) en vez de un string literal
**Archivo:** `profile/followers.tsx`  
**Detalle:** `<Avatar size={44} name={item.name} />` — El componente Avatar usa un sistema de sizing basado en strings (`"xs"`, `"sm"`, `"md"`, `"lg"`, `"xl"`) según todos los demás archivos. Pasar un número directamente probablemente no renderiza correctamente o produce un error de TypeScript.  
**Impacto:** Los avatares en la lista de seguidores tendrán tamaño incorrecto o causarán error en runtime.

### C5. `app/settings/dj-profile.tsx` — Usa `typography.h4` que NO existe en el tema
**Archivo:** `settings/dj-profile.tsx`  
**Detalle:** `sectionTitle: { ...typography.h4 }` — El archivo `typography.ts` solo define `h1`, `h2`, `h3` como headings. No existe `h4`. Esto causará un spread de `undefined`, resultando en estilos vacíos.  
**Impacto:** Los títulos de sección ("Redes sociales", "Preferencias") no tendrán estilo tipográfico, mostrándose con el default de React Native.

---

## 🟡 Medio (12)

### M1. `app/otp.tsx` — `handleKeyPress` usa tipo `any`
**Archivo:** `(auth)/otp.tsx`  
**Detalle:** `const handleKeyPress = (e: any, index: number)` — Debería usar `NativeSyntheticEvent<TextInputKeyPressEventData>`.  
**Impacto:** Pérdida de type safety, no se valida la estructura del evento.

### M2. `app/chat/media.tsx` — `borderRadius.xs` no existe en el tema
**Archivo:** `chat/media.tsx`  
**Detalle:** El estilo `tile` usa `borderRadius: borderRadius.xs` pero `spacing.ts` define `borderRadius` con claves `sm`, `md`, `lg`, `xl`, `2xl`, `full`. No hay `xs`.  
**Impacto:** Se resuelve como `undefined`, las tiles del grid no tendrán border radius.

### M3. `app/(tabs)/_layout.tsx` — Tab bar height de 56px sin SafeArea padding
**Archivo:** `(tabs)/_layout.tsx`  
**Detalle:** `height: 56, paddingBottom: 4` — En iPhones con notch/Dynamic Island, la tab bar necesita padding inferior adicional para no quedar tapada por el home indicator.  
**Impacto:** En iOS modernos, los tabs pueden estar parcialmente ocultos.

### M4. `app/session/queue.tsx` — Fragment `<>` dentro de FlatList renderItem
**Archivo:** `session/queue.tsx`  
**Detalle:** El `renderItem` retorna un Fragment con el section label + SongItem. Esto viola la API de FlatList que espera un solo elemento por item, y el section label se repite innecesariamente por cada item tras el primero.  
**Impacto:** El label "SIGUIENTES" solo aparece antes del item index 1, pero es un patrón frágil. Si se reordena la lista, el label aparece en posición incorrecta.

### M5. Navegación — `router.push('/session/1')` con ID hardcodeado en múltiples archivos
**Archivos:** `live.tsx`, `profile/[id].tsx`, `group/info.tsx`, `session/create.tsx`  
**Detalle:** Múltiples pantallas hacen `router.push('/session/1')` o `router.push('/session/3')` con IDs hardcodeados de los mocks en vez de pasar el ID dinámico.  
**Impacto:** Al conectar con datos reales, estas navegaciones apuntarán a sesiones inexistentes.

### M6. `app/settings/audio.tsx` — View separador vacía entre toggles
**Archivo:** `settings/audio.tsx`  
**Detalle:** `<View style={[styles.toggleRow, styles.rowBorder]} />` — Hay un View vacío entre los toggles de crossfade y auto-play que solo renderiza un borde. Parece un error de copy-paste.  
**Impacto:** Espacio visual extra injustificado entre opciones.

### M7. `app/settings/dj-profile.tsx` — NO usa componentes UI compartidos consistentemente
**Archivo:** `settings/dj-profile.tsx`  
**Detalle:** Usa `TextInput` nativo en vez del componente `Input` del design system para nombre artístico, bio y redes sociales. También usa un `TouchableOpacity` custom como botón guardar en vez del componente `Button`. Importa ambos (`Input`, `Button`) pero los usa parcialmente.  
**Impacto:** Inconsistencia visual. Los inputs tendrán estilo diferente al resto de la app (sin label flotante, sin bordes del design system).

### M8. `app/event/[id].tsx` — No usa `useLocalSearchParams` para obtener el ID del evento
**Archivo:** `event/[id].tsx`  
**Detalle:** La pantalla no lee el parámetro `id` de la URL. Todo es datos hardcodeados sin referencia al ID.  
**Impacto:** Cuando se integre con backend, no hay forma de saber qué evento mostrar.

### M9. `app/chat/[id].tsx` y `app/group/[id].tsx` — FlatList de mensajes no está invertida correctamente
**Archivo:** `chat/[id].tsx`, `group/[id].tsx`  
**Detalle:** Los chats de mensajería tipo WhatsApp deben usar `inverted={true}` con datos en orden inverso para que los nuevos mensajes aparezcan abajo y el scroll sea natural. El chat 1a1 no tiene `inverted`, y el de grupo tiene `inverted={false}` explícitamente.  
**Impacto:** Al agregar mensajes nuevos, el usuario no verá automáticamente el último mensaje sin scroll manual.

### M10. `app/_layout.tsx` — `QueryClient` se crea fuera del componente pero sin configuración de refetch
**Archivo:** `_layout.tsx`  
**Detalle:** `new QueryClient()` sin opciones. Para una app mobile, debería configurar `defaultOptions: { queries: { retry: 2, staleTime: 5 * 60 * 1000 } }` o similar para evitar refetches excesivos.  
**Impacto:** Performance subóptima cuando se conecte a APIs reales. Cada cambio de foco re-fetcharía todo.

### M11. `app/settings/dj-profile.tsx` — Usa `Alert.alert` nativo para feedback en vez de Toast del design system
**Archivo:** `settings/dj-profile.tsx`  
**Detalle:** El design system incluye un componente `Toast.tsx` pero el perfil DJ usa `Alert.alert` nativo para mostrar "Guardado".  
**Impacto:** Experiencia visual inconsistente con el resto de la app.

### M12. `app/otp.tsx` — Teléfono hardcodeado en pantalla OTP
**Archivo:** `(auth)/otp.tsx`  
**Detalle:** Muestra `+34 612 345 678` directamente en vez de recibir el número como parámetro de navegación desde la pantalla de login.  
**Impacto:** El usuario siempre verá el mismo número, sin importar lo que escribió.

---

## 🟢 Menor (14)

### L1. Componentes UI importados pero no usados
- `(tabs)/groups.tsx`: Importa `Badge`, no la usa
- `(tabs)/live.tsx`: Importa `FlatList` del destructuring de react-native, no la usa directamente (usa `ScrollView` con map)

### L2. `app/(tabs)/settings.tsx` — `icon` prop casteado con `as any`
**Detalle:** `<Ionicons name={icon as any}` — Mejor tipar con `ComponentProps<typeof Ionicons>['name']`.

### L3. Múltiples archivos usan `Ionicons name={... as any}`
**Archivos:** `settings.tsx`, `chat/media.tsx`, `settings/audio.tsx`, `settings/notifications.tsx`, `settings/privacy.tsx`, `settings/appearance.tsx`, `settings/storage.tsx`, `settings/help.tsx`, `notifications.tsx`  
**Detalle:** Patrón repetido de castear a `any` los nombres de iconos.  
**Mejora:** Crear un tipo helper: `type IconName = ComponentProps<typeof Ionicons>['name']`

### L4. `app/(auth)/splash.tsx` — `useEffect` sin dependencias del router
**Detalle:** El array de dependencias está vacío `[]` pero usa `router`. No es un bug porque `router` es estable en expo-router, pero ESLint lo marcará.

### L5. `app/(auth)/onboarding.tsx` — `onViewableItemsChanged` debería estar en `useCallback`
**Detalle:** Usa `useRef` para estabilizar la función, lo cual funciona pero no es el patrón idiomático. `useCallback` con `[]` sería más claro.

### L6. Accesibilidad — TouchableOpacity sin `accessibilityLabel` en iconos de acción
**Archivos:** Prácticamente todas las pantallas  
**Detalle:** Los botones de icono (back, search, add, etc.) no tienen `accessibilityLabel`. Screen readers no pueden describir su función.  
**Ejemplo:** `<TouchableOpacity><Ionicons name="search" .../></TouchableOpacity>` debería tener `accessibilityLabel="Buscar"`.

### L7. Accesibilidad — Chips de género no indican estado seleccionado
**Archivos:** `create-profile.tsx`, `edit-profile.tsx`, `session/create.tsx`  
**Detalle:** Los chips de género seleccionados cambian visualmente pero no tienen `accessibilityState={{ selected: true }}` ni `accessibilityRole="checkbox"`.

### L8. `app/event/[id].tsx` — `interestedRow` tiene `gap: -8` para overlapping avatares
**Detalle:** Gap negativo funciona en algunas versiones de RN pero no es soportado universalmente. Mejor usar `marginLeft: -8` en los avatares individuales.

### L9. `app/chat/media.tsx` — `SCREEN_WIDTH` se calcula una vez al montarse
**Detalle:** Si el dispositivo rota o se usa en split view (iPad), el ancho no se actualiza. Debería usar `useWindowDimensions()`.

### L10. `app/session/[id].tsx` — `progressBar` absolute positioned dentro de `miniPlayer`
**Detalle:** El progress bar tiene `position: absolute, bottom: 0, left: 0, right: 0` dentro de un container sin `position: relative` explícito. Funciona porque RN trata los padres como relative por defecto, pero es mejor ser explícito.

### L11. `app/settings/dj-profile.tsx` — Spacing inconsistente
**Detalle:** Usa `spacing.md` para padding horizontal del container mientras el resto de pantallas de settings usa `spacing.base`. También usa `spacing.xs` para gaps de chips vs `spacing.sm` en pantallas similares.

### L12. `app/profile/[id].tsx` — Prop `icon` en Button puede no estar soportada
**Detalle:** `<Button ... icon={<Ionicons ... />} />` — La interfaz de Button incluye `icon?: React.ReactNode` así que está bien, pero la variante `secondary` con icon necesita verificación visual de que el color del icono sea correcto.

### L13. Archivos sin SafeAreaView donde deberían tenerlo
**Archivos:** `notifications.tsx`, `search.tsx`, `chat/media.tsx`, `profile/followers.tsx`  
**Detalle:** Estas pantallas no usan `SafeAreaView` o `useSafeAreaInsets`. El header se posiciona con padding fijo que puede quedar bajo el notch en iOS.

### L14. `app/_layout.tsx` — Solo registra `session/[id]` como Stack.Screen especial
**Detalle:** Otras pantallas modales (send-tip, share-qr, request-song) usan `router.back()` pero no están registradas como modales en el root layout. Funcionan como push normal, no como modal. Puede ser intencional pero vale revisarlo.

---

## ✅ Puntos Positivos

1. **Design system usado consistentemente** — 42 de 43 archivos usan correctamente `colors`, `typography`, `spacing` del tema centralizado.
2. **Componentes UI reutilizados** — `Button`, `Input`, `Avatar`, `Badge`, `Card` se usan en todo el proyecto con props correctas.
3. **Navegación completa** — Todas las rutas referenciadas existen como archivos reales. No hay enlaces rotos.
4. **Estructura Expo Router correcta** — Layouts anidados `(auth)`, `(tabs)` bien configurados.
5. **Sin memory leaks obvios** — Los `setTimeout` en splash y login tienen cleanup con `clearTimeout`.
6. **Sin renders infinitos** — No hay `useEffect` con dependencias que causen loops.
7. **TypeScript correcto en general** — Interfaces tipadas para datos mock, props de componentes tipadas.
8. **Keyboard handling** — `KeyboardAvoidingView` usado en todas las pantallas con input de texto.

---

## 🎯 Prioridades de Corrección

### Sprint inmediato (antes de demo)
1. **C5** — Agregar `h4` al tema o cambiar a `h3` en dj-profile
2. **C4** — Corregir Avatar size en followers
3. **C2** — Usar `bubbleOwn`/`bubbleOther` del tema en chats

### Sprint siguiente
4. **M2** — Agregar `borderRadius.xs` al tema
5. **M7** — Refactorizar dj-profile para usar componentes UI
6. **M9** — Invertir FlatLists de chat
7. **L6** — Accessibility pass en todos los TouchableOpacity

### Backlog
8. **L3** — Crear tipo helper para Ionicons
9. **M5** — Eliminar IDs hardcodeados de navegación
10. **L13** — SafeAreaView pass

---

*Firmado: QA Lead — WhatsSound Team*  
*Revisión #012 · Sprint de desarrollo final*

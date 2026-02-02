# 🚀 Flujo: Onboarding (Registro / Login)

---

## Resumen

El usuario descarga WhatsSound, se registra con teléfono + OTP (estilo WhatsApp), crea su perfil y conecta su servicio de música. En menos de 2 minutos está dentro.

---

## Flujo Completo

```
[Abrir App] → [Splash] → [Onboarding Slides ×3] → [Login Teléfono]
    → [OTP] → [Crear Perfil] → [Conectar Música] → [Permisos] → [Home]
```

---

## Paso a Paso

### 1. Splash Screen (1.5s)
- Logo WhatsSound animado (burbuja aparece, auriculares se posan)
- Fondo `#0B141A`
- Sin acción del usuario — transición automática

### 2. Onboarding Slides (3 pantallas)

| Slide | Ilustración | Título | Subtítulo |
|-------|-------------|--------|-----------|
| 1 | DJ con público | **Crea sesiones en vivo** | "Pon la música. Tu público decide qué suena." |
| 2 | Manos votando | **Vota las canciones** | "La canción más votada suena primero. Democracia musical." |
| 3 | Chat con burbujas musicales | **Chatea mientras suena** | "Reacciona, comenta y manda propinas al DJ. Todo en tiempo real." |

- **Navegación:** Swipe horizontal + dots indicator
- **Skip:** Botón "Saltar" arriba-derecha (`#8696A0`)
- **CTA slide 3:** Botón "Empezar" (Primary, full width)
- **Ya tengo cuenta:** Link debajo del CTA → va directo a Login

### 3. Login — Número de Teléfono
- **Título:** "Tu número de teléfono"
- **Subtítulo:** "Te enviaremos un código para verificarte"
- **Input:** Selector país (bandera + código) + campo teléfono
- **CTA:** "Siguiente" (Primary) — disabled hasta teléfono válido
- **Términos:** "Al continuar, aceptas los [Términos] y [Privacidad]"
- **Decisión:** Si el número ya existe → login. Si es nuevo → registro.

### 4. Verificación OTP
- **Título:** "Introduce el código"
- **Subtítulo:** "Enviado al +34 612 345 678" (con botón editar número)
- **Input:** 6 cajas individuales, autofocus, auto-advance
- **Auto-detect:** Leer SMS automáticamente (Android) / sugerir código (iOS)
- **Timer:** "Reenviar código en 0:30" → después: "Reenviar código" (link)
- **Error:** "Código incorrecto. Inténtalo de nuevo." (shake animation)
- **Auto-submit:** Al completar 6 dígitos, verificar automáticamente

### 5. Crear Perfil
- **Solo para usuarios nuevos** (login existente salta este paso)
- **Avatar:** Placeholder con cámara. Tap → bottom sheet: Cámara / Galería / Eliminar
- **Nombre:** Input texto, máximo 25 caracteres. Obligatorio.
- **Bio:** Input texto, máximo 140 caracteres. Opcional. Placeholder: "Ej: Amante del reggaeton 🎶"
- **CTA:** "Siguiente" — disabled sin nombre

### 6. Conectar Servicio de Música
- **Título:** "Conecta tu música"
- **Subtítulo:** "Para buscar canciones y pedir temas"
- **Opciones:**
  - 🟢 Spotify (OAuth) — recomendado, badge "Popular"
  - 🍎 Apple Music — nativo iOS
  - 🔴 YouTube Music — OAuth
- **Saltar:** "Ahora no" — puede conectar después desde Ajustes
- **Post-conexión:** Mostrar avatar de Spotify/etc + "Conectado ✓"

### 7. Permisos
- **Notificaciones:** "Activa notificaciones para saber cuándo suena tu canción"
  - Ilustración: notificación push de "🎵 ¡Tu canción es la siguiente!"
  - [Activar] / [Ahora no]
- **Contactos (opcional):** "Encuentra amigos en WhatsSound"
  - [Permitir] / [Ahora no]

### 8. ¡Listo! → Home
- Transición directa al Home (Landing — En Vivo)
- Si hay sesiones activas cerca: mostrar directamente
- Si no hay sesiones: estado vacío con CTA "Crea tu primera sesión"

---

## Decisiones y Bifurcaciones

```
¿Número ya registrado?
├── SÍ → OTP → Home (skip perfil)
└── NO → OTP → Crear Perfil → Conectar Música → Permisos → Home

¿Conectó servicio de música?
├── SÍ → Puede pedir canciones desde el inicio
└── NO → Al intentar pedir canción: prompt de conexión

¿Aceptó notificaciones?
├── SÍ → Recibe pushes de sesiones, votos, propinas
└── NO → Solo notificaciones in-app
```

---

## Métricas Clave

| Métrica | Objetivo |
|---------|----------|
| **Tiempo total onboarding** | < 2 minutos |
| **Drop-off en OTP** | < 10% |
| **% que conecta música** | > 60% |
| **% que acepta notifs** | > 70% |

---

## Pantallas relacionadas

- `pantallas/1.1` — Splash Screen
- `pantallas/1.2` — Onboarding Slides
- `pantallas/1.3` — Login / Registro
- `pantallas/1.4` — Verificación OTP
- `pantallas/1.5` — Crear Perfil
- `pantallas/1.6` — Permisos

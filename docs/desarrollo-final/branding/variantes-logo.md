# 🎨 WhatsSound — Variantes del Logo

> 4 variantes oficiales, cada una con su contexto de uso específico.

---

## Variante 1: Fondo Negro + Logo Verde

**Archivo:** `logo/01-whatssound-fondo-negro-logo-verde.png`

| Propiedad | Valor |
|-----------|-------|
| **Fondo** | `#0B141A` (negro WhatsApp) |
| **Icono** | `#25D366` (verde WhatsApp) |
| **Nombre** | No incluido |

### Uso principal
- Splash screen (antes de cargar)
- Fondos oscuros donde se necesita solo el icono
- Stickers, pegatinas, merchandising dark
- Social media cuando no se necesita nombre

### Cuándo NO usar
- Fondos claros o blancos
- Contextos donde la marca no es reconocida (necesita nombre)

---

## Variante 2: Fondo Verde + Logo Blanco

**Archivo:** `logo/02-whatssound-fondo-verde-logo-blanco.png`

| Propiedad | Valor |
|-----------|-------|
| **Fondo** | `#25D366` (verde WhatsApp) |
| **Icono** | `#FFFFFF` (blanco) |
| **Nombre** | No incluido |

### Uso principal
- App Icon (fondo verde de la plataforma)
- Botones grandes de acción con branding
- Banners promocionales con fondo verde
- Pantallas de carga/transición

### Cuándo NO usar
- Sobre otros fondos verdes (se pierde)
- Tamaños muy pequeños (el blanco pierde definición)

---

## Variante 3: App Icon Móvil

**Archivo:** `logo/03-whatssound-appicon-movil.png`

| Propiedad | Valor |
|-----------|-------|
| **Fondo** | `#25D366` con esquinas redondeadas (plataforma) |
| **Icono** | Burbuja + auriculares en blanco |
| **Formato** | Cuadrado 1024×1024 (source), exportar a tamaños de plataforma |

### Uso principal
- Icono de app en iOS y Android
- Tiendas de apps (App Store, Google Play)
- Favicon derivado (recorte a 32×32, 16×16)
- Icono de notificación (derivar monocromático)

### Especificaciones por plataforma
- **iOS:** 1024×1024 source, sistema aplica máscara superellipse
- **Android:** Adaptive icon — foreground (icono blanco) + background (`#25D366`)
- **Web:** Favicon 32×32 y 16×16, PWA icon 192×192 y 512×512

---

## Variante 4: Fondo Negro + Logo Verde + Nombre Blanco

**Archivo:** `logo/04-whatssound-fondo-negro-logo-verde-nombre-blanco.png`

| Propiedad | Valor |
|-----------|-------|
| **Fondo** | `#0B141A` (negro WhatsApp) |
| **Icono** | `#25D366` (verde WhatsApp) |
| **Nombre** | `#FFFFFF` — "WhatsSound" a la derecha del icono |
| **Tipografía nombre** | SF Pro Bold / Inter Bold |

### Uso principal
- **Variante principal para comunicación externa**
- Headers de web/landing page
- Presentaciones, pitch decks
- Redes sociales (banner, cover)
- Material de prensa
- Onboarding (pantallas de bienvenida)
- Videos promocionales

### Cuándo NO usar
- Espacios muy reducidos (usar variante 1 sin nombre)
- App icon (usar variante 3)

---

## Tabla Resumen

| # | Variante | Fondo | Icono | Nombre | Uso principal |
|---|----------|-------|-------|--------|---------------|
| 1 | Negro/Verde | `#0B141A` | `#25D366` | ❌ | Splash, stickers, dark |
| 2 | Verde/Blanco | `#25D366` | `#FFFFFF` | ❌ | App icon base, banners verdes |
| 3 | App Icon | `#25D366` | Blanco | ❌ | Stores, favicon, notif |
| 4 | Completo | `#0B141A` | `#25D366` | ✅ Blanco | Web, press, social, presentaciones |

---

## Jerarquía de Uso

```
¿La gente ya conoce WhatsSound?
├── SÍ → Variante 1 (solo icono) o 3 (app icon)
└── NO → Variante 4 (icono + nombre) SIEMPRE
         ¿Es sobre fondo verde?
         ├── SÍ → Variante 2
         └── NO → Variante 4
```

---

## Notas de Producción

- Todos los archivos source están en `/logo/`
- Exportar siempre desde source a resolución necesaria (no upscale)
- Para impresión, solicitar versión vectorial (SVG/AI) — pendiente de crear
- Las 15 exploraciones previas están archivadas y **no deben usarse**

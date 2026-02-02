# 📐 WhatsSound — Reglas de Uso del Logo

---

## Anatomía del Logo

El logo de WhatsSound combina dos elementos icónicos:
- **Burbuja de chat** — Silueta de bocadillo estilo WhatsApp (conexión, conversación)
- **Auriculares gamer con micrófono** — Colocados sobre la burbuja (música, gaming, comunidad)

La combinación transmite: **"un chat donde la música es protagonista"**.

---

## Tamaños Mínimos

| Contexto | Tamaño mínimo | Notas |
|----------|---------------|-------|
| **Digital — solo icono** | 32×32px | App icon en barra, favicon |
| **Digital — icono + nombre** | 120px ancho | Header de app, web |
| **Impresión — solo icono** | 15mm | Merchandising, tarjetas |
| **Impresión — icono + nombre** | 40mm ancho | Flyers, posters |

> ⚠️ Por debajo de estos tamaños, los auriculares pierden legibilidad. Usar solo el icono simplificado.

---

## Área de Protección (Clear Space)

El logo necesita espacio para respirar. El **área de protección mínima** es equivalente a **la mitad de la altura de la burbuja (0.5x)** en todos los lados.

```
         ╭─── 0.5x ───╮
         │             │
  0.5x ──┤   [LOGO]   ├── 0.5x
         │             │
         ╰─── 0.5x ───╯
```

Ningún elemento gráfico, texto o borde puede invadir esta área.

---

## Fondos Permitidos

### ✅ Fondos correctos

| Fondo | Variante de logo a usar |
|-------|------------------------|
| **Negro sólido** (`#0B141A` o similar) | Logo verde `#25D366` + nombre blanco |
| **Verde sólido** (`#25D366`) | Logo blanco + nombre blanco |
| **Oscuro (< 30% luminosidad)** | Logo verde + nombre blanco |
| **Foto oscura con overlay** | Logo verde, con `rgba(0,0,0,0.5)` de overlay mínimo |

### ❌ Fondos prohibidos

| Fondo | Por qué no |
|-------|-----------|
| **Blanco o claro** | El logo pierde identidad dark-mode |
| **Verde similar al logo** | Se pierde el contraste del icono |
| **Foto sin overlay** | Legibilidad comprometida |
| **Gradientes multicolor** | Compite visualmente con el logo |
| **Patrones o texturas densas** | El icono se pierde |

---

## Lo que NO hacer

### ❌ Prohibiciones absolutas

1. **No rotar** el logo. Siempre horizontal.
2. **No estirar** ni comprimir. Mantener proporciones originales.
3. **No cambiar colores** — Solo usar las variantes oficiales documentadas.
4. **No agregar efectos** — Sin sombras, biseles, brillos, bordes extra.
5. **No recortar** — Los auriculares y la burbuja son inseparables.
6. **No poner texto encima** del logo.
7. **No usar el nombre sin el icono** en tamaños grandes (pierde reconocimiento).
8. **No animar el logo** de formas no aprobadas (solo la animación de splash oficial).
9. **No recrear** el logo con otros iconos o fuentes.
10. **No usar en mockups de terceros** sin la variante correcta de fondo.

### Ejemplos visuales de errores comunes

```
❌ Estirado        ❌ Rotado         ❌ Color cambiado
╭───────────╮      ╱╲               ╭─────╮
│  [LOGO]   │     ╱LO╲             │LOGO │ ← en rojo
│ stretched │    ╱ GO  ╲            │ red │
╰───────────╯   ╱______╲           ╰─────╯

❌ Sobre claro     ❌ Con sombra     ❌ Recortado
┌───────────┐     ╭═════╮          ╭──╮
│  [LOGO]   │     ║LOGO ║░░        │LO│ ← cortado
│ on white  │     ╚═════╝░░        ╰──╯
└───────────┘
```

---

## Colocación Preferida

| Contexto | Posición |
|----------|----------|
| **App — Splash** | Centrado vertical y horizontal |
| **App — Header** | Izquierda, verticalmente centrado |
| **Web — Navbar** | Izquierda, con nombre al lado |
| **Redes sociales — Perfil** | Centrado, variante AppIcon |
| **Merchandising** | Centrado en pecho (camiseta), esquina superior (stickers) |
| **QR Card** | Encima del código QR, centrado |

---

## Favicon y App Icon

- **Favicon:** Solo la burbuja con auriculares, sin nombre. 32×32px y 16×16px.
- **App Icon:** Variante `03-whatssound-appicon-movil.png` — Burbuja centrada sobre fondo verde con esquinas redondeadas (según plataforma: iOS 60pt radius, Android adaptive icon).
- **Notification icon:** Solo silueta blanca de la burbuja+auriculares (Android monocromático).

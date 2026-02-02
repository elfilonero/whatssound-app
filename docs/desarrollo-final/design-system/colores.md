# 🎨 WhatsSound — Paleta de Colores

> **Principio:** WhatsApp dark mode como base, con acentos musicales que transmiten energía sin romper la familiaridad.

---

## Colores Primarios

| Nombre | Hex | Uso |
|--------|-----|-----|
| **Verde WS** | `#25D366` | CTAs, iconos activos, badges online, acentos principales |
| **Verde Oscuro** | `#075E54` | Headers, barra superior, elementos secundarios |
| **Verde Header** | `#1F2C34` | Fondo de header/toolbar |
| **Teal** | `#128C7E` | Iconos secundarios, links, estados hover |

## Fondos

| Nombre | Hex | Uso |
|--------|-----|-----|
| **Fondo App** | `#0B141A` | Fondo principal de la app |
| **Fondo Card** | `#111B21` | Cards, burbujas recibidas, panels |
| **Fondo Elevado** | `#1F2C34` | Elementos elevados, modals, headers |
| **Fondo Input** | `#2A3942` | Campos de texto, search bars |
| **Fondo Hover** | `#233138` | Estado hover en listas |

## Burbujas de Chat

| Nombre | Hex | Uso |
|--------|-----|-----|
| **Burbuja Enviada** | `#005C4B` | Mensajes del usuario |
| **Burbuja Recibida** | `#1F2C34` | Mensajes de otros |
| **Burbuja Sistema** | `#182229` | Mensajes del sistema (notificaciones, canciones) |

## Texto

| Nombre | Hex | Uso |
|--------|-----|-----|
| **Texto Principal** | `#E9EDEF` | Títulos, texto de chat, contenido principal |
| **Texto Secundario** | `#8696A0` | Subtítulos, timestamps, hints |
| **Texto Deshabilitado** | `#4A5D6A` | Texto inactivo, placeholders |
| **Texto sobre Verde** | `#FFFFFF` | Texto sobre fondos verdes |

## Estados

| Nombre | Hex | Uso |
|--------|-----|-----|
| **Éxito** | `#25D366` | Confirmaciones, conexiones exitosas |
| **Error** | `#F44336` | Errores, desconexión, expulsar |
| **Warning** | `#FFA726` | Alertas, propinas, prioridad |
| **Info** | `#29B6F6` | Información, links, menciones |
| **Online** | `#25D366` | Dot de usuario conectado |
| **Offline** | `#8696A0` | Estado desconectado |

## Badges y Roles

| Nombre | Hex | Uso |
|--------|-----|-----|
| **Badge DJ** | `#FFD700` | Estrella/icono DJ |
| **Badge VIP** | `#FF6B35` | Badge VIP, propinas |
| **Badge Moderador** | `#29B6F6` | Escudo moderador |
| **Badge Oro** | `#FFD700` | Medalla 1er puesto en cola |
| **Badge Plata** | `#C0C0C0` | Medalla 2do puesto |
| **Badge Bronce** | `#CD7F32` | Medalla 3er puesto |

## Gradientes

| Nombre | Valores | Uso |
|--------|---------|-----|
| **Verde Musical** | `#075E54 → #25D366` | Headers especiales, splash |
| **Card Destacada** | `#1F2C34 → #0B141A` | Cards con énfasis |
| **Propina** | `#FF6B35 → #FFD700` | Indicador de propina/prioridad |
| **QR Card** | `#075E54 → #128C7E` | Fondo de tarjeta QR |

## Overlays y Sombras

| Nombre | Valor | Uso |
|--------|-------|-----|
| **Overlay Modal** | `rgba(0,0,0,0.6)` | Fondo de modales |
| **Overlay Bottom Sheet** | `rgba(0,0,0,0.4)` | Bottom sheets |
| **Sombra Elevación 1** | `0 1px 3px rgba(0,0,0,0.3)` | Cards, botones |
| **Sombra Elevación 2** | `0 4px 12px rgba(0,0,0,0.4)` | Modales, FAB |
| **Sombra Elevación 3** | `0 8px 24px rgba(0,0,0,0.5)` | Bottom sheets |

---

## Reglas de Uso

1. **Verde `#25D366` solo para acciones e interactividad** — nunca como fondo de grandes superficies
2. **Máximo 2 colores de acento por pantalla** — verde + un estado si es necesario
3. **Contraste mínimo 4.5:1** para texto sobre fondos (WCAG AA)
4. **Badges siempre con borde `#0B141A` de 2px** para separar del fondo
5. **No usar blanco puro `#FFFFFF`** excepto sobre verde — siempre `#E9EDEF`

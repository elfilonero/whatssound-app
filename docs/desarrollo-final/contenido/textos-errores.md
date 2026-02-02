# ⚠️ WhatsSound — Mensajes de Error y Estados Vacíos

---

## Errores de Conexión

| Código | Título | Mensaje | Acción |
|--------|--------|---------|--------|
| **Sin internet** | Sin conexión | Comprueba tu conexión a internet e inténtalo de nuevo. | [Reintentar] |
| **Timeout** | Tardó demasiado | El servidor no responde. Inténtalo en unos segundos. | [Reintentar] |
| **Server down** | Algo salió mal | Estamos teniendo problemas técnicos. Vuelve en unos minutos. | [Reintentar] |
| **Mantenimiento** | Volvemos enseguida | Estamos mejorando WhatsSound. No tardaremos. | — |

## Errores de Autenticación

| Código | Título | Mensaje | Acción |
|--------|--------|---------|--------|
| **OTP incorrecto** | Código incorrecto | Ese no es el código. Inténtalo de nuevo. | [Reenviar código] |
| **OTP expirado** | Código expirado | El código ya no es válido. Te enviamos uno nuevo. | [Reenviar] |
| **Teléfono inválido** | Número no válido | Revisa que el número sea correcto, con código de país. | — |
| **Demasiados intentos** | Demasiados intentos | Espera {minutes} minutos antes de intentar de nuevo. | — |
| **Cuenta bloqueada** | Cuenta suspendida | Tu cuenta ha sido suspendida. Contacta soporte. | [Contactar soporte] |

## Errores de Sesión

| Código | Título | Mensaje | Acción |
|--------|--------|---------|--------|
| **Sesión no existe** | Sesión no encontrada | Esta sesión ya no existe o el enlace no es válido. | [Ver sesiones activas] |
| **Sesión cerrada** | Sesión terminada | Esta sesión ya terminó. ¡Busca otra en vivo! | [Ver sesiones activas] |
| **Sesión llena** | Sesión completa | No hay sitio ahora. Te avisamos cuando se libere. | [Notificarme] |
| **Baneado** | No puedes unirte | No tienes acceso a esta sesión. | [Volver] |
| **QR inválido** | QR no reconocido | Este código QR no es de WhatsSound. | [Escanear otro] |
| **QR expirado** | Enlace expirado | Este QR ya no es válido. Pide uno nuevo al DJ. | [Volver] |

## Errores de Música

| Código | Título | Mensaje | Acción |
|--------|--------|---------|--------|
| **Sin servicio** | Conecta tu música | Necesitas Spotify, Apple Music o YouTube Music para pedir canciones. | [Conectar] |
| **Servicio desconectado** | {Servicio} desconectado | Reconecta tu cuenta para seguir usando WhatsSound. | [Reconectar] |
| **Sin Premium** | Se necesita Premium | Para reproducir música, el DJ necesita Spotify Premium. | — |
| **Canción no disponible** | No disponible | Esta canción no está disponible en tu región. | — |
| **Límite de canciones** | Límite alcanzado | Ya pediste {max} canciones. Espera a que suene una para pedir otra. | — |
| **Duplicada** | Ya está en la cola | Esta canción ya la pidió alguien. ¡Vótala para que suba! | [Ir a votar] |
| **Búsqueda vacía** | Sin resultados | No encontramos "{query}". Prueba con otro nombre. | — |

## Errores de Pagos / Propinas

| Código | Título | Mensaje | Acción |
|--------|--------|---------|--------|
| **Sin método de pago** | Agrega un método de pago | Necesitas una tarjeta o billetera digital para enviar propinas. | [Agregar] |
| **Pago rechazado** | Pago no procesado | Tu banco rechazó el pago. Prueba con otro método. | [Cambiar método] |
| **Fondos insuficientes** | Fondos insuficientes | No hay saldo suficiente. Prueba con otra tarjeta. | [Cambiar método] |
| **Error genérico pago** | Error en el pago | No pudimos procesar tu propina. Inténtalo de nuevo. | [Reintentar] |
| **Retiro mínimo** | Mínimo no alcanzado | Necesitas al menos €10 para retirar fondos. Tienes €{balance}. | — |

## Errores de Chat

| Código | Título | Mensaje | Acción |
|--------|--------|---------|--------|
| **Silenciado** | Estás silenciado | El DJ te silenció. Podrás escribir en {timeLeft}. | — |
| **Chat desactivado** | Chat desactivado | El DJ desactivó el chat en esta sesión. | — |
| **Modo lento** | Espera un momento | En modo lento. Puedes enviar otro mensaje en {seconds}s. | — |
| **Mensaje muy largo** | Mensaje demasiado largo | El máximo es 500 caracteres. | — |

---

## Estados Vacíos

### Home — Sin sesiones en vivo
- **Icono:** 🎵 (48px, apagado)
- **Título:** Silencio por aquí...
- **Subtítulo:** No hay sesiones en vivo ahora. ¡Crea la primera!
- **CTA:** [Crear sesión]

### Cola — Sin canciones
- **Icono:** 📋 (48px)
- **Título:** La cola está vacía
- **Subtítulo:** Sé el primero en pedir una canción.
- **CTA:** [Pedir canción 🎵]

### Chat — Sin mensajes
- **Icono:** 💬 (48px)
- **Título:** Empieza la conversación
- **Subtítulo:** Di algo, que no muerden.
- **CTA:** — (focus en input)

### Gente — Solo tú
- **Icono:** 👤 (48px)
- **Título:** Solo estás tú
- **Subtítulo:** Comparte la sesión para que se unan más.
- **CTA:** [Compartir 📲]

### Historial — Sin sesiones pasadas
- **Icono:** 📡 (48px)
- **Título:** Aún no tienes historial
- **Subtítulo:** Únete a una sesión o crea la tuya. Aquí verás tu actividad.
- **CTA:** [Explorar sesiones]

### Búsqueda — Sin resultados
- **Icono:** 🔍 (48px)
- **Título:** Sin resultados
- **Subtítulo:** No encontramos nada para "{query}". Prueba con otras palabras.
- **CTA:** — (focus en búsqueda)

### Propinas — Sin historial
- **Icono:** 🔥 (48px)
- **Título:** Aún no hay propinas
- **Subtítulo (DJ):** Cuando recibas propinas de tu público, aparecerán aquí.
- **Subtítulo (User):** Envía una propina al DJ para apoyar la sesión.
- **CTA:** —

### Notificaciones — Vacío
- **Icono:** 🔔 (48px)
- **Título:** Todo tranquilo
- **Subtítulo:** Cuando pase algo interesante, te avisamos aquí.
- **CTA:** —

---

## Reglas de Copy para Errores

1. **Nunca mostrar errores técnicos** — "Error 500", "null", "undefined" son inaceptables
2. **Siempre dar una acción** — Si se puede hacer algo, mostrar botón
3. **Tono empático, no culpabilizador** — "Algo salió mal" > "Cometiste un error"
4. **Breves** — Título max 5 palabras, mensaje max 2 líneas
5. **Sin jerga técnica** — "servidor", "API", "timeout" → "problemas técnicos"
6. **Humor solo en estados vacíos** — Nunca en errores reales (frustra al usuario)

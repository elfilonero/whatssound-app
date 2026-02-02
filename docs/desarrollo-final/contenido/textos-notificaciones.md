# 🔔 WhatsSound — Textos de Notificaciones Push

---

## Sesiones

| Trigger | Título | Body |
|---------|--------|------|
| DJ que sigues inicia sesión | **{djName} está en vivo** | Sesión de {genre}. ¡Únete! |
| Invitado a sesión | **Te invitaron a una sesión** | {userName} te invita a la sesión de {djName}. |
| Sesión cercana nueva | **Sesión cerca de ti** | {djName} empezó una sesión de {genre} a {distance}. |
| Sesión a la que asististe vuelve | **{djName} volvió** | Nueva sesión en vivo. La última vez estuviste {timeAgo}. |

## Cola y Canciones

| Trigger | Título | Body |
|---------|--------|------|
| Tu canción es la siguiente | **🎵 ¡Tu canción es la siguiente!** | "{songTitle}" va a sonar ahora. |
| Tu canción está sonando | **🎵 ¡Tu canción está sonando!** | "{songTitle}" de {artist} — ¡a disfrutar! |
| Tu canción fue aprobada | **Canción aprobada** | El DJ aprobó "{songTitle}". Ya está en la cola. |
| Tu canción fue rechazada | **Canción no aceptada** | El DJ no aceptó "{songTitle}". Prueba con otra. |
| Tu canción subió al #1 | **🏆 ¡Tu canción es la #1!** | "{songTitle}" es la más votada. |
| Alguien votó tu canción | **+1 voto** | {userName} votó "{songTitle}". Ya tiene {count} votos. |

## Propinas

| Trigger | Título | Body |
|---------|--------|------|
| Recibir propina (DJ) | **🔥 Propina de €{amount}** | {userName}: "{message}" |
| Recibir propina sin mensaje | **🔥 Propina de €{amount}** | {userName} te envió una propina. |
| Payout completado (DJ) | **💰 Transferencia enviada** | €{amount} enviados a tu cuenta. Llegará en 1-3 días. |
| Pago fallido | **Pago no procesado** | No pudimos procesar tu propina. Revisa tu método de pago. |

## Chat y Social

| Trigger | Título | Body |
|---------|--------|------|
| Mención en chat | **{userName} te mencionó** | "{messagePreview}..." en la sesión de {djName}. |
| Mensaje directo (futuro) | **{userName}** | {messagePreview}... |
| Nuevo seguidor | **{userName} te sigue** | Ahora recibirá notificaciones cuando estés en vivo. |

## DJ — Moderación

| Trigger | Título | Body |
|---------|--------|------|
| Usuario quiere unirse (privada) | **Solicitud de acceso** | {userName} quiere unirse a tu sesión. |
| Muchas canciones pendientes | **{count} canciones pendientes** | Tienes canciones por aprobar en la cola. |
| Sesión alcanzó X oyentes | **🎉 ¡{count} personas escuchando!** | Tu sesión está creciendo. ¡Sigue así! |
| Milestone de propinas | **💰 ¡Llevas €{total} en propinas!** | Esta sesión está siendo generosa. |

## Sistema

| Trigger | Título | Body |
|---------|--------|------|
| Actualización disponible | **Nueva versión disponible** | WhatsSound {version} tiene nuevas funciones. ¡Actualiza! |
| Servicio de música desconectado | **Spotify desconectado** | Reconecta para seguir pidiendo canciones. |
| Sesión inactiva (DJ) | **¿Sigues ahí?** | Tu sesión lleva {minutes} min sin actividad. Se cerrará automáticamente. |
| Bienvenida post-registro | **¡Bienvenido a WhatsSound! 🎵** | ¿Qué suena? Explora sesiones en vivo o crea la tuya. |

---

## Agrupación

Cuando hay múltiples notificaciones del mismo tipo:
- **Votos:** "{userName} y {count} más votaron tu canción" (no 10 notifs separadas)
- **Chat:** "3 mensajes nuevos en la sesión de {djName}"
- **Propinas:** "Recibiste {count} propinas por €{total}"

---

## Configuración de usuario

Desde Ajustes → Notificaciones, el usuario controla:

| Categoría | Default |
|-----------|---------|
| Sesiones en vivo | ✅ On |
| Votos en mis canciones | ✅ On |
| Propinas recibidas | ✅ On |
| Menciones en chat | ✅ On |
| Todos los mensajes de chat | ❌ Off |
| DJs que sigo | ✅ On |
| Sesiones cercanas | ❌ Off |
| Actualizaciones de la app | ✅ On |

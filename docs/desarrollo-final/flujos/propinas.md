# 💰 Flujo: Propinas

---

## Resumen

Los usuarios envían propinas monetarias al DJ para agradecer, priorizar canciones o simplemente apoyar. El DJ acumula balance y puede retirar fondos.

---

## Flujo: Enviar Propina

```
[Sesión] → [Botón propina 🔥] → [Modal: cantidad + mensaje] → [Confirmar pago] → [Propina enviada]
```

### 1. Puntos de Acceso

Desde dónde se puede enviar propina:
- **Reproductor:** Botón "🔥 Propina" junto a reacciones
- **Al pedir canción:** Opción de añadir propina al pedido
- **Perfil del DJ:** Botón "Enviar propina"
- **Chat:** Comando rápido o botón en perfil del DJ

### 2. Modal de Propina

```
┌────────────────────────────────┐
│       🔥 Propina para DJ X     │
│                                │
│   [€1]  [€2]  [€5]  [€10]    │
│          [Otra cantidad]       │
│                                │
│   💬 "¡Gran sesión!"          │
│   (mensaje opcional)           │
│                                │
│   ┌──────────────────────────┐ │
│   │   ENVIAR €5 🔥           │ │
│   └──────────────────────────┘ │
│                                │
│   💳 Visa •••• 1234  [Cambiar] │
└────────────────────────────────┘
```

- **Cantidades rápidas:** €1, €2, €5, €10 (chips seleccionables)
- **Personalizada:** "Otra cantidad" → input numérico (min €0.50, max €100)
- **Mensaje:** Opcional, max 100 chars. Aparece en chat y panel DJ.
- **Método de pago:** Último usado por defecto. Tap para cambiar.

### 3. Confirmar Pago
- Autenticación biométrica (Face ID / Touch ID) o PIN
- Loading → "¡Propina enviada! 🔥"
- Confetti animation breve

### 4. Post-Propina

**Para el que envía:**
- Chat: Burbuja especial dorada: "🔥 [User] envió una propina de €5 — '¡Gran sesión!'"
- Badge temporal "🔥" junto a su nombre en la sesión

**Para el DJ:**
- Notificación en Panel DJ: "💰 [User] te envió €5"
- Toast en pantalla: "🔥 €5 de [User]: '¡Gran sesión!'"
- El total de propinas de la sesión se actualiza en stats

**Si la propina acompaña una canción:**
- La canción en cola muestra borde izquierdo dorado `#FFD700`
- Badge "🔥 PROPINA" visible
- Visualmente destaca sobre canciones sin propina (no cambia posición automáticamente, pero el DJ la ve destacada)

---

## Flujo: Recibir Propinas (DJ)

```
[Panel DJ] → [Ver propinas] → [Historial] → [Retirar fondos]
```

### Panel DJ — Sección Propinas
- Total de la sesión actual: "€47 en propinas"
- Últimas propinas con nombre + cantidad + mensaje
- Tap → historial completo

### Historial de Propinas
- Lista cronológica: usuario, cantidad, mensaje, fecha
- Filtros: Por sesión / Total histórico
- Resumen: Total ganado, promedio por sesión, top propinador

### Retirar Fondos
- Balance disponible en Ajustes → Cuenta → Pagos
- Métodos de retiro: PayPal, transferencia bancaria, Bizum
- Mínimo retiro: €10
- Comisión WhatsSound: 10% (transparente, mostrado en cada propina)
- Tiempo de procesamiento: 1-3 días laborales

---

## Métodos de Pago (Usuario)

| Método | Disponibilidad |
|--------|---------------|
| **Apple Pay** | iOS |
| **Google Pay** | Android |
| **Tarjeta crédito/débito** | Todos |
| **PayPal** | Todos |
| **Bizum** | España |

- Guardado seguro via Stripe/pasarela
- Primer uso: agregar método → guardar para futuro
- Gestión en Ajustes → Cuenta → Métodos de pago

---

## Restricciones

| Regla | Valor |
|-------|-------|
| Propina mínima | €0.50 |
| Propina máxima | €100 por transacción |
| Max propinas por sesión (usuario) | 20 |
| Comisión plataforma | 10% |
| Edad mínima para propinas | 18 años |

---

## Edge Cases

| Caso | Comportamiento |
|------|----------------|
| **Sin método de pago** | "Agrega un método de pago para enviar propinas" → Ajustes |
| **Pago rechazado** | "No se pudo procesar el pago. Intenta con otro método." |
| **DJ desactivó propinas** | Botón no visible, opción oculta |
| **Menor de edad** | Propinas deshabilitadas (verificación en registro) |
| **Reembolso** | Solo por errores técnicos, via soporte. No por "cambié de opinión". |

---

## Pantallas relacionadas

- `pantallas/7.1` — Enviar Propina (modal)
- `pantallas/7.2` — Historial de Propinas
- `pantallas/7.3` — Configurar Pagos
- `pantallas/4.1` — Panel DJ (stats propinas)

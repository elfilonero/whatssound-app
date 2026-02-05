# 🔐 WhatsSound Security Documentation

## Overview

Este documento describe las medidas de seguridad implementadas en WhatsSound.

## Medidas Implementadas

### 1. Row Level Security (RLS)

Todas las tablas de Supabase tienen RLS activado:

| Tabla | RLS | Políticas |
|-------|-----|-----------|
| ws_profiles | ✅ | Lectura pública, escritura solo propietario |
| ws_sessions | ✅ | Lectura pública activas, modificación solo DJ |
| ws_tips | ✅ | Solo visible para from/to user |
| ws_messages | ✅ | Solo miembros del chat |
| ws_votes | ✅ | Solo creación si está en sesión |
| ... | ✅ | Ver Supabase Dashboard |

### 2. Rate Limiting

Implementado en `src/utils/rateLimit.ts`:

| Acción | Límite | Ventana |
|--------|--------|---------|
| Login | 5 | 1 min |
| Signup | 3 | 1 min |
| Vote | 30 | 1 min |
| Request Song | 10 | 1 min |
| Send Message | 60 | 1 min |
| API general | 100 | 1 min |

Bloqueo: 5 minutos después de exceder límite.

### 3. Security Headers

Configurados en `vercel.json`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### 4. Input Validation

- SQL injection: Escapado automático por Supabase
- XSS: React escapa por defecto, no usamos dangerouslySetInnerHTML
- Payload limits: Validación de tamaño en cliente
- Type validation: TypeScript strict mode

### 5. Authentication

- JWT tokens via Supabase Auth
- Tokens almacenados en localStorage con expiración
- Refresh tokens automáticos
- No se almacenan contraseñas en cliente

## Tests de Seguridad

Ubicación: `__tests__/security/`

- `auth.test.ts` - Token validation, brute force
- `rls.test.ts` - Row Level Security
- `validation.test.ts` - SQL injection, XSS
- `rateLimit.test.ts` - Rate limiting

Ejecutar: `npm test -- --testPathPattern=security`

## Mejoras Pendientes

- [ ] Content Security Policy (CSP) completo
- [ ] Subresource Integrity (SRI)
- [ ] Certificate Transparency
- [ ] Security monitoring/alertas
- [ ] Penetration testing profesional

## Reporte de Vulnerabilidades

Si encuentras una vulnerabilidad, contacta: security@whatssound.app

**NO** reportes vulnerabilidades públicamente en GitHub Issues.

## Audit Log

| Fecha | Acción | Responsable |
|-------|--------|-------------|
| 2026-02-05 | RLS verificado todas las tablas | Tanke |
| 2026-02-05 | Rate limiting implementado | Tanke |
| 2026-02-05 | Security headers añadidos | Tanke |
| 2026-02-05 | Tests de seguridad creados | Tanke |

---

*Última actualización: 2026-02-05*

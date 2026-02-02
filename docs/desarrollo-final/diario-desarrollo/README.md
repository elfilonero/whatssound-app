# 📓 Diario de Desarrollo — WhatsSound

## Qué es esto
Registro visual y textual de cada prueba de la aplicación en local. Cada entrada documenta qué se probó, qué funcionó, qué falló, con capturas de pantalla y (cuando sea posible) vídeo.

## Estructura
Cada sesión de prueba crea una carpeta con fecha y hora:

```
diario-desarrollo/
├── README.md (este archivo)
├── 2026-01-29_0600_primera-estructura/
│   ├── notas.md (qué se probó, resultados, fallos)
│   ├── 01-captura-descripcion.png
│   ├── 02-captura-descripcion.png
│   └── video-prueba.webm (si disponible)
├── 2026-01-30_1400_login-otp/
│   ├── notas.md
│   ├── 01-login-cargado.png
│   ├── 02-error-validacion.png
│   └── ...
```

## Formato de notas.md

```markdown
# Prueba: [nombre descriptivo]
**Fecha:** YYYY-MM-DD HH:MM
**Pantallas probadas:** [lista]
**Resultado general:** ✅ OK / ⚠️ Parcial / ❌ Fallo

## Qué se probó
- [acción 1]
- [acción 2]

## Resultados
| # | Acción | Resultado | Captura |
|---|--------|-----------|---------|
| 1 | Abrir login | ✅ OK | 01-login.png |
| 2 | Enviar OTP | ❌ Fallo | 02-error-otp.png |

## Fallos encontrados
- **Fallo 1:** Descripción + captura + dónde mirar en el código
- **Fallo 2:** ...

## Siguiente paso
Qué hay que corregir antes de la próxima prueba.
```

## Método de captura
- **Capturas:** Browser screenshot (navegador interno) — funciona siempre
- **Vídeo:** Pendiente de activar permisos Screen Recording en macOS
- **Alternativa vídeo:** Chrome DevTools recording / browser CDP screencast

## Reglas
1. SIEMPRE documentar antes de corregir
2. Cada fallo con su captura
3. Nombre de archivo = descripción de lo que se ve
4. No borrar entradas antiguas — son el historial

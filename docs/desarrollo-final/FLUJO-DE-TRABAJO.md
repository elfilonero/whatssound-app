# 📋 FLUJO DE TRABAJO — WhatsSound
## Cómo se programa esta aplicación

*Documento oficial. Este es el protocolo obligatorio para cada sesión de desarrollo.*

---

## 🖥️ ENTORNO DE TRABAJO (siempre abierto)

Antes de escribir una sola línea de código, se prepara el entorno con todo visible:

### Panel 1 — REFERENCIA VISUAL
- **Logo de WhatsSound** siempre visible (imagen abierta)
- **Imagen de referencia** de la pantalla que se va a programar (de `referencias-visuales/`)
- Esta imagen es la guía: el resultado programado debe parecerse a ella

### Panel 2 — CÓDIGO
- Editor con el código de la sección actual
- Documentación técnica relevante abierta (del superexperto correspondiente)
- Papers y fuentes descargadas disponibles para consulta

### Panel 3 — PREVIEW EN VIVO
- La app corriendo en local (navegador o simulador)
- Se ve en tiempo real cómo queda el código
- Se compara visualmente con la imagen de referencia del Panel 1

### Panel 4 — DIARIO DE DESARROLLO
- Captura de pantalla de cada prueba
- Vídeo de la interacción (clics, navegación, fallos)
- Anotaciones de qué funciona y qué no
- Comparativa: referencia vs resultado real

---

## 🔄 CICLO DE TRABAJO (para cada pantalla/sección)

### PASO 1 — PREPARACIÓN
1. Identificar qué pantalla/sección se va a programar
2. Abrir la imagen de referencia visual correspondiente
3. Abrir la documentación técnica de esa sección
4. Consultar al superexperto del campo (frontend, backend, realtime, etc.)
5. Tener el logo de WhatsSound visible

### PASO 2 — ASESORÍA DEL EQUIPO
1. El superexperto correspondiente revisa el enfoque antes de codear
2. Consulta sus fuentes descargadas y repos de GitHub
3. Recomienda librerías, patrones y estructura
4. Si hay dudas, mesa redonda con varios superexpertos

### PASO 3 — PROGRAMACIÓN
1. Escribir código siguiendo las recomendaciones del equipo
2. Código de PRODUCCIÓN, no prototipo (escalable, limpio, documentado)
3. Comparar constantemente con la imagen de referencia visual
4. Usar las librerías y patrones acordados por el equipo

### PASO 4 — PRUEBA EN LOCAL
1. Desplegar en local (navegador/simulador)
2. Probar todas las interacciones de la pantalla
3. Capturar pantalla del resultado
4. Grabar vídeo de la interacción (clics, navegación)
5. Comparar visualmente: referencia vs resultado real

### PASO 5 — DOCUMENTAR EN DIARIO
1. Crear entrada en `diario-desarrollo/` con fecha y hora
2. Anotar qué se probó y el resultado
3. Guardar capturas con nombre descriptivo
4. Guardar vídeo de la prueba
5. Si hay fallos: describir el fallo, captura del error, dónde mirar en el código

### PASO 6 — CORRECCIÓN
1. Revisar el diario y los fallos documentados
2. Corregir el código
3. Volver al PASO 4 (probar de nuevo)
4. Repetir hasta que el resultado coincida con la referencia visual

### PASO 7 — CIERRE DE SECCIÓN
1. Captura final del resultado aprobado
2. Comparativa lado a lado: referencia vs resultado
3. Marcar sección como completada en el plan de fases
4. Commit en git con mensaje descriptivo
5. Pasar a la siguiente pantalla/sección

---

## 📁 ESTRUCTURA DE ARCHIVOS DE REFERENCIA

```
desarrollo-final/
├── FLUJO-DE-TRABAJO.md          ← ESTE DOCUMENTO (la ley)
├── logo/                         ← Logo siempre visible
├── referencias-visuales/         ← Imágenes de referencia por sección
│   ├── 01-onboarding/
│   ├── 02-landing-home/
│   ├── ...
│   └── 10-extras/
├── equipo/                       ← Superexpertos y sus fuentes
│   ├── EQUIPO-MAESTRO.md
│   ├── 01-arquitecto-frontend/
│   ├── 02-arquitecto-backend/
│   ├── ...
│   └── github-repos/             ← Código fuente de referencia
├── arquitectura/                 ← Documentos técnicos del equipo
├── diario-desarrollo/            ← Registro de pruebas
│   ├── README.md
│   └── YYYY-MM-DD_HHMM_seccion/ ← Una carpeta por sesión de prueba
├── design-system/
├── branding/
├── flujos/
├── contenido/
└── pantallas/
```

---

## 👁️ REGLAS INQUEBRANTABLES

1. **NUNCA programar sin la imagen de referencia abierta**
2. **NUNCA desplegar sin documentar en el diario**
3. **NUNCA pasar a la siguiente sección sin captura final aprobada**
4. **SIEMPRE consultar al superexperto antes de decisiones técnicas**
5. **SIEMPRE código de producción** (no atajos, no "ya lo arreglo después")
6. **SIEMPRE comparar visual: referencia vs resultado**
7. **SIEMPRE grabar/capturar las pruebas**

---

## 🎯 ORDEN DE PROGRAMACIÓN

El equipo de superexpertos define el orden óptimo. Generalmente:

1. **Setup del proyecto** (estructura, dependencias, configuración)
2. **Design system** (colores, tipografía, componentes base)
3. **Auth / Onboarding** (splash → login → OTP → perfil)
4. **Landing / Home** (sesiones activas, navegación)
5. **Sesión de usuario** (unirse, chat, player, pedir canción)
6. **Sesión de DJ** (crear, cola, anunciar, stats)
7. **Funciones sociales** (propinas, reacciones, compartir)
8. **Ajustes y extras** (perfil, notificaciones, favoritos)
9. **Integración y pulido** (deep links, offline, actualización)

---

---

## 📓 DOS DIARIOS OBLIGATORIOS

### Diario de Desarrollo (`diario-desarrollo/`)
- Capturas de pantalla de cada prueba
- Vídeos de interacción
- Anotaciones: qué funciona, qué falla
- Comparativas: referencia vs resultado

### Diario del Equipo (`diario-equipo/`)
- Cada decisión técnica documentada
- Qué superexperto la tomó y por qué
- Alternativas descartadas
- Causa-efecto rastreable
- Si algo falla, sabemos por qué se hizo así

---

## 🔌 SPOTIFY: MODO SIMULADO

Durante el desarrollo local, Spotify funciona en **modo simulado**:
- Todas las funciones programadas (búsqueda, cola, reproductor, votación)
- Datos de ejemplo en vez de música real
- Interruptor (feature flag) para activar Spotify real cuando pasemos a la nube
- El código es idéntico en ambos modos

Cuando se despliegue en Supabase (nube):
- Se conectan cuentas reales de Spotify (tuya, de Kike, etc.)
- Se activa el interruptor
- Todo funciona con música real

---

*Este documento es la ley del proyecto. Todo desarrollo sigue este flujo.*
*Creado el 29 de enero de 2026.*

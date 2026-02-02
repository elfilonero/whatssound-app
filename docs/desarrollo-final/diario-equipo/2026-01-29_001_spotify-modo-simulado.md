# Decisión #001: Spotify en modo simulado durante desarrollo local
**Fecha:** 2026-01-29
**Superexperto:** Arquitecto Backend + Experto Producto
**Estado:** ✅ Aprobada

## Contexto
Necesitamos definir cómo manejar la integración musical durante el desarrollo. Spotify requiere cuentas registradas y modo desarrollo (máx 5 usuarios). No podemos crear las cuentas aún.

## Decisión
Programar TODA la lógica de música (búsqueda, cola, reproductor, votación) con un **interruptor** (feature flag) que permite:
- **Modo simulado (local):** Datos de ejemplo (canciones fake con portadas, títulos, duraciones). Todas las funciones operativas sin conexión externa.
- **Modo real (nube):** Conecta con Spotify Web API. Búsqueda real, portadas reales, previews de 30s.

El código es idéntico en ambos modos. Solo cambia la fuente de datos.

## Justificación
- Permite desarrollar y probar el 100% de funcionalidades sin dependencias externas
- El interruptor es un patrón estándar de producción (feature flags)
- Cuando se conecte Spotify, solo hay que activar el flag y configurar credenciales
- Basado en: patrón Music Provider Abstraction del Arquitecto Frontend

## Alternativas descartadas
- **Conectar Spotify desde el inicio** → Descartada: requiere cuentas que no tenemos aún, añade complejidad innecesaria en fase de desarrollo
- **No preparar la integración** → Descartada: obligaría a reescribir código después

## Impacto
- Todo el código de música se escribe con una interfaz abstracta (MusicProvider)
- SpotifyProvider y MockProvider implementan la misma interfaz
- Cambiar de simulado a real = cambiar una línea de configuración
- No bloquea ningún desarrollo

## Firmado por
**Arquitecto Backend** — Basado en: TJ Holowaychuk (Express patterns), Pieter Levels (pragmatismo), DHH (convention over configuration)
**Experto Producto** — Basado en: Rahul Vohra (test early), Marty Cagan (product discovery)

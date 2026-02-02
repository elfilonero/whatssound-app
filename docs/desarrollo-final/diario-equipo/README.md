# 🧠 DIARIO DEL EQUIPO — WhatsSound

## Qué es esto
Registro de todas las decisiones técnicas del equipo de superexpertos. Cada entrada documenta:
- **Qué** se decidió
- **Quién** lo decidió (qué superexperto)
- **Por qué** (basándose en qué fuentes/evidencia)
- **Alternativas** que se descartaron y por qué
- **Impacto** en el proyecto (qué cambia, qué depende de esto)

## Para qué sirve
- Rastrear causa-efecto de cada decisión
- Entender por qué estamos donde estamos
- Si algo falla, saber qué cambiar y por qué se hizo así
- Justificar decisiones ante terceros

## Estructura

Cada decisión es una entrada con fecha:

```
diario-equipo/
├── README.md (este archivo)
├── 2026-01-29_001_stack-tecnologico.md
├── 2026-01-29_002_orden-desarrollo.md
├── 2026-01-30_003_spotify-modo-simulado.md
└── ...
```

## Formato de entrada

```markdown
# Decisión #XXX: [Título]
**Fecha:** YYYY-MM-DD
**Superexperto:** [Quién decide]
**Estado:** ✅ Aprobada / 🔄 En debate / ❌ Revertida

## Contexto
Qué problema o pregunta había que resolver.

## Decisión
Qué se decidió hacer.

## Justificación
Por qué. Basado en qué fuentes, datos, experiencia.

## Alternativas descartadas
- Alternativa A → descartada porque...
- Alternativa B → descartada porque...

## Impacto
- Qué cambia en el proyecto
- Qué depende de esta decisión
- Riesgos

## Firmado por
**[Nombre del superexperto]** — Basado en conocimiento de: [lista de referentes]
```

## Reglas
1. TODA decisión técnica relevante se documenta aquí
2. No hay decisiones "obvias" — si afecta al código, se documenta
3. Si se revierte una decisión, se crea nueva entrada explicando por qué
4. Las entradas nunca se borran, solo se marcan como revertidas

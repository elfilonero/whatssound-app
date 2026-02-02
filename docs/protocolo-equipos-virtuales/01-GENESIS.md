# 01-GENESIS.md — Fase 1: Nacimiento del Proyecto

## 🌱 ¿Qué es Genesis?

Genesis es el momento sagrado donde una idea de Ángel se convierte en un proyecto estructurado y listo para ser desarrollado. Es la base de todo lo que vendrá después.

**⚡ REGLA FUNDAMENTAL:** En el momento que Ángel dice "tengo una idea", Leo ejecuta Genesis automáticamente. Sin preguntar. Sin dudar.

## 🎯 Objetivos de Genesis

1. **Capturar la Visión:** Entender completamente qué quiere Ángel
2. **Estructurar el Caos:** Convertir la lluvia de ideas en algo organizado
3. **Crear el Hogar:** Preparar la carpeta local donde vivirá el proyecto
4. **Investigar el Terreno:** Hacer una primera exploración de la competencia
5. **Establecer las Bases:** Definir alcance, objetivos y límites

## 📋 Checklist de Genesis

### ✅ PASO 1: Recepción de la Idea del Director

**Leo debe hacer:**

1. **Escuchar activamente** todo lo que Ángel explica
2. **Tomar notas mentales** de palabras clave, problemas que quiere resolver, inspiraciones
3. **Identificar el tipo de proyecto:**
   - 💻 Software (web, móvil, desktop)
   - 🔧 Hardware/IoT
   - 🔬 Investigación
   - 📈 Mejora de procesos
   - 🏭 Producto físico
   - 🎨 Creativo/marketing

**Preguntas clave para Leo (hacer TODAS):**

```
1. "¿Cuál es el problema principal que quiere resolver este proyecto?"
2. "¿Quién sería el usuario final o beneficiario?"
3. "¿Hay alguna inspiración específica o referencia que tengamos que mirar?"
4. "¿Qué NO queremos que haga este proyecto? (límites)"
5. "¿Hay alguna urgencia o deadline específico?"
6. "¿Qué significa que este proyecto tenga éxito para ti?"
```

**Ejemplo Real - Dame un OK:**
- Problema: Mayores solos sin supervisión familiar
- Usuario: Familiares preocupados + persona mayor
- Inspiración: Apps de tracking pero humanizadas
- Límites: No ser invasivo, no reemplazar cuidado humano
- Éxito: Familia tranquila + mayor independiente

### ✅ PASO 2: Creación de Carpeta Local

**Estructura base para CUALQUIER proyecto:**

```bash
# Crear carpeta principal (nombre en minúsculas, sin espacios)
mkdir ~/clawd/proyecto-[nombre-corto]
cd ~/clawd/proyecto-[nombre-corto]

# Estructura inicial UNIVERSAL
mkdir {docs,research,assets,team,meetings,development}
mkdir docs/{specs,decisions,progress}
mkdir research/{competition,references,market}
mkdir assets/{images,videos,mockups,designs}
mkdir team/{experts,profiles}
mkdir meetings/{initial,expanded,decisions}
mkdir development/{code,tests,iterations,demos}
```

**Ejemplo Real - WhatsSound:**
```bash
mkdir ~/clawd/proyecto-whatsound
# (estructura completa aplicada)
```

### ✅ PASO 3: Documento Fundacional

**Crear: `docs/00-GENESIS.md`**

```markdown
# Genesis - [Nombre del Proyecto]

## 📅 Fecha de Nacimiento
[YYYY-MM-DD HH:MM]

## 👑 Director de Producto
Ángel Fernández

## 🧠 Desarrollador/Investigador  
Leo AI

## 💡 Idea Original
[Transcripción literal de lo que dijo Ángel]

## 🎯 Problema Central
[El problema principal que queremos resolver]

## 👥 Usuario Objetivo
[Quién va a usar esto y por qué]

## 🚫 Límites del Proyecto
[Qué NO vamos a hacer]

## ✅ Definición de Éxito
[Cómo sabremos que funcionó]

## 🏷️ Tipo de Proyecto
[Software/Hardware/Investigación/Proceso/Producto]

## 💭 Notas Adicionales
[Cualquier comentario extra de Ángel]

## 🔄 Estado Actual
GENESIS COMPLETO - Listo para Fase 2 (Creación de Equipo)
```

### ✅ PASO 4: Investigación Competitiva Inicial

**Objetivo:** Entender el mercado en 30 minutos máximo.

**Leo debe buscar:**

1. **Competidores directos** (5-10 máximo)
   - ¿Quién ya está resolviendo este problema?
   - ¿Cómo lo hacen?
   - ¿Qué les falta?

2. **Soluciones relacionadas** (3-5)
   - Productos que atacan problemas similares
   - Tecnologías que podríamos usar
   - Enfoques diferentes al mismo mercado

3. **Referencias de diseño/UX** (2-3)
   - Si es software: apps similares bien diseñadas
   - Si es hardware: productos físicos inspiradores
   - Si es investigación: papers relevantes

**Guardar en: `research/competition/01-landscape-inicial.md`**

```markdown
# Landscape Inicial - [Proyecto]

## 🔥 Competidores Directos
### [Nombre Competidor 1]
- **URL/Empresa:** 
- **Qué hace:** 
- **Fortalezas:** 
- **Debilidades:** 
- **Nuestras ventajas potenciales:**

[Repetir para 5-10 competidores]

## 🔗 Soluciones Relacionadas
[3-5 productos que atacan problemas similares]

## 🎨 Referencias de Diseño
[2-3 productos con buen diseño/UX que podríamos inspirarnos]

## 💭 Conclusiones Rápidas
- **El mercado está:** [maduro/emergente/saturado/vacío]
- **Nuestra oportunidad:** [qué hueco vemos]
- **Riesgo principal:** [mayor obstáculo identificado]
```

**Ejemplo Real - Dame un OK:**
- Competidores: Life360, Apple Find My, varios medidores de salud
- Oportunidad: Apps existentes muy técnicas, falta humanización
- Riesgo: Adopción por parte de mayores resistentes a tecnología

### ✅ PASO 5: Definición de Alcance y Objetivos

**Crear: `docs/specs/01-alcance-inicial.md`**

```markdown
# Alcance Inicial - [Proyecto]

## 🎯 MVP (Versión Mínima Viable)
### ¿Qué SÍ incluir en v1.0?
- [ ] Feature fundamental 1
- [ ] Feature fundamental 2
- [ ] Feature fundamental 3

### ¿Qué NO incluir en v1.0? (pero sí en futuras versiones)
- [ ] Feature avanzada 1
- [ ] Feature avanzada 2
- [ ] Feature avanzada 3

### ¿Qué NUNCA incluir?
- [ ] Cosa que definitivamente no queremos

## 📊 KPIs Iniciales (cómo medir éxito)
1. **Métrica principal:** [ej: usuarios activos]
2. **Métrica secundaria:** [ej: retención]  
3. **Métrica de negocio:** [ej: conversión]

## ⏱️ Timeline Estimado
- **Genesis:** 1 día (HOY)
- **Creación Equipo:** 2-3 días
- **Reuniones Iniciales:** 2 días
- **MVP Development:** [estimación según proyecto]
- **Testing y refinamiento:** [estimación]

## 🛠️ Stack Tecnológico Probable
[Si es software, qué tecnologías usaremos]
[Si es hardware, qué componentes]
[Si es investigación, qué metodologías]

## 💰 Recursos Necesarios
- **Tiempo de Leo:** [horas estimadas]
- **Herramientas externas:** [APIs, servicios, etc]
- **Costos monetarios:** [hosting, licencias, etc]
```

### ✅ PASO 6: Validación con Ángel

**Leo debe presentar a Ángel:**

1. **Documento Genesis completo**
2. **Landscape competitivo inicial**  
3. **Alcance y objetivos propuestos**
4. **Carpeta local creada y organizada**

**Preguntas de validación:**
```
"¿He entendido correctamente la visión?"
"¿El alcance del MVP te parece correcto?"
"¿Falta algún competidor importante que deba investigar?"
"¿Estás de acuerdo con el timeline estimado?"
"¿Puedo proceder a Fase 2 (Creación de Equipo)?"
```

**⚡ CRITERIO DE APROBACIÓN:** Ángel dice explícitamente "OK, adelante con la creación del equipo" o equivalente.

## 🎯 Output de Genesis

Al finalizar Genesis, tendremos:

### 📁 Estructura de carpetas creada
```
proyecto-[nombre]/
├── docs/
│   ├── 00-GENESIS.md ✅
│   └── specs/
│       └── 01-alcance-inicial.md ✅
├── research/
│   └── competition/
│       └── 01-landscape-inicial.md ✅
├── assets/
├── team/
├── meetings/
└── development/
```

### 📋 Documentos clave completados
- ✅ Genesis del proyecto documentado
- ✅ Visión clara y validada por Ángel
- ✅ Competencia identificada  
- ✅ Alcance del MVP definido
- ✅ KPIs establecidos

### 🚀 Estado del proyecto
**LISTO PARA FASE 2: CREACIÓN DE EQUIPO**

---

## ⚠️ Errores Comunes en Genesis

### ❌ NO hacer:
- Preguntar demasiado antes de empezar a trabajar
- Crear estructura de carpetas demasiado específica (mantener genérica)
- Investigar competencia durante horas (30 min máximo en Genesis)
- Proponer tecnologías muy específicas sin conocer al equipo
- Documentar de menos (cada paso debe quedar registrado)

### ✅ SÍ hacer:
- Ejecutar automáticamente cuando Ángel dice "tengo una idea"
- Hacer todas las preguntas clave de una vez
- Crear estructura robusta pero flexible
- Validar entendimiento antes de seguir
- Documentar obsesivamente cada decisión

---

🎯 **SIGUIENTE PASO:** Una vez Genesis aprobado por Ángel → `02-CREACION-EQUIPO.md`
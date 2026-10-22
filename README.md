# Gestión del Servicio de TI (GST) - UTP

Repositorio académico para la publicación y documentación de casos prácticos y proyectos de la asignatura **Gestión del Servicio de TI** (Universidad Tecnológica del Perú - Ciclo Agosto 2025).

El proyecto está diseñado para desplegarse de manera directa en **GitHub Pages** mediante una arquitectura estática limpia, modular y responsiva.

---

## Estructura del Repositorio

```text
SGT/
├── README.md                  # Documentación general del repositorio
├── index.html                 # Portal principal del curso y directorio de entregas
├── assets/
│   ├── css/
│   │   └── main.css           # Hoja de estilos compartida (diseño institucional UTP/ITIL)
│   └── js/
│       └── main.js            # Lógica e interacciones del cliente (filtros, portapapeles)
└── semana11/
    ├── index.html             # Hub y resumen temático de la Semana 11 (Sesión 2)
    ├── caso01/
    │   └── index.html         # Caso 01: Sistema Web con Base de Datos generador de valor
    ├── caso02/
    │   └── index.html         # Caso 02: Cuadro Comparativo de los 5 Principios Guía del SVS
    └── caso03/
        └── index.html         # Caso 03: Mapa Conceptual integral e interactivo de la sesión
```

---

## Resumen de Casos Prácticos - Semana 11 (Sesión 2)

### Caso 01: Sistema Web con Base de Datos Generador de Valor
- **Solución Propuesta:** Sistema Web de Telemedicina y Citas Clínicas (*MediVal SVS*).
- **Descomposición de Valor:** Análisis de Utilidad (*Fit for Purpose*) y Garantía (*Fit for Use*) conforme al marco Axelos (2011) y Rappaport (1986).
- **Arquitectura:** Modelo de tres capas (Vista con SPA, Procesamiento con API RESTful y Capa de Acceso a Datos con PostgreSQL 16 y Redis).
- **Script DDL:** Esquema relacional normalizado con integridad referencial, índices B-Tree y restricciones de negocio.

### Caso 02: Cuadro Comparativo de los Cinco (5) Principios Guía del SVS
- **Matriz Comparativa:** Evaluación detallada de los 5 principios centrales presentados en clase:
  1. *Enfocarse en el valor (Focus on value)*
  2. *Empezar donde se está (Start where you are)*
  3. *Progresar iterativamente con retroalimentación (Progress iteratively with feedback)*
  4. *Colaborar y promover la visibilidad (Collaborate and promote visibility)*
  5. *Pensar y trabajar de forma holística (Think and work holistically)*
- **Dimensiones de Análisis:** Definición, objetivo estratégico, aplicación en software y bases de datos, riesgos de omisión, KPIs y ejemplos reales en la industria de TI.

### Caso 03: Mapa Conceptual de la Sesión
- **Taxonomía Visual:** Mapa conceptual estructurado con filtrado interactivo.
- **Ejes Cubiertos:** Sistema de Valor del Servicio (SVS), concepto de valor, gobernanza, cadena de valor, arquetipos sistémicos (Scrum y tipos de bases de datos), y las 4 dimensiones de la gestión del servicio con el ciclo de mejora continua (PDCA).

---

## Activación de GitHub Pages

Para habilitar la visualización web de los casos prácticos:

1. Ingresar al repositorio en GitHub: `https://github.com/manuelleigh/SGT`
2. Ir a **Settings** &rarr; pestaña **Pages** (en el menú lateral izquierdo).
3. En la sección **Build and deployment**:
   - **Source:** Seleccionar `Deploy from a branch`.
   - **Branch:** Elegir la rama `main` y la carpeta `/ (root)`.
4. Hacer clic en **Save**.
5. Tras unos minutos, el sitio estará publicado en:
   `https://manuelleigh.github.io/SGT/`

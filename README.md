# HelpDesk Lite - Sistema de Gestión de Tickets de Soporte Técnico

Aplicación web frontend desarrollada exclusivamente con **HTML5, CSS3 y JavaScript Vanilla**, diseñada para centralizar, registrar y administrar incidencias y solicitudes de soporte técnico universitario, permitiendo dar seguimiento a todo su ciclo de vida sin frameworks ni backend.

Proyecto para la materia **Aplicaciones de Internet** — Universidad de Guanajuato (DICIS).

---

## 🚀 Tecnologías Utilizadas

- **HTML5:** Estructura semántica, accesible y formularios nativos (`header`, `nav`, `main`, `section`, `article`, `footer`, `form`, `label`, `input`, `select`, etc.).
- **CSS3:** Variables CSS (`:root`), diseño responsive con Flexbox y CSS Grid, pseudo-clases (`:hover`, `:disabled`), transiciones y adaptación móvil.
- **JavaScript Vanilla:** Manipulación del DOM, eventos en tiempo real, validaciones, funciones flecha y métodos de arrays (`forEach`, `filter`, `find`, `some`, `includes`, `map`).
- **localStorage:** Persistencia de tickets y sincronización de estados en el almacenamiento local del navegador.
- **Git & GitFlow:** Control de versiones ordenado mediante ramas (`main`, `develop`, `feature/*`, `release/*`).

---

## 📋 Funcionalidades Principales

- **Registro de Tickets:** Creación mediante formulario con validaciones obligatorias (título, descripción, categoría y prioridad).
- **Generación Automática de Folio:** Folios consecutivos únicos en formato `HD-0001`, `HD-0002` utilizando `padStart()`.
- **Dashboard de Métricas:** Contadores dinámicos calculados en tiempo real (Total, Nuevos, En Proceso y Resueltos).
- **Búsqueda en Tiempo Real:** Filtro tolerante a mayúsculas/minúsculas por folio, título o descripción mediante evento `input`.
- **Filtros Combinados:** Filtrado por estado (`Nuevo`, `En proceso`, `Resuelto`, `Cerrado`, `Cancelado`) y nivel de prioridad (`Baja`, `Media`, `Alta`, `Crítica`).
- **Ciclo de Vida y Reglas de Negocio:**
  - `Nuevo` ➔ `En proceso` | `Cancelado`
  - `En proceso` ➔ `Resuelto` | `Cancelado`
  - `Resuelto` ➔ `Cerrado`
  - `Cerrado` y `Cancelado` son estados finales.
- **Persistencia Local:** Restauración del estado completo al recargar la página vía `localStorage`.
- **Diseño Responsive:** Experiencia fluida tanto en dispositivos móviles como en pantallas de escritorio.

---

## 💻 Cómo ejecutar el proyecto

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/ferchoesty-max/HelpDesk.git
   ```
2. Entrar a la carpeta del proyecto:
   ```bash
   cd HelpDesk
   ```
3. Abrir el archivo `index.html` en cualquier navegador web moderno (o mediante la extensión Live Server de VS Code).

---

## 🌿 Flujo de Trabajo (GitFlow)

El repositorio sigue un esquema estricto de GitFlow:
- `main`: Versiones oficiales y estables del producto etiquetadas con tags (`v1.0.0`).
- `develop`: Rama central de integración de código.
- `feature/*`: Ramas individuales por módulo:
  - `feature/base-layout`: Maquetación semántica base y dashboard.
  - `feature/ticket-form`: Formulario y controles de nuevo ticket.
  - `feature/application-styles`: Estilos visuales CSS3 y responsive.
  - `feature/ticket-management`: Render dinámico de tickets, búsqueda y filtros.
  - `feature/ticket-workflow`: Reglas de transición de estados y persistencia en localStorage.
- `release/1.0.0`: Rama de estabilización previa a la entrega final.

# Sistema Web Danimar — versión Java / Spring Boot

Réplica del sistema Danimar (originalmente en Python/Flask) construida en
**Java 17 + Spring Boot**, con **API REST** y **frontend HTML/CSS/JS**, manteniendo
el mismo diseño visual. Proyecto independiente: una sola aplicación web que sirve
la API y las páginas.

## Tecnologías
- Java 17, Spring Boot 3, Spring Data JPA
- Base de datos H2 (en memoria, se carga el catálogo real al iniciar)
- Frontend: HTML5, CSS3, JavaScript (Fetch API)

## Estado por etapas
- **Etapa 1 (lista):** estructura, diseño de Danimar 1, base con catálogo real
  (5 categorías, 69 exámenes, 205 parámetros), módulo **Pacientes** y
  **Lista de Precios**.
- **Próximas etapas:** Generar reporte, Reportes/estadísticas, Nuevo Examen,
  Auditoría, Seguridad (login).


## Estructura
```
src/main/java/com/danimar/
  model/        entidades JPA (Paciente, Examen, Parametro, Orden, ...)
  repository/   repositorios Spring Data
  controller/   API REST (PacienteController, CatalogoController)
  dto/ config/  apoyo
src/main/resources/
  application.properties
  data.sql      catálogo real
  static/       frontend (css, js, páginas html)
```

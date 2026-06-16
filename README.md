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

## Cómo ejecutarlo en tu Mac
Necesitas Java 17+ y Maven (o usa el Dockerfile). Desde la carpeta del proyecto:

```
mvn spring-boot:run
```

Abre en el navegador: http://localhost:8080  → te lleva a Pacientes.

> Si tienes una versión de Java muy nueva (25) y falla, instala Java 21 con
> SDKMAN y reintenta (ver notas más abajo).

## Desplegar como sitio web (Render)
1. Sube este proyecto a un repositorio de GitHub propio.
2. En https://render.com → New + → Blueprint → elige el repo (o pega su URL).
3. Render lee `render.yaml`, construye con el `Dockerfile` y te da una URL pública.

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

# Talleres UAB

Aplicación web en Angular para consultar talleres, inscribir estudiantes y retirar inscripciones. Los datos se guardan en el navegador con IndexedDB.

## Funcionalidades

| Pantalla | Ruta | Descripción |
|---|---|---|
| Talleres | `/talleres` | Catálogo en tarjetas con búsqueda por texto y filtro por categoría. |
| Inscribir | `/inscribir` | Formulario reactivo con validaciones. |
| Mis inscripciones | `/inscripciones` | Historial con fecha y estado, filtrable por estado. |
| Detalle | `/inscripciones/:id` | Datos de la inscripción y acción **Retirar inscripción**. |

### Reglas del tema

- Cada inscripción ocupa un cupo del taller. Si no hay cupos, no se puede inscribir.
- El mismo estudiante (CI) solo puede tener una inscripción activa por taller.
- Al retirar una inscripción, su estado pasa a *Retirada* y el cupo vuelve al taller. Solo se puede retirar una vez.

## Tecnologías

- Angular 22 (componentes standalone, signals, formularios reactivos, control de flujo `@if` / `@for`)
- Bootstrap 5
- IndexedDB

## Requisitos

- Node.js 22.22.3 o superior (o 24.15+)
- npm

## Instalación y ejecución

```bash
git clone https://github.com/victorcastro-dot/angular-examen-final.git
cd angular-examen-final
npm install
npm start
```

Abrir `http://localhost:4200/` en el navegador.

## Compilar para producción

```bash
npm run build
```

Los archivos quedan en `dist/angular-examen-final/browser`.

## Estructura

```
src/app/
├── models.ts                      # Interfaces Taller e Inscripcion
├── services/db.service.ts         # Acceso a IndexedDB
├── components/taller-card/        # Componente hijo reutilizable
└── pages/
    ├── talleres/                  # Consulta principal
    ├── inscribir/                 # Registro
    ├── inscripciones/             # Historial
    └── inscripcion-detalle/       # Detalle y retiro
```

## Autor

Victor Castro

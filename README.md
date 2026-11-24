# Talleres UAB

Aplicación web en Angular para consultar talleres, inscribir estudiantes y retirar inscripciones. Los datos se guardan en el navegador con IndexedDB, así que se conservan al cerrar y volver a abrir la aplicación.

## Funcionalidades

| Pantalla | Ruta | Descripción |
|---|---|---|
| Talleres | `/talleres` | Catálogo en tarjetas con foto, búsqueda por texto, filtro por categoría y paginación de 6 en 6. |
| Inscribir | `/inscribir` | Formulario reactivo con validaciones y reglas del tema. |
| Mis inscripciones | `/inscripciones` | Historial con fecha y estado, filtro por estado, paginación de 5 en 5 y botón para ver el detalle. |
| Detalle | `/inscripciones/:id` | Datos de la inscripción y acción **Retirar inscripción**. Funciona al recargar la página y muestra un aviso si el identificador no existe. |

### Talleres

- Cada tarjeta muestra una foto del taller. Si la foto no existe, muestra una carátula con un icono según la categoría.
- Barra de cupos que cambia de color: verde con cupos y amarilla cuando quedan pocos. Sin cupos se muestra "Sin cupos" en rojo y el botón se desactiva.
- La búsqueda y el filtro funcionan juntos. El botón **Limpiar** solo se activa cuando hay algo que limpiar.
- El botón **Inscribirme** abre el formulario con el taller ya seleccionado.

### Inscribir

- Campos obligatorios con mensajes de validación: taller, nombre, CI (solo números, de 5 a 10 dígitos) y correo.
- No permite guardar si el taller no tiene cupos o si el estudiante ya está inscrito en ese taller.

### Mis inscripciones y detalle

- Al cambiar el filtro de estado, la paginación vuelve a la página 1.
- La columna **Acciones** tiene un botón con icono de ojo para abrir el detalle.
- Al retirar una inscripción, el estado cambia a *Retirada*, se registra la fecha de retiro y el cupo vuelve al taller.

### Reglas del tema

- Cada inscripción ocupa un cupo del taller. Si no hay cupos, no se puede inscribir.
- El mismo estudiante (CI) solo puede tener una inscripción activa por taller.
- Una inscripción solo se puede retirar una vez.

### Diseño responsive

- Tema en color teal con Bootstrap 5 y Bootstrap Icons.
- En celular el menú se pliega y se cierra solo al elegir una sección.
- Las tarjetas se ordenan en 1, 2 o 3 columnas según el ancho de la pantalla.
- En celular la tabla del historial oculta el número y acorta la fecha para que el estado y el botón de detalle siempre estén visibles.

## Tecnologías

- Angular 22 (componentes standalone, signals, formularios reactivos, control de flujo `@if` / `@for`)
- Bootstrap 5 y Bootstrap Icons
- IndexedDB

## Requisitos de Angular aplicados

| Requisito | Dónde se aplica |
|---|---|
| Componentes hijos con `input()` / `output()` | `TallerCard` (recibe el taller y emite *inscribir*) y `Paginador` (recibe total, página y tamaño, y emite *cambiarPagina*). |
| Servicio inyectado e IndexedDB | `DbService` guarda, lee y actualiza talleres e inscripciones. Los datos iniciales se cargan una sola vez. La versión 2 de la base agrega 5 talleres nuevos (12 en total) sin borrar las inscripciones existentes. |
| Rutas | Cuatro pantallas, ruta inicial `/talleres` y detalle con parámetro `:id`. |
| Pipes | `date`, `currency`, `titlecase`. |
| Directivas | `routerLinkActive`, `ngClass`, `formControlName`. |
| Plantillas | Interpolación, enlace de propiedades y eventos, `@if`, `@for` y `@let`. |

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
├── components/
│   ├── taller-card/               # Tarjeta de taller (componente hijo)
│   └── paginador/                 # Paginador reutilizable (componente hijo)
└── pages/
    ├── talleres/                  # Consulta principal
    ├── inscribir/                 # Registro
    ├── inscripciones/             # Historial
    └── inscripcion-detalle/       # Detalle y retiro

public/img/talleres/               # Fotos de los talleres, nombradas por id (1.jpg, 2.jpg…)
```

## Autor

Victor Castro

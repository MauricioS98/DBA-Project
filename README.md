# Sistema de Gestión de Grupos de Investigación (Investigación UD)

Aplicación web para consultar grupos y proyectos de investigación, gestionar postulaciones y administrar catálogos. El **backend** es **Node.js + Express** con **PostgreSQL** (`backend-node`). El **frontend** es **Angular 17** con Angular Material (`frontend`).

## Requisitos previos

| Componente | Versión recomendada |
|------------|---------------------|
| Node.js    | 18 LTS o superior   |
| npm        | 9+                  |
| PostgreSQL | 14+                 |

- Base de datos creada en PostgreSQL (por defecto el proyecto usa `investigacion_ud`).
- Esquema definido en el script SQL de la raíz del repositorio.

## Estructura del repositorio

```
├── backend-node/     # API REST (Express, pg, JWT)
├── frontend/         # SPA (Angular 17)
├── DB.sql            # Esquema PostgreSQL
└── README.md         # Este archivo
```

## 1. Base de datos

1. Crea la base de datos en PostgreSQL, por ejemplo:

   ```sql
   CREATE DATABASE investigacion_ud;
   ```

2. Aplica el esquema (desde la **raíz** del proyecto):

   ```bash
   psql -U postgres -d investigacion_ud -f DB.sql
   ```

3. (Opcional) Datos de prueba y documentación del seed:

   ```bash
   cd backend-node
   npm run seed
   ```

   Detalle en `backend-node/SEED_INSTRUCTIONS.md`.

## 2. Backend (`backend-node`)

```bash
cd backend-node
npm install
```

Variables de entorno: copia `env.example` a `.env` y ajusta credenciales y secretos.

```bash
# Windows (PowerShell)
copy env.example .env

# macOS / Linux
cp env.example .env
```

Variables habituales:

| Variable       | Descripción                          |
|----------------|--------------------------------------|
| `PORT`         | Puerto del API (por defecto `8081`) |
| `DB_*`         | Conexión PostgreSQL                  |
| `JWT_SECRET`   | Clave para firmar tokens           |
| `JWT_EXPIRATION` | Duración del token (ms)          |
| `CORS_ORIGIN`  | Origen del front (p. ej. `http://localhost:4200`) |

Ejecución:

```bash
npm run dev    # desarrollo (nodemon)
npm start      # producción (node)
```

Comprobación rápida: `GET http://localhost:8081/health`

Documentación detallada de endpoints: **`backend-node/README.md`**.

## 3. Frontend (`frontend`)

```bash
cd frontend
npm install
npm start          # equivale a ng serve — suele usar http://localhost:4200
```

La URL del API está definida en `frontend/src/app/core/services/api.service.ts` (`API_URL`, por defecto `http://localhost:8081/api`). Debe coincidir con el `PORT` y el host del backend.

Build de producción:

```bash
npm run build
```

Salida típica: `frontend/dist/investigacion-ud/`.

## 4. Arranque típico en desarrollo

1. PostgreSQL en ejecución con `DB.sql` aplicado.
2. Terminal 1: `cd backend-node && npm run dev`
3. Terminal 2: `cd frontend && npm start`
4. Navegador: `http://localhost:4200`

## Roles de usuario

| Rol             | Uso principal en la app |
|-----------------|-------------------------|
| `ESTUDIANTE`    | Registro, solicitudes a grupos, “mis grupos” aprobados |
| `DOCENTE`       | Puede postular a equipos; acceso a proyectos según flujo del dashboard |
| `COORDINADOR`   | Grupos propios, proyectos del equipo, respuesta a solicitudes |
| `ADMINISTRADOR` | Usuarios, catálogos (áreas, tipos de producto), grupos globales |

Los permisos concretos de cada endpoint están en `backend-node/routes/` y middleware `authenticateToken` / `authorizeRoles`.

## Funcionalidades (vista de producto)

### Público (sin sesión)

- Listado y detalle de **grupos de investigación** y filtrado por área.
- Consulta de **proyectos** asociados a equipos.
- Catálogos públicos: **áreas de proyecto**, **áreas de investigación**, **tipos de producto**.

### Autenticación

- **Registro** e **inicio de sesión** con correo institucional (`@udistrital.edu.co`) y JWT.

### Estudiante / docente

- Crear **solicitudes de vinculación** a un grupo y ver su estado.
- Ver **mis grupos** cuando la solicitud fue aprobada.

### Coordinador

- **Mis grupos**: equipos donde actúa como coordinador.
- **Proyectos**: alta, edición y baja de proyectos de investigación del equipo (según permisos del API).
- **Solicitudes** del equipo: revisión y cambio de estado.

### Administrador

- **Usuarios**: listado, alta de docentes, edición, eliminación con validaciones de integridad.
- Utilidades para **coordinadores** y **docentes** disponibles (equipos sin coordinador, asignación de grupos, etc.).
- **Tipos de producto** y **proyectos curriculares** (y gestión relacionada en dashboard).
- Gestión ampliada de **grupos** (incluye eliminación según reglas del backend).

Rutas principales del front: `home`, `teams`, `teams/:id`, `login`, `register`, `dashboard/*` (autenticado), `admin/*` (solo administrador).

## Más información

- API y lista completa de rutas: `backend-node/README.md`
- Seed y credenciales de prueba: `backend-node/SEED_INSTRUCTIONS.md`
- Instrucciones legacy en español: `backend-node/INSTRUCCIONES.md`

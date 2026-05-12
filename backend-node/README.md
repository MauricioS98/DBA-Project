# Backend Node.js — Sistema de Gestión de Grupos de Investigación

API REST con **Express**, **PostgreSQL** (`pg`), autenticación **JWT** y validación con **express-validator**.

## Requisitos

- Node.js 16+ (recomendado 18 LTS)
- PostgreSQL
- npm o yarn

## Instalación

```bash
cd backend-node
npm install
```

## Variables de entorno

En este directorio existe **`env.example`**. Cópialo como **`.env`** y ajusta valores:

```bash
# Windows (PowerShell)
copy env.example .env

# macOS / Linux
cp env.example .env
```

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto HTTP del servidor (por defecto `8081`) |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Conexión a PostgreSQL |
| `JWT_SECRET` | Secreto para firmar tokens (usa un valor fuerte en producción) |
| `JWT_EXPIRATION` | Duración del token en milisegundos |
| `CORS_ORIGIN` | Origen permitido para CORS (p. ej. `http://localhost:4200`) |
| `NODE_ENV` | `development` / `production` |

## Base de datos

El esquema está en **`DB.sql`** en la **raíz del repositorio** (no dentro de `backend-node`). Debes crear la base y ejecutar ese script antes de arrancar el servidor.

Poblado opcional de datos de prueba:

```bash
npm run seed
```

Instrucciones detalladas: `SEED_INSTRUCTIONS.md`.

## Ejecución

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo con **nodemon** |
| `npm start` | Producción con `node server.js` |
| `npm run seed` | Inserta datos de ejemplo |

URL por defecto: `http://localhost:8081`  
Comprobación de salud: `GET /health`

## Autenticación

Tras `POST /api/auth/login` o `POST /api/auth/register`, envía el token en cabeceras:

```http
Authorization: Bearer <token>
```

El middleware valida el JWT y comprueba que el usuario siga existiendo en `app_user`.

## Endpoints de la API

Prefijo base: **`/api`**. Los que requieren token están marcados con “Auth”.

### Públicos (`/api/public`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/public/project-areas` | Áreas de proyecto (proyectos curriculares) |
| GET | `/api/public/investigation-areas` | Áreas de investigación |
| GET | `/api/public/product-types` | Tipos de producto |

### Autenticación (`/api/auth`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro |
| POST | `/api/auth/login` | Inicio de sesión |

### Usuarios (`/api/users`)

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/users/me` | Cualquiera autenticado | Usuario actual |
| GET | `/api/users` | ADMINISTRADOR | Listado de usuarios |
| POST | `/api/users` | ADMINISTRADOR | Crear usuario (docente) |
| GET | `/api/users/teams-without-coordinator` | ADMINISTRADOR | Equipos sin coordinador |
| GET | `/api/users/coordinators` | ADMINISTRADOR | Coordinadores |
| GET | `/api/users/available-teachers` | ADMINISTRADOR | Docentes disponibles |
| GET | `/api/users/:id` | Autenticado | Usuario por ID |
| GET | `/api/users/:id/coordinator-info` | ADMINISTRADOR | Detalle coordinador + equipos |
| PUT | `/api/users/:id` | ADMINISTRADOR | Actualizar usuario |
| PUT | `/api/users/coordinator/:coordinatorId/teams` | ADMINISTRADOR | Asignar equipo a coordinador |
| DELETE | `/api/users/:id` | ADMINISTRADOR | Eliminar usuario |

> **Nota:** En Express, rutas estáticas como `/me` deben declararse **antes** de `/:id` (ya está ordenado en el código).

### Equipos (`/api/teams`)

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/teams/public` | Público | Todos los equipos |
| GET | `/api/teams/public/:id` | Público | Equipo por ID |
| GET | `/api/teams/public/area/:areaId` | Público | Equipos por área de investigación |
| GET | `/api/teams/my-teams` | COORDINADOR, ADMINISTRADOR | Equipos del coordinador |
| GET | `/api/teams/my-teams-student` | ESTUDIANTE, DOCENTE | Equipos vinculados vía solicitudes aprobadas |
| POST | `/api/teams` | COORDINADOR, ADMINISTRADOR | Crear equipo |
| PUT | `/api/teams/:id` | COORDINADOR, ADMINISTRADOR | Actualizar equipo |
| DELETE | `/api/teams/:id` | ADMINISTRADOR | Eliminar equipo |

### Proyectos (`/api/projects`)

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/projects/public` | Público | Listado de proyectos |
| GET | `/api/projects/public/:id` | Público | Proyecto por ID |
| GET | `/api/projects/public/team/:teamId` | Público | Proyectos por equipo |
| POST | `/api/projects` | COORDINADOR | Crear proyecto |
| PUT | `/api/projects/:id` | COORDINADOR | Actualizar proyecto |
| DELETE | `/api/projects/:id` | COORDINADOR | Eliminar proyecto |

### Solicitudes / aplicaciones (`/api/applications`)

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| POST | `/api/applications` | ESTUDIANTE, DOCENTE | Crear solicitud a un equipo |
| GET | `/api/applications/my-applications` | ESTUDIANTE, DOCENTE | Mis solicitudes |
| GET | `/api/applications/my-application/team/:teamId` | ESTUDIANTE, DOCENTE | Mi solicitud más reciente a un equipo |
| GET | `/api/applications/team/:teamId` | COORDINADOR, ADMINISTRADOR | Solicitudes del equipo |
| PUT | `/api/applications/:id/status` | COORDINADOR, ADMINISTRADOR | Cambiar estado y mensaje de respuesta |

### Tipos de producto (`/api/product-types`)

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| GET | `/api/product-types` | No | — | Listar tipos |
| GET | `/api/product-types/:id` | No | — | Tipo por ID |
| POST | `/api/product-types` | Sí | ADMINISTRADOR | Crear |
| PUT | `/api/product-types/:id` | Sí | ADMINISTRADOR | Actualizar |
| DELETE | `/api/product-types/:id` | Sí | ADMINISTRADOR | Eliminar |

### Áreas de proyecto (`/api/project-areas`)

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| GET | `/api/project-areas` | No | — | Listar proyectos curriculares |
| GET | `/api/project-areas/:id` | No | — | Detalle |
| POST | `/api/project-areas` | Sí | ADMINISTRADOR | Crear |
| PUT | `/api/project-areas/:id` | Sí | ADMINISTRADOR | Actualizar |
| DELETE | `/api/project-areas/:id` | Sí | ADMINISTRADOR | Eliminar |
| GET | `/api/project-areas/:id/users` | Sí | ADMINISTRADOR | Usuarios por área |

### Áreas de investigación (`/api/investigation-areas`)

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| GET | `/api/investigation-areas` | No | — | Listar áreas |
| GET | `/api/investigation-areas/project-area/:projectAreaId` | No | — | Áreas por proyecto curricular |
| GET | `/api/investigation-areas/:id` | No | — | Detalle |
| POST | `/api/investigation-areas` | Sí | ADMINISTRADOR | Crear |
| PUT | `/api/investigation-areas/:id` | Sí | ADMINISTRADOR | Actualizar |
| DELETE | `/api/investigation-areas/:id` | Sí | ADMINISTRADOR | Eliminar |

## Estructura del proyecto

```
backend-node/
├── config/           # database.js, jwt.js
├── controllers/
├── middleware/       # auth, errorHandler
├── routes/
├── services/
├── server.js
├── seed.js
├── env.example
└── package.json
```

## Documentación adicional

- `SEED_INSTRUCTIONS.md` — Cómo ejecutar el seed y credenciales de prueba  
- `INSTRUCCIONES.md` — Notas en español del backend  

Para instalación conjunta con el cliente Angular, ver el **`README.md`** en la raíz del repositorio.

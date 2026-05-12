# Investigación UD - Sistema de Gestión de Grupos de Investigación

Sistema web para centralizar, consultar y gestionar la información de los grupos de investigación de la Facultad de Ingeniería de la Universidad Distrital Francisco José de Caldas.

## 🚀 Características

- **Registro y autenticación** con validación de dominio @udistrital.edu.co
- **Navegación pública** - Páginas de inicio y grupos accesibles sin autenticación
- **Directorio unificado** de grupos de investigación clasificados por área
- **Visualización de proyectos** activos y producción científica con enlaces a documentos
- **Solicitudes de vinculación** con seguimiento de estado
- **Gestión de grupos** para coordinadores y administradores
- **Panel de administración** para gestión de usuarios y roles
- **Dashboard dinámico** que se actualiza automáticamente según el rol del usuario
- **Sistema de roles avanzado** con promoción automática de docentes a coordinadores
- **Gestión de proyectos curriculares** y áreas de investigación
- **Validación de proyecto curricular** para coordinadores y grupos
- **Filtros avanzados** en gestión de usuarios
- **CI/CD con GitHub Actions** para evaluación automática de calidad de código

## 🛠️ Tecnologías

### Backend
- **Node.js 18+**
- **Express.js 4.18**
- **PostgreSQL** con pg (node-postgres)
- **JWT** (jsonwebtoken) para autenticación
- **bcryptjs** para hash de contraseñas
- **express-validator** para validación de datos

### Frontend
- **Angular 17**
- **Angular Material**
- **TypeScript**
- **RxJS**

## 📋 Requisitos Previos

- Node.js 18 o superior
- PostgreSQL 12 o superior
- npm o yarn
- Angular CLI 17

## 🔧 Instalación

### 1. Base de Datos

```sql
-- Crear la base de datos
CREATE DATABASE investigacion_ud;

-- Ejecutar el script DB.sql para crear las tablas
\i DB.sql
```

### 2. Backend

```bash
cd backend-node

# Instalar dependencias
npm install

# Configurar variables de entorno
# Copiar env.example a .env y ajustar los valores
cp env.example .env

# Editar .env con tus credenciales de PostgreSQL:
# - DB_HOST=localhost
# - DB_PORT=5432
# - DB_NAME=investigacion_ud
# - DB_USER=tu_usuario
# - DB_PASSWORD=tu_contraseña
# - JWT_SECRET=tu_secret_key_segura
# - PORT=8081

# Ejecutar en modo desarrollo (con auto-reload)
npm run dev

# O en modo producción
npm start
```

El backend estará disponible en `http://localhost:8081`

### 3. Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
ng serve
# o
npm start
```

El frontend estará disponible en `http://localhost:4200`

## 📁 Estructura del Proyecto

```
InvestigaciónUD/
├── backend-node/            # Aplicación Node.js/Express
│   ├── config/              # Configuraciones (database, jwt)
│   ├── controllers/         # Controladores REST
│   ├── middleware/          # Middleware (auth, errorHandler)
│   ├── routes/              # Rutas de la API
│   ├── services/            # Lógica de negocio
│   ├── server.js            # Punto de entrada
│   ├── seed.js              # Script de datos iniciales
│   ├── package.json
│   └── .env                 # Variables de entorno (crear desde env.example)
├── frontend/                # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/        # Servicios, guards, interceptors
│   │   │   ├── features/    # Módulos de funcionalidades
│   │   │   │   ├── auth/    # Autenticación
│   │   │   │   ├── dashboard/ # Dashboard
│   │   │   │   ├── teams/   # Grupos de investigación
│   │   │   │   ├── admin/   # Administración
│   │   │   │   └── home/    # Página principal
│   │   │   └── shared/      # Componentes compartidos
│   │   ├── styles.scss      # Estilos globales
│   │   └── index.html
│   ├── package.json
│   └── angular.json
├── .github/
│   └── workflows/
│       ├── code-quality.yml # Workflow de CI/CD para calidad de código
│       └── README.md        # Documentación de workflows
└── DB.sql                   # Script de base de datos
```

## 🎨 Paleta de Colores

- **Azul Principal**: `#1291C0`
- **Negro**: `#373435`
- **Blanco**: `#FFFFFF`
- **Dorado**: `#b49739` (accent)
- **Rojo**: `#ED3237` (accent)

## 👥 Roles de Usuario

### ESTUDIANTE
- Puede consultar grupos de investigación
- Puede enviar solicitudes de vinculación a grupos
- Puede ver el estado de sus solicitudes
- Puede ver proyectos de los grupos a los que pertenece
- Puede ver enlaces a documentos de proyectos

### DOCENTE
- Todas las funcionalidades de ESTUDIANTE
- Puede ver todos los proyectos de investigación (solo lectura)
- Puede aplicar a grupos de investigación
- **No puede** crear proyectos
- **No puede** gestionar solicitudes de estudiantes
- **No puede** crear grupos

### COORDINADOR
- Puede gestionar sus grupos de investigación
- Puede crear, editar y eliminar proyectos
- Puede gestionar solicitudes de vinculación (aprobar/rechazar)
- Puede ver y editar información de sus grupos
- Puede agregar enlaces a documentos en proyectos
- El dashboard se actualiza automáticamente cuando se le asigna un grupo

### ADMINISTRADOR
- Acceso completo al sistema
- Puede crear usuarios (solo DOCENTE)
- Puede crear y gestionar grupos de investigación
- Puede asignar coordinadores a grupos (promueve docentes a coordinadores)
- Puede cambiar coordinadores de grupos
- Puede ver todos los proyectos (solo lectura)
- **No puede** crear, editar o eliminar proyectos
- Puede ver todas las solicitudes (solo lectura)
- Puede gestionar proyectos curriculares (crear, editar, eliminar)
- Puede gestionar áreas de investigación dentro de proyectos curriculares
- Puede ver usuarios por proyecto curricular
- Puede gestionar tipos de productos de investigación
- Validación: Solo puede asignar coordinadores del mismo proyecto curricular que el grupo

## 🔄 Sistema de Promoción de Roles

### Docente → Coordinador
- Cuando un administrador asigna un docente como coordinador de un grupo, el sistema automáticamente:
  - Crea un registro en la tabla `Cordinator`
  - Cambia el rol del usuario de `DOCENTE` a `COORDINADOR`
  - Actualiza el dashboard del docente para mostrar las opciones de coordinador

### Coordinador → Docente
- Cuando un coordinador pierde su grupo (se le asigna otro coordinador o se elimina el grupo), el sistema automáticamente:
  - Verifica si el coordinador tiene otros grupos asignados
  - Si no tiene grupos, cambia su rol de `COORDINADOR` a `DOCENTE`
  - Actualiza el dashboard automáticamente

## 🔐 Autenticación

- Validación de dominio: Solo emails `@udistrital.edu.co`
- Autenticación mediante JWT (JSON Web Tokens)
- Tokens almacenados en localStorage
- Interceptor HTTP para agregar token a todas las peticiones
- Guards para proteger rutas según roles de usuario
- Actualización automática del usuario para detectar cambios de rol
- **Navegación pública**: Las páginas de inicio (`/home`) y grupos (`/teams`) son accesibles sin autenticación
- Redirección inteligente: Solo se redirige al login cuando se intenta acceder a rutas protegidas

## 📡 API REST

### Endpoints Principales

#### Autenticación
- `POST /api/auth/register` - Registro de usuario (solo ESTUDIANTE)
- `POST /api/auth/login` - Inicio de sesión

#### Grupos (Públicos)
- `GET /api/teams/public` - Listar grupos (público)
- `GET /api/teams/public/:id` - Detalle de grupo (público)
- `GET /api/teams/public/area/:areaId` - Grupos por área (público)

#### Grupos (Protegidos)
- `GET /api/teams/my-teams` - Mis grupos (COORDINADOR, ADMINISTRADOR)
- `GET /api/teams/my-teams-student` - Mis grupos como estudiante/docente
- `POST /api/teams` - Crear grupo (COORDINADOR, ADMINISTRADOR)
- `PUT /api/teams/:id` - Actualizar grupo (COORDINADOR, ADMINISTRADOR)
- `DELETE /api/teams/:id` - Eliminar grupo (ADMINISTRADOR)

#### Proyectos
- `GET /api/projects/public` - Listar proyectos (público)
- `GET /api/projects/public/:id` - Detalle de proyecto (público)
- `GET /api/projects/public/team/:teamId` - Proyectos por grupo (público)
- `POST /api/projects` - Crear proyecto (COORDINADOR)
- `PUT /api/projects/:id` - Actualizar proyecto (COORDINADOR)
- `DELETE /api/projects/:id` - Eliminar proyecto (COORDINADOR)

#### Solicitudes
- `POST /api/applications` - Crear solicitud (ESTUDIANTE, DOCENTE)
- `GET /api/applications/my-applications` - Mis solicitudes (ESTUDIANTE, DOCENTE)
- `GET /api/applications/team/:teamId` - Solicitudes de un grupo (COORDINADOR)
- `PUT /api/applications/:id/status` - Actualizar estado (COORDINADOR)

#### Usuarios (Admin)
- `GET /api/users` - Listar usuarios (ADMINISTRADOR)
- `GET /api/users/me` - Usuario actual
- `POST /api/users` - Crear usuario (ADMINISTRADOR, solo DOCENTE)
- `PUT /api/users/:id` - Actualizar usuario (ADMINISTRADOR)
- `DELETE /api/users/:id` - Eliminar usuario (ADMINISTRADOR)
- `GET /api/users/available-teachers` - Docentes disponibles para coordinar (ADMINISTRADOR)
  - Query params: `excludeTeamId`, `projectAreaId` (filtra por proyecto curricular)
- `GET /api/users/teams-without-coordinator` - Grupos sin coordinador (ADMINISTRADOR)

#### Proyectos Curriculares (Admin)
- `GET /api/project-areas` - Listar proyectos curriculares (ADMINISTRADOR)
- `GET /api/project-areas/:id` - Obtener proyecto curricular (ADMINISTRADOR)
- `POST /api/project-areas` - Crear proyecto curricular (ADMINISTRADOR)
- `PUT /api/project-areas/:id` - Actualizar proyecto curricular (ADMINISTRADOR)
- `DELETE /api/project-areas/:id` - Eliminar proyecto curricular (ADMINISTRADOR, solo si no tiene información relacionada)
- `GET /api/project-areas/:id/users` - Obtener usuarios por proyecto curricular (ADMINISTRADOR)

#### Áreas de Investigación (Admin)
- `GET /api/investigation-areas` - Listar áreas de investigación (público)
- `GET /api/investigation-areas/project-area/:projectAreaId` - Áreas por proyecto curricular (público)
- `GET /api/investigation-areas/:id` - Obtener área de investigación (público)
- `POST /api/investigation-areas` - Crear área de investigación (ADMINISTRADOR)
- `PUT /api/investigation-areas/:id` - Actualizar área de investigación (ADMINISTRADOR)
- `DELETE /api/investigation-areas/:id` - Eliminar área de investigación (ADMINISTRADOR, solo si no tiene equipos)

#### Tipos de Producto (Admin)
- `GET /api/product-types` - Listar tipos de producto (público)
- `GET /api/product-types/:id` - Obtener tipo de producto (ADMINISTRADOR)
- `POST /api/product-types` - Crear tipo de producto (ADMINISTRADOR)
- `PUT /api/product-types/:id` - Actualizar tipo de producto (ADMINISTRADOR)
- `DELETE /api/product-types/:id` - Eliminar tipo de producto (ADMINISTRADOR, solo si no está en uso)

#### Públicos
- `GET /api/public/project-areas` - Áreas de proyecto (público)
- `GET /api/public/investigation-areas` - Áreas de investigación (público)
- `GET /api/public/product-types` - Tipos de producto (público)

## 🚦 Estado del Proyecto

### ✅ Backend completo con:
- Autenticación JWT
- CRUD de grupos de investigación
- CRUD de proyectos con enlaces a documentos
- Gestión de solicitudes de vinculación
- Administración de usuarios y roles
- Sistema de promoción automática de roles
- Validación de permisos por rol
- Actualización automática de roles según asignación de grupos
- CRUD de proyectos curriculares con validación de dependencias
- CRUD de áreas de investigación con validación de dependencias
- CRUD de tipos de producto con validación de dependencias
- Validación de proyecto curricular para coordinadores y grupos
- Endpoints para obtener usuarios por proyecto curricular

### ✅ Frontend completo con:
- Autenticación y registro
- Directorio de grupos
- Dashboard dinámico por roles
- Gestión de solicitudes
- Panel de administración completo
- Gestión de proyectos con enlaces a documentos
- Actualización automática del dashboard cuando cambia el rol
- Visualización de proyectos con enlaces públicos
- Gestión de proyectos curriculares con áreas de investigación
- Visualización de usuarios por proyecto curricular
- Gestión de tipos de producto
- Panel de usuarios con filtros avanzados
- Visualización de proyecto curricular en grupos públicos

## 📝 Características Implementadas

### Gestión de Roles
- ✅ Registro público solo para estudiantes
- ✅ Administradores pueden crear docentes
- ✅ Promoción automática de docentes a coordinadores al asignar grupo
- ✅ Degradación automática de coordinadores a docentes al perder grupo
- ✅ Validación de que cada coordinador solo coordina un grupo
- ✅ Dashboard se actualiza automáticamente según el rol

### Proyectos
- ✅ Coordinadores pueden crear, editar y eliminar proyectos
- ✅ Administradores solo pueden ver proyectos (solo lectura)
- ✅ Docentes pueden ver proyectos (solo lectura)
- ✅ Proyectos pueden tener enlaces a documentos/carpetas (campo `document`)
- ✅ Enlaces visibles en vistas públicas y privadas

### Solicitudes
- ✅ Estudiantes y docentes pueden aplicar a grupos
- ✅ Coordinadores pueden aprobar/rechazar solicitudes
- ✅ Administradores pueden ver solicitudes (solo lectura)
- ✅ Visualización de rol del solicitante (Estudiante/Docente)

### Grupos
- ✅ Administradores pueden crear grupos y asignar coordinadores
- ✅ Administradores pueden cambiar coordinadores de grupos
- ✅ Coordinadores pueden gestionar sus propios grupos
- ✅ Validación de que grupos siempre tengan un coordinador
- ✅ Visualización de coordinador en vista de administrador
- ✅ Validación: Coordinador y grupo deben pertenecer al mismo proyecto curricular
- ✅ Información del proyecto curricular visible públicamente en grupos
- ✅ Filtrado de docentes disponibles por proyecto curricular al asignar coordinador

### Proyectos Curriculares
- ✅ Administradores pueden crear, editar y eliminar proyectos curriculares
- ✅ Validación: No se pueden eliminar proyectos curriculares con información relacionada
- ✅ Visualización de usuarios (estudiantes y docentes) por proyecto curricular
- ✅ Gestión de áreas de investigación dentro de cada proyecto curricular
- ✅ Botón de eliminar se oculta automáticamente si hay información relacionada

### Áreas de Investigación
- ✅ Administradores pueden crear, editar y eliminar áreas de investigación
- ✅ Áreas de investigación están asociadas a un proyecto curricular
- ✅ Validación: No se pueden eliminar áreas de investigación con equipos asignados
- ✅ Gestión integrada desde el panel de proyectos curriculares

### Tipos de Producto
- ✅ Administradores pueden crear, editar y eliminar tipos de producto
- ✅ Validación: No se pueden eliminar tipos de producto que están en uso
- ✅ Gestión desde el dashboard de administrador

### Gestión de Usuarios
- ✅ Panel de administración con tabla completa de usuarios
- ✅ Visualización de proyecto curricular en la tabla de usuarios
- ✅ Filtros de búsqueda por nombre/email
- ✅ Filtros por rol (Estudiante, Docente, Coordinador, Administrador)
- ✅ Filtros por proyecto curricular
- ✅ Botón para limpiar filtros
- ✅ Chips de colores para identificar roles visualmente

## 🔄 Actualización Automática del Dashboard

El sistema implementa un mecanismo de actualización automática del dashboard:

1. **Al iniciar sesión**: El usuario se carga desde el backend
2. **Al cargar el dashboard**: Se refresca el usuario para detectar cambios de rol
3. **Polling automático**: Cada 5 segundos se verifica si el rol cambió
4. **Después de operaciones**: Se refresca el usuario después de crear/editar equipos
5. **Interceptor HTTP**: Refresca el usuario después de operaciones PUT/POST/DELETE relacionadas con equipos

Esto asegura que:
- Si un docente es asignado como coordinador, verá el cambio en su dashboard automáticamente
- Si un coordinador pierde su grupo, volverá a ver el dashboard de docente automáticamente

## 📝 Notas de Desarrollo

- El backend usa PostgreSQL con conexión mediante `pg` (node-postgres)
- El frontend usa interceptors para manejar tokens JWT automáticamente
- Los guards protegen las rutas según roles de usuario
- El sistema valida automáticamente los roles en cada petición
- Los cambios de rol se reflejan inmediatamente en el dashboard
- El interceptor HTTP detecta rutas públicas y no redirige al login innecesariamente
- Las páginas públicas (`/home`, `/teams`) pueden ser accedidas sin autenticación

## 🔄 CI/CD con GitHub Actions

El proyecto incluye un workflow de GitHub Actions para evaluación automática de calidad de código:

### Características del Workflow

- **Ejecución automática** en cada push y pull request a las ramas principales
- **Evaluación del Backend (Node.js)**:
  - Verificación de sintaxis de archivos JavaScript
  - Validación de `package.json`
  - Auditoría de seguridad con `npm audit`
  - Verificación de que el servidor puede iniciarse

- **Evaluación del Frontend (Angular)**:
  - Linting de TypeScript con Angular CLI
  - Verificación de tipos de TypeScript
  - Compilación de TypeScript
  - Validación de `angular.json`
  - Detección de `console.log` en código de producción

- **Parámetros configurables**:
  - Modo estricto (falla en warnings)
  - Opción de saltar verificación de backend o frontend
  - Variables de entorno para controlar verificaciones específicas

- **Reportes automáticos**:
  - Genera un reporte de calidad al finalizar
  - Muestra el estado de cada verificación

Para más detalles, consulta `.github/workflows/README.md`

## 🗄️ Base de Datos

El esquema de la base de datos incluye:
- `app_user`: Usuarios del sistema
- `Teacher`: Docentes (tiene `project_id` que referencia `Project_area`)
- `Student`: Estudiantes (tiene `project_id` que referencia `Project_area`)
- `Cordinator`: Coordinadores (relación con Teacher)
- `Investigation_team`: Grupos de investigación (tiene `area_id` que referencia `Investigation_area`)
- `Investigation_project`: Proyectos de investigación
- `Product`: Productos asociados a proyectos (incluye campo `document` para enlaces)
- `Product_type`: Tipos de productos de investigación
- `Application`: Solicitudes de vinculación
- `Project_area`: Proyectos curriculares
- `Investigation_area`: Áreas de investigación (tiene `project_area_id` que referencia `Project_area`)

### Relaciones Importantes
- Un **grupo de investigación** pertenece a un **área de investigación**
- Un **área de investigación** pertenece a un **proyecto curricular**
- Un **docente** pertenece a un **proyecto curricular**
- Un **estudiante** pertenece a un **proyecto curricular**
- **Validación**: Un coordinador solo puede coordinar grupos del mismo proyecto curricular al que pertenece

## 🤝 Contribución

Este es un proyecto académico para la Universidad Distrital Francisco José de Caldas.

## 📄 Licencia

Proyecto académico - Universidad Distrital Francisco José de Caldas
#   D B A - P r o j e c t  
 
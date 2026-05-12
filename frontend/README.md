# Frontend — Investigación UD (Angular)

Cliente web del sistema de grupos de investigación. Consume la API definida en `backend-node`.

## Requisitos

- Node.js 18+ y npm
- Angular CLI 17 (se instala con las dependencias del proyecto o globalmente)

## Instalación

```bash
npm install
```

## Configuración del API

Por defecto las peticiones van a `http://localhost:8081/api`, definido en:

`src/app/core/services/api.service.ts` → constante `API_URL`.

Si el backend corre en otro host o puerto, cambia esa constante o externalízala a `environment` en una evolución futura del proyecto.

## Scripts

| Comando        | Descripción                    |
|----------------|--------------------------------|
| `npm start`    | Servidor de desarrollo (`ng serve`) |
| `npm run build` | Compilación de producción   |
| `npm run watch` | Build en modo observación   |
| `npm test`     | Tests unitarios (Karma)     |

## Rutas relevantes

- `/home` — Inicio
- `/teams`, `/teams/:id` — Catálogo público de grupos
- `/login`, `/register` — Autenticación
- `/dashboard/*` — Panel según rol (solicitudes, grupos, proyectos, catálogos admin)
- `/admin/users` — Administración de usuarios (rol administrador)

El enrutamiento está en `src/app/app.routes.ts` y `src/app/features/dashboard/dashboard.routes.ts`.

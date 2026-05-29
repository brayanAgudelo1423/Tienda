# OZONO Backend

API y panel de administración para la tienda OZONO (Colombia — precios en COP).

## Requisitos

- Node.js 18+

## Instalación

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

La API queda en `http://localhost:3001`.

## Credenciales admin (por defecto)

- Usuario: `admin`
- Contraseña: `ozono2026`

Cámbialas en `.env` (`ADMIN_USER`, `ADMIN_PASSWORD`).

## Panel admin (frontend)

Con el backend y el frontend en marcha:

`http://localhost:5173/admin`

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Productos activos (tienda) |
| POST | `/api/sales` | Registrar venta |
| POST | `/api/auth/login` | Login admin |
| GET | `/api/products/admin/all` | Todos los productos (admin) |
| POST | `/api/upload` | Subir foto (admin, multipart) |

## Desarrollo con la tienda

En otra terminal:

```bash
cd OZONO
npm run dev
```

Vite redirige `/api` y `/uploads` al backend.

# OZONO Backend — API (Colombia, COP)

API Node.js + SQLite para la tienda OZONO. Precios en **pesos colombianos (COP)**.

## Despliegue en Render

1. [render.com](https://render.com) → inicia sesión con GitHub.
2. **New → Blueprint**.
3. Repo: `brayanagudelo1423-png/OZONO`.
4. Render lee `render.yaml` en la raíz y crea **ozono-api**.
5. Cuando termine, la URL será: **https://ozono-api.onrender.com**

Comprueba: `https://ozono-api.onrender.com/api/health` → `{"ok":true,...}`

### Variables en Render (automáticas vía `render.yaml`)

| Variable | Uso |
|----------|-----|
| `FRONTEND_URL` | CORS — GitHub Pages |
| `JWT_SECRET` | Sesión admin |
| `ADMIN_USER` / `ADMIN_PASSWORD` | Login admin |
| `PORT` | Lo asigna Render |

### Frontend conectado

El frontend en GitHub Pages usa:

`VITE_API_URL=https://ozono-api.onrender.com`

(definido en `.env.production` y en el workflow de deploy).

## Desarrollo local

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

API: http://localhost:3001

## Credenciales admin

- Usuario: `admin`
- Contraseña: `ozono2026`

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado del servicio |
| GET | `/api/products` | Productos activos (tienda) |
| POST | `/api/sales` | Registrar venta |
| POST | `/api/auth/login` | Login admin |
| GET | `/api/products/admin/all` | Productos (admin) |
| POST | `/api/upload` | Subir foto (admin) |

## Nota sobre datos en Render (plan free)

SQLite y fotos subidas viven en el disco del contenedor. Si Render redepliega, puede vaciarse la base; el comando `npm run seed` vuelve a cargar el catálogo inicial.

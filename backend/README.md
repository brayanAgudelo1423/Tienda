# OZONO Backend — API (Colombia, COP)

API Node.js + SQLite. URL en producción: **https://ozono.onrender.com**

## Comprobar que está activa

- https://ozono.onrender.com/
- https://ozono.onrender.com/api/health
- https://ozono.onrender.com/api/products

## Configuración en Render (dashboard)

| Campo | Valor |
|-------|--------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install && npm run seed` |
| **Start Command** | `npm start` |
| **Health Check Path** | `/api/health` |

Variables de entorno:

- `FRONTEND_URL` = `https://brayanagudelo1423-png.github.io`
- `ADMIN_USER` = `admin`
- `ADMIN_PASSWORD` = `ozono2026`
- `JWT_SECRET` = (texto aleatorio largo)

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

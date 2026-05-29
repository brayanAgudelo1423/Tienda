# OZONO — Tienda + Admin (Colombia, COP)

Tienda web y panel de administración. Precios en **pesos colombianos (COP)**.

## Sitios en vivo

| Servicio | URL |
|----------|-----|
| Tienda | https://brayanagudelo1423-png.github.io/OZONO/ |
| Admin | https://brayanagudelo1423-png.github.io/OZONO/admin |
| API (Render) | https://ozono-api.onrender.com |

**Login admin:** footer → **Ayuda → Ozono** (o `/admin`)

| Usuario | Contraseña |
|---------|------------|
| `admin` | `ozono2026` |

## Arquitectura

```
GitHub Pages (frontend)  ──API──►  Render (backend + SQLite)
     /OZONO/                         ozono-api.onrender.com
```

- **Frontend:** React + Vite → rama `gh-pages` (automático al push en `main`).
- **Backend:** Express en carpeta `backend/` → Render Blueprint (`render.yaml`).

## Desplegar backend en Render (obligatorio para admin)

El backend **no se activa solo**: debes crearlo en Render una vez.

### Opción A — Blueprint (recomendado)

1. Abre: [render.com/deploy?repo=https://github.com/brayanagudelo1423-png/OZONO](https://render.com/deploy?repo=https://github.com/brayanagudelo1423-png/OZONO)
2. Inicia sesión con GitHub y confirma el deploy.
3. Espera 3–5 minutos hasta que el estado sea **Live**.
4. Prueba: https://ozono-api.onrender.com/api/health  
   Debe responder: `{"ok":true,"service":"ozono-backend",...}`

### Opción B — Manual

1. [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**.
2. Conecta el repo **OZONO**.
3. Configura:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run render:start`
   - **Health Check Path:** `/api/health`
4. Variables de entorno:
   - `FRONTEND_URL` = `https://brayanagudelo1423-png.github.io`
   - `ADMIN_USER` = `admin`
   - `ADMIN_PASSWORD` = `ozono2026`
   - `JWT_SECRET` = (genera uno aleatorio)
5. **Create Web Service**.

El frontend ya apunta a `https://ozono-api.onrender.com` (`VITE_API_URL`).

> En plan gratis, la API puede tardar ~30 s en responder si estuvo inactiva.

## Desarrollo local

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

Tienda: http://localhost:5173 (proxy `/api` → backend).

## Precios (COP)

- La tienda muestra precios con formato colombiano (`$ 189.000`, etc.).
- El catálogo inicial se siembra en COP desde `src/data.js`.
- En el admin, ingresa precios en pesos (ej. `189000`).

## Estructura del repo

- `src/` — Frontend React (tienda + admin)
- `backend/` — API Node.js
- `render.yaml` — Configuración Render
- `public/images/` — Fotos del catálogo (107 imágenes)

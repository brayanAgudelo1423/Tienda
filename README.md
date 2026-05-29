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

## Desplegar backend en Render (una vez)

1. [render.com](https://render.com) → **New → Blueprint**.
2. Conecta `brayanagudelo1423-png/OZONO`.
3. Espera el deploy de **ozono-api**.
4. Verifica: https://ozono-api.onrender.com/api/health

El frontend ya apunta a esa API (`VITE_API_URL` en `.env.production`).

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

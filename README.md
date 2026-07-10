# OZONO — Tienda + Admin (Colombia, COP)

Tienda web y panel de administración. Precios en **pesos colombianos (COP)**.

## Sitios en vivo

| Servicio | URL |
|----------|-----|
| Tienda | https://brayanagudelo1423.github.io/Tienda/ |
| Admin | https://brayanagudelo1423.github.io/Tienda/admin |
| API (Render) | https://ozono.onrender.com |

**Login admin:** `/admin`

| Usuario | Contraseña |
|---------|------------|
| `admin` | `ozono2026` |

## Arquitectura

```
GitHub Pages (frontend)  ──API──►  Render (backend + SQLite)
     /Tienda/                        ozono.onrender.com
```

- **Frontend:** React + Vite → GitHub Actions → rama `gh-pages` (push en `main`).
- **Backend:** Express en `backend/` → Render (`render.yaml`).

## Desplegar backend en Render

1. Abre: [render.com/deploy?repo=https://github.com/brayanAgudelo1423/Tienda](https://render.com/deploy?repo=https://github.com/brayanAgudelo1423/Tienda)
2. Confirma el deploy y espera estado **Live**.
3. Prueba: https://ozono.onrender.com/api/health

Variables importantes en Render:

- `FRONTEND_URL` = `https://brayanagudelo1423.github.io/Tienda`
- `BACKEND_URL` = `https://ozono.onrender.com`
- `JWT_SECRET`, `ADMIN_USER`, `ADMIN_PASSWORD`
- PayU (opcional): `PAYU_API_KEY`, `PAYU_MERCHANT_ID`, `PAYU_ACCOUNT_ID`

## Desarrollo local

```bash
npm run dev:all
```

Frontend: http://localhost:5173 · Backend: http://localhost:3001

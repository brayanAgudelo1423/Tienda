# OZONO — Tienda + Admin (Colombia)

Tienda web con panel de administración. El frontend se publica en GitHub Pages y la API en Render.

## Sitio en vivo

- **Tienda:** https://brayanagudelo1423-png.github.io/OZONO/
- **Admin:** https://brayanagudelo1423-png.github.io/OZONO/admin
- **API:** https://ozono-api.onrender.com

## Credenciales admin

| Campo | Valor |
|--------|--------|
| Usuario | `admin` |
| Contraseña | `ozono2026` |

En el footer: **Ayuda → Ozono** para iniciar sesión.

## Desarrollo local

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

API: http://localhost:3001

### Frontend

```bash
npm install
npm run dev
```

Tienda: http://localhost:5173 (el proxy de Vite conecta `/api` al backend).

## Despliegue (una vez)

### 1. API en Render

1. Entra a [render.com](https://render.com) e inicia sesión con GitHub.
2. **New → Blueprint** y conecta el repo `brayanagudelo1423-png/OZONO`.
3. Render leerá `render.yaml` y creará el servicio **ozono-api**.
4. Espera a que el deploy termine (la URL será `https://ozono-api.onrender.com`).

### 2. Frontend en GitHub Pages

Ya está configurado: cada push a `main` compila y publica en la rama `gh-pages`.

En **Settings → Pages**, origen: rama **gh-pages**, carpeta **/ (root)**.

El build usa `.env.production` con `VITE_API_URL=https://ozono-api.onrender.com`.

### Sincronización tienda ↔ admin

- La tienda carga productos desde la API.
- Cada cambio en el admin actualiza la base de datos al instante.
- La tienda se refresca al volver a la pestaña y cada 30 segundos.

## Estructura

- `src/` — React (tienda + admin)
- `backend/` — API Node.js, SQLite, subida de fotos

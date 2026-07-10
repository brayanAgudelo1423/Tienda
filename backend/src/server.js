import '../scripts/load-env.mjs';
import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import brandsRoutes from './routes/brands.js';
import salesRoutes from './routes/sales.js';
import uploadRoutes from './routes/upload.js';
import paymentsRoutes from './routes/payments.js';
import { initDatabase, getProductCount } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    'https://brayanagudelo1423.github.io',
    'https://brayanagudelo1423-png.github.io',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
  ].filter(Boolean)
);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  if (origin.includes('github.io')) return true;
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;
  if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return true;
  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origen no permitido por CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(express.json({ limit: '2mb' }));

const uploadsDir = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (process.env.NODE_ENV === 'production') {
  console.log(`[OZONO] Uploads: ${uploadsDir}`);
}
app.use('/uploads', express.static(uploadsDir));

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'ozono-backend',
    message: 'API OZONO activa. Usa /api/health o /api/products',
    currency: 'COP',
  });
});

app.get('/api/health', async (_req, res) => {
  try {
    const productCount = await getProductCount();
    res.json({
      ok: true,
      service: 'ozono-backend',
      currency: 'COP',
      database: 'postgresql',
      products: productCount,
      frontend: process.env.FRONTEND_URL || null,
    });
  } catch (err) {
    res.status(503).json({
      ok: false,
      service: 'ozono-backend',
      error: err.message,
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/upload', uploadRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.message?.includes('CORS') ? 403 : 500;
  res.status(status).json({ error: err.message || 'Error interno del servidor' });
});

await initDatabase();

async function runSeedScript(relativePath) {
  const scriptPath = path.join(__dirname, '..', relativePath);
  await new Promise((resolve) => {
    const child = spawn(process.execPath, [scriptPath], {
      stdio: 'inherit',
      env: process.env,
    });
    child.on('exit', () => resolve());
    child.on('error', (err) => {
      console.warn(`[OZONO] Seed falló (${relativePath}):`, err.message);
      resolve();
    });
  });
}

const productCount = await getProductCount();
if (productCount === 0) {
  console.log('[OZONO] Catálogo vacío, sembrando productos...');
  await runSeedScript('scripts/seed.mjs');
  await runSeedScript('scripts/seed-lociones.mjs');
  console.log(`[OZONO] Productos en catálogo: ${await getProductCount()}`);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`OZONO API escuchando en puerto ${PORT} (COP)`);
});

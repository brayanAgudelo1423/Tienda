import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import brandsRoutes from './routes/brands.js';
import salesRoutes from './routes/sales.js';
import uploadRoutes from './routes/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
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

app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'ozono-backend',
    currency: 'COP',
    frontend: process.env.FRONTEND_URL || null,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/upload', uploadRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.message?.includes('CORS') ? 403 : 500;
  res.status(status).json({ error: err.message || 'Error interno del servidor' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`OZONO API escuchando en puerto ${PORT} (COP)`);
});

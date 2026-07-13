import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { requireAuth } from '../middleware/auth.js';
import {
  configureCloudinary,
  isCloudinaryConfigured,
  uploadImageBuffer,
} from '../cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
const useCloudinary = isCloudinaryConfigured();

if (useCloudinary) {
  configureCloudinary();
  console.log('[OZONO] Uploads: Cloudinary (persistente)');
} else {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  console.log('[OZONO] Uploads: disco local (temporal en Render)');
}

const storage = useCloudinary
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, uploadsDir),
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg';
        const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
        cb(null, safe);
      },
    });

const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten imágenes'));
    }
    cb(null, true);
  },
});

const router = Router();

router.post('/', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ninguna imagen' });
    }

    if (useCloudinary) {
      const folder = process.env.CLOUDINARY_FOLDER || 'virtusmonaco';
      const result = await uploadImageBuffer(req.file.buffer, { folder });
      return res.status(201).json({
        url: result.secure_url,
        filename: result.public_id,
        provider: 'cloudinary',
      });
    }

    const url = `/uploads/${req.file.filename}`;
    res.status(201).json({ url, filename: req.file.filename, provider: 'local' });
  } catch (err) {
    next(err);
  }
});

router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  if (err) return res.status(400).json({ error: err.message });
  next();
});

export default router;

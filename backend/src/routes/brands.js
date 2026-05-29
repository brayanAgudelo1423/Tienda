import { Router } from 'express';
import { getBrands, upsertBrand } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', (_req, res) => {
  const brands = getBrands();
  res.json(brands.map((b) => ({ name: b.name, slug: b.slug, sortOrder: b.sort_order })));
});

router.post('/admin', requireAuth, (req, res) => {
  const { name, slug, sortOrder } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ error: 'Nombre y slug requeridos' });
  }
  upsertBrand({ name, slug, sortOrder: sortOrder ?? 0 });
  res.status(201).json({ success: true });
});

export default router;

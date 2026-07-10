import { Router } from 'express';
import { getBrands, upsertBrand } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const brands = await getBrands();
    res.json(brands.map((b) => ({ name: b.name, slug: b.slug, sortOrder: b.sort_order })));
  } catch (err) {
    next(err);
  }
});

router.post('/admin', requireAuth, async (req, res, next) => {
  try {
    const { name, slug, sortOrder } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: 'Nombre y slug requeridos' });
    }
    await upsertBrand({ name, slug, sortOrder: sortOrder ?? 0 });
    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;

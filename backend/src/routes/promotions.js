import { Router } from 'express';
import {
  getActivePromotions,
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function normalizeBody(body) {
  return {
    title: body.title?.trim(),
    subtitle: body.subtitle?.trim() ?? '',
    badge: body.badge?.trim() ?? '',
    ctaText: body.ctaText?.trim() || 'Ver más',
    ctaLink: body.ctaLink?.trim() || '/',
    image: body.image?.trim() || '',
    sortOrder: Number(body.sortOrder ?? 0),
    active: body.active !== false,
  };
}

router.get('/', async (_req, res, next) => {
  try {
    res.json(await getActivePromotions());
  } catch (err) {
    next(err);
  }
});

router.get('/admin/all', requireAuth, async (_req, res, next) => {
  try {
    res.json(await getAllPromotions());
  } catch (err) {
    next(err);
  }
});

router.post('/admin', requireAuth, async (req, res, next) => {
  try {
    const data = normalizeBody(req.body);
    if (!data.title) {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }
    const promo = await createPromotion(data);
    res.status(201).json(promo);
  } catch (err) {
    next(err);
  }
});

router.put('/admin/:id', requireAuth, async (req, res, next) => {
  try {
    const data = normalizeBody(req.body);
    const promo = await updatePromotion(Number(req.params.id), data);
    if (!promo) return res.status(404).json({ error: 'Promoción no encontrada' });
    res.json(promo);
  } catch (err) {
    next(err);
  }
});

router.patch('/admin/:id/toggle', requireAuth, async (req, res, next) => {
  try {
    const existing = await getPromotionById(Number(req.params.id));
    if (!existing) return res.status(404).json({ error: 'Promoción no encontrada' });
    const promo = await updatePromotion(existing.id, { active: !existing.active });
    res.json(promo);
  } catch (err) {
    next(err);
  }
});

router.delete('/admin/:id', requireAuth, async (req, res, next) => {
  try {
    const ok = await deletePromotion(Number(req.params.id));
    if (!ok) return res.status(404).json({ error: 'Promoción no encontrada' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;

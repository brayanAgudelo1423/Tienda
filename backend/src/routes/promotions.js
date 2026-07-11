import { Router } from 'express';
import {
  getPromotionsPage,
  getPromotionsSettings,
  updatePromotionsSettings,
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { scheduleCatalogExport } from '../catalogExport.js';

const router = Router();

function normalizePrice(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

function normalizeBody(body) {
  return {
    title: body.title?.trim(),
    subtitle: body.subtitle?.trim() ?? '',
    badge: body.badge?.trim() ?? '',
    ctaText: body.ctaText?.trim() || 'Ver más',
    ctaLink: body.ctaLink?.trim() || '/',
    image: body.image?.trim() || '',
    priceBefore: normalizePrice(body.priceBefore),
    priceNow: normalizePrice(body.priceNow),
    sortOrder: Number(body.sortOrder ?? 0),
    active: body.active !== false,
  };
}

function normalizeSettingsBody(body) {
  return {
    sectionEnabled: body.sectionEnabled,
    pageTitle: body.pageTitle?.trim(),
    pageSubtitle: body.pageSubtitle?.trim(),
    menuLabel: body.menuLabel?.trim(),
  };
}

router.get('/', async (_req, res, next) => {
  try {
    res.json(await getPromotionsPage());
  } catch (err) {
    next(err);
  }
});

router.get('/admin/all', requireAuth, async (_req, res, next) => {
  try {
    const [settings, promotions] = await Promise.all([
      getPromotionsSettings(),
      getAllPromotions(),
    ]);
    res.json({ settings, promotions });
  } catch (err) {
    next(err);
  }
});

router.put('/admin/settings', requireAuth, async (req, res, next) => {
  try {
    const settings = await updatePromotionsSettings(normalizeSettingsBody(req.body));
    scheduleCatalogExport();
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

router.patch('/admin/settings/toggle', requireAuth, async (_req, res, next) => {
  try {
    const current = await getPromotionsSettings();
    const settings = await updatePromotionsSettings({
      sectionEnabled: !current.sectionEnabled,
    });
    scheduleCatalogExport();
    res.json(settings);
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
    scheduleCatalogExport();
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
    scheduleCatalogExport();
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
    scheduleCatalogExport();
    res.json(promo);
  } catch (err) {
    next(err);
  }
});

router.delete('/admin/:id', requireAuth, async (req, res, next) => {
  try {
    const ok = await deletePromotion(Number(req.params.id));
    if (!ok) return res.status(404).json({ error: 'Promoción no encontrada' });
    scheduleCatalogExport();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;

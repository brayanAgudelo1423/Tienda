import { Router } from 'express';
import {
  getActiveProducts,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkSetProductsActive,
  bulkDeleteProducts,
} from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { scheduleCatalogExport } from '../catalogExport.js';

const router = Router();

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeProductBody(body) {
  const brand = body.brand?.trim();
  return {
    name: body.name?.trim(),
    brand,
    brandSlug: body.brandSlug?.trim() || slugify(brand || ''),
    productType: body.productType?.trim() || 'Producto',
    price: Number(body.price),
    category: body.category?.trim() || 'Moda',
    gender: body.gender?.trim() || null,
    rating: body.rating !== undefined ? Number(body.rating) : 4.6,
    reviewCount: body.reviewCount !== undefined ? Number(body.reviewCount) : 0,
    description: body.description?.trim() || '',
    image: body.image,
    hoverImage: body.hoverImage || body.image,
    gallery: Array.isArray(body.gallery) ? body.gallery.filter(Boolean) : [],
    sizes: Array.isArray(body.sizes) ? body.sizes : [],
    colors: Array.isArray(body.colors) ? body.colors : [],
    active: body.active !== false,
  };
}

router.get('/admin/all', requireAuth, async (_req, res, next) => {
  try {
    res.json(await getAllProducts());
  } catch (err) {
    next(err);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    res.json(await getActiveProducts());
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await getProductById(Number(req.params.id));
    if (!product || !product.active) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.post('/admin', requireAuth, async (req, res, next) => {
  try {
    const data = normalizeProductBody(req.body);
    if (!data.name || !data.brand || !data.image || !Number.isFinite(data.price)) {
      return res.status(400).json({ error: 'Nombre, marca, imagen y precio son obligatorios' });
    }
    const product = await createProduct(data);
    scheduleCatalogExport();
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

router.put('/admin/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = normalizeProductBody(req.body);
    const product = await updateProduct(id, data);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    scheduleCatalogExport();
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.patch('/admin/:id/toggle', requireAuth, async (req, res, next) => {
  try {
    const existing = await getProductById(Number(req.params.id));
    if (!existing) return res.status(404).json({ error: 'Producto no encontrado' });
    const product = await updateProduct(existing.id, { active: !existing.active });
    scheduleCatalogExport();
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.post('/admin/bulk', requireAuth, async (req, res, next) => {
  try {
    const { ids, action } = req.body;
    const numericIds = [...new Set(
      (Array.isArray(ids) ? ids : [])
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0)
    )];

    if (!numericIds.length) {
      return res.status(400).json({ error: 'Selecciona al menos un producto' });
    }

    let count = 0;
    if (action === 'delete') {
      count = await bulkDeleteProducts(numericIds);
    } else if (action === 'hide') {
      count = await bulkSetProductsActive(numericIds, false);
    } else if (action === 'show') {
      count = await bulkSetProductsActive(numericIds, true);
    } else {
      return res.status(400).json({ error: 'Acción inválida' });
    }

    res.json({ success: true, count });
    scheduleCatalogExport();
  } catch (err) {
    next(err);
  }
});

router.delete('/admin/:id', requireAuth, async (req, res, next) => {
  try {
    const ok = await deleteProduct(Number(req.params.id));
    if (!ok) return res.status(404).json({ error: 'Producto no encontrado' });
    scheduleCatalogExport();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;

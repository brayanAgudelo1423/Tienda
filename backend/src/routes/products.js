import { Router } from 'express';
import {
  getActiveProducts,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../db.js';
import { requireAuth } from '../middleware/auth.js';

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
    sizes: Array.isArray(body.sizes) ? body.sizes : [],
    colors: Array.isArray(body.colors) ? body.colors : [],
    active: body.active !== false,
  };
}

// Admin (antes de /:id)
router.get('/admin/all', requireAuth, (_req, res) => {
  res.json(getAllProducts());
});

// Público — tienda
router.get('/', (_req, res) => {
  res.json(getActiveProducts());
});

router.get('/:id', (req, res) => {
  const product = getProductById(Number(req.params.id));
  if (!product || !product.active) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(product);
});

router.post('/admin', requireAuth, (req, res) => {
  const data = normalizeProductBody(req.body);
  if (!data.name || !data.brand || !data.image || !Number.isFinite(data.price)) {
    return res.status(400).json({ error: 'Nombre, marca, imagen y precio son obligatorios' });
  }
  const product = createProduct(data);
  res.status(201).json(product);
});

router.put('/admin/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const data = normalizeProductBody(req.body);
  const product = updateProduct(id, data);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

router.patch('/admin/:id/toggle', requireAuth, (req, res) => {
  const existing = getProductById(Number(req.params.id));
  if (!existing) return res.status(404).json({ error: 'Producto no encontrado' });
  const product = updateProduct(existing.id, { active: !existing.active });
  res.json(product);
});

router.delete('/admin/:id', requireAuth, (req, res) => {
  const ok = deleteProduct(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json({ success: true });
});

export default router;

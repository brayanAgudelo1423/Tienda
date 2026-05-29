import { Router } from 'express';
import { createSale, getSales, getSalesStats } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', (req, res) => {
  const { total, subtotal, customer, items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'La venta debe incluir productos' });
  }

  const sale = createSale({
    total: Number(total),
    subtotal: Number(subtotal ?? total),
    customerName: customer?.name,
    customerEmail: customer?.email,
    customerPhone: customer?.phone,
    customerCity: customer?.city,
    customerAddress: customer?.address,
    items,
    status: 'completada',
  });

  res.status(201).json(sale);
});

router.get('/admin', requireAuth, (req, res) => {
  const limit = Number(req.query.limit) || 100;
  res.json(getSales(limit));
});

router.get('/admin/stats', requireAuth, (_req, res) => {
  res.json(getSalesStats());
});

export default router;

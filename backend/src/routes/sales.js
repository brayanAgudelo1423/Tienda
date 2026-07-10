import { Router } from 'express';
import { createSale, getSales, getSalesStats } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const VALID_PAYMENT_METHODS = new Set(['payu-online', 'payu-card', 'pse', 'contraentrega']);

function normalizePaymentMethod(paymentMethod) {
  if (paymentMethod === 'payu-card' || paymentMethod === 'pse') return 'payu-online';
  if (VALID_PAYMENT_METHODS.has(paymentMethod)) return paymentMethod;
  return 'contraentrega';
}

router.post('/', (req, res) => {
  const { total, subtotal, customer, items, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'La venta debe incluir productos' });
  }

  if (!customer?.name?.trim() || !customer?.email?.trim() || !customer?.phone?.trim()) {
    return res.status(400).json({ error: 'Completa nombre, correo y teléfono' });
  }

  if (!customer?.address?.trim() || !customer?.city?.trim()) {
    return res.status(400).json({ error: 'Completa la dirección de envío' });
  }

  const normalizedTotal = Number(total);
  if (!Number.isFinite(normalizedTotal) || normalizedTotal <= 0) {
    return res.status(400).json({ error: 'Total de venta inválido' });
  }

  const normalizedPayment = normalizePaymentMethod(paymentMethod);

  const sale = createSale({
    total: normalizedTotal,
    subtotal: Number(subtotal ?? total),
    customerName: customer.name.trim(),
    customerEmail: customer.email.trim(),
    customerPhone: customer.phone.trim(),
    customerCity: customer.city.trim(),
    customerAddress: customer.address.trim(),
    items,
    paymentMethod: normalizedPayment,
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

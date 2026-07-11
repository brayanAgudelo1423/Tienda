import { Router } from 'express';
import { createSale, getSales, getSalesStats, getSaleForTracking } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { notifyNewOrder } from '../email.js';

const router = Router();

const VALID_PAYMENT_METHODS = new Set(['payu-online', 'payu-card', 'pse', 'contraentrega']);

function normalizePaymentMethod(paymentMethod) {
  if (paymentMethod === 'payu-card' || paymentMethod === 'pse') return 'payu-online';
  if (VALID_PAYMENT_METHODS.has(paymentMethod)) return paymentMethod;
  return 'contraentrega';
}

router.post('/', async (req, res, next) => {
  try {
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

    const sale = await createSale({
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

    notifyNewOrder(sale).catch(() => {});

    res.status(201).json(sale);
  } catch (err) {
    next(err);
  }
});

router.get('/track', async (req, res, next) => {
  try {
    const orderId = req.query.orderId || req.query.id;
    const email = req.query.email;
    if (!orderId || !email) {
      return res.status(400).json({ error: 'Ingresa número de pedido y correo electrónico' });
    }
    const sale = await getSaleForTracking(orderId, email);
    if (!sale) {
      return res.status(404).json({ error: 'Pedido no encontrado. Verifica el número y el correo.' });
    }
    res.json(sale);
  } catch (err) {
    next(err);
  }
});

router.get('/admin', requireAuth, async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 100;
    res.json(await getSales(limit));
  } catch (err) {
    next(err);
  }
});

router.get('/admin/stats', requireAuth, async (_req, res, next) => {
  try {
    res.json(await getSalesStats());
  } catch (err) {
    next(err);
  }
});

export default router;

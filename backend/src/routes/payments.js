import { Router } from 'express';
import {
  getSaleById,
  getSaleByPayUReference,
  updateSalePayment,
} from '../db.js';
import {
  buildPaymentSignature,
  buildResponseSignature,
  getCheckoutAction,
  getPayUConfig,
  isPayUConfigured,
  mapPayUState,
} from '../payu.js';
import {
  createCheckoutPreference,
  extractWebhookPaymentId,
  extractWebhookTopic,
  fetchMercadoPagoPayment,
  isMercadoPagoConfigured,
  mapMercadoPagoStatus,
} from '../mercadopago.js';

const router = Router();

function backendBaseUrl(req) {
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL.replace(/\/$/, '');
  const host = req.get('host');
  const proto = req.get('x-forwarded-proto') || req.protocol || 'http';
  return `${proto}://${host}`;
}

function frontendBaseUrl() {
  return (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
}

router.get('/methods', (_req, res) => {
  const methods = [];

  if (isMercadoPagoConfigured()) {
    methods.push({
      id: 'mercadopago',
      label: 'Pago en línea',
      desc: 'Tarjetas, PSE, Nequi, Daviplata, Efecty y más medios en Colombia.',
    });
  }

  methods.push({
    id: 'contraentrega',
    label: 'Pago contraentrega',
    desc: 'Pagas en efectivo o datáfono al recibir',
  });

  res.json({ methods });
});

router.post('/mercadopago/checkout', async (req, res, next) => {
  try {
    if (!isMercadoPagoConfigured()) {
      return res.status(503).json({
        error:
          'Mercado Pago no está configurado. Agrega MERCADOPAGO_ACCESS_TOKEN en Render.',
      });
    }

    const { saleId, customer } = req.body;
    const sale = await getSaleById(Number(saleId));

    if (!sale) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    if (!customer?.email || !customer?.name || !customer?.phone) {
      return res.status(400).json({ error: 'Datos del cliente incompletos' });
    }

    const checkout = await createCheckoutPreference({
      sale,
      customer,
      backendUrl: backendBaseUrl(req),
      frontendUrl: frontendBaseUrl(),
    });

    await updateSalePayment(sale.id, {
      payuReference: checkout.reference,
      status: 'pendiente_pago',
    });

    res.json({
      initPoint: checkout.initPoint,
      preferenceId: checkout.preferenceId,
      reference: checkout.reference,
      test: checkout.test,
    });
  } catch (err) {
    next(err);
  }
});

async function processMercadoPagoPayment(paymentId) {
  const payment = await fetchMercadoPagoPayment(paymentId);
  const saleId = Number(payment.external_reference);
  const sale =
    (saleId ? await getSaleById(saleId) : null) ||
    (payment.metadata?.reference
      ? await getSaleByPayUReference(String(payment.metadata.reference))
      : null);

  if (!sale) {
    console.warn('[Mercado Pago] Pago sin pedido asociado:', paymentId);
    return;
  }

  await updateSalePayment(sale.id, {
    status: mapMercadoPagoStatus(payment.status),
    payuTransactionId: String(payment.id),
    payuReference: payment.metadata?.reference || sale.payuReference,
  });

  return getSaleById(sale.id);
}

async function handleMercadoPagoWebhook(req, res, next) {
  try {
    const topic = extractWebhookTopic(req);
    const paymentId = extractWebhookPaymentId(req);

    if (paymentId && (topic.includes('payment') || req.method === 'GET')) {
      await processMercadoPagoPayment(paymentId);
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('[Mercado Pago] Webhook error:', err.message);
    res.status(200).send('OK');
  }
}

router.post('/mercadopago/webhook', handleMercadoPagoWebhook);
router.get('/mercadopago/webhook', handleMercadoPagoWebhook);

router.post('/mercadopago/sync', async (req, res, next) => {
  try {
    if (!isMercadoPagoConfigured()) {
      return res.status(503).json({ error: 'Mercado Pago no está configurado' });
    }

    const paymentId = String(req.body.paymentId || '').trim();
    if (!paymentId) {
      return res.status(400).json({ error: 'paymentId requerido' });
    }

    const sale = await processMercadoPagoPayment(paymentId);
    if (!sale) {
      return res.status(404).json({ error: 'No se encontró el pedido de este pago' });
    }

    res.json({
      id: sale.id,
      status: sale.status,
      paymentMethod: sale.paymentMethod,
      payuReference: sale.payuReference,
      payuTransactionId: sale.payuTransactionId,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/checkout', async (req, res, next) => {
  try {
    if (!isPayUConfigured()) {
      return res.status(503).json({
        error: 'PayU no está configurado. Agrega PAYU_API_KEY, PAYU_MERCHANT_ID y PAYU_ACCOUNT_ID.',
      });
    }

    const { saleId, customer, documentType, documentNumber } = req.body;
    const sale = await getSaleById(Number(saleId));

    if (!sale) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    if (!customer?.email || !customer?.name || !customer?.phone) {
      return res.status(400).json({ error: 'Datos del cliente incompletos' });
    }

    if (!documentNumber?.trim()) {
      return res.status(400).json({ error: 'Documento de identidad requerido para PayU' });
    }

    const config = getPayUConfig();
    const referenceCode = `VM${sale.id}${Date.now()}`;
    const amount = Math.round(sale.total);
    const signature = buildPaymentSignature({
      referenceCode,
      amount,
      currency: 'COP',
    });

    const responseUrl = `${frontendBaseUrl()}/checkout/resulto`;
    const confirmationUrl = `${backendBaseUrl(req)}/api/payments/confirmation`;

    await updateSalePayment(sale.id, {
      payuReference: referenceCode,
      status: 'pendiente_pago',
    });

    const fields = {
      merchantId: config.merchantId,
      accountId: config.accountId,
      description: `Pedido VirtusMonaco #${sale.id}`,
      referenceCode,
      amount: String(amount),
      tax: '0',
      taxReturnBase: '0',
      currency: 'COP',
      signature,
      test: config.test ? '1' : '0',
      buyerEmail: customer.email,
      buyerFullName: customer.name,
      buyerDocumentType: documentType || 'CC',
      buyerDocument: String(documentNumber).trim(),
      telephone: customer.phone,
      payerFullName: customer.name,
      payerEmail: customer.email,
      payerDocumentType: documentType || 'CC',
      payerDocument: String(documentNumber).trim(),
      payerPhone: customer.phone,
      shippingAddress: customer.address || 'Colombia',
      shippingCity: customer.city || 'Bogota',
      shippingCountry: 'CO',
      responseUrl,
      confirmationUrl,
      extra1: String(sale.id),
      lng: 'es',
    };

    res.json({
      action: getCheckoutAction(config.test),
      fields,
      referenceCode,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/confirmation', async (req, res, next) => {
  try {
    const body = req.body;
    const referenceCode = body.reference_sale || body.referenceCode;
    const transactionState = body.state_pol || body.transactionState || body.lapTransactionState;
    const transactionId = body.transaction_id || body.transactionId;
    const value = body.value || body.TX_VALUE || body.amount;
    const currency = body.currency || 'COP';
    const signature = body.sign || body.signature;

    if (referenceCode && signature && isPayUConfigured()) {
      const expected = buildResponseSignature({
        referenceCode,
        amount: value,
        currency,
        transactionState,
      });
      if (expected !== signature) {
        console.warn('PayU: firma de confirmación inválida', referenceCode);
      }
    }

    const sale =
      (await getSaleByPayUReference(referenceCode)) || (await getSaleById(Number(body.extra1)));

    if (sale) {
      await updateSalePayment(sale.id, {
        status: mapPayUState(transactionState),
        payuTransactionId: transactionId ? String(transactionId) : null,
        payuReference: referenceCode,
      });
    }

    res.status(200).send('OK');
  } catch (err) {
    next(err);
  }
});

router.get('/status/:saleId', async (req, res, next) => {
  try {
    const sale = await getSaleById(Number(req.params.saleId));
    if (!sale) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json({
      id: sale.id,
      status: sale.status,
      paymentMethod: sale.paymentMethod,
      payuReference: sale.payuReference,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

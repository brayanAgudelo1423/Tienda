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

router.post('/checkout', (req, res) => {
  if (!isPayUConfigured()) {
    return res.status(503).json({
      error: 'PayU no está configurado. Agrega PAYU_API_KEY, PAYU_MERCHANT_ID y PAYU_ACCOUNT_ID.',
    });
  }

  const { saleId, customer, paymentMethod, documentType, documentNumber } = req.body;
  const sale = getSaleById(Number(saleId));

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
  const referenceCode = `OZONO${sale.id}${Date.now()}`;
  const amount = Math.round(sale.total);
  // Sin paymentMethods: PayU muestra todos los medios habilitados en tu cuenta
  // (PSE, Nequi, Daviplata, tarjetas, Efecty, Addi, Sistecredito, etc.)
  const signature = buildPaymentSignature({
    referenceCode,
    amount,
    currency: 'COP',
  });

  const responseUrl = `${frontendBaseUrl()}/checkout/resulto`;
  const confirmationUrl = `${backendBaseUrl(req)}/api/payments/confirmation`;

  updateSalePayment(sale.id, {
    payuReference: referenceCode,
    status: 'pendiente_pago',
  });

  const fields = {
    merchantId: config.merchantId,
    accountId: config.accountId,
    description: `Pedido OZONO #${sale.id}`,
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
});

router.post('/confirmation', (req, res) => {
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
    getSaleByPayUReference(referenceCode) ||
    getSaleById(Number(body.extra1));

  if (sale) {
    updateSalePayment(sale.id, {
      status: mapPayUState(transactionState),
      payuTransactionId: transactionId ? String(transactionId) : null,
      payuReference: referenceCode,
    });
  }

  res.status(200).send('OK');
});

router.get('/status/:saleId', (req, res) => {
  const sale = getSaleById(Number(req.params.saleId));
  if (!sale) return res.status(404).json({ error: 'Pedido no encontrado' });
  res.json({
    id: sale.id,
    status: sale.status,
    paymentMethod: sale.paymentMethod,
    payuReference: sale.payuReference,
  });
});

export default router;

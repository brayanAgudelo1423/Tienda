const MP_API = 'https://api.mercadopago.com';

export function getMercadoPagoConfig() {
  return {
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
    test:
      process.env.MERCADOPAGO_TEST === '1' ||
      (process.env.MERCADOPAGO_ACCESS_TOKEN || '').startsWith('TEST-'),
  };
}

export function isMercadoPagoConfigured() {
  return Boolean(getMercadoPagoConfig().accessToken);
}

export function mapMercadoPagoStatus(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'approved') return 'pagada';
  if (normalized === 'rejected' || normalized === 'cancelled' || normalized === 'refunded') {
    return 'rechazada';
  }
  if (normalized === 'pending' || normalized === 'in_process' || normalized === 'in_mediation') {
    return 'pendiente_pago';
  }
  return 'pendiente_pago';
}

export function buildPreferenceItems(sale) {
  const lineItems = Array.isArray(sale.items) ? sale.items : [];
  const items = lineItems.map((item, index) => ({
    id: String(item.id ?? index + 1),
    title: `${item.brand ? `${item.brand} — ` : ''}${item.name}`.slice(0, 256),
    quantity: Math.max(1, Number(item.quantity) || 1),
    unit_price: Math.round(Number(item.price) || 0),
    currency_id: 'COP',
  }));

  const itemsTotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const saleTotal = Math.round(Number(sale.total) || 0);

  if (!items.length || itemsTotal !== saleTotal) {
    return [
      {
        id: String(sale.id),
        title: `Pedido VirtusMonaco #${sale.id}`,
        quantity: 1,
        unit_price: saleTotal,
        currency_id: 'COP',
      },
    ];
  }

  return items;
}

export async function createCheckoutPreference({ sale, customer, backendUrl, frontendUrl }) {
  const { accessToken, test } = getMercadoPagoConfig();
  if (!accessToken) {
    throw new Error('Mercado Pago no está configurado');
  }

  const reference = `VM-MP-${sale.id}-${Date.now()}`;
  const resultBase = `${frontendUrl.replace(/\/$/, '')}/checkout/resulto`;

  const preference = {
    items: buildPreferenceItems(sale),
    payer: {
      name: customer.name,
      email: customer.email,
      phone: {
        number: String(customer.phone || '').replace(/\D/g, '').slice(-10),
      },
    },
    back_urls: {
      success: `${resultBase}?gateway=mp&collection_status=approved`,
      failure: `${resultBase}?gateway=mp&collection_status=rejected`,
      pending: `${resultBase}?gateway=mp&collection_status=pending`,
    },
    auto_return: 'approved',
    external_reference: String(sale.id),
    notification_url: `${backendUrl.replace(/\/$/, '')}/api/payments/mercadopago/webhook`,
    statement_descriptor: 'VirtusMonaco',
    metadata: {
      sale_id: String(sale.id),
      reference,
    },
  };

  const response = await fetch(`${MP_API}/checkout/preferences`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preference),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || data.error || 'No se pudo crear la preferencia de pago';
    throw new Error(message);
  }

  const initPoint = test ? data.sandbox_init_point : data.init_point;
  if (!initPoint) {
    throw new Error('Mercado Pago no devolvió URL de pago');
  }

  return {
    initPoint,
    preferenceId: data.id,
    reference,
    test,
  };
}

export async function fetchMercadoPagoPayment(paymentId) {
  const { accessToken } = getMercadoPagoConfig();
  const response = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `No se pudo consultar el pago ${paymentId}`);
  }
  return data;
}

export function extractWebhookPaymentId(req) {
  if (req.body?.data?.id) return String(req.body.data.id);
  if (req.body?.id) return String(req.body.id);
  if (req.query?.['data.id']) return String(req.query['data.id']);
  if (req.query?.id) return String(req.query.id);
  return null;
}

export function extractWebhookTopic(req) {
  return req.body?.type || req.body?.action || req.query?.topic || req.query?.type || '';
}

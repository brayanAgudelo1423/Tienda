const STAGING_BASE = 'https://api-co-stg.sistecreditocloud.com';
const PRODUCTION_BASE = 'https://api.sistecredito.com';

const AUTH_PATH = '/Spay/PasCheckout/auth/authentication';
const CREATE_PATH = '/Spay/PasCheckout/checkout-integration/create/transaction';
const GET_PATH = '/Spay/PasCheckout/checkout-integration/get/transaction';

const TERMINAL_FAILURE = new Set([
  'Rejected',
  'Cancelled',
  'Expired',
  'Abandoned',
  'Failed',
]);

const APPROVED_STATUS = new Set(['Approved']);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getSistecreditoConfig() {
  const production = process.env.SISTECREDITO_ENV === 'production';
  return {
    baseUrl: (
      process.env.SISTECREDITO_API_BASE || (production ? PRODUCTION_BASE : STAGING_BASE)
    ).replace(/\/$/, ''),
    subscriptionKey: process.env.SISTECREDITO_SUBSCRIPTION_KEY || '',
    alliedPublicKey: process.env.SISTECREDITO_ALLIED_PUBLIC_KEY || '',
    paymentMethodId: Number(process.env.SISTECREDITO_PAYMENT_METHOD_ID || 2),
    sandbox: process.env.SISTECREDITO_SANDBOX === '1',
    sandboxStatus: process.env.SISTECREDITO_SANDBOX_STATUS || 'Approved',
    production,
  };
}

export function isSistecreditoConfigured() {
  const cfg = getSistecreditoConfig();
  return Boolean(cfg.subscriptionKey && cfg.alliedPublicKey);
}

export function mapSistecreditoStatus(status) {
  const normalized = String(status || '').trim();
  if (APPROVED_STATUS.has(normalized)) return 'pagada';
  if (TERMINAL_FAILURE.has(normalized)) return 'rechazada';
  return 'pendiente_pago';
}

function splitCustomerName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  return {
    name: parts[0] || 'Cliente',
    lastName: parts.slice(1).join(' ') || '-',
  };
}

function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.slice(-10) || digits;
}

async function parseJsonResponse(res) {
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  return { res, data };
}

function apiErrorMessage(data, fallback) {
  if (typeof data?.message === 'string' && data.message.trim()) return data.message.trim();
  if (typeof data?.error === 'string' && data.error.trim()) return data.error.trim();
  return fallback;
}

function transactionPayload(data) {
  return data?.data ?? data;
}

function getRedirectUrl(tx) {
  return (
    tx?.paymentMethodResponse?.paymentRedirectUrl ||
    tx?.paymentRedirectUrl ||
    null
  );
}

function getTransactionStatus(tx) {
  return (
    tx?.transactionStatus ||
    tx?.paymentMethodResponse?.statusResponse ||
    tx?.statusResponse ||
    ''
  );
}

export async function authenticateSistecredito() {
  const cfg = getSistecreditoConfig();
  const res = await fetch(`${cfg.baseUrl}${AUTH_PATH}`, {
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': cfg.subscriptionKey,
      alliedPublicKey: cfg.alliedPublicKey,
    },
  });

  const { data } = await parseJsonResponse(res);
  const token = data?.data?.token;
  if (!res.ok || !token) {
    throw new Error(apiErrorMessage(data, 'No se pudo autenticar con Sistecrédito'));
  }
  return token;
}

export async function createSistecreditoTransaction({ sale, customer, backendUrl, frontendUrl }) {
  const cfg = getSistecreditoConfig();
  const token = await authenticateSistecredito();
  const { name, lastName } = splitCustomerName(customer.name);
  const amount = Math.round(Number(sale.total) || 0);
  const phone = normalizePhone(customer.phone);

  const body = {
    invoice: `VM-${sale.id}`,
    description: `Pedido VirtusMonaco #${sale.id}`,
    paymentMethod: {
      paymentMethodId: cfg.paymentMethodId,
    },
    currency: 'COP',
    value: amount,
    tax: 0,
    taxBase: amount,
    sandbox: {
      isActive: cfg.sandbox,
      status: cfg.sandboxStatus,
    },
    urlResponse: `${frontendUrl.replace(/\/$/, '')}/checkout/resulto?gateway=sc`,
    urlConfirmation: `${backendUrl.replace(/\/$/, '')}/api/payments/sistecredito/confirmation`,
    methodConfirmation: 'POST',
    client: {
      docType: customer.documentType || 'CC',
      document: String(customer.documentNumber || '').trim(),
      name,
      lastName,
      email: customer.email,
      indCountry: '57',
      phone,
      country: 'co',
      city: customer.cityName || customer.city || 'Colombia',
      address: customer.street || customer.address || 'Colombia',
    },
    extraData: {
      saleId: String(sale.id),
    },
  };

  const res = await fetch(`${cfg.baseUrl}${CREATE_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': cfg.subscriptionKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const { data } = await parseJsonResponse(res);
  if (!res.ok || Number(data?.errorCode) !== 0) {
    throw new Error(apiErrorMessage(data, 'Sistecrédito rechazó la creación del pago'));
  }

  const tx = transactionPayload(data);
  if (!tx?._id) {
    throw new Error('Sistecrédito no devolvió identificador de transacción');
  }

  return { token, transaction: tx, raw: data };
}

export async function fetchSistecreditoTransaction(paymentRef, token) {
  const cfg = getSistecreditoConfig();
  const authToken = token || (await authenticateSistecredito());
  const url = new URL(`${cfg.baseUrl}${GET_PATH}`);
  url.searchParams.set('paymentRef', String(paymentRef));

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': cfg.subscriptionKey,
      Authorization: `Bearer ${authToken}`,
    },
  });

  const { data } = await parseJsonResponse(res);
  if (!res.ok || Number(data?.errorCode) !== 0) {
    throw new Error(apiErrorMessage(data, 'No se pudo consultar el pago en Sistecrédito'));
  }

  return transactionPayload(data);
}

export async function pollSistecreditoRedirect(paymentRef, token, { attempts = 24, delayMs = 1500 } = {}) {
  let lastTx = null;

  for (let i = 0; i < attempts; i += 1) {
    const tx = await fetchSistecreditoTransaction(paymentRef, token);
    lastTx = tx;
    const status = getTransactionStatus(tx);
    const redirectUrl = getRedirectUrl(tx);

    if (redirectUrl) {
      return { transaction: tx, redirectUrl, status };
    }

    if (TERMINAL_FAILURE.has(status)) {
      const detail =
        tx?.paymentMethodResponse?.description ||
        tx?.description ||
        `Pago no disponible (${status})`;
      throw new Error(detail);
    }

    if (i < attempts - 1) await sleep(delayMs);
  }

  throw new Error(
    lastTx?.paymentMethodResponse?.description ||
      'Sistecrédito tardó demasiado en preparar el pago. Intenta de nuevo.'
  );
}

export async function createSistecreditoCheckout({ sale, customer, backendUrl, frontendUrl }) {
  const { token, transaction } = await createSistecreditoTransaction({
    sale,
    customer,
    backendUrl,
    frontendUrl,
  });

  let redirectUrl = getRedirectUrl(transaction);
  let finalTx = transaction;

  if (!redirectUrl) {
    const polled = await pollSistecreditoRedirect(transaction._id, token);
    redirectUrl = polled.redirectUrl;
    finalTx = polled.transaction;
  }

  return {
    paymentRef: finalTx._id,
    redirectUrl,
    invoice: finalTx.invoice || `VM-${sale.id}`,
    transactionStatus: getTransactionStatus(finalTx),
    test: !getSistecreditoConfig().production,
  };
}

export function extractSaleIdFromNotification(payload) {
  const extraSaleId = payload?.extraData?.saleId || payload?.data?.extraData?.saleId;
  if (extraSaleId) return Number(extraSaleId);

  const invoice = payload?.invoice || payload?.data?.invoice;
  if (typeof invoice === 'string') {
    const match = invoice.match(/^VM-(\d+)$/i);
    if (match) return Number(match[1]);
  }

  return null;
}

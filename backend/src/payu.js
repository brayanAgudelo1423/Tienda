import crypto from 'node:crypto';

export function getPayUConfig() {
  return {
    apiKey: process.env.PAYU_API_KEY || '',
    merchantId: process.env.PAYU_MERCHANT_ID || '',
    accountId: process.env.PAYU_ACCOUNT_ID || '',
    test: process.env.PAYU_TEST !== '0',
  };
}

export function isPayUConfigured() {
  const { apiKey, merchantId, accountId } = getPayUConfig();
  return Boolean(apiKey && merchantId && accountId);
}

export function getCheckoutAction(test) {
  return test
    ? 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/'
    : 'https://checkout.payulatam.com/ppp-web-gateway-payu/';
}

export function buildPaymentSignature({ referenceCode, amount, currency = 'COP', paymentMethods }) {
  const { apiKey, merchantId } = getPayUConfig();
  const amountStr = String(Math.round(Number(amount)));
  let chain = `${apiKey}~${merchantId}~${referenceCode}~${amountStr}~${currency}`;
  if (paymentMethods) {
    chain += `~${paymentMethods}`;
  }
  return crypto.createHash('md5').update(chain).digest('hex');
}

export function buildResponseSignature({ referenceCode, amount, currency, transactionState }) {
  const { apiKey, merchantId } = getPayUConfig();
  const chain = `${apiKey}~${merchantId}~${referenceCode}~${amount}~${currency}~${transactionState}`;
  return crypto.createHash('md5').update(chain).digest('hex');
}

export function isPayUOnlinePayment(paymentMethod) {
  return paymentMethod === 'payu-online' || paymentMethod === 'payu-card' || paymentMethod === 'pse';
}

export function mapPayUState(state) {
  const normalized = String(state || '').toUpperCase();
  if (normalized === 'APPROVED') return 'pagada';
  if (normalized === 'PENDING') return 'pendiente_pago';
  if (normalized === 'DECLINED' || normalized === 'EXPIRED') return 'rechazada';
  return 'pendiente_pago';
}

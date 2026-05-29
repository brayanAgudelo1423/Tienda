/** Convierte precio base del catálogo a pesos colombianos (COP) */
const COP_FACTOR = 4000;

export function toCopPrice(base) {
  const n = Number(base) || 0;
  if (n >= 10000) return Math.round(n);
  return Math.round(n * COP_FACTOR);
}

/** Formato peso colombiano (COP) */
export function formatCOP(amount) {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function parseCOPInput(value) {
  if (typeof value === 'number') return value;
  const digits = String(value).replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}

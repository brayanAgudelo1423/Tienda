/**
 * Actualiza precios en producción:
 * - Polos Tommy → 239990
 * - Camisetas Calvin Klein → 199900
 * - Camisetas Psycho Bunny → 299900
 * También limpia "OZONO" → "VirtusMonaco" en descripciones.
 */
const API_URL = (process.env.API_URL || 'https://tienda-1-7f8f.onrender.com').replace(/\/$/, '');
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ozono2026';

const PRICES = {
  tommyPolo: 239990,
  ckCamiseta: 199900,
  psychoCamiseta: 299900,
};

async function api(method, pathname, { token, body } = {}) {
  const res = await fetch(`${API_URL}${pathname}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    throw new Error(`${method} ${pathname} → ${res.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
  }
  return data;
}

function isPolo(p) {
  const blob = `${p.category || ''} ${p.productType || ''} ${p.name || ''}`.toLowerCase();
  return blob.includes('polo');
}

function isCamiseta(p) {
  const blob = `${p.category || ''} ${p.productType || ''} ${p.name || ''}`.toLowerCase();
  return blob.includes('camiseta');
}

function cleanDesc(text) {
  return String(text ?? '')
    .replace(/\bOZONO\b/gi, 'VirtusMonaco')
    .replace(/\bOzono\b/g, 'VirtusMonaco');
}

function targetPrice(p) {
  const slug = (p.brandSlug || '').toLowerCase();
  const brand = (p.brand || '').toLowerCase();
  const isTommy = slug === 'tomi' || brand === 'tommy' || brand === 'tomi';
  const isCk = slug === 'calvin-klein' || brand === 'calvin klein';
  const isPsycho = slug === 'psycho-bunny' || brand === 'psycho bunny';

  if (isTommy && isPolo(p)) return PRICES.tommyPolo;
  if (isCk && isCamiseta(p)) return PRICES.ckCamiseta;
  if (isPsycho && isCamiseta(p)) return PRICES.psychoCamiseta;
  return null;
}

async function main() {
  const login = await api('POST', '/api/auth/login', {
    body: { username: ADMIN_USER, password: ADMIN_PASSWORD },
  });
  const token = login.token;
  if (!token) throw new Error('Sin token');

  const products = await api('GET', '/api/products/admin/all', { token });
  let updated = 0;
  let descOnly = 0;

  for (const p of products) {
    const nextPrice = targetPrice(p);
    const nextDesc = cleanDesc(p.description);
    const priceChanged = nextPrice != null && Number(p.price) !== nextPrice;
    const descChanged = nextDesc !== (p.description || '');

    if (!priceChanged && !descChanged) continue;

    await api('PUT', `/api/products/admin/${p.id}`, {
      token,
      body: {
        ...p,
        price: priceChanged ? nextPrice : p.price,
        description: nextDesc,
      },
    });

    if (priceChanged) {
      updated += 1;
      console.log(`precio ${p.id} ${p.name}: ${p.price} → ${nextPrice}`);
    } else {
      descOnly += 1;
    }
  }

  console.log(`Listo. Precios: ${updated}. Descripciones limpiadas: ${descOnly + updated}.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

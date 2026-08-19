/**
 * Restaura un catalog-export.json en la API en vivo
 * (borra seed actual y recrea productos/marcas/promos).
 *
 * Uso:
 *   node scripts/restore-catalog-via-api.mjs [ruta-al-export.json]
 *
 * Env opcionales:
 *   API_URL=https://tienda-1-7f8f.onrender.com
 *   ADMIN_USER=admin
 *   ADMIN_PASSWORD=ozono2026
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_URL = (process.env.API_URL || 'https://tienda-1-7f8f.onrender.com').replace(/\/$/, '');
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ozono2026';
const exportPath =
  process.argv[2] ||
  path.join(__dirname, '..', 'data', 'catalog-export.json');

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

async function main() {
  if (!fs.existsSync(exportPath)) {
    throw new Error(`No existe el export: ${exportPath}`);
  }

  const snapshot = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
  const products = snapshot.products || [];
  const brands = snapshot.brands || [];
  const promotions = snapshot.promotions || [];

  console.log(`[restore] API: ${API_URL}`);
  console.log(`[restore] Export: ${exportPath}`);
  console.log(`[restore] ${products.length} productos, ${brands.length} marcas, ${promotions.length} promos`);

  const login = await api('POST', '/api/auth/login', {
    body: { username: ADMIN_USER, password: ADMIN_PASSWORD },
  });
  const token = login.token;
  if (!token) throw new Error('Login sin token');
  console.log('[restore] Login OK');

  const existing = await api('GET', '/api/products/admin/all', { token });
  if (existing.length) {
    const ids = existing.map((p) => p.id);
    // borrar en lotes
    for (let i = 0; i < ids.length; i += 50) {
      const chunk = ids.slice(i, i + 50);
      await api('POST', '/api/products/admin/bulk', {
        token,
        body: { ids: chunk, action: 'delete' },
      });
    }
    console.log(`[restore] Borrados ${ids.length} productos (seed/viejos)`);
  } else {
    console.log('[restore] No había productos previos');
  }

  const promoRes = await api('GET', '/api/promotions/admin/all', { token });
  const promoItems = promoRes.promotions || [];
  for (const promo of promoItems) {
    if (promo?.id == null) continue;
    await api('DELETE', `/api/promotions/admin/${promo.id}`, { token });
  }
  if (promoItems.length) {
    console.log(`[restore] Borradas ${promoItems.length} promociones`);
  }

  for (const brand of brands) {
    await api('POST', '/api/brands/admin', {
      token,
      body: {
        name: brand.name,
        slug: brand.slug,
        sortOrder: brand.sortOrder ?? 0,
      },
    }).catch(async (err) => {
      // si ya existe, ignorar
      if (!String(err.message).includes('409') && !String(err.message).includes('existe')) {
        console.warn(`[restore] marca ${brand.name}: ${err.message}`);
      }
    });
  }
  console.log(`[restore] Marcas OK (${brands.length})`);

  let created = 0;
  for (const p of products) {
    await api('POST', '/api/products/admin', {
      token,
      body: {
        name: p.name,
        brand: p.brand,
        brandSlug: p.brandSlug,
        productType: p.productType,
        price: p.price,
        category: p.category,
        gender: p.gender ?? null,
        rating: p.rating ?? 4.6,
        reviewCount: p.reviewCount ?? 0,
        description: p.description ?? '',
        image: p.image,
        hoverImage: p.hoverImage ?? p.image,
        gallery: p.gallery ?? [],
        sizes: p.sizes ?? [],
        colors: p.colors ?? [],
        active: p.active !== false,
      },
    });
    created += 1;
    if (created % 25 === 0) console.log(`[restore] Productos: ${created}/${products.length}`);
  }
  console.log(`[restore] Productos creados: ${created}`);

  if (snapshot.promotionsSettings) {
    await api('PUT', '/api/promotions/admin/settings', {
      token,
      body: snapshot.promotionsSettings,
    });
    console.log('[restore] Settings de promociones OK');
  }

  for (const promo of promotions) {
    await api('POST', '/api/promotions/admin', {
      token,
      body: {
        title: promo.title,
        subtitle: promo.subtitle ?? '',
        badge: promo.badge ?? '',
        ctaText: promo.ctaText ?? 'Ver más',
        ctaLink: promo.ctaLink ?? '/',
        image: promo.image ?? '',
        priceBefore: promo.priceBefore ?? null,
        priceNow: promo.priceNow ?? null,
        sortOrder: promo.sortOrder ?? 0,
        active: promo.active !== false,
      },
    });
  }
  console.log(`[restore] Promociones creadas: ${promotions.length}`);

  const health = await api('GET', '/api/health');
  console.log('[restore] Health:', health);
  console.log('[restore] Listo.');
}

main().catch((err) => {
  console.error('[restore] ERROR:', err.message);
  process.exit(1);
});

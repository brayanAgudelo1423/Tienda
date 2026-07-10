import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

let pool;
let initialized = false;

function getPool() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL no está configurada. En Render, vincula una base PostgreSQL al servicio.'
    );
  }

  pool = new Pool({
    connectionString,
    ssl: process.env.PGSSL === 'false' ? false : { rejectUnauthorized: false },
    max: 10,
  });

  pool.on('error', (err) => {
    console.error('[OZONO] Error inesperado en PostgreSQL:', err.message);
  });

  if (process.env.NODE_ENV === 'production') {
    console.log('[OZONO] PostgreSQL conectado');
  }

  return pool;
}

function parseJson(value, fallback = []) {
  if (value == null) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function saleStatusForPayment(paymentMethod) {
  if (paymentMethod === 'contraentrega') return 'confirmada';
  if (paymentMethod === 'payu-online' || paymentMethod === 'payu-card' || paymentMethod === 'pse') {
    return 'pendiente_pago';
  }
  return 'confirmada';
}

function rowToProduct(row) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    brandSlug: row.brand_slug,
    productType: row.product_type,
    price: Number(row.price),
    category: row.category,
    gender: row.gender ?? null,
    rating: Number(row.rating),
    reviewCount: Number(row.review_count),
    description: row.description,
    image: row.image,
    hoverImage: row.hover_image || row.image,
    gallery: parseJson(row.gallery, []),
    sizes: parseJson(row.sizes, []),
    colors: parseJson(row.colors, []),
    active: Boolean(row.active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function saleRowToObject(row) {
  return {
    id: row.id,
    total: Number(row.total),
    subtotal: Number(row.subtotal),
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    customerCity: row.customer_city,
    customerAddress: row.customer_address,
    items: parseJson(row.items, []),
    paymentMethod: row.payment_method ?? null,
    payuReference: row.payu_reference ?? null,
    payuTransactionId: row.payu_transaction_id ?? null,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function initDatabase() {
  if (initialized) return;

  const db = getPool();

  await db.query(`
    CREATE TABLE IF NOT EXISTS brands (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      brand_slug TEXT NOT NULL,
      product_type TEXT NOT NULL DEFAULT 'Producto',
      price INTEGER NOT NULL,
      category TEXT NOT NULL DEFAULT 'Moda',
      gender TEXT,
      rating REAL NOT NULL DEFAULT 4.6,
      review_count INTEGER NOT NULL DEFAULT 0,
      description TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL,
      hover_image TEXT,
      gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
      sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
      colors JSONB NOT NULL DEFAULT '[]'::jsonb,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sales (
      id SERIAL PRIMARY KEY,
      total INTEGER NOT NULL,
      subtotal INTEGER NOT NULL,
      customer_name TEXT,
      customer_email TEXT,
      customer_phone TEXT,
      customer_city TEXT,
      customer_address TEXT,
      items JSONB NOT NULL,
      payment_method TEXT,
      payu_reference TEXT,
      payu_transaction_id TEXT,
      status TEXT NOT NULL DEFAULT 'confirmada',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS promotions (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL DEFAULT '',
      badge TEXT NOT NULL DEFAULT '',
      cta_text TEXT NOT NULL DEFAULT 'Ver más',
      cta_link TEXT NOT NULL DEFAULT '/',
      image TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await ensureAdminUser();
  await ensureDefaultPromotions();
  initialized = true;
  console.log('[OZONO] Esquema PostgreSQL listo');
}

async function ensureAdminUser() {
  const db = getPool();
  const { rows } = await db.query('SELECT COUNT(*)::int AS c FROM admin_users');
  if (rows[0].c > 0) return;

  const username = process.env.ADMIN_USER || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'ozono2026';
  const hash = bcrypt.hashSync(password, 10);
  await db.query('INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)', [
    username,
    hash,
  ]);
  console.log(`Admin creado: usuario "${username}"`);
}

function rowToPromotion(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? '',
    badge: row.badge ?? '',
    ctaText: row.cta_text,
    ctaLink: row.cta_link,
    image: row.image ?? '',
    sortOrder: row.sort_order,
    active: Boolean(row.active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function ensureDefaultPromotions() {
  const db = getPool();
  const { rows } = await db.query('SELECT COUNT(*)::int AS c FROM promotions');
  if (rows[0].c > 0) return;

  const defaults = [
    {
      title: 'Lociones originales',
      subtitle: 'Selección premium con descuento especial esta semana',
      badge: '-20%',
      sortOrder: 0,
    },
    {
      title: 'Envío gratis',
      subtitle: 'En compras superiores a $200.000 COP',
      badge: 'ENVÍO',
      sortOrder: 1,
    },
    {
      title: 'Novedades de temporada',
      subtitle: 'Piezas limitadas en moda y accesorios',
      badge: 'NUEVO',
      sortOrder: 2,
    },
  ];

  for (const promo of defaults) {
    await db.query(
      `INSERT INTO promotions (title, subtitle, badge, cta_text, cta_link, sort_order, active)
       VALUES ($1, $2, $3, '', '', $4, TRUE)`,
      [promo.title, promo.subtitle, promo.badge, promo.sortOrder]
    );
  }
  console.log(`[OZONO] ${defaults.length} promociones iniciales creadas`);
}

export async function getActivePromotions() {
  const { rows } = await getPool().query(
    'SELECT * FROM promotions WHERE active = TRUE ORDER BY sort_order, id'
  );
  return rows.map(rowToPromotion);
}

export async function getAllPromotions() {
  const { rows } = await getPool().query(
    'SELECT * FROM promotions ORDER BY sort_order, id'
  );
  return rows.map(rowToPromotion);
}

export async function getPromotionById(id) {
  const { rows } = await getPool().query('SELECT * FROM promotions WHERE id = $1', [id]);
  return rows[0] ? rowToPromotion(rows[0]) : null;
}

export async function createPromotion(data) {
  const { rows } = await getPool().query(
    `INSERT INTO promotions (title, subtitle, badge, cta_text, cta_link, image, sort_order, active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [
      data.title,
      data.subtitle ?? '',
      data.badge ?? '',
      data.ctaText ?? 'Ver más',
      data.ctaLink ?? '/',
      data.image || null,
      data.sortOrder ?? 0,
      data.active !== false,
    ]
  );
  return getPromotionById(rows[0].id);
}

export async function updatePromotion(id, data) {
  const existing = await getPromotionById(id);
  if (!existing) return null;

  await getPool().query(
    `UPDATE promotions SET
      title = $1, subtitle = $2, badge = $3, cta_text = $4, cta_link = $5,
      image = $6, sort_order = $7, active = $8, updated_at = NOW()
    WHERE id = $9`,
    [
      data.title ?? existing.title,
      data.subtitle !== undefined ? data.subtitle : existing.subtitle,
      data.badge !== undefined ? data.badge : existing.badge,
      data.ctaText ?? existing.ctaText,
      data.ctaLink ?? existing.ctaLink,
      data.image !== undefined ? data.image || null : existing.image || null,
      data.sortOrder !== undefined ? data.sortOrder : existing.sortOrder,
      data.active === undefined ? existing.active : Boolean(data.active),
      id,
    ]
  );
  return getPromotionById(id);
}

export async function deletePromotion(id) {
  const result = await getPool().query('DELETE FROM promotions WHERE id = $1', [id]);
  return result.rowCount > 0;
}

export async function getActiveProducts() {
  const { rows } = await getPool().query(
    'SELECT * FROM products WHERE active = TRUE ORDER BY id DESC'
  );
  return rows.map(rowToProduct);
}

export async function getAllProducts() {
  const { rows } = await getPool().query('SELECT * FROM products ORDER BY id DESC');
  return rows.map(rowToProduct);
}

export async function getProductById(id) {
  const { rows } = await getPool().query('SELECT * FROM products WHERE id = $1', [id]);
  return rows[0] ? rowToProduct(rows[0]) : null;
}

export async function createProduct(data) {
  const gallery = Array.isArray(data.gallery) ? data.gallery : [];
  const sizes = data.sizes ?? [];
  const colors = data.colors ?? [];

  const { rows } = await getPool().query(
    `INSERT INTO products (
      name, brand, brand_slug, product_type, price, category, gender,
      rating, review_count, description, image, hover_image, gallery, sizes, colors, active
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb, $14::jsonb, $15::jsonb, $16)
    RETURNING id`,
    [
      data.name,
      data.brand,
      data.brandSlug,
      data.productType,
      data.price,
      data.category,
      data.gender ?? null,
      data.rating ?? 4.6,
      data.reviewCount ?? 0,
      data.description ?? '',
      data.image,
      data.hoverImage ?? data.image,
      JSON.stringify(gallery),
      JSON.stringify(sizes),
      JSON.stringify(colors),
      data.active !== false,
    ]
  );

  return getProductById(rows[0].id);
}

export async function updateProduct(id, data) {
  const existing = await getProductById(id);
  if (!existing) return null;

  const gallery = Array.isArray(data.gallery) ? data.gallery : existing.gallery ?? [];
  const sizes = data.sizes ?? existing.sizes;
  const colors = data.colors ?? existing.colors;

  await getPool().query(
    `UPDATE products SET
      name = $1, brand = $2, brand_slug = $3, product_type = $4, price = $5, category = $6, gender = $7,
      rating = $8, review_count = $9, description = $10, image = $11, hover_image = $12,
      gallery = $13::jsonb, sizes = $14::jsonb, colors = $15::jsonb, active = $16, updated_at = NOW()
    WHERE id = $17`,
    [
      data.name ?? existing.name,
      data.brand ?? existing.brand,
      data.brandSlug ?? existing.brandSlug,
      data.productType ?? existing.productType,
      data.price ?? existing.price,
      data.category ?? existing.category,
      data.gender !== undefined ? data.gender : existing.gender,
      data.rating ?? existing.rating,
      data.reviewCount ?? existing.reviewCount,
      data.description ?? existing.description,
      data.image ?? existing.image,
      data.hoverImage ?? existing.hoverImage,
      JSON.stringify(gallery),
      JSON.stringify(sizes),
      JSON.stringify(colors),
      data.active === undefined ? existing.active : Boolean(data.active),
      id,
    ]
  );

  return getProductById(id);
}

export async function deleteProduct(id) {
  const result = await getPool().query('DELETE FROM products WHERE id = $1', [id]);
  return result.rowCount > 0;
}

export async function getBrands() {
  const { rows } = await getPool().query('SELECT * FROM brands ORDER BY sort_order, name');
  return rows;
}

export async function upsertBrand({ name, slug, sortOrder = 0 }) {
  await getPool().query(
    `INSERT INTO brands (name, slug, sort_order) VALUES ($1, $2, $3)
     ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order`,
    [name, slug, sortOrder]
  );
}

export async function createSale(sale) {
  const paymentMethod = sale.paymentMethod ?? null;
  const status = sale.status ?? saleStatusForPayment(paymentMethod);

  const { rows } = await getPool().query(
    `INSERT INTO sales (
      total, subtotal, customer_name, customer_email, customer_phone,
      customer_city, customer_address, items, payment_method, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10)
    RETURNING id`,
    [
      sale.total,
      sale.subtotal,
      sale.customerName ?? null,
      sale.customerEmail ?? null,
      sale.customerPhone ?? null,
      sale.customerCity ?? null,
      sale.customerAddress ?? null,
      JSON.stringify(sale.items),
      paymentMethod,
      status,
    ]
  );

  return getSaleById(rows[0].id);
}

export async function getSaleById(id) {
  const { rows } = await getPool().query('SELECT * FROM sales WHERE id = $1', [id]);
  return rows[0] ? saleRowToObject(rows[0]) : null;
}

export async function getSaleByPayUReference(reference) {
  if (!reference) return null;
  const { rows } = await getPool().query('SELECT * FROM sales WHERE payu_reference = $1', [
    reference,
  ]);
  return rows[0] ? saleRowToObject(rows[0]) : null;
}

export async function updateSalePayment(id, { status, payuReference, payuTransactionId }) {
  const existing = await getSaleById(id);
  if (!existing) return null;

  await getPool().query(
    `UPDATE sales SET
      status = COALESCE($1, status),
      payu_reference = COALESCE($2, payu_reference),
      payu_transaction_id = COALESCE($3, payu_transaction_id)
    WHERE id = $4`,
    [status ?? null, payuReference ?? null, payuTransactionId ?? null, id]
  );

  return getSaleById(id);
}

export async function getSales(limit = 100) {
  const { rows } = await getPool().query(
    'SELECT * FROM sales ORDER BY created_at DESC LIMIT $1',
    [limit]
  );
  return rows.map(saleRowToObject);
}

export async function getSalesStats() {
  const db = getPool();

  const totalsResult = await db.query(`
    SELECT
      COUNT(*)::int AS "totalSales",
      COALESCE(SUM(total), 0)::int AS revenue
    FROM sales
  `);
  const totals = totalsResult.rows[0];

  const salesRows = await db.query('SELECT items FROM sales');
  let itemsSold = 0;
  for (const row of salesRows.rows) {
    const items = parseJson(row.items, []);
    itemsSold += items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }

  const todayResult = await db.query(`
    SELECT COUNT(*)::int AS c, COALESCE(SUM(total), 0)::int AS revenue
    FROM sales
    WHERE created_at::date = CURRENT_DATE
  `);
  const today = todayResult.rows[0];

  const monthResult = await db.query(`
    SELECT COUNT(*)::int AS c, COALESCE(SUM(total), 0)::int AS revenue
    FROM sales
    WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)
  `);
  const month = monthResult.rows[0];

  return {
    totalSales: totals.totalSales,
    revenue: totals.revenue,
    itemsSold,
    todaySales: today.c,
    todayRevenue: today.revenue,
    monthSales: month.c,
    monthRevenue: month.revenue,
  };
}

export async function bulkSetProductsActive(ids, active) {
  if (!ids?.length) return 0;
  const result = await getPool().query(
    `UPDATE products SET active = $1, updated_at = NOW() WHERE id = ANY($2::int[])`,
    [Boolean(active), ids]
  );
  return result.rowCount;
}

export async function bulkDeleteProducts(ids) {
  if (!ids?.length) return 0;
  const result = await getPool().query(`DELETE FROM products WHERE id = ANY($1::int[])`, [ids]);
  return result.rowCount;
}

export async function verifyAdmin(username, password) {
  const { rows } = await getPool().query('SELECT * FROM admin_users WHERE username = $1', [
    username,
  ]);
  const user = rows[0];
  if (!user) return null;
  const ok = bcrypt.compareSync(password, user.password_hash);
  return ok ? { id: user.id, username: user.username } : null;
}

export async function getProductCount() {
  const { rows } = await getPool().query('SELECT COUNT(*)::int AS c FROM products');
  return rows[0].c;
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    initialized = false;
  }
}

export default { initDatabase, closePool, getPool };

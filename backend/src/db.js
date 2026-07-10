import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'ozono.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    sizes TEXT NOT NULL DEFAULT '[]',
    colors TEXT NOT NULL DEFAULT '[]',
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total INTEGER NOT NULL,
    subtotal INTEGER NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    customer_city TEXT,
    customer_address TEXT,
    items TEXT NOT NULL,
    payment_method TEXT,
    payu_reference TEXT,
    payu_transaction_id TEXT,
    status TEXT NOT NULL DEFAULT 'confirmada',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );
`);

function ensureSalesColumns() {
  const columns = db.prepare('PRAGMA table_info(sales)').all();
  const names = new Set(columns.map((col) => col.name));
  if (!names.has('payment_method')) {
    db.exec('ALTER TABLE sales ADD COLUMN payment_method TEXT');
  }
  if (!names.has('payu_reference')) {
    db.exec('ALTER TABLE sales ADD COLUMN payu_reference TEXT');
  }
  if (!names.has('payu_transaction_id')) {
    db.exec('ALTER TABLE sales ADD COLUMN payu_transaction_id TEXT');
  }
}

function ensureProductColumns() {
  const columns = db.prepare('PRAGMA table_info(products)').all();
  if (!columns.some((col) => col.name === 'gender')) {
    db.exec('ALTER TABLE products ADD COLUMN gender TEXT');
  }
}

function saleStatusForPayment(paymentMethod) {
  if (paymentMethod === 'contraentrega') return 'confirmada';
  if (paymentMethod === 'payu-card' || paymentMethod === 'pse') return 'pendiente_pago';
  return 'confirmada';
}

function ensureAdminUser() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM admin_users').get().c;
  if (count > 0) return;

  const username = process.env.ADMIN_USER || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'ozono2026';
  const hash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run(
    username,
    hash
  );
  console.log(`Admin creado: usuario "${username}"`);
}

function rowToProduct(row) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    brandSlug: row.brand_slug,
    productType: row.product_type,
    price: row.price,
    category: row.category,
    gender: row.gender ?? null,
    rating: row.rating,
    reviewCount: row.review_count,
    description: row.description,
    image: row.image,
    hoverImage: row.hover_image || row.image,
    sizes: JSON.parse(row.sizes),
    colors: JSON.parse(row.colors),
    active: Boolean(row.active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getActiveProducts() {
  const rows = db
    .prepare('SELECT * FROM products WHERE active = 1 ORDER BY id DESC')
    .all();
  return rows.map(rowToProduct);
}

export function getAllProducts() {
  const rows = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
  return rows.map(rowToProduct);
}

export function getProductById(id) {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  return row ? rowToProduct(row) : null;
}

export function createProduct(data) {
  const result = db
    .prepare(
      `INSERT INTO products (
        name, brand, brand_slug, product_type, price, category, gender,
        rating, review_count, description, image, hover_image, sizes, colors, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
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
      JSON.stringify(data.sizes ?? []),
      JSON.stringify(data.colors ?? []),
      data.active === false ? 0 : 1
    );
  return getProductById(result.lastInsertRowid);
}

export function updateProduct(id, data) {
  const existing = getProductById(id);
  if (!existing) return null;

  db.prepare(
    `UPDATE products SET
      name = ?, brand = ?, brand_slug = ?, product_type = ?, price = ?, category = ?, gender = ?,
      rating = ?, review_count = ?, description = ?, image = ?, hover_image = ?,
      sizes = ?, colors = ?, active = ?, updated_at = datetime('now')
    WHERE id = ?`
  ).run(
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
    JSON.stringify(data.sizes ?? existing.sizes),
    JSON.stringify(data.colors ?? existing.colors),
    data.active === undefined ? (existing.active ? 1 : 0) : data.active ? 1 : 0,
    id
  );
  return getProductById(id);
}

export function deleteProduct(id) {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return result.changes > 0;
}

export function getBrands() {
  return db.prepare('SELECT * FROM brands ORDER BY sort_order, name').all();
}

export function upsertBrand({ name, slug, sortOrder = 0 }) {
  db.prepare(
    `INSERT INTO brands (name, slug, sort_order) VALUES (?, ?, ?)
     ON CONFLICT(slug) DO UPDATE SET name = excluded.name, sort_order = excluded.sort_order`
  ).run(name, slug, sortOrder);
}

function saleRowToObject(row) {
  return {
    id: row.id,
    total: row.total,
    subtotal: row.subtotal,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    customerCity: row.customer_city,
    customerAddress: row.customer_address,
    items: JSON.parse(row.items),
    paymentMethod: row.payment_method ?? null,
    payuReference: row.payu_reference ?? null,
    payuTransactionId: row.payu_transaction_id ?? null,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function createSale(sale) {
  const paymentMethod = sale.paymentMethod ?? null;
  const status = sale.status ?? saleStatusForPayment(paymentMethod);

  const result = db
    .prepare(
      `INSERT INTO sales (
        total, subtotal, customer_name, customer_email, customer_phone,
        customer_city, customer_address, items, payment_method, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      sale.total,
      sale.subtotal,
      sale.customerName ?? null,
      sale.customerEmail ?? null,
      sale.customerPhone ?? null,
      sale.customerCity ?? null,
      sale.customerAddress ?? null,
      JSON.stringify(sale.items),
      paymentMethod,
      status
    );
  return getSaleById(result.lastInsertRowid);
}

export function getSaleById(id) {
  const row = db.prepare('SELECT * FROM sales WHERE id = ?').get(id);
  if (!row) return null;
  return saleRowToObject(row);
}

export function getSaleByPayUReference(reference) {
  if (!reference) return null;
  const row = db.prepare('SELECT * FROM sales WHERE payu_reference = ?').get(reference);
  if (!row) return null;
  return saleRowToObject(row);
}

export function updateSalePayment(id, { status, payuReference, payuTransactionId }) {
  const existing = getSaleById(id);
  if (!existing) return null;

  db.prepare(
    `UPDATE sales SET
      status = COALESCE(?, status),
      payu_reference = COALESCE(?, payu_reference),
      payu_transaction_id = COALESCE(?, payu_transaction_id)
    WHERE id = ?`
  ).run(
    status ?? null,
    payuReference ?? null,
    payuTransactionId ?? null,
    id
  );

  return getSaleById(id);
}

export function getSales(limit = 100) {
  const rows = db
    .prepare('SELECT * FROM sales ORDER BY created_at DESC LIMIT ?')
    .all(limit);
  return rows.map((row) => saleRowToObject(row));
}

export function getSalesStats() {
  const totals = db
    .prepare(
      `SELECT
        COUNT(*) AS totalSales,
        COALESCE(SUM(total), 0) AS revenue
      FROM sales`
    )
    .get();

  const salesRows = db.prepare('SELECT items FROM sales').all();
  let itemsSold = 0;
  for (const row of salesRows) {
    const items = JSON.parse(row.items);
    itemsSold += items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }

  const today = db
    .prepare(
      `SELECT COUNT(*) AS c, COALESCE(SUM(total), 0) AS revenue
       FROM sales WHERE date(created_at) = date('now', 'localtime')`
    )
    .get();

  const month = db
    .prepare(
      `SELECT COUNT(*) AS c, COALESCE(SUM(total), 0) AS revenue
       FROM sales
       WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now', 'localtime')`
    )
    .get();

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

export function verifyAdmin(username, password) {
  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
  if (!user) return null;
  const ok = bcrypt.compareSync(password, user.password_hash);
  return ok ? { id: user.id, username: user.username } : null;
}

export function getProductCount() {
  return db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
}

ensureProductColumns();
ensureSalesColumns();
ensureAdminUser();

export default db;

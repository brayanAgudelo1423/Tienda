import { assetUrl, getPublicBase, normalizeStoreImagePath } from '../utils/assets.js';

const PRODUCTION_API = 'https://tienda-1-7f8f.onrender.com';
const API_BASE = (
  import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PRODUCTION_API : '')
).replace(/\/$/, '');

function connectionHint() {
  if (import.meta.env.DEV) {
    return 'Asegúrate de tener el backend corriendo: npm --prefix backend run dev';
  }
  return 'Verifica https://tienda-1-7f8f.onrender.com/api/health y espera un minuto si el servidor estaba dormido.';
}

function getAdminToken() {
  return localStorage.getItem('ozono_admin_token');
}

async function request(path, options = {}) {
  const headers = { ...options.headers };
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (options.auth) {
    const token = getAdminToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      body:
        options.body instanceof FormData || options.body === undefined
          ? options.body
          : JSON.stringify(options.body),
    });
  } catch {
    throw new Error(`No se pudo conectar con el servidor. ${connectionHint()}`);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 404 && path.startsWith('/api/')) {
      throw new Error(
        'No se encontró la API. Verifica VITE_API_URL en GitHub Actions o espera el redeploy.'
      );
    }
    throw new Error(data.error || `Error en la solicitud (${res.status})`);
  }
  return data;
}

export const api = {
  getProducts: () => request('/api/products'),
  getBrands: () => request('/api/brands'),
  getPromotions: () => request('/api/promotions'),

  login: (username, password) =>
    request('/api/auth/login', { method: 'POST', body: { username, password } }),

  getMe: () => request('/api/auth/me', { auth: true }),

  getAdminProducts: () => request('/api/products/admin/all', { auth: true }),

  createProduct: (product) =>
    request('/api/products/admin', { method: 'POST', body: product, auth: true }),

  updateProduct: (id, product) =>
    request(`/api/products/admin/${id}`, { method: 'PUT', body: product, auth: true }),

  toggleProduct: (id) =>
    request(`/api/products/admin/${id}/toggle`, { method: 'PATCH', auth: true }),

  deleteProduct: (id) =>
    request(`/api/products/admin/${id}`, { method: 'DELETE', auth: true }),

  bulkProducts: (ids, action) =>
    request('/api/products/admin/bulk', { method: 'POST', body: { ids, action }, auth: true }),

  getAdminPromotions: () => request('/api/promotions/admin/all', { auth: true }),

  updatePromotionsSettings: (settings) =>
    request('/api/promotions/admin/settings', { method: 'PUT', body: settings, auth: true }),

  togglePromotionsSection: () =>
    request('/api/promotions/admin/settings/toggle', { method: 'PATCH', auth: true }),

  createPromotion: (promotion) =>
    request('/api/promotions/admin', { method: 'POST', body: promotion, auth: true }),

  updatePromotion: (id, promotion) =>
    request(`/api/promotions/admin/${id}`, { method: 'PUT', body: promotion, auth: true }),

  togglePromotion: (id) =>
    request(`/api/promotions/admin/${id}/toggle`, { method: 'PATCH', auth: true }),

  deletePromotion: (id) =>
    request(`/api/promotions/admin/${id}`, { method: 'DELETE', auth: true }),

  uploadImage: (file) => {
    const form = new FormData();
    form.append('image', file);
    return request('/api/upload', { method: 'POST', body: form, auth: true });
  },

  createSale: (sale) => request('/api/sales', { method: 'POST', body: sale }),

  createPayUCheckout: (payload) =>
    request('/api/payments/checkout', { method: 'POST', body: payload }),

  checkHealth: () => request('/api/health'),

  getSales: (limit = 100) =>
    request(`/api/sales/admin?limit=${limit}`, { auth: true }),

  getSalesStats: () => request('/api/sales/admin/stats', { auth: true }),
};

export function mediaUrl(path) {
  if (!path) return '';

  if (path.startsWith('http')) {
    if (path.includes('/images/')) return normalizeStoreImagePath(path);
    return path;
  }

  const base = getPublicBase();
  if (base !== '/' && path.startsWith(base)) return path;

  if (path.startsWith('/uploads') || path.startsWith('uploads')) {
    const uploadsPath = path.startsWith('/') ? path : `/${path}`;
    return API_BASE ? `${API_BASE}${uploadsPath}` : assetUrl(uploadsPath.replace(/^\//, ''));
  }

  if (path.includes('/images/') || path.startsWith('/images') || path.startsWith('images')) {
    return normalizeStoreImagePath(path);
  }

  return assetUrl(path.startsWith('/') ? path.slice(1) : path);
}

export function setAdminToken(token) {
  if (token) localStorage.setItem('ozono_admin_token', token);
  else localStorage.removeItem('ozono_admin_token');
}

export function submitPayUForm({ action, fields }) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = action;
  form.style.display = 'none';

  Object.entries(fields).forEach(([name, value]) => {
    if (value === undefined || value === null || value === '') return;
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

const API_BASE = import.meta.env.VITE_API_URL || '';

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

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body:
      options.body instanceof FormData || options.body === undefined
        ? options.body
        : JSON.stringify(options.body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Error en la solicitud');
  }
  return data;
}

export const api = {
  getProducts: () => request('/api/products'),
  getBrands: () => request('/api/brands'),

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

  uploadImage: (file) => {
    const form = new FormData();
    form.append('image', file);
    return request('/api/upload', { method: 'POST', body: form, auth: true });
  },

  createSale: (sale) => request('/api/sales', { method: 'POST', body: sale }),

  getSales: (limit = 100) =>
    request(`/api/sales/admin?limit=${limit}`, { auth: true }),

  getSalesStats: () => request('/api/sales/admin/stats', { auth: true }),
};

export function mediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
}

export function setAdminToken(token) {
  if (token) localStorage.setItem('ozono_admin_token', token);
  else localStorage.removeItem('ozono_admin_token');
}

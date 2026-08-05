import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAdminToken, wakeAdminApi } from '../api/client';
import BrandLogo from '../components/BrandLogo';
import './admin.css';

async function loginWithRetry(username, password) {
  let lastError;
  for (const delay of [0, 1500, 4000]) {
    if (delay > 0) await new Promise((r) => setTimeout(r, delay));
    try {
      return await api.login(username, password);
    } catch (err) {
      lastError = err;
      const msg = String(err.message || '');
      const retryable =
        msg.includes('No se pudo conectar') ||
        msg.includes('servidor estaba dormido') ||
        msg.includes('Failed to fetch');
      if (!retryable) throw err;
    }
  }
  throw lastError;
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.getElementById('boot-splash')?.remove();
    wakeAdminApi();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await wakeAdminApi();
      const { token } = await loginWithRetry(username, password);
      setAdminToken(token);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <BrandLogo variant="admin" asLink={false} className="admin-login-brand" />
        <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Panel de administración — Colombia
        </p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="user">Usuario</label>
            <input
              id="user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="pass">Contraseña</label>
            <input
              id="pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p style={{ color: '#b91c1c', fontSize: '0.9rem' }}>{error}</p>}
          <button type="submit" className="btn" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Entrando…' : 'Iniciar sesión'}
          </button>
        </form>

        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '1rem' }}>
          Gestiona productos, fotos y ventas desde tu celular.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

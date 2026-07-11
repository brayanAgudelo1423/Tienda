import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAdminToken } from '../api/client';
import { BRAND } from '../config/brand';
import './admin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await api.login(username, password);
      setAdminToken(token);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="brand-logo" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          {BRAND.name}
        </h1>
        <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
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

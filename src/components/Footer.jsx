import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, X } from 'lucide-react';
import { api, setAdminToken } from '../api/client';
import { BRAND } from '../config/brand';

const Footer = () => {
  const navigate = useNavigate();
  const hasToken = Boolean(localStorage.getItem('ozono_admin_token'));
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const openAdmin = () => {
    if (hasToken) {
      navigate('/admin');
      return;
    }
    setError('');
    setShowLogin(true);
  };

  const closeLogin = () => {
    setShowLogin(false);
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await api.login(username, password);
      setAdminToken(token);
      closeLogin();
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        <div style={styles.col}>
          <h2 className="brand-logo" style={styles.logo}>
            {BRAND.name}
          </h2>
          <p style={styles.desc}>Moda deportiva y urbana de alto rendimiento. 100% original.</p>
        </div>
        <div style={styles.col}>
          <h4 style={styles.title}>AYUDA</h4>
          <ul style={styles.list}>
            <li style={styles.linkItem} onClick={openAdmin} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openAdmin()}>
              {BRAND.short}
            </li>
            <li style={{ cursor: 'pointer' }}>Estado del pedido</li>
            <li style={{ cursor: 'pointer' }}>Envío y entrega</li>
            <li style={{ cursor: 'pointer' }}>Devoluciones</li>
            <li style={{ cursor: 'pointer' }}>Opciones de pago</li>
            <li><Link to="/contacto" style={{ color: 'var(--color-secondary)', fontWeight: 600, textDecoration: 'none' }}>📞 Contacto & Ayuda</Link></li>
          </ul>
        </div>
        <div style={styles.col}>
          <h4 style={styles.title}>ACERCA DE {BRAND.short}</h4>
          <ul style={styles.list}>
            <li style={{ cursor: 'pointer' }}>Noticias</li>
            <li style={{ cursor: 'pointer' }}>Empleo</li>
            <li style={{ cursor: 'pointer' }}>Sostenibilidad</li>
          </ul>
        </div>
        <div style={styles.col}>
          <div style={styles.social}>
            <a href="https://wa.me/573009902243" target="_blank" rel="noopener noreferrer" title="WhatsApp 300 990 2243">
              <Phone size={24} style={{ cursor: 'pointer', color: '#25D366' }} />
            </a>
            <a href="https://www.instagram.com/_ozono_3?igsh=MTJkYTNrNnhhaDRsaQ==" target="_blank" rel="noopener noreferrer" title="Instagram @_ozono_3">
              <Mail size={24} style={{ cursor: 'pointer', color: 'var(--color-primary)' }} />
            </a>
            <MapPin size={24} style={{ cursor: 'pointer', color: 'var(--color-primary)' }} />
          </div>
          <Link to="/politica-de-privacidad" style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', textDecoration: 'underline', marginTop: '0.5rem' }}>
            Política de Privacidad
          </Link>
        </div>
      </div>
      <div style={styles.copy}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <span>&copy; {new Date().getFullYear()} {BRAND.legal}. Todos los derechos reservados.</span>
          <span>Pagos seguros procesados por <strong>PayU</strong> · <Link to="/politica-de-privacidad" style={{ color: 'var(--color-secondary)', textDecoration: 'underline' }}>Política de Privacidad</Link></span>
        </div>
      </div>

      {showLogin && (
        <div style={styles.overlay} onClick={closeLogin} role="presentation">
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="vm-login-title"
            aria-modal="true"
          >
            <button type="button" style={styles.closeBtn} onClick={closeLogin} aria-label="Cerrar">
              <X size={20} />
            </button>
            <h2 id="vm-login-title" className="brand-logo" style={styles.modalTitle}>
              {BRAND.name}
            </h2>
            <p style={styles.modalDesc}>Panel de administración</p>
            <form style={styles.adminForm} onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                style={styles.adminInput}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                style={styles.adminInput}
              />
              {error && <p style={styles.adminError}>{error}</p>}
              <button type="submit" className="btn" disabled={loading} style={styles.adminBtn}>
                {loading ? 'Entrando…' : 'Ingresar al admin'}
              </button>
            </form>
            <p style={styles.adminHint}>Gestiona productos y ventas desde tu celular.</p>
          </div>
        </div>
      )}
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-primary)',
    paddingTop: '4rem',
    borderTop: '1px solid var(--color-bg-alt)',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '4rem',
    marginBottom: '3rem',
  },
  col: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  logo: { fontSize: '1.75rem' },
  desc: { color: 'var(--color-text-light)', fontSize: '0.9rem', lineHeight: '1.5' },
  title: {
    fontSize: '0.9rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    fontFamily: 'var(--font-body)',
  },
  list: {
    color: 'var(--color-text-light)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  linkItem: { cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600 },
  social: { display: 'flex', gap: '1.5rem', justifyContent: 'flex-start' },
  copy: {
    padding: '1.5rem 2rem',
    borderTop: '1px solid var(--color-bg-alt)',
    fontSize: '0.75rem',
    color: 'var(--color-text-light)',
    backgroundColor: 'var(--color-bg)',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    zIndex: 1000,
  },
  modal: {
    position: 'relative',
    width: '100%',
    maxWidth: '380px',
    background: '#fff',
    borderRadius: '16px',
    padding: '2rem 1.5rem',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-light)',
    padding: '0.25rem',
  },
  modalTitle: { fontSize: '1.5rem', marginBottom: '0.25rem' },
  modalDesc: { color: 'var(--color-text-light)', fontSize: '0.9rem', marginBottom: '1.25rem' },
  adminForm: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  adminInput: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.9rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: '#fff',
    color: 'var(--color-primary)',
  },
  adminBtn: { width: '100%', padding: '0.75rem', fontSize: '0.9rem', marginTop: '0.25rem' },
  adminError: { color: '#b91c1c', fontSize: '0.85rem', margin: 0 },
  adminHint: {
    fontSize: '0.8rem',
    color: 'var(--color-text-light)',
    marginTop: '1rem',
    marginBottom: 0,
    textAlign: 'center',
  },
};

export default Footer;

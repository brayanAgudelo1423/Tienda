import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Mail, MapPin, X } from 'lucide-react';
import { api, setAdminToken } from '../api/client';
import { BRAND } from '../config/brand';
import BrandLogo from './BrandLogo';

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
    <footer className="site-footer">
      <div className="container site-footer-main">
        <div className="site-footer-brand">
          <BrandLogo variant="footer" />
          <p className="site-footer-tagline">
            Moda deportiva y urbana de alto rendimiento. 100% original.
          </p>
        </div>

        <div className="site-footer-columns">
          <div className="site-footer-col">
            <h4 className="site-footer-heading">Ayuda</h4>
            <ul className="site-footer-links">
              <li>
                <Link to="/rastrear-pedido">Estado del pedido</Link>
              </li>
              <li>
                <Link to="/contacto">Envío y entrega</Link>
              </li>
              <li>
                <Link to="/contacto">Devoluciones</Link>
              </li>
              <li>
                <Link to="/checkout">Opciones de pago</Link>
              </li>
              <li>
                <Link to="/contacto" className="site-footer-link-accent">
                  Contacto &amp; Ayuda
                </Link>
              </li>
            </ul>
          </div>

          <div className="site-footer-col">
            <h4 className="site-footer-heading">Acerca de {BRAND.short}</h4>
            <ul className="site-footer-links">
              <li>
                <button type="button" className="site-footer-admin-btn" onClick={openAdmin}>
                  Panel {BRAND.short}
                </button>
              </li>
              <li>
                <Link to="/promociones">Promociones</Link>
              </li>
              <li>
                <Link to="/lociones">Lociones originales</Link>
              </li>
            </ul>
          </div>

          <div className="site-footer-col site-footer-col-contact">
            <h4 className="site-footer-heading">Contáctanos</h4>
            <div className="site-footer-social">
              <a
                href="https://wa.me/573009902243"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp 300 990 2243"
                className="site-footer-social-link site-footer-social-wa"
              >
                <Phone size={20} />
              </a>
              <a
                href="https://www.instagram.com/_ozono_3?igsh=MTJkYTNrNnhhaDRsaQ=="
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="site-footer-social-link site-footer-social-ig"
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-8 3.999 3.999 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z" />
                </svg>
              </a>
              <a
                href="mailto:contacto@virtusmonaco.store"
                title="Correo"
                className="site-footer-social-link"
              >
                <Mail size={20} />
              </a>
              <span className="site-footer-social-link site-footer-social-static" title="Colombia">
                <MapPin size={20} />
              </span>
            </div>
            <Link to="/politica-de-privacidad" className="site-footer-legal">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="container site-footer-bottom-inner">
          <span>
            &copy; {new Date().getFullYear()} {BRAND.legal}. Todos los derechos reservados.
          </span>
          <span className="site-footer-payu">
            Pagos seguros con <strong>PayU</strong>
          </span>
        </div>
      </div>

      {showLogin && (
        <div className="site-footer-modal-overlay" onClick={closeLogin} role="presentation">
          <div
            className="site-footer-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="vm-login-title"
            aria-modal="true"
          >
            <div id="vm-login-title" className="visually-hidden">{BRAND.name} — Admin</div>
            <button type="button" className="site-footer-modal-close" onClick={closeLogin} aria-label="Cerrar">
              <X size={20} />
            </button>
            <BrandLogo variant="admin" asLink={false} className="site-footer-modal-brand" />
            <p className="site-footer-modal-desc">Panel de administración</p>
            <form className="site-footer-modal-form" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              {error && <p className="site-footer-modal-error">{error}</p>}
              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Entrando…' : 'Ingresar al admin'}
              </button>
            </form>
            <p className="site-footer-modal-hint">Gestiona productos y ventas desde tu celular.</p>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';

const INSTAGRAM_URL = 'https://www.instagram.com/virtusmonaco_?igsh=eG9taG5yNWpwNWY1&utm_source=qr';

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
import { BRAND } from '../config/brand';
import BrandLogo from './BrandLogo';

const Footer = () => {
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
                <WhatsAppIcon />
              </a>
              <a
                href={INSTAGRAM_URL}
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
            </div>
            <p className="site-footer-location">
              <MapPin size={16} aria-hidden="true" />
              Colombia
            </p>
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
            Pagos seguros con <strong>Mercado Pago</strong>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';

/** Variantes con animación de giro suave (solo navegación principal). */
const SPIN_VARIANTS = new Set(['header', 'utility', 'drawer']);

/** Variantes que muestran "VM" junto al logo. */
const MARK_VARIANTS = new Set(['header', 'utility', 'drawer', 'admin-bar']);

const BrandLogo = ({
  variant = 'header',
  to = '/',
  className = '',
  asLink = true,
  onClick,
}) => {
  const spin = SPIN_VARIANTS.has(variant);
  const showMark = MARK_VARIANTS.has(variant);

  const content = (
    <span className={`brand-logo-unit brand-logo-unit--${variant} ${className}`.trim()}>
      <span className={`brand-logo-visual ${spin ? 'brand-logo-visual--spin' : ''}`}>
        <img
          src={BRAND.logo}
          alt={BRAND.logoAlt}
          className={`brand-logo-img brand-logo-img--${variant}`}
          width={variant === 'header' ? 140 : undefined}
          height={variant === 'header' ? 44 : undefined}
          loading={variant === 'header' || variant === 'utility' ? 'eager' : 'lazy'}
          decoding="async"
        />
      </span>
      {showMark && (
        <span className="brand-logo-mark" aria-hidden="true">
          {BRAND.short}
        </span>
      )}
    </span>
  );

  if (!asLink) {
    return <span className="brand-logo-wrap">{content}</span>;
  }

  return (
    <Link
      to={to}
      className="brand-logo-link brand-logo-link--img"
      aria-label={BRAND.name}
      onClick={onClick}
    >
      {content}
    </Link>
  );
};

export default BrandLogo;

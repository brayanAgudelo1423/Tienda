import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Flecha para volver a la página anterior (fallback: inicio).
 */
const BackNav = ({ fallback = '/', label = 'Volver' }) => {
  const navigate = useNavigate();

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallback);
  };

  return (
    <button type="button" className="back-nav" onClick={goBack} aria-label={label}>
      <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
};

export default BackNav;

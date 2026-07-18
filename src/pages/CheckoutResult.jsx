import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import BrandLogo from '../components/BrandLogo';

const STATE_COPY = {
  APPROVED: {
    icon: CheckCircle,
    title: '¡Pago aprobado!',
    body: 'Tu pago fue procesado correctamente. Te enviaremos la confirmación por correo.',
    tone: 'success',
  },
  PENDING: {
    icon: Clock,
    title: 'Pago pendiente',
    body: 'Tu pago está en proceso. Te avisaremos cuando se confirme.',
    tone: 'pending',
  },
  DECLINED: {
    icon: XCircle,
    title: 'Pago rechazado',
    body: 'No se pudo completar el pago. Puedes intentar de nuevo desde tu carrito.',
    tone: 'error',
  },
  EXPIRED: {
    icon: XCircle,
    title: 'Pago expirado',
    body: 'El tiempo para pagar expiró. Realiza un nuevo pedido cuando quieras.',
    tone: 'error',
  },
};

function normalizePaymentState(params) {
  const gateway = params.get('gateway');

  if (gateway === 'mp') {
    const mpStatus = (
      params.get('collection_status') ||
      params.get('status') ||
      'pending'
    ).toLowerCase();

    if (mpStatus === 'approved') return 'APPROVED';
    if (mpStatus === 'rejected' || mpStatus === 'failure') return 'DECLINED';
    return 'PENDING';
  }

  return String(
    params.get('lapTransactionState') ||
      params.get('transactionState') ||
      params.get('state_pol') ||
      'PENDING'
  ).toUpperCase();
}

const CheckoutResult = () => {
  const [params] = useSearchParams();
  const [state, setState] = useState('PENDING');

  useEffect(() => {
    setState(normalizePaymentState(params));
  }, [params]);

  const copy = STATE_COPY[state] || STATE_COPY.PENDING;
  const Icon = copy.icon;
  const reference = params.get('referenceCode') || params.get('reference_pol') || params.get('payment_id');
  const orderId = params.get('external_reference') || params.get('extra1');
  const isMercadoPago = params.get('gateway') === 'mp';

  return (
    <motion.div
      className={`checkout-result checkout-result--${copy.tone}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <BrandLogo variant="checkout" asLink={false} />
      <Icon size={56} strokeWidth={1.5} />
      <h1>{copy.title}</h1>
      {orderId && !isMercadoPago && <p className="checkout-result-order">Pedido #{orderId}</p>}
      {reference && <p className="checkout-result-ref">Ref. {reference}</p>}
      <p>{copy.body}</p>
      <div className="checkout-result-actions">
        <Link to="/" className="btn">
          Volver a la tienda
        </Link>
        {state === 'DECLINED' && (
          <Link to="/cart" className="btn btn-outline">
            Revisar carrito
          </Link>
        )}
      </div>

      <style>{`
        .checkout-result {
          min-height: 65vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3rem 1.5rem;
        }
        .checkout-result--success svg { color: var(--color-secondary); }
        .checkout-result--pending svg { color: #b8860b; }
        .checkout-result--error svg { color: #b91c1c; }
        .checkout-result h1 {
          font-size: 1.75rem;
          font-weight: 500;
          margin: 1rem 0 0.5rem;
          text-transform: none;
        }
        .checkout-result-order {
          font-weight: 600;
          margin: 0 0 0.25rem;
        }
        .checkout-result-ref {
          font-size: 0.85rem;
          color: var(--color-text-light);
          margin: 0 0 1rem;
        }
        .checkout-result > p:last-of-type {
          max-width: 360px;
          color: var(--color-text-light);
          line-height: 1.5;
          margin-bottom: 2rem;
        }
        .checkout-result-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
        }
        .btn-outline {
          background: transparent;
          border: 1px solid var(--color-primary);
          color: var(--color-primary);
        }
      `}</style>
    </motion.div>
  );
};

export default CheckoutResult;

import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import BrandLogo from '../components/BrandLogo';
import { api } from '../api/client';

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
    body: 'Mercado Pago aún no confirmó el cobro. Si usaste PSE o efectivo, puede tardar horas. Si pagaste con tarjeta y no ves el descuento, el pago no se completó — intenta de nuevo.',
    tone: 'pending',
  },
  CANCELLED: {
    icon: Clock,
    title: 'Pago no completado',
    body: 'Saliste de Mercado Pago sin pagar. Puedes volver al carrito e intentar de nuevo cuando quieras.',
    tone: 'pending',
  },
  DECLINED: {
    icon: XCircle,
    title: 'Pago rechazado',
    body: 'Mercado Pago no aprobó el pago. Prueba otro medio (PSE, Nequi u otra tarjeta) o contacta a tu banco.',
    tone: 'error',
  },
  EXPIRED: {
    icon: XCircle,
    title: 'Pago expirado',
    body: 'El tiempo para pagar expiró. Realiza un nuevo pedido cuando quieras.',
    tone: 'error',
  },
};

function isNullishParam(value) {
  return !value || value === 'null' || value === 'undefined';
}

function normalizePaymentState(params) {
  const gateway = params.get('gateway');

  if (gateway === 'mp') {
    if (params.get('return') === 'cancel') return 'CANCELLED';

    const mpStatus = (
      params.get('collection_status') ||
      params.get('status') ||
      ''
    ).toLowerCase();
    const paymentId = params.get('payment_id');
    const hasPaymentId = !isNullishParam(paymentId);

    if (mpStatus === 'approved') return 'APPROVED';
    if (mpStatus === 'rejected' || mpStatus === 'failure') {
      return hasPaymentId ? 'DECLINED' : 'CANCELLED';
    }
    if (mpStatus === 'pending' || mpStatus === 'in_process') return 'PENDING';
    if (!hasPaymentId && !mpStatus) return 'CANCELLED';
    return 'PENDING';
  }

  return String(
    params.get('lapTransactionState') ||
      params.get('transactionState') ||
      params.get('state_pol') ||
      'PENDING'
  ).toUpperCase();
}

function mapSaleStatus(status) {
  if (status === 'pagada') return 'APPROVED';
  if (status === 'rechazada') return 'DECLINED';
  if (status === 'pendiente_pago') return 'PENDING';
  return null;
}

function pickReference(params) {
  const candidates = [
    params.get('payment_id'),
    params.get('referenceCode'),
    params.get('reference_pol'),
    params.get('merchant_order_id'),
  ];
  return candidates.find((value) => !isNullishParam(value)) || null;
}

const CheckoutResult = () => {
  const [params] = useSearchParams();
  const [state, setState] = useState('PENDING');

  useEffect(() => {
    const urlState = normalizePaymentState(params);
    setState(urlState);

    const orderId = params.get('external_reference');
    const paymentId = params.get('payment_id');
    if (!orderId || params.get('gateway') !== 'mp') return undefined;

    let cancelled = false;

    const applySale = (sale) => {
      if (cancelled || !sale) return;
      const backendState = mapSaleStatus(sale.status);
      if (backendState) setState(backendState);
    };

    const syncPromise = isNullishParam(paymentId)
      ? api.getPaymentStatus(orderId)
      : api.syncMercadoPagoPayment({ saleId: orderId, paymentId });

    syncPromise.then(applySale).catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [params]);

  const copy = STATE_COPY[state] || STATE_COPY.PENDING;
  const Icon = copy.icon;
  const reference = pickReference(params);
  const orderId = params.get('external_reference') || params.get('extra1');

  return (
    <motion.div
      className={`checkout-result checkout-result--${copy.tone}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <BrandLogo variant="checkout" asLink={false} />
      <Icon size={56} strokeWidth={1.5} />
      <h1>{copy.title}</h1>
      {orderId && !isNullishParam(orderId) && (
        <p className="checkout-result-order">Pedido #{orderId}</p>
      )}
      {reference && <p className="checkout-result-ref">Ref. {reference}</p>}
      <p>{copy.body}</p>
      <div className="checkout-result-actions">
        <Link to="/" className="btn">
          Volver a la tienda
        </Link>
        {(state === 'DECLINED' || state === 'CANCELLED') && (
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

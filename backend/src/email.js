import nodemailer from 'nodemailer';
import { formatCOP } from './formatCOP.js';

function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function statusLabel(status) {
  const map = {
    confirmada: 'Confirmado',
    pendiente_pago: 'Pendiente de pago',
    pagada: 'Pagado',
    rechazada: 'Pago rechazado',
  };
  return map[status] || status;
}

function buildItemsList(items) {
  return items
    .map(
      (item) =>
        `• ${item.name} (${item.brand}) x${item.quantity} — ${formatCOP(item.price * item.quantity)}`
    )
    .join('\n');
}

export async function sendOrderConfirmationEmail(sale) {
  if (!isEmailConfigured() || !sale.customerEmail) return false;

  const storeName = process.env.STORE_NAME || 'VirtusMonaco';
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const trackUrl = `${(process.env.FRONTEND_URL || 'https://virtusmonaco.store').replace(/\/$/, '')}/rastrear-pedido`;

  const text = `Hola ${sale.customerName},

¡Gracias por tu compra en ${storeName}!

Pedido #${sale.id}
Estado: ${statusLabel(sale.status)}
Total: ${formatCOP(sale.total)}

Productos:
${buildItemsList(sale.items)}

Dirección de envío:
${sale.customerAddress}
${sale.customerCity}

Rastrea tu pedido en: ${trackUrl}
(Necesitarás tu número de pedido y el correo ${sale.customerEmail})

Cualquier duda escríbenos por WhatsApp: 300 990 2243

— ${storeName}`;

  await getTransporter().sendMail({
    from,
    to: sale.customerEmail,
    subject: `Pedido #${sale.id} confirmado — ${storeName}`,
    text,
  });

  return true;
}

export async function sendAdminOrderNotification(sale) {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!isEmailConfigured() || !adminEmail) return false;

  const storeName = process.env.STORE_NAME || 'VirtusMonaco';
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const text = `Nuevo pedido #${sale.id} en ${storeName}

Cliente: ${sale.customerName}
Email: ${sale.customerEmail}
Tel: ${sale.customerPhone}
Ciudad: ${sale.customerCity}
Dirección: ${sale.customerAddress}

Total: ${formatCOP(sale.total)}
Estado: ${statusLabel(sale.status)}
Pago: ${sale.paymentMethod || 'N/A'}

Productos:
${buildItemsList(sale.items)}`;

  await getTransporter().sendMail({
    from,
    to: adminEmail,
    subject: `[${storeName}] Nuevo pedido #${sale.id}`,
    text,
  });

  return true;
}

export async function notifyNewOrder(sale) {
  try {
    await Promise.all([
      sendOrderConfirmationEmail(sale),
      sendAdminOrderNotification(sale),
    ]);
  } catch (err) {
    console.warn('[OZONO] Email de pedido no enviado:', err.message);
  }
}

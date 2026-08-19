import nodemailer from 'nodemailer';
import { formatCOP } from './formatCOP.js';

function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function isSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim()
  );
}

export function isEmailConfigured() {
  return isResendConfigured() || isSmtpConfigured();
}

function getFromAddress() {
  return (
    process.env.EMAIL_FROM?.trim() ||
    process.env.SMTP_FROM?.trim() ||
    process.env.SMTP_USER?.trim() ||
    'VirtusMonaco <onboarding@resend.dev>'
  );
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: String(process.env.SMTP_PASS || '').replace(/\s+/g, ''),
    },
  });
}

async function sendViaResend({ from, to, subject, text }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data.message || data.error || JSON.stringify(data);
    throw new Error(`Resend: ${detail}`);
  }
  return data;
}

async function sendViaSmtp({ from, to, subject, text }) {
  await getTransporter().sendMail({ from, to, subject, text });
  return { provider: 'smtp' };
}

async function sendEmail({ to, subject, text }) {
  if (!to?.trim()) {
    throw new Error('Destinatario vacío');
  }

  const from = getFromAddress();
  const payload = { from, to: to.trim(), subject, text };

  if (isResendConfigured()) {
    const result = await sendViaResend(payload);
    console.log(`[OZONO] Email enviado (Resend) → ${to}`);
    return { provider: 'resend', ...result };
  }

  if (isSmtpConfigured()) {
    const result = await sendViaSmtp(payload);
    console.log(`[OZONO] Email enviado (SMTP) → ${to}`);
    return result;
  }

  throw new Error(
    'Email no configurado. En Render (plan free) usa RESEND_API_KEY — Gmail SMTP está bloqueado.'
  );
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

function buildCustomerEmailText(sale) {
  const storeName = process.env.STORE_NAME || 'VirtusMonaco';
  const trackUrl = `${(process.env.FRONTEND_URL || 'https://virtusmonaco.store').replace(/\/$/, '')}/rastrear-pedido`;

  return `Hola ${sale.customerName},

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
}

function buildAdminEmailText(sale) {
  const storeName = process.env.STORE_NAME || 'VirtusMonaco';

  return `Nuevo pedido #${sale.id} en ${storeName}

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
}

export async function sendOrderConfirmationEmail(sale) {
  if (!sale.customerEmail) return false;

  await sendEmail({
    to: sale.customerEmail,
    subject: `Pedido #${sale.id} confirmado — ${process.env.STORE_NAME || 'VirtusMonaco'}`,
    text: buildCustomerEmailText(sale),
  });

  return true;
}

export async function sendAdminOrderNotification(sale) {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL?.trim();
  if (!adminEmail) return false;

  await sendEmail({
    to: adminEmail,
    subject: `[${process.env.STORE_NAME || 'VirtusMonaco'}] Nuevo pedido #${sale.id}`,
    text: buildAdminEmailText(sale),
  });

  return true;
}

export async function notifyNewOrder(sale) {
  if (!isEmailConfigured()) {
    console.warn(
      '[OZONO] Email omitido: configura RESEND_API_KEY en Render (Gmail SMTP no funciona en plan free).'
    );
    return;
  }

  const results = await Promise.allSettled([
    sendOrderConfirmationEmail(sale),
    sendAdminOrderNotification(sale),
  ]);

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[OZONO] Email de pedido falló:', result.reason?.message || result.reason);
    }
  }
}

export async function sendTestEmail(to) {
  const storeName = process.env.STORE_NAME || 'VirtusMonaco';
  return sendEmail({
    to,
    subject: `Prueba de email — ${storeName}`,
    text: `Este es un correo de prueba de ${storeName}.\n\nSi lo recibes, los emails de pedidos están funcionando correctamente.`,
  });
}

export function getEmailStatus() {
  return {
    configured: isEmailConfigured(),
    provider: isResendConfigured() ? 'resend' : isSmtpConfigured() ? 'smtp' : 'none',
    from: getFromAddress(),
    adminNotify: process.env.ADMIN_NOTIFY_EMAIL || null,
    note: isResendConfigured()
      ? 'Usando Resend API (HTTPS) — compatible con Render free.'
      : isSmtpConfigured()
        ? 'Usando SMTP — en Render free los puertos 587/465 están bloqueados.'
        : 'Configura RESEND_API_KEY en Render.',
  };
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WHATSAPP_NUMBER = '573009902243';
const INSTAGRAM_URL = 'https://www.instagram.com/_ozono_3?igsh=MTJkYTNrNnhhaDRsaQ==';

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const faqs = [
  {
    q: '¿Cuánto tiempo tarda mi pedido en llegar?',
    a: 'Los pedidos se procesan en 1-2 días hábiles y el envío estándar toma entre 3-5 días hábiles dentro de Colombia.',
  },
  {
    q: '¿Qué hago si mi pago fue rechazado?',
    a: 'Verifica que los datos de tu tarjeta sean correctos y que tengas fondos suficientes. Si el problema persiste, contáctanos por WhatsApp para ayudarte.',
  },
  {
    q: '¿Puedo cambiar o devolver un producto?',
    a: 'Sí, aceptamos cambios y devoluciones dentro de los 15 días calendario después de recibir tu pedido, siempre que el producto esté sin usar y con su empaque original.',
  },
  {
    q: '¿Cómo puedo rastrear mi pedido?',
    a: 'Al confirmar tu compra recibirás un número de guía por correo electrónico para rastrear tu envío.',
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Aceptamos tarjetas de crédito y débito (Visa, MasterCard, American Express), PSE y pagos en efectivo a través de plataformas habilitadas, procesados de forma segura mediante PayU.',
  },
  {
    q: '¿Mis datos de pago están seguros?',
    a: 'Sí. Todo el proceso de pago es gestionado por PayU, plataforma certificada con estándares PCI DSS. Ozono nunca almacena los datos de tu tarjeta.',
  },
];

const Contacto = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ nombre: '', email: '', pedido: '', mensaje: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hola OZONO 👋\n\nNombre: ${form.nombre}\nEmail: ${form.email}\nNro. Pedido: ${form.pedido || 'N/A'}\n\nMensaje:\n${form.mensaje}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola OZONO, necesito ayuda con mi pedido.')}`;

  return (
    <main style={s.page}>
      {/* Hero */}
      <section style={s.hero}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={s.heroInner}
        >
          <p style={s.heroTag}>Centro de Ayuda</p>
          <h1 style={s.heroTitle}>¿En qué podemos<br />ayudarte?</h1>
          <p style={s.heroSub}>
            Estamos aquí para resolver cualquier problema con tu compra.
            Respuesta garantizada en menos de 2 horas en horario hábil.
          </p>
          <div style={s.heroBtns}>
            <motion.a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              style={s.btnWa}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              id="btn-whatsapp-hero"
            >
              <WhatsAppIcon /> Chatear por WhatsApp
            </motion.a>
            <motion.a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={s.btnIg}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              id="btn-instagram-hero"
            >
              <InstagramIcon /> Instagram
            </motion.a>
          </div>
        </motion.div>
      </section>

      <div style={s.content} className="container">

        {/* Info cards */}
        <section style={s.cards}>
          {[
            {
              icon: '📞',
              title: 'WhatsApp',
              text: '+57 300 990 2243',
              sub: 'Lun – Sáb, 8 am – 8 pm',
              href: waLink,
              btnLabel: 'Escribir ahora',
              id: 'card-whatsapp',
            },
            {
              icon: '📸',
              title: 'Instagram',
              text: '@_ozono_3',
              sub: 'DM abiertos siempre',
              href: INSTAGRAM_URL,
              btnLabel: 'Ir a Instagram',
              id: 'card-instagram',
            },
            {
              icon: '⏱️',
              title: 'Tiempo de respuesta',
              text: '< 2 horas',
              sub: 'En horario hábil',
              href: null,
              btnLabel: null,
              id: 'card-tiempo',
            },
          ].map((card) => (
            <motion.div
              key={card.id}
              id={card.id}
              style={s.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ boxShadow: '0 12px 40px rgba(0,0,0,0.10)', transform: 'translateY(-4px)' }}
            >
              <span style={s.cardIcon}>{card.icon}</span>
              <h3 style={s.cardTitle}>{card.title}</h3>
              <p style={s.cardText}>{card.text}</p>
              <p style={s.cardSub}>{card.sub}</p>
              {card.href && (
                <a href={card.href} target="_blank" rel="noopener noreferrer" style={s.cardLink}>
                  {card.btnLabel} →
                </a>
              )}
            </motion.div>
          ))}
        </section>

        {/* Form + FAQ */}
        <section style={s.grid2}>

          {/* Contact form */}
          <motion.div
            style={s.formBox}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={s.sectionTitle}>Reportar un problema</h2>
            <p style={s.sectionSub}>
              Completa el formulario y te contactaremos por WhatsApp de inmediato.
            </p>
            <form onSubmit={handleSubmit} style={s.form} id="contact-form">
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label} htmlFor="nombre">Nombre completo *</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    style={s.input}
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label} htmlFor="email">Correo electrónico *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    value={form.email}
                    onChange={handleChange}
                    style={s.input}
                  />
                </div>
              </div>
              <div style={s.formGroup}>
                <label style={s.label} htmlFor="pedido">Número de pedido (opcional)</label>
                <input
                  id="pedido"
                  name="pedido"
                  type="text"
                  placeholder="Ej: OZN-2024-00123"
                  value={form.pedido}
                  onChange={handleChange}
                  style={s.input}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label} htmlFor="mensaje">Describe tu problema *</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  required
                  rows={5}
                  placeholder="Cuéntanos qué pasó con tu compra..."
                  value={form.mensaje}
                  onChange={handleChange}
                  style={{ ...s.input, resize: 'vertical', minHeight: '120px' }}
                />
              </div>
              <motion.button
                type="submit"
                style={s.submitBtn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                id="btn-submit-contact"
              >
                <WhatsAppIcon />
                {sent ? '¡Mensaje enviado! Redirigiendo…' : 'Enviar por WhatsApp'}
              </motion.button>
            </form>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={s.sectionTitle}>Preguntas frecuentes</h2>
            <p style={s.sectionSub}>Respuestas rápidas a las dudas más comunes.</p>
            <div style={s.faqList}>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  style={s.faqItem}
                  id={`faq-item-${i}`}
                >
                  <button
                    style={s.faqQ}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    id={`faq-btn-${i}`}
                  >
                    {faq.q}
                    <span style={{ ...s.faqChevron, transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      ▾
                    </span>
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      style={s.faqA}
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Bottom CTA */}
        <motion.section
          style={s.cta}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p style={s.ctaTitle}>¿No encontraste lo que buscabas?</p>
          <p style={s.ctaSub}>Nuestro equipo responde de inmediato por WhatsApp.</p>
          <motion.a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            style={s.ctaBtn}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            id="btn-whatsapp-cta"
          >
            <WhatsAppIcon /> Hablar con un asesor
          </motion.a>
        </motion.section>

      </div>
    </main>
  );
};

const s = {
  page: { backgroundColor: 'var(--color-bg)', minHeight: '60vh' },

  hero: {
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 60%, #16213e 100%)',
    padding: '6rem 1.5rem 5rem',
    textAlign: 'center',
  },
  heroInner: { maxWidth: '680px', margin: '0 auto' },
  heroTag: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.1)',
    color: '#ccc',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    padding: '0.35rem 1rem',
    borderRadius: '20px',
    marginBottom: '1.2rem',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.15,
    marginBottom: '1rem',
  },
  heroSub: {
    color: '#aaa',
    fontSize: '1rem',
    lineHeight: 1.7,
    marginBottom: '2rem',
  },
  heroBtns: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },

  btnWa: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    backgroundColor: '#25D366',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    padding: '0.85rem 1.6rem',
    borderRadius: '50px',
    textDecoration: 'none',
    boxShadow: '0 4px 20px rgba(37,211,102,0.35)',
    transition: 'all 0.2s ease',
  },
  btnIg: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    padding: '0.85rem 1.6rem',
    borderRadius: '50px',
    textDecoration: 'none',
    boxShadow: '0 4px 20px rgba(225,48,108,0.35)',
    transition: 'all 0.2s ease',
  },

  content: { padding: '4rem 1.5rem 6rem' },

  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '4rem',
  },
  card: {
    background: '#fff',
    border: '1px solid #efefef',
    borderRadius: '16px',
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    transition: 'all 0.25s ease',
    cursor: 'default',
  },
  cardIcon: { fontSize: '2rem', marginBottom: '0.5rem' },
  cardTitle: { fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 },
  cardText: { fontSize: '1.05rem', fontWeight: 600, margin: 0 },
  cardSub: { fontSize: '0.82rem', color: 'var(--color-text-light)', margin: 0 },
  cardLink: {
    marginTop: '0.75rem',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--color-secondary)',
    textDecoration: 'none',
  },

  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '3rem',
    marginBottom: '4rem',
    alignItems: 'start',
  },

  formBox: {},
  sectionTitle: {
    fontSize: '1.5rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    marginBottom: '0.4rem',
    color: 'var(--color-primary)',
  },
  sectionSub: {
    color: 'var(--color-text-light)',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
    lineHeight: 1.6,
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.02em' },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.9rem',
    border: '1.5px solid #e5e5e5',
    borderRadius: '10px',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    color: 'var(--color-primary)',
    backgroundColor: '#fafafa',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    background: 'linear-gradient(135deg, #25D366, #128C7E)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1rem',
    padding: '0.9rem 1.5rem',
    borderRadius: '50px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
    marginTop: '0.5rem',
    fontFamily: 'var(--font-body)',
  },

  faqList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  faqItem: {
    border: '1.5px solid #efefef',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  faqQ: {
    width: '100%',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    padding: '1rem 1.25rem',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--color-primary)',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-body)',
  },
  faqChevron: { fontSize: '1.1rem', transition: 'transform 0.25s ease', flexShrink: 0 },
  faqA: {
    padding: '0 1.25rem 1rem',
    fontSize: '0.875rem',
    color: 'var(--color-text-light)',
    lineHeight: 1.7,
  },

  cta: {
    background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
    borderRadius: '24px',
    padding: '3.5rem 2rem',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '1.6rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '0.5rem',
  },
  ctaSub: { color: '#aaa', fontSize: '0.95rem', marginBottom: '1.75rem' },
  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    backgroundColor: '#25D366',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1rem',
    padding: '0.9rem 2rem',
    borderRadius: '50px',
    textDecoration: 'none',
    boxShadow: '0 4px 24px rgba(37,211,102,0.4)',
    transition: 'all 0.2s ease',
  },
};

export default Contacto;

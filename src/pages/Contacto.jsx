import React, { useState } from 'react';
import { BRAND, whatsappLink } from '../config/brand';
import BackNav from '../components/BackNav';

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const faqs = [
  {
    q: '¿Cuánto tarda el envío?',
    a: 'Entre 3 y 5 días hábiles en Colombia, después de confirmar el pedido.',
  },
  {
    q: '¿Puedo cambiar o devolver?',
    a: 'Sí, dentro de 15 días si el producto llega sin usar y con su empaque.',
  },
  {
    q: '¿Cómo pago?',
    a: 'Pago en línea seguro o contraentrega. Si tienes dudas, escríbenos por WhatsApp.',
  },
];

const Contacto = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  const waDirect = whatsappLink(`Hola ${BRAND.name}, necesito ayuda.`);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `Hola ${BRAND.name}\n\nNombre: ${nombre}\n\n${mensaje}`;
    window.open(whatsappLink(text), '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="help-page">
      <div className="container help-page-inner">
        <BackNav label="Volver" />

        <header className="help-header">
          <h1>Contacto y ayuda</h1>
          <p>Escríbenos y te respondemos rápido.</p>
        </header>

        <div className="help-actions">
          <a
            className="help-action help-action--wa"
            href={waDirect}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            WhatsApp · {BRAND.whatsappDisplay}
          </a>
          <a
            className="help-action help-action--ig"
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram · {BRAND.instagramHandle}
          </a>
        </div>

        <section className="help-grid">
          <form className="help-form" onSubmit={handleSubmit}>
            <h2>Enviar mensaje</h2>
            <label htmlFor="help-nombre">
              Nombre
              <input
                id="help-nombre"
                name="nombre"
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
              />
            </label>
            <label htmlFor="help-mensaje">
              Mensaje
              <textarea
                id="help-mensaje"
                name="mensaje"
                required
                rows={4}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="¿En qué te ayudamos?"
              />
            </label>
            <button type="submit" className="help-submit">
              <WhatsAppIcon /> Enviar por WhatsApp
            </button>
          </form>

          <div className="help-faq">
            <h2>Preguntas frecuentes</h2>
            {faqs.map((faq, i) => (
              <div key={faq.q} className="help-faq-item">
                <button
                  type="button"
                  className="help-faq-q"
                  aria-expanded={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <span aria-hidden="true">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <p className="help-faq-a">{faq.a}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Contacto;

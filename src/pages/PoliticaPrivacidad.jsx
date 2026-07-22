import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BRAND, whatsappLink } from '../config/brand';

const COMPANY = BRAND.name;
const CONTACT_PHONE = BRAND.whatsappDisplayIntl;
const CONTACT_INSTAGRAM = BRAND.instagramUrl;
const CONTACT_INSTAGRAM_HANDLE = BRAND.instagramHandle;
const LAST_UPDATED = '29 de mayo de 2025';

const Section = ({ id, number, title, children }) => (
  <motion.section
    id={id}
    style={s.section}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5 }}
  >
    <div style={s.sectionHead}>
      <span style={s.number}>{number}</span>
      <h2 style={s.sectionTitle}>{title}</h2>
    </div>
    <div style={s.sectionBody}>{children}</div>
  </motion.section>
);

const PoliticaPrivacidad = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <main style={s.page}>

      {/* Hero */}
      <section style={s.hero}>
        <motion.div
          style={s.heroInner}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p style={s.heroTag}>Documento Legal</p>
          <h1 style={s.heroTitle}>Política de Privacidad<br />y Seguridad de Datos</h1>
          <p style={s.heroSub}>
            Última actualización: <strong style={{ color: '#fff' }}>{LAST_UPDATED}</strong>
          </p>
          <p style={s.heroSub}>
            En <strong style={{ color: '#fff' }}>{COMPANY}</strong> respetamos tu privacidad y protegemos
            tus datos personales conforme a la Ley 1581 de 2012 (Habeas Data) y demás normativa vigente
            en Colombia.
          </p>
        </motion.div>
      </section>

      {/* Index */}
      <div style={s.wrapper} className="container">
        <aside style={s.aside}>
          <p style={s.asideTitle}>Contenido</p>
          {[
            ['#responsable', '1. Responsable del tratamiento'],
            ['#datos-recopilados', '2. Datos que recopilamos'],
            ['#finalidad', '3. Finalidad del tratamiento'],
            ['#bases-legales', '4. Bases legales'],
            ['#pago-payu', '5. Procesamiento de pagos (PayU)'],
            ['#compartir', '6. Compartir información'],
            ['#derechos', '7. Tus derechos'],
            ['#seguridad', '8. Seguridad de la información'],
            ['#cookies', '9. Cookies'],
            ['#menores', '10. Menores de edad'],
            ['#cambios', '11. Cambios a esta política'],
            ['#contacto', '12. Contacto'],
          ].map(([href, label]) => (
            <a key={href} href={href} style={s.asideLink}>{label}</a>
          ))}
        </aside>

        <article style={s.article}>

          <Section id="responsable" number="01" title="Responsable del Tratamiento">
            <p>
              <strong>{COMPANY}</strong> (en adelante "la Empresa", "nosotros" o "nuestro") es responsable
              del tratamiento de los datos personales recopilados a través de nuestro sitio web de
              comercio electrónico.
            </p>
            <div style={s.infoBox}>
              <p style={s.infoRow}><strong>Razón social:</strong> {COMPANY}</p>
              <p style={s.infoRow}><strong>País de operación:</strong> República de Colombia</p>
              <p style={s.infoRow}><strong>WhatsApp de contacto:</strong>{' '}
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" style={s.link}>
                  {CONTACT_PHONE}
                </a>
              </p>
              <p style={s.infoRow}><strong>Instagram:</strong>{' '}
                <a href={CONTACT_INSTAGRAM} target="_blank" rel="noopener noreferrer" style={s.link}>
                  {CONTACT_INSTAGRAM_HANDLE}
                </a>
              </p>
            </div>
          </Section>

          <Section id="datos-recopilados" number="02" title="Datos que Recopilamos">
            <p>Recopilamos los siguientes datos cuando realizas una compra o interactúas con nuestro sitio:</p>
            <h3 style={s.subTitle}>Datos proporcionados por el usuario</h3>
            <ul style={s.list}>
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono / WhatsApp</li>
              <li>Dirección de envío (departamento, ciudad, barrio, dirección)</li>
              <li>Número de documento de identidad (cuando sea requerido para facturación)</li>
            </ul>
            <h3 style={s.subTitle}>Datos recopilados automáticamente</h3>
            <ul style={s.list}>
              <li>Dirección IP</li>
              <li>Tipo de navegador y dispositivo</li>
              <li>Páginas visitadas y tiempo de permanencia</li>
              <li>Cookies de sesión y de rendimiento</li>
            </ul>
            <div style={s.alertBox}>
              <strong>⚠️ Importante:</strong> {COMPANY} <strong>NUNCA</strong> almacena datos de tarjetas de
              crédito, débito ni información bancaria. Toda la información de pago es procesada directamente
              por PayU Latam mediante conexiones cifradas.
            </div>
          </Section>

          <Section id="finalidad" number="03" title="Finalidad del Tratamiento">
            <p>Utilizamos tus datos personales exclusivamente para los siguientes fines:</p>
            <ul style={s.list}>
              <li>Procesar y gestionar tu pedido de compra</li>
              <li>Coordinar el envío y la entrega de productos</li>
              <li>Emitir facturas y comprobantes de pago</li>
              <li>Brindarte atención al cliente y resolver inconvenientes</li>
              <li>Enviarte notificaciones relacionadas con tu pedido (solo por WhatsApp o email)</li>
              <li>Prevenir fraudes y garantizar la seguridad de las transacciones</li>
              <li>Cumplir con obligaciones legales y regulatorias aplicables</li>
              <li>Mejorar la experiencia de usuario en nuestro sitio web</li>
            </ul>
            <p>
              No realizaremos perfilado automatizado ni tomaremos decisiones automáticas que afecten
              significativamente al usuario sin su consentimiento expreso.
            </p>
          </Section>

          <Section id="bases-legales" number="04" title="Bases Legales del Tratamiento">
            <p>El tratamiento de tus datos se sustenta en las siguientes bases legales:</p>
            <div style={s.table}>
              {[
                ['Ejecución de contrato', 'Procesar y entregar tu pedido.'],
                ['Consentimiento', 'Envío de comunicaciones de marketing (requiere aceptación expresa).'],
                ['Interés legítimo', 'Prevención de fraude y mejora del servicio.'],
                ['Cumplimiento legal', 'Facturación, informes tributarios y retención de registros.'],
              ].map(([base, desc]) => (
                <div key={base} style={s.tableRow}>
                  <strong style={s.tableKey}>{base}</strong>
                  <span style={s.tableVal}>{desc}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section id="pago-payu" number="05" title="Procesamiento de Pagos con PayU">
            <p>
              Nuestro sitio utiliza <strong>PayU Latam</strong> como pasarela de pago certificada. PayU es
              una plataforma regulada que cumple con el estándar{' '}
              <strong>PCI DSS (Payment Card Industry Data Security Standard) Nivel 1</strong>, el nivel más
              alto de seguridad para procesamiento de tarjetas.
            </p>
            <h3 style={s.subTitle}>¿Qué hace PayU con tus datos?</h3>
            <ul style={s.list}>
              <li>Cifra todos los datos de pago mediante protocolo TLS 1.2 o superior.</li>
              <li>Tokeniza los números de tarjeta para que nunca queden expuestos.</li>
              <li>Aplica autenticación 3D Secure cuando el banco emisor lo requiere.</li>
              <li>Realiza análisis antifraude en tiempo real antes de aprobar cada transacción.</li>
            </ul>
            <h3 style={s.subTitle}>Datos que recibe PayU</h3>
            <ul style={s.list}>
              <li>Nombre del titular de la tarjeta</li>
              <li>Número de tarjeta (cifrado y tokenizado)</li>
              <li>Fecha de vencimiento y CVV (procesados directamente en sus servidores)</li>
              <li>Monto de la transacción y referencia del pedido</li>
              <li>Dirección IP del comprador (para antifraude)</li>
            </ul>
            <div style={s.alertBox}>
              <strong>🔒 Seguridad:</strong> {COMPANY} no tiene acceso en ningún momento a los datos completos
              de tu tarjeta. Estos datos son procesados íntegramente en los servidores seguros de PayU.
              Puedes consultar la política de privacidad de PayU en{' '}
              <a href="https://legal.payulatam.com/ES/privacy_policy_customers.html" target="_blank" rel="noopener noreferrer" style={s.link}>
                legal.payulatam.com
              </a>.
            </div>
            <h3 style={s.subTitle}>Medios de pago aceptados</h3>
            <ul style={s.list}>
              <li>Tarjetas de crédito: Visa, MasterCard, American Express, Diners</li>
              <li>Tarjetas débito</li>
              <li>PSE (débito bancario en línea)</li>
              <li>Efectivo en puntos habilitados (Efecty, Baloto, etc.)</li>
            </ul>
          </Section>

          <Section id="compartir" number="06" title="Compartir Información con Terceros">
            <p>
              {COMPANY} no vende, arrienda ni comparte tus datos personales con terceros con fines
              comerciales. Solo compartimos información cuando es estrictamente necesario con:
            </p>
            <ul style={s.list}>
              <li>
                <strong>PayU Latam:</strong> para procesar el pago de tu compra.
              </li>
              <li>
                <strong>Operadores logísticos:</strong> nombre, dirección de envío y teléfono de contacto,
                únicamente para coordinar la entrega de tu pedido.
              </li>
              <li>
                <strong>Autoridades competentes:</strong> cuando exista obligación legal o requerimiento
                judicial en Colombia.
              </li>
            </ul>
            <p>
              Todos los terceros que reciben datos están obligados contractualmente a mantener la
              confidencialidad y a no usar esa información para fines distintos al servicio contratado.
            </p>
          </Section>

          <Section id="derechos" number="07" title="Tus Derechos como Titular de Datos">
            <p>
              De acuerdo con la Ley 1581 de 2012 y el Decreto 1377 de 2013, tienes los siguientes derechos:
            </p>
            <div style={s.table}>
              {[
                ['Acceso', 'Conocer qué datos tenemos sobre ti.'],
                ['Rectificación', 'Corregir datos inexactos o incompletos.'],
                ['Supresión', 'Solicitar la eliminación de tus datos cuando ya no sean necesarios.'],
                ['Revocación', 'Retirar el consentimiento otorgado para el tratamiento.'],
                ['Portabilidad', 'Recibir tus datos en un formato estructurado y legible.'],
                ['Oposición', 'Oponerte al tratamiento de tus datos para fines específicos.'],
              ].map(([right, desc]) => (
                <div key={right} style={s.tableRow}>
                  <strong style={s.tableKey}>{right}</strong>
                  <span style={s.tableVal}>{desc}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: '1rem' }}>
              Para ejercer estos derechos contáctanos por WhatsApp al{' '}
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" style={s.link}>
                {CONTACT_PHONE}
              </a>{' '}
              o por mensaje directo en Instagram{' '}
              <a href={CONTACT_INSTAGRAM} target="_blank" rel="noopener noreferrer" style={s.link}>
                {CONTACT_INSTAGRAM_HANDLE}
              </a>.
              Responderemos dentro de los 15 días hábiles establecidos por la ley.
            </p>
          </Section>

          <Section id="seguridad" number="08" title="Seguridad de la Información">
            <p>
              Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos
              contra acceso no autorizado, alteración, divulgación o destrucción:
            </p>
            <ul style={s.list}>
              <li>Cifrado HTTPS (TLS) en todas las páginas del sitio web.</li>
              <li>Controles de acceso restringido a la base de datos de pedidos.</li>
              <li>Autenticación con token para el panel de administración.</li>
              <li>Procesamiento de pagos exclusivamente a través de PayU (PCI DSS Nivel 1).</li>
              <li>No almacenamiento de datos de tarjetas en nuestros servidores.</li>
              <li>Revisión periódica de vulnerabilidades y accesos.</li>
            </ul>
            <p>
              En caso de una brecha de seguridad que afecte tus datos, te notificaremos sin demora
              indebida y reportaremos el incidente a la Superintendencia de Industria y Comercio (SIC)
              conforme a la normativa vigente.
            </p>
          </Section>

          <Section id="cookies" number="09" title="Política de Cookies">
            <p>
              Nuestro sitio web utiliza cookies y tecnologías similares para mejorar tu experiencia.
              Utilizamos los siguientes tipos:
            </p>
            <div style={s.table}>
              {[
                ['Esenciales', 'Necesarias para el funcionamiento del carrito y el proceso de compra. No pueden desactivarse.'],
                ['Rendimiento', 'Nos ayudan a entender cómo interactúas con el sitio (páginas visitadas, errores). Son anónimas.'],
                ['Funcionales', 'Recuerdan tus preferencias (como idioma o ciudad de envío).'],
              ].map(([type, desc]) => (
                <div key={type} style={s.tableRow}>
                  <strong style={s.tableKey}>{type}</strong>
                  <span style={s.tableVal}>{desc}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: '1rem' }}>
              Puedes configurar tu navegador para rechazar o eliminar cookies. Sin embargo, algunas
              funcionalidades del sitio (como el carrito de compras) pueden verse afectadas.
            </p>
          </Section>

          <Section id="menores" number="10" title="Menores de Edad">
            <p>
              Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos
              intencionalmente datos personales de menores de edad. Si eres padre/madre o tutor y
              crees que tu hijo ha proporcionado datos personales en nuestro sitio, contáctanos
              de inmediato para proceder con su eliminación.
            </p>
          </Section>

          <Section id="cambios" number="11" title="Cambios a Esta Política">
            <p>
              Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios
              en nuestras prácticas de datos o en la legislación aplicable. Te notificaremos de
              cambios significativos publicando la nueva versión en esta página con la fecha de
              actualización. Te recomendamos revisar esta política cada vez que realices una compra.
            </p>
            <p>
              El uso continuado de nuestros servicios después de la publicación de cambios constituye
              tu aceptación de la política actualizada.
            </p>
          </Section>

          <Section id="contacto" number="12" title="Contacto y Reclamaciones">
            <p>
              Para cualquier consulta relacionada con esta política, el tratamiento de tus datos o
              para ejercer tus derechos, comunícate con nosotros:
            </p>
            <div style={s.infoBox}>
              <p style={s.infoRow}>
                <strong>WhatsApp:</strong>{' '}
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" style={s.link}>
                  {CONTACT_PHONE}
                </a>
              </p>
              <p style={s.infoRow}>
                <strong>Instagram:</strong>{' '}
                <a href={CONTACT_INSTAGRAM} target="_blank" rel="noopener noreferrer" style={s.link}>
                  {CONTACT_INSTAGRAM_HANDLE}
                </a>
              </p>
              <p style={s.infoRow}>
                <strong>Formulario de contacto:</strong>{' '}
                <Link to="/contacto" style={s.link}>ozono.com/contacto</Link>
              </p>
            </div>
            <p style={{ marginTop: '1rem' }}>
              Si consideras que no hemos atendido adecuadamente tu solicitud, puedes presentar una
              queja ante la{' '}
              <a
                href="https://www.sic.gov.co"
                target="_blank"
                rel="noopener noreferrer"
                style={s.link}
              >
                Superintendencia de Industria y Comercio (SIC)
              </a>
              , entidad encargada de la protección de datos personales en Colombia.
            </p>
          </Section>

        </article>
      </div>
    </main>
  );
};

const s = {
  page: { backgroundColor: 'var(--color-bg)', minHeight: '80vh' },

  hero: {
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 60%, #16213e 100%)',
    padding: '6rem 1.5rem 5rem',
    textAlign: 'center',
  },
  heroInner: { maxWidth: '720px', margin: '0 auto' },
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
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.2,
    marginBottom: '1rem',
  },
  heroSub: {
    color: '#aaa',
    fontSize: '0.95rem',
    lineHeight: 1.7,
    marginBottom: '0.5rem',
  },

  wrapper: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    gap: '4rem',
    padding: '4rem 1.5rem 6rem',
    alignItems: 'start',
  },

  aside: {
    position: 'sticky',
    top: '100px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  asideTitle: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--color-text-light)',
    marginBottom: '0.75rem',
  },
  asideLink: {
    fontSize: '0.8rem',
    color: 'var(--color-text-light)',
    textDecoration: 'none',
    padding: '0.25rem 0',
    borderLeft: '2px solid transparent',
    paddingLeft: '0.75rem',
    transition: 'all 0.2s ease',
    lineHeight: 1.4,
  },

  article: { maxWidth: '720px' },

  section: { marginBottom: '3.5rem', paddingBottom: '3.5rem', borderBottom: '1px solid #efefef' },
  sectionHead: { display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.25rem' },
  number: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--color-secondary)',
    backgroundColor: 'rgba(0,0,0,0.04)',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    color: 'var(--color-primary)',
    margin: 0,
  },
  sectionBody: {
    fontSize: '0.92rem',
    lineHeight: 1.8,
    color: '#444',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  subTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--color-primary)',
    marginTop: '0.5rem',
    marginBottom: '0.25rem',
  },
  list: {
    paddingLeft: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    margin: 0,
  },
  alertBox: {
    background: 'rgba(37,211,102,0.07)',
    border: '1px solid rgba(37,211,102,0.3)',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    fontSize: '0.875rem',
    color: '#1a4a2e',
    lineHeight: 1.7,
  },
  infoBox: {
    background: '#f8f8f8',
    border: '1px solid #efefef',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  infoRow: { margin: 0, fontSize: '0.9rem' },
  link: { color: 'var(--color-secondary)', textDecoration: 'underline' },
  table: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '160px 1fr',
    gap: '1rem',
    padding: '0.75rem 1rem',
    background: '#f8f8f8',
    borderRadius: '10px',
    fontSize: '0.875rem',
    alignItems: 'start',
  },
  tableKey: { color: 'var(--color-primary)', fontWeight: 700 },
  tableVal: { color: '#555', lineHeight: 1.6 },
};

export default PoliticaPrivacidad;

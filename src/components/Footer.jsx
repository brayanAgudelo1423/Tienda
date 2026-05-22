import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        <div style={styles.col}>
          <h2 className="brand-logo" style={styles.logo}>OZONO</h2>
          <p style={styles.desc}>Moda deportiva y urbana de alto rendimiento. 100% original.</p>
        </div>
        <div style={styles.col}>
          <h4 style={styles.title}>AYUDA</h4>
          <ul style={styles.list}>
            <li style={{cursor: 'pointer'}}>Estado del pedido</li>
            <li style={{cursor: 'pointer'}}>Envío y entrega</li>
            <li style={{cursor: 'pointer'}}>Devoluciones</li>
            <li style={{cursor: 'pointer'}}>Opciones de pago</li>
          </ul>
        </div>
        <div style={styles.col}>
          <h4 style={styles.title}>ACERCA DE OZONO</h4>
          <ul style={styles.list}>
            <li style={{cursor: 'pointer'}}>Noticias</li>
            <li style={{cursor: 'pointer'}}>Empleo</li>
            <li style={{cursor: 'pointer'}}>Sostenibilidad</li>
          </ul>
        </div>
        <div style={styles.col}>
          <div style={styles.social}>
            <Mail size={24} style={{cursor: 'pointer', color: 'var(--color-primary)'}} />
            <Phone size={24} style={{cursor: 'pointer', color: 'var(--color-primary)'}} />
            <MapPin size={24} style={{cursor: 'pointer', color: 'var(--color-primary)'}} />
          </div>
        </div>
      </div>
      <div style={styles.copy}>
        &copy; {new Date().getFullYear()} OZONO, Inc. Todos los derechos reservados.
      </div>
    </footer>
  );
};

const styles = {
  footer: { backgroundColor: 'var(--color-bg)', color: 'var(--color-primary)', paddingTop: '4rem', borderTop: '1px solid var(--color-bg-alt)' },
  container: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '3rem' },
  col: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  logo: { fontSize: '1.75rem' },
  desc: { color: 'var(--color-text-light)', fontSize: '0.9rem', lineHeight: '1.5' },
  title: { fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-body)' },
  list: { color: 'var(--color-text-light)', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', fontWeight: 500 },
  social: { display: 'flex', gap: '1.5rem', justifyContent: 'flex-start' },
  copy: { padding: '1.5rem 2rem', borderTop: '1px solid var(--color-bg-alt)', fontSize: '0.75rem', color: 'var(--color-text-light)', backgroundColor: 'var(--color-bg)' }
};

export default Footer;

export const BRAND = {
  name: 'VirtusMonaco',
  short: 'VM',
  legal: 'VirtusMonaco',
  domain: 'virtusmonaco.store',
  siteUrl: 'https://virtusmonaco.store',
  logo: '/Logo/Logo.jpg',
  logoAlt: 'VirtusMonaco — Moda y lociones originales',
  email: 'jaramillofelipe528@gmail.com',
  whatsapp: '573009902243',
  whatsappDisplay: '3206887235 Linea Atencion al Cliente', 
  whatsappDisplayIntl: '+57 300 990 2243',
  instagramUrl:
    'https://www.instagram.com/virtusmonaco_?igsh=MXA0ZjYzYTg0Yjlucg==',
  instagramHandle: '@virtusmonaco_',
};

export function whatsappLink(message) {
  const base = `https://wa.me/${BRAND.whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

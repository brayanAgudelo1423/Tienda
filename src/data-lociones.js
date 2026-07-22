import { toCopPrice } from './utils/currency.js';
import {
  FRAGRANCE_BRANDS,
  LOCIONES_CATEGORY,
  LOCIONES_PLACEHOLDER,
} from './constants/catalog.js';

const LOCIONES_CATALOG = [
  { name: 'Sauvage Eau de Parfum', brand: 'Dior', productType: 'Eau de Parfum', gender: 'hombre', price: 420, sizes: ['100ml'] },
  { name: 'J\'adore Eau de Parfum', brand: 'Dior', productType: 'Eau de Parfum', gender: 'mujer', price: 395, sizes: ['100ml'] },
  { name: 'Bleu de Chanel', brand: 'Chanel', productType: 'Eau de Parfum', gender: 'hombre', price: 480, sizes: ['100ml'] },
  { name: 'Coco Mademoiselle', brand: 'Chanel', productType: 'Eau de Parfum', gender: 'mujer', price: 465, sizes: ['100ml'] },
  { name: 'Eros Eau de Parfum', brand: 'Versace', productType: 'Eau de Parfum', gender: 'hombre', price: 310, sizes: ['100ml', '200ml'] },
  { name: 'Bright Crystal', brand: 'Versace', productType: 'Eau de Toilette', gender: 'mujer', price: 285, sizes: ['90ml'] },
  { name: 'Acqua di Gio Profumo', brand: 'Armani', productType: 'Eau de Parfum', gender: 'hombre', price: 360, sizes: ['125ml'] },
  { name: 'Si Passione', brand: 'Armani', productType: 'Eau de Parfum', gender: 'mujer', price: 340, sizes: ['100ml'] },
  { name: '1 Million', brand: 'Paco Rabanne', productType: 'Eau de Toilette', gender: 'hombre', price: 295, sizes: ['100ml', '200ml'] },
  { name: 'Lady Million', brand: 'Paco Rabanne', productType: 'Eau de Parfum', gender: 'mujer', price: 305, sizes: ['80ml'] },
  { name: 'Good Girl', brand: 'Carolina Herrera', productType: 'Eau de Parfum', gender: 'mujer', price: 350, sizes: ['80ml'] },
  { name: 'Bad Boy', brand: 'Carolina Herrera', productType: 'Eau de Toilette', gender: 'hombre', price: 330, sizes: ['100ml'] },
  { name: 'Light Blue Pour Homme', brand: 'Dolce & Gabbana', productType: 'Eau de Toilette', gender: 'hombre', price: 280, sizes: ['125ml'] },
  { name: 'Light Blue', brand: 'Dolce & Gabbana', productType: 'Eau de Toilette', gender: 'mujer', price: 275, sizes: ['100ml'] },
  { name: 'Guilty Pour Homme', brand: 'Gucci', productType: 'Eau de Toilette', gender: 'hombre', price: 320, sizes: ['90ml'] },
  { name: 'Bloom', brand: 'Gucci', productType: 'Eau de Parfum', gender: 'mujer', price: 345, sizes: ['100ml'] },
  { name: 'Gentleman Reserve Privée', brand: 'Givenchy', productType: 'Eau de Parfum', gender: 'hombre', price: 370, sizes: ['100ml'] },
  { name: 'Irresistible', brand: 'Givenchy', productType: 'Eau de Parfum', gender: 'mujer', price: 355, sizes: ['80ml'] },
  { name: 'Explorer', brand: 'Montblanc', productType: 'Eau de Parfum', gender: 'hombre', price: 260, sizes: ['100ml'] },
  { name: 'Signature', brand: 'Montblanc', productType: 'Eau de Parfum', gender: 'mujer', price: 255, sizes: ['90ml'] },
  { name: 'Le Male Le Parfum', brand: 'Jean Paul Gaultier', productType: 'Eau de Parfum', gender: 'hombre', price: 315, sizes: ['125ml'] },
  { name: 'La Vie Est Belle', brand: 'Lancome', productType: 'Eau de Parfum', gender: 'mujer', price: 365, sizes: ['100ml'] },
  { name: 'Y Eau de Parfum', brand: 'YSL', productType: 'Eau de Parfum', gender: 'hombre', price: 380, sizes: ['100ml'] },
  { name: 'Libre Eau de Parfum', brand: 'YSL', productType: 'Eau de Parfum', gender: 'mujer', price: 390, sizes: ['90ml'] },
  { name: 'Hero', brand: 'Burberry', productType: 'Eau de Parfum', gender: 'hombre', price: 340, sizes: ['100ml'] },
  { name: 'Her', brand: 'Burberry', productType: 'Eau de Parfum', gender: 'mujer', price: 335, sizes: ['100ml'] },
  { name: 'CK One', brand: 'Calvin Klein', productType: 'Eau de Toilette', gender: 'unisex', price: 180, sizes: ['200ml'] },
  { name: 'Boss Bottled', brand: 'Hugo Boss', productType: 'Eau de Toilette', gender: 'hombre', price: 270, sizes: ['100ml', '200ml'] },
  { name: 'L.12.12 Blanc', brand: 'Lacoste', productType: 'Eau de Toilette', gender: 'hombre', price: 220, sizes: ['100ml'] },
  { name: 'Ombre Leather', brand: 'Tom Ford', productType: 'Eau de Parfum', gender: 'unisex', price: 520, sizes: ['100ml'] },
  { name: 'Valentino Uomo Born in Roma', brand: 'Valentino', productType: 'Eau de Toilette', gender: 'hombre', price: 360, sizes: ['100ml'] },
  { name: 'Valentino Donna Born in Roma', brand: 'Valentino', productType: 'Eau de Parfum', gender: 'mujer', price: 370, sizes: ['100ml'] },
  { name: 'Luna Rossa Ocean', brand: 'Prada', productType: 'Eau de Toilette', gender: 'hombre', price: 390, sizes: ['100ml'] },
];

function buildLocionesProducts() {
  return LOCIONES_CATALOG.map((item, index) => ({
    id: 900 + index,
    name: item.name,
    brand: item.brand,
    brandSlug:
      FRAGRANCE_BRANDS.find((b) => b.name === item.brand)?.slug ||
      item.brand.toLowerCase().replace(/\s+/g, '-'),
    productType: item.productType,
    price: item.price,
    category: LOCIONES_CATEGORY,
    gender: item.gender,
    rating: 4.7,
    reviewCount: 80 + index * 3,
    sizes: item.sizes,
    colors: [{ name: 'Original', hex: '#d4c4a8' }],
    image: LOCIONES_PLACEHOLDER,
    hoverImage: LOCIONES_PLACEHOLDER,
    description: `${item.name} — loción original ${item.brand}. Autenticidad garantizada en VirtusMonaco.`,
  }));
}

/** Catálogo de lociones con precios en COP */
export const locionesProducts = buildLocionesProducts().map((p) => ({
  ...p,
  price: toCopPrice(p.price),
}));

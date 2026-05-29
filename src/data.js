import { imageUrl, hugoBossImageUrl } from './utils/assets.js';

export const NAV_BRANDS = [
  { name: 'Hugo Boss', slug: 'hugo-boss' },
  { name: 'Lacoste', slug: 'lacoste' },
  { name: 'Calvin Klein', slug: 'calvin-klein' },
  { name: 'Psycho Bunny', slug: 'psycho-bunny' },
  { name: 'Tomi', slug: 'tomi' },
  { name: 'Novedades', slug: 'novedades' },
];

const SHOE_SIZES = ['38', '39', '40', '41', '42', '43'];
const CLOTHING_SIZES = ['S', 'M', 'L', 'XL'];

const LACOSTE_IMAGE_FILES = [
  'Chaqueta Lacoste Azul Ref2.jpeg',
  'Conjunto o separado Lacoste Azul.jpeg',
  'Polo Lacoste Amarilla Ref1.jpeg',
  'Polo Lacoste Azul Cielo Ref1.jpeg',
  'Polo Lacoste Azul Ref1.jpeg',
  'Polo Lacoste Azul Ref2.jpeg',
  'Polo Lacoste Blanca Ref1.jpeg',
  'Polo Lacoste Gris Ref1.jpeg',
  'Polo Lacoste Verde Ref1.jpeg',
  'Polo Lacoste Verde Ref2.jpeg',
];

const TOMI_IMAGE_FILES = [
  'Polo Rosada Azul Ref1.jpeg',
  'Polo Tomi Amarilla Ref1.jpeg',
  'Polo Tomi Azul Crema Ref1.jpeg',
  'Polo Tomi Azul Ref1.jpeg',
  'Polo Tomi Azul Ref2.jpeg',
  'Polo Tomi Blanca Ref1.jpeg',
  'Polo Tomi Blanca Ref2.jpeg',
  'Polo Tomi Gris Ref1.jpeg',
  'Polo Tomi Gris Ref2.jpeg',
  'Polo Tomi Negra Ref1.jpeg',
  'Polo Tomi Negra Ref2.jpeg',
  'Polo Tomi Pastel Ref1.jpeg',
];

const NOVEDADES_IMAGE_FILES = [
  'Billeteras Fossil.jpeg',
  'Bolso Coach Cafe Dama.jpeg',
  'Bolso Coach Negro Ref1.jpeg',
  'Bolso Tory Burch Blanca Ref1.jpeg',
  'Bolso Tory Burch Negro Ref1.jpeg',
  'Bolso Tory Burch Negro Ref2.jpeg',
  'Bolso Tory Burch Negro Ref3.jpeg',
  'Bolso Tory Burch Rojo Ref1.jpeg',
  'Bolso Tory Burch Rosado Ref1.jpeg',
  'Bolsos Tory Burch.jpeg',
  'Buso Under Ref1.jpeg',
  'Chaqueta Jordan Ref1.jpeg',
  'Chaqueta Nike Pastel Ref1.jpeg',
  'Chaqueta Nike Vino Ref1.jpeg',
  'Chaqueta The North Face Negra Ref1.jpeg',
  'Chaqueta Under Armour Ref1.jpeg',
  'Chaqueta Under negra Ref1.jpeg',
  'Gafas Burberry.jpeg',
  'Gafas Prada.jpeg',
  'Gafas RayBan Cafe Ref1.jpeg',
  'Gafas RayBan Doradas Ref1.jpeg',
  'Gafas RayBan Negras Ref1.jpeg',
  'Gafas RayBan Negras Ref2.jpeg',
  'Gafas Versace.jpeg',
  'Gorra Under Azul Ref1.jpeg',
  'Gorra Under Blanca Ref1.jpeg',
  'Gorra Under Cafe Ref1.jpeg',
  'Gorra Under Negra Ref1.jpeg',
  'Polo Michael Kors Cafe Ref1.jpeg',
  'Polo Nautica Roja.jpeg',
  'Polo Puma Ferrari.jpeg',
  'Riñonera Coach Negra.jpeg',
  'Riñonera Coach Ref1.jpeg',
  'Tennis Adidas Azul Ref1.jpeg',
  'Tennis Adidas Mujer Ref1.jpeg',
  'Tennis Adidas mujer Ref2.jpeg',
  'Tennis Lacoste Ref2.jpeg',
  'Tennis Nike Azul Ref1.jpeg',
  'Tennis Nike Ref1.jpeg',
  'Tennis Nike Ref2.jpeg',
  'Tennis Samba Ref1.jpeg',
];

const CALVIN_KLEIN_IMAGE_FILES = [
  'Camiseta CK Blanca Ref1.jpeg',
  'Polo CK Azul Ref1.jpeg',
  'Polo CK Azul Ref2.jpeg',
  'Polo CK Azul Ref3.jpeg',
  'Polo CK Blanca Ref1.jpeg',
  'Polo CK Blanca Ref2.jpeg',
  'Polo CK Gris Ref1.jpeg',
  'Polo CK Gris Ref2.jpeg',
  'Polo CK Lineas Ref1.jpeg',
  'Polo CK Negra Ref1.jpeg',
  'Polo CK Pastel Ref1.jpeg',
  'Polo CK Rosada Ref1.jpeg',
  'Polo CK Salmon.jpeg',
  'Polo CK Verde Ref1.jpeg',
];

const BUNNY_IMAGE_FILES = [
  'Camiseta Psycho Bunny Azul Ref1.jpeg',
  'Camiseta Psycho Bunny Azul Ref2.jpeg',
  'Camiseta Psycho Bunny Blanca Ref1.jpeg',
  'Camiseta Psycho Bunny Blanca Ref2.jpeg',
  'Camiseta Psycho Bunny Roja Ref1.jpeg',
  'Camiseta Psycho Bunny Verde Ref1.jpeg',
];

const inferFromFilename = (filename) => {
  const lower = filename.toLowerCase();
  const productType = (() => {
    if (lower.includes('chaqueta')) return 'Chaqueta';
    if (lower.includes('conjunto')) return 'Conjunto';
    if (lower.includes('polo')) return 'Polo';
    if (lower.includes('camisa')) return 'Camisa';
    if (lower.includes('camiseta')) return 'Camiseta';
    if (lower.includes('tennis')) return 'Tennis';
    if (lower.includes('zapatos')) return 'Zapatos';
    if (lower.includes('gafas')) return 'Gafas';
    if (lower.includes('billeteras')) return 'Billetera';
    if (lower.includes('bolso') || lower.includes('riñonera') || lower.includes('rionera'))
      return 'Bolso';
    if (lower.includes('gorra')) return 'Gorra';
    if (lower.includes('buso')) return 'Buso';
    if (lower.includes('sandalias')) return 'Sandalias';
    if (lower.includes('chanclas')) return 'Chanclas';
    return 'Producto';
  })();

  const category = (() => {
    if (['tennis', 'zapatos', 'sandalias', 'chanclas'].some((k) => lower.includes(k))) return 'Calzado';
    if (lower.includes('gafas')) return 'Accesorios';
    if (lower.includes('billeteras')) return 'Accesorios';
    if (lower.includes('bolso') || lower.includes('riñonera') || lower.includes('rionera'))
      return 'Accesorios';
    if (lower.includes('gorra')) return 'Accesorios';
    if (lower.includes('buso')) return 'Buzos';
    if (lower.includes('chaqueta')) return 'Chaquetas';
    if (lower.includes('conjunto')) return 'Conjuntos';
    if (lower.includes('polo')) return 'Polos';
    if (lower.includes('camisa')) return 'Camisas';
    if (lower.includes('camiseta')) return 'Camisetas';
    return 'Moda';
  })();

  const sizes = (() => {
    if (['tennis', 'zapatos', 'sandalias', 'chanclas'].some((k) => lower.includes(k))) return SHOE_SIZES;
    if (
      ['gafas', 'billeteras', 'bolso', 'gorra', 'riñonera', 'rionera'].some((k) =>
        lower.includes(k)
      )
    )
      return ['ÚNICA'];
    if (lower.includes('buso')) return CLOTHING_SIZES;
    return CLOTHING_SIZES;
  })();

  const colors = (() => {
    const colorsOut = [];
    const push = (name, hex) => {
      if (colorsOut.some((c) => c.hex === hex)) return;
      colorsOut.push({ name, hex });
    };
    if (lower.includes('azul')) push('Azul', '#1e3a5f');
    if (lower.includes('blanca') || lower.includes('blancas')) push('Blanco', '#f5f5f5');
    if (lower.includes('negra') || lower.includes('negras')) push('Negro', '#111111');
    if (lower.includes('gris')) push('Gris', '#6b7280');
    if (lower.includes('verde')) push('Verde', '#1a5c3a');
    if (lower.includes('amarilla')) push('Amarillo', '#f2c94c');
    if (lower.includes('rosada')) push('Rosado', '#e8a0a0');
    if (lower.includes('cafe')) push('Café', '#6f4e37');
    if (colorsOut.length === 0) {
      push('Negro', '#111111');
      push('Blanco', '#f5f5f5');
    }
    return colorsOut;
  })();

  const price = (() => {
    if (lower.includes('bolso')) return 180;
    if (lower.includes('billeteras')) return 90;
    if (lower.includes('gafas')) return 140;
    if (lower.includes('chaqueta')) return 220;
    if (lower.includes('conjunto')) return 200;
    if (lower.includes('tennis')) return 180;
    if (lower.includes('zapatos')) return 240;
    if (lower.includes('camisa')) return 145;
    if (lower.includes('camiseta')) return 120;
    if (lower.includes('polo')) return 110;
    return 120;
  })();

  return { productType, category, sizes, colors, price };
};

const HUGO_BOSS_IMAGE_FILES = [
  'Camisa Manga Larga Boss.jpeg',
  'Camiseta Boss Azul.jpeg',
  'Camiseta Boss Blanca Ref1.jpeg',
  'Camiseta Boss Ref2.jpeg',
  'Camiseta Boss Roja.jpeg',
  'Chanclas Boss Negras Ref2.jpeg',
  'Chanclas Boss Negras.jpeg',
  'Conjunto Boss.jpeg',
  'Polo Boss Azul.jpeg',
  'Polo Boss Blanca.jpeg',
  'Polo Boss Morada.jpeg',
  'Polo Boss Negra.jpeg',
  'Polo Boss Ref1.jpeg',
  'Polo Boss Ref2.jpeg',
  'Polo Boss Ref3.jpeg',
  'Polo Boss Rosada.jpeg',
  'Polo HUGO Morada.jpeg',
  'Polo HUGO Negra.jpeg',
  'Sandalias Boss Ref1.jpeg',
  'Sandalias Boss Ref2.jpeg',
  'Tennis Boss Blancas.jpeg',
  'Tennis Boss Negras.jpeg',
  'Zapatos HUGO Rojos.jpeg',
  'Zapatos HUGO.jpeg',
];

const inferHugoBossProductType = (filename) => {
  const lower = filename.toLowerCase();
  if (lower.includes('camisa')) return 'Camisa formal';
  if (lower.includes('camiseta')) return 'Camiseta casual';
  if (lower.includes('polo')) return 'Polo de algodón';
  if (lower.includes('conjunto')) return 'Conjunto de moda';
  if (lower.includes('zapatos')) return 'Zapatos';
  if (lower.includes('tennis')) return 'Tennis';
  if (lower.includes('sandalias')) return 'Sandalias';
  if (lower.includes('chanclas')) return 'Chanclas';
  return 'Artículo Hugo Boss';
};

const inferHugoBossCategory = (filename) => {
  const lower = filename.toLowerCase();
  if (lower.includes('zapatos')) return 'Calzado';
  if (lower.includes('tennis')) return 'Calzado';
  if (lower.includes('sandalias')) return 'Calzado';
  if (lower.includes('chanclas')) return 'Calzado';
  if (lower.includes('camisa')) return 'Camisas';
  if (lower.includes('camiseta')) return 'Camisetas';
  if (lower.includes('polo')) return 'Polos';
  if (lower.includes('conjunto')) return 'Conjuntos';
  return 'Moda';
};

const inferHugoBossSizes = (filename) => {
  const lower = filename.toLowerCase();
  if (
    lower.includes('zapatos') ||
    lower.includes('tennis') ||
    lower.includes('sandalias') ||
    lower.includes('chanclas')
  ) {
    return SHOE_SIZES;
  }
  return CLOTHING_SIZES;
};

const inferHugoBossColors = (filename) => {
  const lower = filename.toLowerCase();
  const colors = [];

  const pushColor = (name, hex) => {
    if (colors.some((c) => c.hex === hex)) return;
    colors.push({ name, hex });
  };

  if (lower.includes('azul')) pushColor('Azul', '#1e3a5f');
  if (lower.includes('blanca') || lower.includes('blancas')) pushColor('Blanco', '#f5f5f5');
  if (lower.includes('negra') || lower.includes('negras')) pushColor('Negro', '#111111');
  if (lower.includes('morada')) pushColor('Morada', '#6d28d9');
  if (lower.includes('rosada')) pushColor('Rosada', '#e8a0a0');
  if (lower.includes('roja') || lower.includes('rojos')) pushColor('Rojo', '#c41e3a');

  // Si el nombre no sugiere color (ej. “Ref1/Ref2”), usamos dos opciones genéricas.
  if (colors.length === 0) {
    pushColor('Negro', '#111111');
    pushColor('Blanco', '#f5f5f5');
  }

  return colors;
};

const inferHugoBossPrice = (filename) => {
  const lower = filename.toLowerCase();
  if (lower.includes('zapatos')) return 240;
  if (lower.includes('tennis')) return 180;
  if (lower.includes('sandalias')) return 110;
  if (lower.includes('chanclas')) return 80;
  if (lower.includes('camisa')) return 145;
  if (lower.includes('conjunto')) return 200;
  if (lower.includes('camiseta')) return 120;
  if (lower.includes('polo')) return 110;
  return 120;
};

const hugoBossProducts = HUGO_BOSS_IMAGE_FILES.map((filename, index) => {
  const rating = 4.6;
  const reviewCount = 60 + index * 2;

  return {
    id: 8 + index,
    name: filename.replace(/\.jpe?g$/i, ''),
    brand: 'Hugo Boss',
    productType: inferHugoBossProductType(filename),
    price: inferHugoBossPrice(filename),
    category: inferHugoBossCategory(filename),
    rating,
    reviewCount,
    sizes: inferHugoBossSizes(filename),
    colors: inferHugoBossColors(filename),
    image: hugoBossImageUrl(filename),
    hoverImage: hugoBossImageUrl(filename),
    description: 'Estilo premium de Hugo Boss.',
  };
});

export const products = [
  ...LACOSTE_IMAGE_FILES.map((filename, index) => {
    const meta = inferFromFilename(filename);
    const url = imageUrl('Lacoste', filename);
    return {
      id: 1 + index,
      name: filename.replace(/\.jpe?g$/i, ''),
      brand: 'Lacoste',
      productType: meta.productType,
      price: meta.price,
      category: meta.category,
      rating: 4.6,
      reviewCount: 70 + index * 2,
      sizes: meta.sizes,
      colors: meta.colors,
      image: url,
      hoverImage: url,
      description: 'Estilo original de Lacoste.',
    };
  }),
  ...CALVIN_KLEIN_IMAGE_FILES.map((filename, index) => {
    const meta = inferFromFilename(filename);
    const url = imageUrl('CK', filename);
    return {
      id: 50 + index,
      name: filename.replace(/\.jpe?g$/i, ''),
      brand: 'Calvin Klein',
      productType: meta.productType,
      price: meta.price,
      category: meta.category,
      rating: 4.6,
      reviewCount: 60 + index * 2,
      sizes: meta.sizes,
      colors: meta.colors,
      image: url,
      hoverImage: url,
      description: 'Colección premium Calvin Klein.',
    };
  }),
  ...BUNNY_IMAGE_FILES.map((filename, index) => {
    const meta = inferFromFilename(filename);
    const url = imageUrl('bunny', filename);
    return {
      id: 80 + index,
      name: filename.replace(/\.jpe?g$/i, ''),
      brand: 'Psycho Bunny',
      productType: meta.productType,
      price: meta.price,
      category: meta.category,
      rating: 4.6,
      reviewCount: 50 + index * 2,
      sizes: meta.sizes,
      colors: meta.colors,
      image: url,
      hoverImage: url,
      description: 'Estilo distintivo Psycho Bunny.',
    };
  }),
  ...TOMI_IMAGE_FILES.map((filename, index) => {
    const meta = inferFromFilename(filename);
    const url = imageUrl('Tomi', filename);
    return {
      id: 100 + index,
      name: filename.replace(/\.jpe?g$/i, ''),
      brand: 'Tomi',
      productType: meta.productType,
      price: meta.price,
      category: meta.category,
      rating: 4.6,
      reviewCount: 55 + index * 2,
      sizes: meta.sizes,
      colors: meta.colors,
      image: url,
      hoverImage: url,
      description: 'Estilo premium Tomi.',
    };
  }),
  ...NOVEDADES_IMAGE_FILES.map((filename, index) => {
    const meta = inferFromFilename(filename);
    const url = imageUrl('Novedades', filename);
    return {
      id: 200 + index,
      name: filename.replace(/\.jpe?g$/i, ''),
      brand: 'Novedades',
      productType: meta.productType,
      price: meta.price,
      category: meta.category,
      rating: 4.6,
      reviewCount: 40 + index * 2,
      sizes: meta.sizes,
      colors: meta.colors,
      image: url,
      hoverImage: url,
      description: 'Lo más nuevo en OZONO.',
    };
  }),
  ...hugoBossProducts,
];

export const getBrandBySlug = (slug) =>
  NAV_BRANDS.find((b) => b.slug === slug)?.name ?? null;

export { getCartItemId } from './utils/product.js';

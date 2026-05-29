import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dataPath = pathToFileURL(
  path.join(__dirname, '..', '..', 'src', 'data.js')
).href;

const { products, NAV_BRANDS } = await import(dataPath);

const {
  getProductCount,
  createProduct,
  upsertBrand,
  default: db,
} = await import('../src/db.js');

const COP_MULTIPLIER = 4000;

function toCop(usdLikePrice) {
  return Math.round(Number(usdLikePrice) * COP_MULTIPLIER);
}

if (getProductCount() > 0) {
  console.log('La base de datos ya tiene productos. Seed omitido.');
  process.exit(0);
}

console.log('Sembrando marcas y productos...');

NAV_BRANDS.forEach((brand, index) => {
  upsertBrand({ name: brand.name, slug: brand.slug, sortOrder: index });
});

let count = 0;
for (const p of products) {
  const brandSlug =
    NAV_BRANDS.find((b) => b.name === p.brand)?.slug ||
    p.brand.toLowerCase().replace(/\s+/g, '-');

  createProduct({
    name: p.name,
    brand: p.brand,
    brandSlug,
    productType: p.productType,
    price: toCop(p.price),
    category: p.category,
    rating: p.rating,
    reviewCount: p.reviewCount,
    description: p.description,
    image: p.image,
    hoverImage: p.hoverImage,
    sizes: p.sizes,
    colors: p.colors,
    active: true,
  });
  count += 1;
}

console.log(`Listo: ${count} productos en pesos colombianos (COP).`);
db.close();

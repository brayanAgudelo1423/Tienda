import './load-env.mjs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, '..', '..', 'src', 'data-lociones.js');
const catalogFile = path.join(__dirname, '..', '..', 'src', 'constants', 'catalog.js');

const { locionesProducts } = await import(pathToFileURL(dataFile).href);
const { FRAGRANCE_BRANDS } = await import(pathToFileURL(catalogFile).href);

const { createProduct, upsertBrand, getActiveProducts, default: db } = await import('../src/db.js');

const existingLociones = getActiveProducts().filter((p) => p.category === 'Lociones');
if (existingLociones.length > 0) {
  console.log(`Ya hay ${existingLociones.length} lociones en la base. Seed omitido.`);
  process.exit(0);
}

console.log('Sembrando marcas de perfumería y lociones...');

FRAGRANCE_BRANDS.forEach((brand, index) => {
  upsertBrand({ name: brand.name, slug: brand.slug, sortOrder: 100 + index });
});

let count = 0;
for (const p of locionesProducts) {
  createProduct({
    name: p.name,
    brand: p.brand,
    brandSlug: p.brandSlug,
    productType: p.productType,
    price: p.price,
    category: p.category,
    gender: p.gender,
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

console.log(`Listo: ${count} lociones agregadas.`);
db.close();

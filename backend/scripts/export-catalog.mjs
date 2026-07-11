import './load-env.mjs';
import { initDatabase, closePool } from '../src/db.js';
import { exportCatalogToFile } from '../src/catalogExport.js';

await initDatabase();
const { snapshot, path } = await exportCatalogToFile();
console.log(`Exportado: ${snapshot.products.length} productos, ${snapshot.promotions.length} promociones`);
console.log(`Archivo: ${path}`);
console.log('Sube backend/data/catalog-export.json a git para respaldo.');
await closePool();

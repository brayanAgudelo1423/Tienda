/**
 * Inicializa PostgreSQL: esquema + catálogo si está vacío.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import './load-env.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function runNode(script) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [script], {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
    });
    child.on('exit', (code) => {
      if (code !== 0) {
        console.warn(`[OZONO] ${script} terminó con código ${code}`);
      }
      resolve();
    });
    child.on('error', (err) => {
      console.warn(`[OZONO] No se pudo ejecutar ${script}:`, err.message);
      resolve();
    });
  });
}

console.log('[OZONO] Inicializando PostgreSQL...');

const { initDatabase, getProductCount, closePool } = await import('../src/db.js');
await initDatabase();

const countBefore = await getProductCount();
console.log(`[OZONO] Productos actuales: ${countBefore}`);

await runNode('scripts/seed.mjs');
await runNode('scripts/seed-lociones.mjs');

const countAfter = await getProductCount();
console.log(`[OZONO] Base de datos lista (${countAfter} productos).`);
await closePool();

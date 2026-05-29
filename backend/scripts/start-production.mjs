/**
 * Arranque en Render: ejecuta seed (si puede) y luego inicia la API.
 * Si el seed falla, la API igual arranca.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function runNode(script) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [script], {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
    });
    child.on('exit', (code) => {
      if (code !== 0) console.warn(`[OZONO] ${script} terminó con código ${code}`);
      resolve();
    });
    child.on('error', (err) => {
      console.warn(`[OZONO] No se pudo ejecutar ${script}:`, err.message);
      resolve();
    });
  });
}

await runNode('scripts/seed.mjs');
await runNode('src/server.js');

/** Carga .env en local; en Render las variables vienen del panel. */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFile = path.join(root, '.env');

if (existsSync(envFile)) {
  const dotenv = await import('dotenv');
  dotenv.config({ path: envFile });
}

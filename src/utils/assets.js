/** Ruta pública con prefijo de despliegue (GitHub Pages: /OZONO/) */
export function assetUrl(path) {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${clean}`;
}

export function imageUrl(folder, filename) {
  return assetUrl(`images/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`);
}

export function hugoBossImageUrl(filename) {
  return assetUrl(`images/hugo%20boss/${encodeURIComponent(filename)}`);
}

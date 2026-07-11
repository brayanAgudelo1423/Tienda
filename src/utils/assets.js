/** Base pública según Vite (dominio: /, GitHub Pages antiguo: /Tienda/) */
export function getPublicBase() {
  return import.meta.env.BASE_URL || '/';
}

export function assetUrl(path) {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${getPublicBase()}${clean}`;
}

export function imageUrl(folder, filename) {
  return assetUrl(`images/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`);
}

export function hugoBossImageUrl(filename) {
  return assetUrl(`images/hugo%20boss/${encodeURIComponent(filename)}`);
}

/** Normaliza rutas /images/... con cada segmento bien codificado */
export function normalizeStoreImagePath(path) {
  const imagesIdx = path.indexOf('/images/');
  const raw =
    imagesIdx !== -1
      ? path.slice(imagesIdx + 8)
      : path.replace(/^\/?images\/?/, '');
  const parts = raw.split('/').filter(Boolean).map((p) => encodeURIComponent(decodeURIComponent(p)));
  return assetUrl(`images/${parts.join('/')}`);
}

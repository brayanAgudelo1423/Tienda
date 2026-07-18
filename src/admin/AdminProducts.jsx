import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, mediaUrl } from '../api/client';
import { useProducts } from '../context/ProductsContext';
import { formatCOP } from '../utils/currency';
import { displayStoreText } from '../utils/displayText';

const AdminProducts = () => {
  const { reloadProducts } = useProducts();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [busy, setBusy] = useState(false);
  const [brandFilter, setBrandFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const load = () => {
    setLoading(true);
    api
      .getAdminProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [products]
  );

  const categories = useMemo(
    () =>
      [...new Set(products.map((p) => p.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [products]
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        if (brandFilter !== 'all' && p.brand !== brandFilter) return false;
        if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
        return true;
      }),
    [products, brandFilter, categoryFilter]
  );

  const selectedIds = useMemo(() => [...selected], [selected]);
  const allSelected = filteredProducts.length > 0 && filteredProducts.every((p) => selected.has(p.id));

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        filteredProducts.forEach((p) => next.delete(p.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filteredProducts.forEach((p) => next.add(p.id));
        return next;
      });
    }
  };

  const refresh = async () => {
    setSelected(new Set());
    load();
    await reloadProducts();
  };

  const runBulk = async (action, confirmMessage) => {
    if (!selectedIds.length) return;
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    setBusy(true);
    try {
      await api.bulkProducts(selectedIds, action);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (id) => {
    await api.toggleProduct(id);
    load();
    reloadProducts();
  };

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar este producto permanentemente?')) return;
    await api.deleteProduct(id);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    load();
    reloadProducts();
  };

  if (loading) return <p>Cargando productos…</p>;

  return (
    <>
      <div className="admin-products-head">
        <h2 style={{ fontSize: '1.35rem', margin: 0 }}>
          Productos ({filteredProducts.length}
          {filteredProducts.length !== products.length ? ` de ${products.length}` : ''})
        </h2>
        <label className="admin-select-all">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            disabled={busy || filteredProducts.length === 0}
          />
          Seleccionar visibles
        </label>
      </div>

      <div className="admin-filter-row">
        <label>
          Marca
          <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
            <option value="all">Todas las marcas</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {displayStoreText(brand)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Categoría
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        {(brandFilter !== 'all' || categoryFilter !== 'all') && (
          <button
            type="button"
            className="admin-btn-sm"
            onClick={() => {
              setBrandFilter('all');
              setCategoryFilter('all');
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="admin-bulk-bar">
          <span>{selectedIds.length} seleccionado(s)</span>
          <div className="admin-bulk-actions">
            <button
              type="button"
              className="admin-btn-sm"
              disabled={busy}
              onClick={() =>
                runBulk(
                  'hide',
                  `¿Marcar ${selectedIds.length} producto(s) como no disponibles? Se ocultarán de la tienda.`
                )
              }
            >
              No disponible
            </button>
            <button
              type="button"
              className="admin-btn-sm"
              disabled={busy}
              onClick={() => runBulk('show')}
            >
              Publicar
            </button>
            <button
              type="button"
              className="admin-btn-sm danger"
              disabled={busy}
              onClick={() =>
                runBulk(
                  'delete',
                  `¿Eliminar ${selectedIds.length} producto(s) permanentemente? Esta acción no se puede deshacer.`
                )
              }
            >
              Eliminar
            </button>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <p style={{ color: 'var(--color-text-light)' }}>No hay productos con estos filtros.</p>
      )}

      {filteredProducts.map((p) => (
        <article
          key={p.id}
          className={`admin-product-card${selected.has(p.id) ? ' is-selected' : ''}`}
        >
          <label className="admin-product-check">
            <input
              type="checkbox"
              checked={selected.has(p.id)}
              onChange={() => toggleSelect(p.id)}
              disabled={busy}
              aria-label={`Seleccionar ${p.name}`}
            />
          </label>
          <div className="admin-product-thumb product-card-image">
            <img src={mediaUrl(p.image)} alt="" className="product-card-fg" />
          </div>
          <div className="admin-product-info">
            <h3>
              {displayStoreText(p.name)}
              {!p.active && <span className="admin-badge-inactive">No disponible</span>}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', margin: 0 }}>
              {displayStoreText(p.brand)} · {p.category} · {formatCOP(p.price)}
            </p>
            <div className="admin-product-actions">
              <Link to={`/admin/productos/${p.id}`} className="admin-btn-sm">
                Editar
              </Link>
              <button type="button" className="admin-btn-sm" onClick={() => toggleActive(p.id)}>
                {p.active ? 'No disponible' : 'Publicar'}
              </button>
              <button type="button" className="admin-btn-sm danger" onClick={() => remove(p.id)}>
                Eliminar
              </button>
            </div>
          </div>
        </article>
      ))}
    </>
  );
};

export default AdminProducts;

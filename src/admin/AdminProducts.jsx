import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, mediaUrl } from '../api/client';
import { useProducts } from '../context/ProductsContext';
import { formatCOP } from '../utils/currency';

const AdminProducts = () => {
  const { reloadProducts } = useProducts();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [busy, setBusy] = useState(false);

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

  const selectedIds = useMemo(() => [...selected], [selected]);
  const allSelected = products.length > 0 && selected.size === products.length;

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
      setSelected(new Set());
    } else {
      setSelected(new Set(products.map((p) => p.id)));
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
          Productos ({products.length})
        </h2>
        <label className="admin-select-all">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            disabled={busy || products.length === 0}
          />
          Seleccionar todos
        </label>
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

      {products.map((p) => (
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
              {p.name}
              {!p.active && <span className="admin-badge-inactive">No disponible</span>}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', margin: 0 }}>
              {p.brand} · {formatCOP(p.price)}
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

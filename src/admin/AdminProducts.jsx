import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, mediaUrl } from '../api/client';
import { useProducts } from '../context/ProductsContext';
import { formatCOP } from '../utils/currency';

const AdminProducts = () => {
  const { reloadProducts } = useProducts();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const toggleActive = async (id) => {
    await api.toggleProduct(id);
    load();
    reloadProducts();
  };

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar este producto permanentemente?')) return;
    await api.deleteProduct(id);
    load();
    reloadProducts();
  };

  if (loading) return <p>Cargando productos…</p>;

  return (
    <>
      <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>
        Productos ({products.length})
      </h2>

      {products.map((p) => (
        <article key={p.id} className="admin-product-card">
          <div className="admin-product-thumb product-card-image">
            <img src={mediaUrl(p.image)} alt="" className="product-card-fg" />
          </div>
          <div className="admin-product-info">
            <h3>
              {p.name}
              {!p.active && <span className="admin-badge-inactive">Oculto</span>}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', margin: 0 }}>
              {p.brand} · {formatCOP(p.price)}
            </p>
            <div className="admin-product-actions">
              <Link to={`/admin/productos/${p.id}`} className="admin-btn-sm">
                Editar
              </Link>
              <button type="button" className="admin-btn-sm" onClick={() => toggleActive(p.id)}>
                {p.active ? 'Ocultar' : 'Publicar'}
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

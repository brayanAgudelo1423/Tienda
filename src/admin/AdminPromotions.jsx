import React, { useEffect, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { api, mediaUrl } from '../api/client';

const emptyForm = {
  title: '',
  subtitle: '',
  badge: '',
  image: '',
  sortOrder: '0',
  active: true,
};

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .getAdminPromotions()
      .then(setPromotions)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
  };

  const startEdit = (promo) => {
    setEditingId(promo.id);
    setForm({
      title: promo.title,
      subtitle: promo.subtitle,
      badge: promo.badge,
      image: promo.image || '',
      sortOrder: String(promo.sortOrder ?? 0),
      active: promo.active,
    });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { url } = await api.uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    setSaving(true);
    setError('');
    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      badge: form.badge.trim(),
      ctaText: '',
      ctaLink: '',
      image: form.image,
      sortOrder: Number(form.sortOrder) || 0,
      active: form.active,
    };

    try {
      if (editingId) {
        await api.updatePromotion(editingId, payload);
      } else {
        await api.createPromotion(payload);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id) => {
    await api.togglePromotion(id);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar esta promoción?')) return;
    await api.deletePromotion(id);
    if (editingId === id) resetForm();
    load();
  };

  if (loading) return <p>Cargando promociones…</p>;

  return (
    <>
      <h2 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>Promociones</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '1rem' }}>
        Tarjetas informativas en la página de inicio. No llevan enlace — solo muestran la oferta.
      </p>

      <form className="admin-form admin-promo-form" onSubmit={handleSubmit}>
        <h3 style={{ fontSize: '1rem', margin: '0 0 0.75rem' }}>
          {editingId ? 'Editar promoción' : 'Nueva promoción'}
        </h3>

        <div className="admin-field">
          <label>Título *</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Ej. Lociones originales"
            required
          />
        </div>

        <div className="admin-field">
          <label>Descripción</label>
          <textarea
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            placeholder="Ej. Hasta 20% esta semana en toda la colección"
            rows={2}
          />
        </div>

        <div className="admin-field-row">
          <div className="admin-field">
            <label>Etiqueta destacada</label>
            <input
              value={form.badge}
              onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
              placeholder="Ej. -20%, ENVÍO, NUEVO"
            />
          </div>
          <div className="admin-field">
            <label>Orden</label>
            <input
              inputMode="numeric"
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
            />
          </div>
        </div>

        <div className="admin-field">
          <label>Imagen (opcional)</label>
          {form.image && (
            <div className="admin-promo-preview">
              <img src={mediaUrl(form.image)} alt="" />
            </div>
          )}
          <label className="admin-upload-btn" style={{ display: 'inline-flex', marginTop: '0.5rem' }}>
            <ImagePlus size={18} />
            {uploading ? 'Subiendo…' : form.image ? 'Cambiar imagen' : 'Subir imagen'}
            <input type="file" accept="image/*" hidden onChange={handleUpload} />
          </label>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
          />
          Visible en la tienda
        </label>

        {error && <p style={{ color: '#b91c1c', marginBottom: '0.75rem' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button type="submit" className="btn" disabled={saving || uploading}>
            {saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Crear promoción'}
          </button>
          {editingId && (
            <button type="button" className="admin-btn-sm" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3 style={{ fontSize: '1rem', margin: '1.5rem 0 0.75rem' }}>
        Listado ({promotions.filter((p) => p.active).length} visibles)
      </h3>

      {promotions.length === 0 && (
        <p style={{ color: 'var(--color-text-light)' }}>No hay promociones aún.</p>
      )}

      {promotions.map((promo) => (
        <article key={promo.id} className="admin-promo-card">
          <div className="admin-promo-card-main">
            {promo.badge && <span className="promo-badge">{promo.badge}</span>}
            <strong>{promo.title}</strong>
            {promo.subtitle && (
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                {promo.subtitle}
              </p>
            )}
            {!promo.active && <span className="admin-badge-inactive">Oculta</span>}
          </div>
          <div className="admin-product-actions">
            <button type="button" className="admin-btn-sm" onClick={() => startEdit(promo)}>
              Editar
            </button>
            <button type="button" className="admin-btn-sm" onClick={() => toggleActive(promo.id)}>
              {promo.active ? 'Ocultar' : 'Publicar'}
            </button>
            <button type="button" className="admin-btn-sm danger" onClick={() => remove(promo.id)}>
              Eliminar
            </button>
          </div>
        </article>
      ))}
    </>
  );
};

export default AdminPromotions;

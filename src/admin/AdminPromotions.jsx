import React, { useEffect, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { api, mediaUrl } from '../api/client';
import { BRAND } from '../config/brand';
import { formatCOP, parseCOPInput } from '../utils/currency';
import { promoDiscountPercent, resolvePromoBadge } from '../utils/promo';

const emptyForm = {
  title: '',
  subtitle: '',
  badge: '',
  priceBefore: '',
  priceNow: '',
  image: '',
  sortOrder: '0',
  active: true,
};

const defaultSectionSettings = {
  sectionEnabled: true,
  pageTitle: 'Promociones',
  pageSubtitle: `Ofertas exclusivas en ${BRAND.name}`,
  menuLabel: 'Promociones',
};

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [sectionSettings, setSectionSettings] = useState(defaultSectionSettings);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const previewBefore = parseCOPInput(form.priceBefore);
  const previewNow = parseCOPInput(form.priceNow);
  const previewDiscount = promoDiscountPercent(previewBefore, previewNow);

  const load = () => {
    setLoading(true);
    api
      .getAdminPromotions()
      .then((data) => {
        if (Array.isArray(data)) {
          setPromotions(data);
          setSectionSettings(defaultSectionSettings);
        } else {
          setPromotions(data.promotions ?? []);
          setSectionSettings({ ...defaultSectionSettings, ...(data.settings || {}) });
        }
      })
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
      priceBefore: promo.priceBefore ? String(promo.priceBefore) : '',
      priceNow: promo.priceNow ? String(promo.priceNow) : '',
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

    const priceBefore = parseCOPInput(form.priceBefore) || null;
    const priceNow = parseCOPInput(form.priceNow) || null;

    if (!priceNow) {
      setError('El precio actual es obligatorio para que se pueda comprar');
      return;
    }

    if (priceBefore && priceNow && priceNow >= priceBefore) {
      setError('El precio actual debe ser menor al precio anterior');
      return;
    }

    setSaving(true);
    setError('');

    let badge = form.badge.trim();
    if (!badge && priceBefore && priceNow) {
      const pct = promoDiscountPercent(priceBefore, priceNow);
      if (pct) badge = `-${pct}%`;
    }

    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      badge,
      ctaText: '',
      ctaLink: '',
      image: form.image,
      priceBefore,
      priceNow,
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

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setError('');
    try {
      const updated = await api.updatePromotionsSettings(sectionSettings);
      setSectionSettings({ ...defaultSectionSettings, ...updated });
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const toggleSection = async () => {
    setSavingSettings(true);
    setError('');
    try {
      const updated = await api.togglePromotionsSection();
      setSectionSettings({ ...defaultSectionSettings, ...updated });
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingSettings(false);
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
        Crea ofertas con precio actual para que el cliente pueda comprar directo desde /promociones.
      </p>

      <section className="admin-promo-settings">
        <div className="admin-promo-settings-head">
          <div>
            <h3>Sección en el menú</h3>
            <p>
              {sectionSettings.sectionEnabled
                ? 'Visible en el menú y accesible en /promociones'
                : 'Oculta del menú — la página redirige al inicio'}
            </p>
          </div>
          <button
            type="button"
            className={`admin-toggle-pill ${sectionSettings.sectionEnabled ? 'is-on' : ''}`}
            onClick={toggleSection}
            disabled={savingSettings}
          >
            {sectionSettings.sectionEnabled ? 'Habilitada' : 'Deshabilitada'}
          </button>
        </div>

        <form className="admin-form admin-promo-settings-form" onSubmit={handleSaveSettings}>
          <div className="admin-field">
            <label>Texto en el menú</label>
            <input
              value={sectionSettings.menuLabel}
              onChange={(e) =>
                setSectionSettings((s) => ({ ...s, menuLabel: e.target.value }))
              }
              placeholder="Promociones"
              required
            />
          </div>

          <div className="admin-field-row">
            <div className="admin-field">
              <label>Título de la página</label>
              <input
                value={sectionSettings.pageTitle}
                onChange={(e) =>
                  setSectionSettings((s) => ({ ...s, pageTitle: e.target.value }))
                }
                placeholder="Promociones"
                required
              />
            </div>
            <div className="admin-field">
              <label>Subtítulo de la página</label>
              <input
                value={sectionSettings.pageSubtitle}
                onChange={(e) =>
                  setSectionSettings((s) => ({ ...s, pageSubtitle: e.target.value }))
                }
                placeholder={`Ofertas exclusivas en ${BRAND.name}`}
              />
            </div>
          </div>

          <button type="submit" className="btn" disabled={savingSettings}>
            {savingSettings ? 'Guardando…' : 'Guardar configuración'}
          </button>
        </form>
      </section>

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
            placeholder="Ej. Oferta válida por tiempo limitado"
            rows={2}
          />
        </div>

        <div className="admin-field-row">
          <div className="admin-field">
            <label>Precio antes (COP)</label>
            <input
              inputMode="numeric"
              value={form.priceBefore}
              onChange={(e) => setForm((f) => ({ ...f, priceBefore: e.target.value }))}
              placeholder="Ej. 350000"
            />
          </div>
          <div className="admin-field">
            <label>Precio ahora (COP) *</label>
            <input
              inputMode="numeric"
              value={form.priceNow}
              onChange={(e) => setForm((f) => ({ ...f, priceNow: e.target.value }))}
              placeholder="Ej. 280000"
              required
            />
          </div>
        </div>

        {(previewBefore > 0 || previewNow > 0) && (
          <div className="admin-promo-price-preview">
            {previewBefore > 0 && (
              <span>
                Antes: <s>{formatCOP(previewBefore)}</s>
              </span>
            )}
            {previewNow > 0 && (
              <span>
                Ahora: <strong>{formatCOP(previewNow)}</strong>
              </span>
            )}
            {previewDiscount && <span className="promo-badge">-{previewDiscount}%</span>}
          </div>
        )}

        <div className="admin-field-row">
          <div className="admin-field">
            <label>Etiqueta (opcional)</label>
            <input
              value={form.badge}
              onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
              placeholder={previewDiscount ? `Auto: -${previewDiscount}%` : 'Ej. HOT, -20%'}
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
            {resolvePromoBadge(promo) && (
              <span className="promo-badge">{resolvePromoBadge(promo)}</span>
            )}
            <strong>{promo.title}</strong>
            {promo.subtitle && (
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                {promo.subtitle}
              </p>
            )}
            {promo.priceBefore && promo.priceNow && (
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem' }}>
                <s style={{ color: 'var(--color-text-light)' }}>{formatCOP(promo.priceBefore)}</s>
                {' → '}
                <strong style={{ color: 'var(--color-secondary)' }}>{formatCOP(promo.priceNow)}</strong>
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

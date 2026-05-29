import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, mediaUrl } from '../api/client';
import { useProducts } from '../context/ProductsContext';
import { parseCOPInput } from '../utils/currency';
import { NAV_BRANDS } from '../data';

const CLOTHING_SIZES = ['S', 'M', 'L', 'XL'];
const SHOE_SIZES = ['38', '39', '40', '41', '42', '43'];
const DEFAULT_COLORS = [
  { name: 'Negro', hex: '#111111' },
  { name: 'Blanco', hex: '#f5f5f5' },
];

const emptyForm = {
  name: '',
  brand: NAV_BRANDS[0]?.name || 'Lacoste',
  productType: 'Polo',
  price: '',
  category: 'Polos',
  description: '',
  image: '',
  hoverImage: '',
  sizes: [...CLOTHING_SIZES],
  colors: [...DEFAULT_COLORS],
  active: true,
};

const AdminProductForm = () => {
  const { reloadProducts } = useProducts();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [sizePreset, setSizePreset] = useState('ropa');
  const [customSize, setCustomSize] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.getAdminProducts().then((list) => {
      const p = list.find((x) => String(x.id) === id);
      if (!p) return;
      setForm({
        name: p.name,
        brand: p.brand,
        productType: p.productType,
        price: String(p.price),
        category: p.category,
        description: p.description,
        image: p.image,
        hoverImage: p.hoverImage,
        sizes: p.sizes,
        colors: p.colors,
        active: p.active,
      });
      setSizePreset(p.sizes.some((s) => SHOE_SIZES.includes(s)) ? 'calzado' : 'ropa');
    });
  }, [id, isEdit]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { url } = await api.uploadImage(file);
      update('image', url);
      update('hoverImage', url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const applySizePreset = (preset) => {
    setSizePreset(preset);
    update('sizes', preset === 'calzado' ? [...SHOE_SIZES] : [...CLOTHING_SIZES]);
  };

  const addSize = () => {
    const s = customSize.trim();
    if (!s || form.sizes.includes(s)) return;
    update('sizes', [...form.sizes, s]);
    setCustomSize('');
  };

  const removeSize = (size) => update('sizes', form.sizes.filter((x) => x !== size));

  const addColor = () => {
    update('colors', [...form.colors, { name: 'Nuevo', hex: '#333333' }]);
  };

  const updateColor = (index, field, value) => {
    const colors = [...form.colors];
    colors[index] = { ...colors[index], [field]: value };
    update('colors', colors);
  };

  const removeColor = (index) => update('colors', form.colors.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const brandSlug =
      NAV_BRANDS.find((b) => b.name === form.brand)?.slug ||
      form.brand.toLowerCase().replace(/\s+/g, '-');

    const payload = {
      ...form,
      brandSlug,
      price: parseCOPInput(form.price),
      rating: 4.6,
      reviewCount: 0,
    };

    try {
      if (isEdit) await api.updateProduct(id, payload);
      else await api.createProduct(payload);
      await reloadProducts();
      navigate('/admin/productos');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>
        {isEdit ? 'Editar producto' : 'Nuevo producto'}
      </h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label className="admin-upload-zone">
          <input type="file" accept="image/*" capture="environment" onChange={handleUpload} />
          {uploading ? 'Subiendo foto…' : 'Toca para tomar o elegir foto'}
        </label>

        {form.image && (
          <div className="admin-preview product-card-image">
            <img src={mediaUrl(form.image)} alt="" className="product-card-fg" />
          </div>
        )}

        <div className="admin-field">
          <label>Nombre</label>
          <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </div>

        <div className="admin-field">
          <label>Marca</label>
          <select value={form.brand} onChange={(e) => update('brand', e.target.value)}>
            {NAV_BRANDS.map((b) => (
              <option key={b.slug} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label>Tipo de producto</label>
          <input
            value={form.productType}
            onChange={(e) => update('productType', e.target.value)}
            placeholder="Polo, Chaqueta, Tennis…"
          />
        </div>

        <div className="admin-field">
          <label>Precio (COP)</label>
          <input
            inputMode="numeric"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            placeholder="Ej. 189000"
            required
          />
        </div>

        <div className="admin-field">
          <label>Categoría</label>
          <input value={form.category} onChange={(e) => update('category', e.target.value)} />
        </div>

        <div className="admin-field">
          <label>Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>

        <div className="admin-field">
          <label>Tallas</label>
          <div className="admin-chip-row" style={{ marginBottom: '0.5rem' }}>
            <button
              type="button"
              className={`admin-chip ${sizePreset === 'ropa' ? 'selected' : ''}`}
              onClick={() => applySizePreset('ropa')}
            >
              Ropa S–XL
            </button>
            <button
              type="button"
              className={`admin-chip ${sizePreset === 'calzado' ? 'selected' : ''}`}
              onClick={() => applySizePreset('calzado')}
            >
              Calzado 38–43
            </button>
          </div>
          <div className="admin-chip-row">
            {form.sizes.map((s) => (
              <button key={s} type="button" className="admin-chip selected" onClick={() => removeSize(s)}>
                {s} ×
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              placeholder="Talla extra"
            />
            <button type="button" className="admin-btn-sm" onClick={addSize}>
              +
            </button>
          </div>
        </div>

        <div className="admin-field">
          <label>Colores</label>
          {form.colors.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                value={c.name}
                onChange={(e) => updateColor(i, 'name', e.target.value)}
                placeholder="Nombre"
                style={{ flex: 1 }}
              />
              <input
                type="color"
                value={c.hex}
                onChange={(e) => updateColor(i, 'hex', e.target.value)}
                style={{ width: 48, padding: 0, height: 44 }}
              />
              <button type="button" className="admin-btn-sm danger" onClick={() => removeColor(i)}>
                ×
              </button>
            </div>
          ))}
          <button type="button" className="admin-btn-sm" onClick={addColor}>
            + Color
          </button>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => update('active', e.target.checked)}
          />
          Visible en la tienda
        </label>

        {error && <p style={{ color: '#b91c1c' }}>{error}</p>}

        <button type="submit" className="btn" disabled={saving || !form.image}>
          {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </form>
    </>
  );
};

export default AdminProductForm;

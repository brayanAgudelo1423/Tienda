import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImagePlus, Camera, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { api, mediaUrl } from '../api/client';
import { useProducts } from '../context/ProductsContext';
import { parseCOPInput } from '../utils/currency';
import { compressImageForUpload } from '../utils/compressImage';
import { ALL_BRANDS } from '../data';
import {
  PRODUCT_CATEGORIES,
  GENDERS,
  LOCIONES_CATEGORY,
  LOCION_SIZES,
} from '../constants/catalog';

const CLOTHING_SIZES = ['S', 'M', 'L', 'XL'];
const SHOE_SIZES = ['38', '39', '40', '41', '42', '43'];
const DEFAULT_COLORS = [
  { name: 'Negro', hex: '#111111' },
  { name: 'Blanco', hex: '#f5f5f5' },
];

const emptyForm = {
  name: '',
  brand: ALL_BRANDS[0]?.name || 'Lacoste',
  productType: 'Polo',
  price: '',
  category: 'Polos',
  gender: '',
  description: '',
  image: '',
  hoverImage: '',
  gallery: [],
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
  const [uploadTarget, setUploadTarget] = useState('image');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const hoverGalleryInputRef = useRef(null);
  const extraGalleryInputRef = useRef(null);

  const isLocion = form.category === LOCIONES_CATEGORY;

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
        gender: p.gender || '',
        description: p.description,
        image: p.image,
        hoverImage: p.hoverImage,
        gallery: Array.isArray(p.gallery) ? p.gallery : [],
        sizes: p.sizes,
        colors: p.colors,
        active: p.active,
      });
      if (p.category === LOCIONES_CATEGORY) setSizePreset('locion');
      else if (p.sizes.some((s) => SHOE_SIZES.includes(s))) setSizePreset('calzado');
      else setSizePreset('ropa');
    });
  }, [id, isEdit]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleCategoryChange = (category) => {
    update('category', category);
    if (category === LOCIONES_CATEGORY) {
      setSizePreset('locion');
      update('productType', 'Eau de Parfum');
      update('sizes', [...LOCION_SIZES.slice(0, 3)]);
      update('colors', [{ name: 'Original', hex: '#d4c4a8' }]);
      if (!form.gender) update('gender', 'unisex');
    }
  };

  const handleUpload = async (e, target = 'image') => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Selecciona un archivo de imagen (JPG, PNG, WEBP…)');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const prepared = await compressImageForUpload(file);
      const { url } = await api.uploadImage(prepared);
      if (target === 'hover') {
        update('hoverImage', url);
      } else if (target === 'gallery') {
        setForm((f) => ({ ...f, gallery: [...(f.gallery || []), url] }));
      } else {
        setForm((f) => ({
          ...f,
          image: url,
          hoverImage: !f.hoverImage || f.hoverImage === f.image ? url : f.hoverImage,
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index) => {
    update(
      'gallery',
      form.gallery.filter((_, i) => i !== index)
    );
  };

  const moveGalleryImage = (index, direction) => {
    const next = [...form.gallery];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update('gallery', next);
  };

  const openGallery = (target = 'image') => {
    setUploadTarget(target);
    if (target === 'hover') hoverGalleryInputRef.current?.click();
    else if (target === 'gallery') extraGalleryInputRef.current?.click();
    else galleryInputRef.current?.click();
  };

  const openCamera = () => {
    setUploadTarget('image');
    cameraInputRef.current?.click();
  };

  const applySizePreset = (preset) => {
    setSizePreset(preset);
    if (preset === 'calzado') update('sizes', [...SHOE_SIZES]);
    else if (preset === 'locion') update('sizes', [...LOCION_SIZES]);
    else update('sizes', [...CLOTHING_SIZES]);
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

    if (isLocion && !form.gender) {
      setError('Selecciona género para la loción');
      setSaving(false);
      return;
    }

    const brandSlug =
      ALL_BRANDS.find((b) => b.name === form.brand)?.slug ||
      form.brand.toLowerCase().replace(/\s+/g, '-');

    const pendingSize = customSize.trim();
    const sizes =
      pendingSize && !form.sizes.includes(pendingSize)
        ? [...form.sizes, pendingSize]
        : form.sizes;

    const payload = {
      ...form,
      sizes,
      brandSlug,
      gender: isLocion ? form.gender : null,
      price: parseCOPInput(form.price),
      rating: 4.6,
      reviewCount: 0,
    };

    try {
      if (isEdit) await api.updateProduct(id, payload);
      else await api.createProduct(payload);
      if (pendingSize) setCustomSize('');
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
        <div className="admin-upload-section">
          <label className="admin-field-label">Foto del producto</label>

          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*"
            className="admin-upload-input-hidden"
            onChange={(e) => handleUpload(e, uploadTarget)}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="admin-upload-input-hidden"
            onChange={(e) => handleUpload(e, 'image')}
          />
          <input
            ref={hoverGalleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*"
            className="admin-upload-input-hidden"
            onChange={(e) => handleUpload(e, 'hover')}
          />
          <input
            ref={extraGalleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*"
            className="admin-upload-input-hidden"
            onChange={(e) => handleUpload(e, 'gallery')}
          />

          {form.image ? (
            <div className="admin-preview product-card-image">
              <img src={mediaUrl(form.image)} alt="" className="product-card-fg" />
            </div>
          ) : (
            <div className="admin-upload-placeholder">
              <ImagePlus size={32} strokeWidth={1.5} />
              <p>Sin foto aún</p>
            </div>
          )}

          <div className="admin-upload-actions">
            <button
              type="button"
              className="admin-upload-btn admin-upload-btn-primary"
              disabled={uploading}
              onClick={() => openGallery('image')}
            >
              <ImagePlus size={18} />
              {uploading && uploadTarget === 'image' ? 'Subiendo…' : 'Galería del teléfono'}
            </button>
            <button
              type="button"
              className="admin-upload-btn"
              disabled={uploading}
              onClick={openCamera}
            >
              <Camera size={18} />
              Tomar foto
            </button>
          </div>

          {form.image && (
            <button
              type="button"
              className="admin-upload-change"
              disabled={uploading}
              onClick={() => openGallery('image')}
            >
              Cambiar foto principal
            </button>
          )}

          {form.image && form.hoverImage && form.hoverImage !== form.image && (
            <div className="admin-preview admin-preview-sm product-card-image">
              <img src={mediaUrl(form.hoverImage)} alt="" className="product-card-fg" />
              <span className="admin-preview-caption">Hover / 2ª foto</span>
            </div>
          )}

          {form.image && (
            <button
              type="button"
              className="admin-upload-change"
              disabled={uploading}
              onClick={() => openGallery('hover')}
            >
              {uploading && uploadTarget === 'hover'
                ? 'Subiendo…'
                : 'Subir 2ª foto (hover, opcional)'}
            </button>
          )}

          <p className="admin-upload-hint">
            En el celular, «Galería del teléfono» abre tus fotos guardadas. Máx. 12 MB.
          </p>
        </div>

        <div className="admin-gallery-section">
          <label className="admin-field-label">Galería en ficha del producto (opcional)</label>
          <p className="admin-upload-hint" style={{ marginTop: 0 }}>
            La foto principal y la de hover se usan en las tarjetas. Aquí puedes agregar más fotos
            que el cliente verá al abrir el producto. Si no agregas ninguna, solo se muestra una
            imagen.
          </p>

          {form.gallery.length > 0 && (
            <div className="admin-gallery-grid">
              {form.gallery.map((url, index) => (
                <div key={`${url}-${index}`} className="admin-gallery-item">
                  <img src={mediaUrl(url)} alt="" />
                  <div className="admin-gallery-item-actions">
                    <button
                      type="button"
                      className="admin-gallery-icon-btn"
                      disabled={index === 0}
                      onClick={() => moveGalleryImage(index, -1)}
                      aria-label="Mover arriba"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      className="admin-gallery-icon-btn"
                      disabled={index === form.gallery.length - 1}
                      onClick={() => moveGalleryImage(index, 1)}
                      aria-label="Mover abajo"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      type="button"
                      className="admin-gallery-icon-btn danger"
                      onClick={() => removeGalleryImage(index)}
                      aria-label="Eliminar foto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            className="admin-upload-btn"
            disabled={uploading || !form.image}
            onClick={() => openGallery('gallery')}
          >
            <ImagePlus size={18} />
            {uploading && uploadTarget === 'gallery'
              ? 'Subiendo…'
              : 'Agregar foto a la galería'}
          </button>
        </div>

        <div className="admin-field">
          <label>Nombre</label>
          <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </div>

        <div className="admin-field">
          <label>Categoría</label>
          <select value={form.category} onChange={(e) => handleCategoryChange(e.target.value)}>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {isLocion && (
          <div className="admin-field">
            <label>Género</label>
            <select value={form.gender} onChange={(e) => update('gender', e.target.value)} required>
              <option value="">Seleccionar…</option>
              {GENDERS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="admin-field">
          <label>Marca</label>
          <select value={form.brand} onChange={(e) => update('brand', e.target.value)}>
            {ALL_BRANDS.map((b) => (
              <option key={`${b.slug}-${b.name}`} value={b.name}>
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
            placeholder={isLocion ? 'Eau de Parfum, Eau de Toilette…' : 'Polo, Chaqueta, Tennis…'}
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
          <label>Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>

        <div className="admin-field">
          <label>{isLocion ? 'Presentaciones (ml)' : 'Tallas'}</label>
          <div className="admin-chip-row" style={{ marginBottom: '0.5rem' }}>
            {!isLocion && (
              <>
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
              </>
            )}
            {isLocion && (
              <button
                type="button"
                className={`admin-chip ${sizePreset === 'locion' ? 'selected' : ''}`}
                onClick={() => applySizePreset('locion')}
              >
                Lociones 30–200ml
              </button>
            )}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSize();
                }
              }}
              placeholder={isLocion ? 'Ej. 150ml' : 'Ej. US10/11'}
            />
            <button type="button" className="admin-btn-sm" onClick={addSize}>
              +
            </button>
          </div>
        </div>

        <div className="admin-field">
          <label>Colores / variantes</label>
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

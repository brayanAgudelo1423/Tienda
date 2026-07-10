import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { mediaUrl } from '../api/client';

const ProductImageGallery = ({ images, productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasMultiple = images.length > 1;
  const activeSrc = images[activeIndex] ?? images[0];

  const goPrev = useCallback(
    () => setActiveIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const goNext = useCallback(
    () => setActiveIndex((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    setActiveIndex(0);
    setLightboxOpen(false);
  }, [images]);

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft' && hasMultiple) goPrev();
      if (e.key === 'ArrowRight' && hasMultiple) goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, hasMultiple, goPrev, goNext]);

  if (!images?.length) return null;

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <img
          src={mediaUrl(activeSrc)}
          alt={productName}
          className="product-card-fg product-gallery-img"
          loading="eager"
          decoding="async"
        />
        {hasMultiple && (
          <>
            <button
              type="button"
              className="product-gallery-nav product-gallery-nav-prev"
              onClick={goPrev}
              aria-label="Foto anterior"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="product-gallery-nav product-gallery-nav-next"
              onClick={goNext}
              aria-label="Foto siguiente"
            >
              <ChevronRight size={22} />
            </button>
            <button
              type="button"
              className="product-gallery-expand"
              onClick={() => setLightboxOpen(true)}
              aria-label="Ver imagen ampliada"
            >
              <Expand size={18} />
            </button>
            <span className="product-gallery-counter">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="product-gallery-thumbs" role="tablist" aria-label="Fotos del producto">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Foto ${index + 1}`}
              className={`product-gallery-thumb${index === activeIndex ? ' active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              <img src={mediaUrl(src)} alt="" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="product-gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              className="product-gallery-lightbox-close"
              onClick={() => setLightboxOpen(false)}
              aria-label="Cerrar galería"
            >
              <X size={28} />
            </button>
            {hasMultiple && (
              <>
                <button
                  type="button"
                  className="product-gallery-lightbox-nav prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  type="button"
                  className="product-gallery-lightbox-nav next"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Foto siguiente"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}
            <motion.img
              key={activeSrc}
              src={mediaUrl(activeSrc)}
              alt={productName}
              className="product-gallery-lightbox-img"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
            {hasMultiple && (
              <p className="product-gallery-lightbox-counter">
                {activeIndex + 1} / {images.length}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductImageGallery;

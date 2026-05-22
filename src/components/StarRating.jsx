import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, reviewCount, size = 18 }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div style={styles.wrapper}>
      <div style={styles.stars} aria-label={`${rating} de 5 estrellas`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= fullStars;
          const half = star === fullStars + 1 && hasHalf;

          return (
            <span key={star} style={styles.starWrap}>
              <Star size={size} style={styles.empty} />
              {(filled || half) && (
                <span style={{ ...styles.filled, width: half ? '50%' : '100%' }}>
                  <Star size={size} fill="currentColor" stroke="currentColor" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      <span style={styles.ratingText}>{rating.toFixed(1)}</span>
      {reviewCount != null && (
        <span style={styles.reviewCount}>({reviewCount} reseñas)</span>
      )}
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  stars: { display: 'flex', gap: '2px' },
  starWrap: { position: 'relative', display: 'inline-flex' },
  empty: { color: '#ddd' },
  filled: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    color: '#111',
    display: 'inline-flex',
  },
  ratingText: { fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-primary)' },
  reviewCount: { fontSize: '0.85rem', color: 'var(--color-text-light)' },
};

export default StarRating;

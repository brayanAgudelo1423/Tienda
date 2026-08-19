import { useEffect } from 'react';

/**
 * Pausa animaciones CSS cuando el elemento sale de pantalla (mejor scroll).
 */
export function usePauseAnimationWhenHidden(targetRef, selector) {
  useEffect(() => {
    const root = targetRef.current;
    if (!root) return undefined;

    const animated = root.querySelector(selector);
    if (!animated) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        animated.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      },
      { root: null, threshold: 0.05, rootMargin: '80px 0px' }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [targetRef, selector]);
}

const LOCK_CLASS = 'store-scroll-locked';
let lockCount = 0;

export function lockPageScroll() {
  lockCount += 1;
  if (lockCount === 1) {
    document.documentElement.classList.add(LOCK_CLASS);
  }
}

export function unlockPageScroll() {
  if (lockCount <= 0) return;
  lockCount -= 1;
  if (lockCount === 0) {
    document.documentElement.classList.remove(LOCK_CLASS);
  }
}

/** Fuerza desbloqueo (p. ej. si quedó un lock huérfano tras la carga). */
export function forceUnlockPageScroll() {
  lockCount = 0;
  document.documentElement.classList.remove(LOCK_CLASS);
  document.body.style.removeProperty('overflow');
  document.documentElement.style.removeProperty('overflow');
  document.body.style.removeProperty('position');
  document.body.style.removeProperty('top');
  document.body.style.removeProperty('width');
}

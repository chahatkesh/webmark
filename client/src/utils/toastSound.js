/**
 * Plays /public/toast.mp3 for all toast types.
 * Respects prefers-reduced-motion.
 */
const _audio = typeof window !== "undefined" ? new Audio("/toast.mp3") : null;
if (_audio) {
  _audio.volume = 0.4;
  // Pre-load so first play is instant
  _audio.load();
}

export function playToastSound() {
  try {
    if (
      !_audio ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    // Reset to start so rapid toasts each play from the beginning
    _audio.currentTime = 0;
    _audio.play().catch(() => {
      // Browser may block autoplay before first user gesture — silently ignore
    });
  } catch {
    // Non-critical
  }
}

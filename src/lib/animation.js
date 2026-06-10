import { useState, useEffect, useContext, createContext } from "react";

// ============================================================================
//  ANIMATION UTILITIES — a clock plus easing/interpolation helpers shared by
//  every animation component.
//
//  The clock can be DRIVEN BY A PARENT via TickContext (so AnimationFrame can
//  add play/pause, seek, and speed control). When an animation is rendered
//  outside a provider, useTick() falls back to its own self-running rAF loop —
//  so existing usages keep working unchanged.
// ============================================================================

export const TickContext = createContext(null); // { t } when a parent drives the clock

export function useTick() {
  const ctx = useContext(TickContext);
  const hasCtx = !!ctx;
  const [t, setT] = useState(0);

  useEffect(() => {
    if (hasCtx) return; // a parent provider supplies the time
    let raf, start;
    const loop = (n) => {
      if (start == null) start = n;
      setT((n - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [hasCtx]);

  return hasCtx ? ctx.t : t;
}

// Smooth cosine ease, clamped to [0, 1].
export const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));

// Linear interpolation between a and b by fraction p.
export const L = (a, b, p) => a + (b - a) * p;

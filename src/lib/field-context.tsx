"use client";

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface FieldState {
  /** Mouse X in viewport px */
  x: number;
  /** Mouse Y in viewport px */
  y: number;
  /** Velocity X (px/frame at 60fps, smoothed) */
  vx: number;
  /** Velocity Y (px/frame at 60fps, smoothed) */
  vy: number;
  /** Speed magnitude */
  speed: number;
  /** Whether the mouse is within the window */
  active: boolean;
}

type FieldSub = (state: FieldState) => void;

interface FieldCtxValue {
  state: React.RefObject<FieldState>;
  subscribe: (cb: FieldSub) => () => void;
}

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */

const Ctx = createContext<FieldCtxValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider — zero re-renders, pure subscription + rAF              */
/* ------------------------------------------------------------------ */

export function FieldProvider({ children }: { children: ReactNode }) {
  const state = useRef<FieldState>({
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    speed: 0,
    active: false,
  });

  const subs = useRef(new Set<FieldSub>());
  const prev = useRef({ x: -9999, y: -9999, t: 0 });

  const subscribe = useCallback((cb: FieldSub) => {
    subs.current.add(cb);
    return () => {
      subs.current.delete(cb);
    };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - prev.current.t);
      const s = state.current;
      // Normalize velocity to ~px/frame at 60fps
      s.vx = ((e.clientX - prev.current.x) / dt) * 16.67;
      s.vy = ((e.clientY - prev.current.y) / dt) * 16.67;
      s.speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      s.x = e.clientX;
      s.y = e.clientY;
      s.active = true;
      prev.current = { x: e.clientX, y: e.clientY, t: now };
    };

    const onLeave = () => {
      state.current.active = false;
    };
    const onEnter = () => {
      state.current.active = true;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    // Animation loop: decay velocity + notify subscribers every frame
    let raf: number;
    const tick = () => {
      const s = state.current;
      s.vx *= 0.9;
      s.vy *= 0.9;
      s.speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      subs.current.forEach((cb) => cb(s));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Stable ref so provider value identity never changes
  const value = useRef<FieldCtxValue>({ state, subscribe });

  return <Ctx.Provider value={value.current}>{children}</Ctx.Provider>;
}

/* ------------------------------------------------------------------ */
/*  Hooks                                                             */
/* ------------------------------------------------------------------ */

/** Raw access to the field state ref and subscription function. */
export function useField(): FieldCtxValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useField must be used inside <FieldProvider>");
  return ctx;
}

/**
 * Subscribe a callback to run every animation frame with the current
 * field state. The callback should perform direct DOM mutations —
 * never call setState inside it.
 */
export function useFieldSubscribe(cb: FieldSub) {
  const { subscribe } = useField();
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => subscribe((s) => ref.current(s)), [subscribe]);
}

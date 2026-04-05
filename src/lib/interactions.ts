"use client";

import { useRef, useCallback } from "react";

interface MagneticHandlers {
  ref: React.RefObject<HTMLElement | null>;
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
}

export function useMagneticEffect(strength: number = 0.3): MagneticHandlers {
  const ref = useRef<HTMLElement | null>(null);
  const rafId = useRef<number | null>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const offsetX = e.clientX - centerX;
      const offsetY = e.clientY - centerY;

      const distance = Math.sqrt(offsetX ** 2 + offsetY ** 2);

      if (distance > 100) {
        // Outside magnetic radius — spring back
        el.style.transition =
          "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        el.style.transform = "translate(0px, 0px)";
        return;
      }

      // Cancel any pending rAF
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        if (!el) return;
        const translateX = offsetX * strength;
        const translateY = offsetY * strength;
        el.style.transition = "none";
        el.style.transform = `translate(${translateX}px, ${translateY}px)`;
        rafId.current = null;
      });
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    el.style.transition =
      "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    el.style.transform = "translate(0px, 0px)";
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

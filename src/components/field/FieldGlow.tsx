"use client";

import { useRef } from "react";
import { useFieldSubscribe } from "@/lib/field-context";

/**
 * Full-viewport radial glow that follows the cursor.
 * Intensity scales with cursor speed — faster movement = brighter flash.
 * Updated via direct DOM manipulation (zero re-renders).
 */
export default function FieldGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useFieldSubscribe((s) => {
    const el = ref.current;
    if (!el) return;
    const intensity = Math.min(0.06, 0.015 + s.speed * 0.003);
    el.style.background = `radial-gradient(600px circle at ${s.x}px ${s.y}px, rgba(255,255,255,${intensity.toFixed(4)}), transparent)`;
  });

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden
    />
  );
}

"use client";

import { useRef } from "react";
import { useFieldSubscribe } from "@/lib/field-context";

/**
 * Lab-instrument-style readouts at viewport edges.
 * Coordinates + velocity — extremely subtle (≈5 % opacity).
 * Contributes to the "observation interface" atmosphere.
 */
export default function FieldAnnotations() {
  const coordRef = useRef<HTMLSpanElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);

  useFieldSubscribe((s) => {
    if (coordRef.current) {
      coordRef.current.textContent = `${Math.round(s.x)} · ${Math.round(s.y)}`;
    }
    if (speedRef.current) {
      const v = Math.min(99.9, s.speed);
      speedRef.current.textContent = `δ ${v.toFixed(1)}`;
    }
  });

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }} aria-hidden>
      <span
        ref={coordRef}
        className="absolute bottom-4 left-4 text-[9px] tracking-[0.15em] text-white/[0.05] font-mono"
      />
      <span
        ref={speedRef}
        className="absolute bottom-4 right-4 text-[9px] tracking-[0.15em] text-white/[0.05] font-mono"
      />
    </div>
  );
}

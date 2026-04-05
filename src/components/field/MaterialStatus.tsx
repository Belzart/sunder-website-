"use client";

import { useRef, useEffect, useState } from "react";
import { useFieldSubscribe } from "@/lib/field-context";

/**
 * Persistent lab-instrument status bar.
 * Shows material state, field readings, and specimen integrity.
 * Updated via direct DOM mutations — zero re-renders during interaction.
 *
 * Fades in after a delay so it doesn't compete with the first impression.
 */
export default function MaterialStatus() {
  const stateRef = useRef<HTMLSpanElement>(null);
  const fieldRef = useRef<HTMLSpanElement>(null);
  const integrityRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  // Fade in after initial load
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Track interaction state for the status readout
  const interactionState = useRef<"idle" | "active" | "engaged">("idle");
  const lastActive = useRef(0);

  useFieldSubscribe((s) => {
    const now = performance.now();

    // Determine interaction state based on speed
    if (s.speed > 2) {
      interactionState.current = "engaged";
      lastActive.current = now;
    } else if (s.speed > 0.3) {
      interactionState.current = "active";
      lastActive.current = now;
    } else if (now - lastActive.current > 3000) {
      interactionState.current = "idle";
    }

    if (stateRef.current) {
      const states = {
        idle: "specimen.state: idle",
        active: "specimen.state: responsive",
        engaged: "specimen.state: engaged",
      };
      stateRef.current.textContent = states[interactionState.current];
    }

    if (fieldRef.current) {
      const amplitude = Math.min(1, s.speed * 0.05);
      fieldRef.current.textContent = `field.amplitude: ${amplitude.toFixed(3)}`;
    }

    if (integrityRef.current) {
      // Integrity decreases slightly under high-speed interaction, recovers
      const stress = Math.min(0.1, s.speed * 0.005);
      const integrity = (1 - stress).toFixed(3);
      integrityRef.current.textContent = `substrate.integrity: ${integrity}`;
    }
  });

  return (
    <div
      className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 pointer-events-none flex flex-col gap-3 transition-opacity duration-[2000ms]"
      style={{ zIndex: 2, opacity: visible ? 1 : 0 }}
      aria-hidden
    >
      <span
        ref={stateRef}
        className="text-[8px] md:text-[9px] tracking-[0.12em] text-white/[0.04] font-mono whitespace-nowrap"
      />
      <span
        ref={fieldRef}
        className="text-[8px] md:text-[9px] tracking-[0.12em] text-white/[0.04] font-mono whitespace-nowrap"
      />
      <span
        ref={integrityRef}
        className="text-[8px] md:text-[9px] tracking-[0.12em] text-white/[0.04] font-mono whitespace-nowrap"
      />
    </div>
  );
}

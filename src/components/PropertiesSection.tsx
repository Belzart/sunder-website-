"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useFieldSubscribe } from "@/lib/field-context";

/* ------------------------------------------------------------------ */
/*  Data — floating material-science vocabulary                       */
/*  Positioned as percentages within the section.                     */
/*  Base opacity varies: some barely visible, some truly hidden       */
/*  until the cursor "probes" them.                                   */
/* ------------------------------------------------------------------ */

const PROPERTIES = [
  { word: "RESPONSIVE", x: 12, y: 18, opacity: 0.07 },
  { word: "ADAPTIVE", x: 68, y: 25, opacity: 0.04 },
  { word: "PROGRAMMABLE", x: 22, y: 52, opacity: 0.06 },
  { word: "SELF-HEALING", x: 72, y: 65, opacity: 0.03 },
  { word: "DYNAMIC", x: 42, y: 38, opacity: 0.07 },
  { word: "RECONFIGURABLE", x: 55, y: 80, opacity: 0.05 },
  { word: "SHAPE-MEMORY", x: 8, y: 75, opacity: 0.04 },
  { word: "PIEZOELECTRIC", x: 78, y: 42, opacity: 0.03 },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function PropertiesSection() {
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useFieldSubscribe((s) => {
    const now = performance.now() / 1000;

    wordRefs.current.forEach((el, i) => {
      if (!el) return;
      const seed = i * 2.7;

      // Ambient drift — slow, organic, unique per word
      const driftX = Math.sin(now * 0.2 + seed) * 12;
      const driftY = Math.cos(now * 0.15 + seed * 1.3) * 8;

      // Cursor proximity → push + brighten
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = s.x - cx;
      const dy = s.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let pushX = 0;
      let pushY = 0;
      let bright = 1;

      if (dist < 350) {
        const raw = 1 - dist / 350;
        const t = raw * raw; // quadratic falloff
        // Non-Newtonian: fast cursor = stiffer
        const stiff = 1 / (1 + s.speed * 0.03);
        const nx = dist > 0.1 ? dx / dist : 0;
        const ny = dist > 0.1 ? dy / dist : 0;
        pushX = -nx * 30 * t * stiff;
        pushY = -ny * 30 * t * stiff;
        bright = 1 + t * 3; // up to 4× brighter on direct proximity
      }

      el.style.transform = `translate(${(driftX + pushX).toFixed(1)}px, ${(driftY + pushY).toFixed(1)}px)`;
      el.style.filter = `brightness(${bright.toFixed(2)})`;
    });
  });

  return (
    <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      {/* Section label */}
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="absolute top-8 left-8 md:left-16 text-[10px] tracking-[0.4em] text-white/[0.08] uppercase font-mono"
      >
        Material properties
      </motion.span>

      {/* Floating words */}
      {PROPERTIES.map((p, i) => (
        <motion.span
          key={p.word}
          ref={(el) => {
            wordRefs.current[i] = el;
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: p.opacity }}
          transition={{ duration: 2, delay: 0.5 + i * 0.1 }}
          viewport={{ once: true }}
          className="absolute text-[10px] md:text-xs tracking-[0.4em] text-white font-light select-none cursor-default"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            willChange: "transform, filter",
          }}
          data-cursor="expand"
        >
          {p.word}
        </motion.span>
      ))}
    </section>
  );
}

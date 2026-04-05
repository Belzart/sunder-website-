"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

interface Domain {
  name: string;
  descriptor: string;
}

const DOMAINS: Domain[] = [
  {
    name: "ROBOTICS",
    descriptor:
      "Compliant structures. Adaptive joints. Materials that move with intent.",
  },
  {
    name: "SPACE",
    descriptor:
      "Thermal metamaterials. Radiation-adaptive composites. Materials that endure.",
  },
  {
    name: "DEFENSE",
    descriptor:
      "Impact-responsive armor. Shape-shifting surfaces. Materials that protect.",
  },
  {
    name: "ENERGY",
    descriptor:
      "Piezoelectric substrates. Phase-change composites. Materials that convert.",
  },
];

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

/* ------------------------------------------------------------------ */
/*  Card                                                              */
/* ------------------------------------------------------------------ */

function DomainCard({ domain, index }: { domain: Domain; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const onEnter = useCallback(() => {
    const el = cardRef.current;
    if (el) el.style.transition = "none";
  }, []);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    el.style.transform = `perspective(800px) rotateY(${(x * 10).toFixed(2)}deg) rotateX(${(-y * 10).toFixed(2)}deg) scale(1.02)`;

    if (glowRef.current) {
      const px = ((x + 0.5) * 100).toFixed(1);
      const py = ((y + 0.5) * 100).toFixed(1);
      glowRef.current.style.background = `radial-gradient(300px circle at ${px}% ${py}%, rgba(255,255,255,0.06), transparent)`;
    }
  }, []);

  const onLeave = useCallback(() => {
    const el = cardRef.current;
    if (el) {
      el.style.transition =
        "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.5s";
      el.style.transform = "";
    }
    if (glowRef.current) glowRef.current.style.background = "";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: EASE }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <div
        ref={cardRef}
        className="group relative border border-white/[0.06] hover:border-white/[0.12] p-8 md:p-10 cursor-default"
        onMouseEnter={onEnter}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        data-cursor="expand"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Inner cursor-tracking glow */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none"
        />

        <div className="relative">
          <span className="block text-[10px] tracking-[0.3em] text-white/[0.08] mb-6 font-mono">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-xs tracking-[0.4em] text-white/35 group-hover:text-white/80 transition-colors duration-500 mb-3">
            {domain.name}
          </h3>
          <p className="text-[11px] leading-relaxed text-white/[0.12] group-hover:text-white/30 transition-colors duration-500">
            {domain.descriptor}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                           */
/* ------------------------------------------------------------------ */

export default function DomainsSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-8 md:px-16 py-24">
      <div className="w-full max-w-4xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-[10px] tracking-[0.4em] text-white/[0.06] mb-12 uppercase font-mono"
        >
          Application domains
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {DOMAINS.map((d, i) => (
            <DomainCard key={d.name} domain={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import FieldReactive from "@/components/field/FieldReactive";

/* ------------------------------------------------------------------ */
/*  Research areas                                                    */
/* ------------------------------------------------------------------ */

interface ResearchArea {
  id: string;
  label: string;
  title: string;
  description: string;
  note: string;
}

const AREAS: ResearchArea[] = [
  {
    id: "01",
    label: "ACTIVE SUBSTRATES",
    title: "Surfaces that compute through structure.",
    description:
      "Substrates embedded with responsive microstructures that process mechanical, thermal, and electromagnetic signals without external circuitry.",
    note: "stimulus → structural response → emergent computation",
  },
  {
    id: "02",
    label: "DYNAMIC COMPOSITES",
    title: "Materials that reconfigure under force.",
    description:
      "Multi-phase composites with programmable interfaces. Internal geometry shifts in response to load, temperature, or applied field — changing stiffness, damping, and conductivity in real time.",
    note: "passive composite → active composite → programmable composite",
  },
  {
    id: "03",
    label: "SHAPE-MEMORY SYSTEMS",
    title: "Form follows force. Then remembers.",
    description:
      "Alloys and polymers with engineered memory. Deform under stress, recover original geometry on command. Multi-state memory enables complex shape sequences without actuators.",
    note: "deformation → recovery → re-programmable memory states",
  },
  {
    id: "04",
    label: "RESPONSIVE INTERFACES",
    title: "Where material meets signal.",
    description:
      "The boundary layer between a responsive material and its environment. Surfaces that sense contact, pressure distribution, chemical gradients, and field intensity — then translate that data into material behavior.",
    note: "environment → interface → material intelligence",
  },
];

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

/* ------------------------------------------------------------------ */
/*  Research card with 3D tilt + inner glow                           */
/* ------------------------------------------------------------------ */

function ResearchCard({ area, index }: { area: ResearchArea; index: number }) {
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

    el.style.transform = `perspective(1000px) rotateY(${(x * 6).toFixed(2)}deg) rotateX(${(-y * 6).toFixed(2)}deg) scale(1.01)`;

    if (glowRef.current) {
      const px = ((x + 0.5) * 100).toFixed(1);
      const py = ((y + 0.5) * 100).toFixed(1);
      glowRef.current.style.background = `radial-gradient(400px circle at ${px}% ${py}%, rgba(255,255,255,0.04), transparent)`;
    }
  }, []);

  const onLeave = useCallback(() => {
    const el = cardRef.current;
    if (el) {
      el.style.transition = "transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)";
      el.style.transform = "";
    }
    if (glowRef.current) glowRef.current.style.background = "";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: EASE }}
      viewport={{ once: true, margin: "-80px" }}
    >
      <div
        ref={cardRef}
        className="group relative border border-white/[0.05] hover:border-white/[0.10] p-8 md:p-12 cursor-default"
        onMouseEnter={onEnter}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        data-cursor="expand"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div ref={glowRef} className="absolute inset-0 pointer-events-none" />

        <div className="relative">
          {/* Area ID + Label */}
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-[10px] tracking-[0.2em] text-white/[0.06] font-mono">
              {area.id}
            </span>
            <span className="text-[10px] tracking-[0.4em] text-white/[0.12] uppercase font-mono">
              {area.label}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base md:text-lg font-light text-white/50 group-hover:text-white/80 transition-colors duration-500 mb-6 leading-relaxed">
            {area.title}
          </h3>

          {/* Description */}
          <p className="text-[11px] md:text-xs leading-[1.8] text-white/[0.12] group-hover:text-white/25 transition-colors duration-700 mb-8 max-w-lg">
            {area.description}
          </p>

          {/* Lab note — nearly invisible until hover */}
          <p className="text-[9px] tracking-[0.15em] text-white/[0.04] group-hover:text-white/[0.12] transition-colors duration-1000 font-mono">
            {area.note}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page content                                                      */
/* ------------------------------------------------------------------ */

export default function ResearchContent() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-start justify-end px-8 md:px-16 pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
        >
          <FieldReactive glow={0.5} radius={400}>
            <p className="text-[10px] tracking-[0.5em] text-white/[0.10] uppercase mb-8 font-mono">
              Research
            </p>
            <h1 className="text-2xl md:text-4xl font-light text-white/60 leading-[1.35] tracking-tight max-w-2xl">
              Exploring a new class of matter.
            </h1>
            <p className="mt-6 text-sm tracking-[0.1em] text-white/15 font-light max-w-lg">
              Where materials stop being passive and start being participants.
            </p>
          </FieldReactive>
        </motion.div>
      </section>

      {/* Research areas */}
      <section className="px-8 md:px-16 pb-24 md:pb-32">
        <div className="max-w-3xl mx-auto flex flex-col gap-6 md:gap-8">
          {AREAS.map((area, i) => (
            <ResearchCard key={area.id} area={area} index={i} />
          ))}
        </div>
      </section>

      {/* Manifesto fragment */}
      <section className="min-h-[50vh] flex items-center justify-center px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2 }}
          viewport={{ once: true }}
        >
          <FieldReactive glow={0.6} radius={350}>
            <p
              className="text-lg md:text-2xl font-light text-white/20 tracking-tight text-center max-w-xl leading-relaxed cursor-default"
              data-cursor="expand"
            >
              Structure is behavior.
            </p>
          </FieldReactive>
        </motion.div>
      </section>
    </>
  );
}

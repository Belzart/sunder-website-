"use client";

import { useState, useCallback } from "react";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const COLORS = [
  { name: "Void Black", hex: "#0A0A0A", border: true },
  { name: "Pure White", hex: "#FFFFFF", border: false },
  { name: "Titanium", hex: "#b8bcc0", border: false },
  { name: "Carbon", hex: "#1a1a1a", border: true },
  { name: "Frost", hex: "#cde0f0", border: false },
  { name: "Molten", hex: "#ff6a00", border: false },
  { name: "Ember", hex: "#ff4400", border: false },
] as const;

const OPACITY_STEPS = [90, 70, 50, 40, 30, 20, 15, 10] as const;

function SwatchCard({ name, hex, border }: { name: string; hex: string; border: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [hex]);

  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col items-start gap-2 cursor-pointer group"
      onClick={handleClick}
    >
      <p className="text-xs text-white/30 tracking-[0.1em] uppercase">{name}</p>

      <div
        className="w-20 h-20 rounded-lg transition-transform duration-200 group-hover:scale-105"
        style={{
          backgroundColor: hex,
          border: border ? "1px solid rgba(255,255,255,0.12)" : "none",
        }}
      />

      <div className="h-4">
        {copied ? (
          <motion.p
            key="copied"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-green-400 tracking-[0.05em]"
          >
            Copied!
          </motion.p>
        ) : (
          <p className="text-xs text-white/40 font-mono tracking-[0.05em] group-hover:text-white/60 transition-colors">
            {hex}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function BrandColors() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Section label */}
          <motion.p variants={itemVariants} className="text-xs text-white/30 tracking-[0.3em] uppercase mb-3">
            03 — Color
          </motion.p>
          <motion.h2 variants={itemVariants} className="text-2xl font-light text-white/80 mb-4">
            Palette
          </motion.h2>
          <motion.p variants={itemVariants} className="text-sm text-white/30 mb-12">
            Click any swatch to copy the hex value.
          </motion.p>

          {/* Main swatches */}
          <motion.div
            variants={containerVariants}
            className="flex flex-wrap gap-8 mb-20"
          >
            {COLORS.map((color) => (
              <SwatchCard key={color.hex} {...color} />
            ))}
          </motion.div>

          {/* Opacity scale */}
          <motion.div variants={itemVariants}>
            <p className="text-xs text-white/30 tracking-[0.3em] uppercase mb-6">
              White Opacity Scale
            </p>
            <div className="flex flex-wrap gap-4">
              {OPACITY_STEPS.map((pct) => (
                <div key={pct} className="flex flex-col items-center gap-2">
                  <div
                    className="w-14 h-14 rounded-md"
                    style={{ backgroundColor: `rgba(255,255,255,${pct / 100})` }}
                  />
                  <p className="text-xs text-white/25 font-mono">{pct}%</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

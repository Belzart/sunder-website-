"use client";

import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const TRACKING_STEPS = [
  { label: "0.1em", value: "0.1em" },
  { label: "0.15em", value: "0.15em" },
  { label: "0.2em", value: "0.2em" },
  { label: "0.3em", value: "0.3em" },
  { label: "0.4em", value: "0.4em" },
] as const;

const SIZE_STEPS = [
  { label: "xs", cls: "text-xs" },
  { label: "sm", cls: "text-sm" },
  { label: "base", cls: "text-base" },
  { label: "lg", cls: "text-lg" },
  { label: "xl", cls: "text-xl" },
  { label: "2xl", cls: "text-2xl" },
  { label: "4xl", cls: "text-4xl" },
] as const;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col sm:flex-row sm:items-center gap-3 py-5 border-b border-white/[0.06]"
    >
      <p className="text-xs text-white/30 tracking-[0.1em] uppercase w-28 shrink-0">{label}</p>
      <div className="flex-1">{children}</div>
    </motion.div>
  );
}

export default function BrandTypography() {
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
            04 — Typography
          </motion.p>
          <motion.h2 variants={itemVariants} className="text-2xl font-light text-white/80 mb-2">
            Type System
          </motion.h2>

          {/* Typeface name */}
          <motion.div variants={itemVariants} className="mt-12 mb-16">
            <p className="text-xs text-white/25 tracking-[0.2em] uppercase mb-4">Typeface</p>
            <p className="text-6xl font-light text-white/80 tracking-tight">Inter</p>
            <p className="text-sm text-white/25 mt-2">Google Fonts — Variable</p>
          </motion.div>

          {/* Weight examples */}
          <motion.div variants={itemVariants} className="mb-4">
            <p className="text-xs text-white/30 tracking-[0.3em] uppercase mb-6">Weights</p>
          </motion.div>

          <Row label="Light / 300">
            <p className="text-2xl font-light text-white/70">The future is material.</p>
          </Row>

          <Row label="Medium / 500">
            <p className="text-lg font-medium tracking-[0.3em] text-white/70">SUNDER</p>
          </Row>

          {/* Letter spacing scale */}
          <motion.div variants={itemVariants} className="mt-14 mb-4">
            <p className="text-xs text-white/30 tracking-[0.3em] uppercase mb-6">Tracking Scale</p>
          </motion.div>

          {TRACKING_STEPS.map(({ label, value }) => (
            <Row key={value} label={label}>
              <p
                className="text-sm font-medium text-white/70 uppercase"
                style={{ letterSpacing: value }}
              >
                SUNDER
              </p>
            </Row>
          ))}

          {/* Size scale */}
          <motion.div variants={itemVariants} className="mt-14 mb-4">
            <p className="text-xs text-white/30 tracking-[0.3em] uppercase mb-6">Size Scale</p>
          </motion.div>

          {SIZE_STEPS.map(({ label, cls }) => (
            <Row key={label} label={label}>
              <p className={`${cls} font-light text-white/70`}>Materials</p>
            </Row>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

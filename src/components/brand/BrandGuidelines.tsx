"use client";

import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const DOS = [
  "Use generous whitespace",
  "Keep text minimal and confident",
  "Prefer uppercase for UI elements",
  "Use smooth, physics-based animations",
  "Dark backgrounds, light text",
] as const;

const DONTS = [
  "Use bright or saturated backgrounds",
  "Add decorative elements or borders",
  "Use bouncy or cartoonish animations",
  "Crowd content — let it breathe",
  "Use more than 2 font weights",
] as const;

function GuidelineItem({
  text,
  type,
}: {
  text: string;
  type: "do" | "dont";
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="flex items-start gap-3 py-3 border-b border-white/[0.05] last:border-0"
    >
      <span
        className={`mt-0.5 text-sm font-bold shrink-0 ${
          type === "do" ? "text-green-400" : "text-red-400"
        }`}
      >
        {type === "do" ? "✓" : "✕"}
      </span>
      <p className="text-sm text-white/60 leading-relaxed">{text}</p>
    </motion.div>
  );
}

export default function BrandGuidelines() {
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
            05 — Guidelines
          </motion.p>
          <motion.h2 variants={itemVariants} className="text-2xl font-light text-white/80 mb-16">
            Dos &amp; Don&apos;ts
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Do column */}
            <motion.div variants={itemVariants}>
              <p className="text-xs text-green-400/70 tracking-[0.2em] uppercase mb-6 font-medium">
                Do
              </p>
              <div>
                {DOS.map((text) => (
                  <GuidelineItem key={text} text={text} type="do" />
                ))}
              </div>
            </motion.div>

            {/* Don't column */}
            <motion.div variants={itemVariants}>
              <p className="text-xs text-red-400/70 tracking-[0.2em] uppercase mb-6 font-medium">
                Don&apos;t
              </p>
              <div>
                {DONTS.map((text) => (
                  <GuidelineItem key={text} text={text} type="dont" />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer note */}
          <motion.div variants={itemVariants} className="mt-24 pt-8 border-t border-white/[0.06]">
            <p className="text-xs text-white/15 tracking-[0.15em] text-center uppercase">
              Sunder Brand System — Internal Use Only
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

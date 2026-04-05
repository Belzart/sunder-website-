"use client";

import { motion } from "framer-motion";

export default function BrandHero() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white/90 mb-6">
            Sunder Brand System
          </h1>
          <p className="text-sm text-white/20 tracking-[0.2em] uppercase">
            Internal use only. Do not distribute.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="origin-left mt-12 h-px bg-white/10"
        />
      </div>
    </section>
  );
}

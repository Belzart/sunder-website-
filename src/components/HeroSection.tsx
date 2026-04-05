"use client";

import { motion } from "framer-motion";
import FieldReactive from "@/components/field/FieldReactive";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-end pb-20 md:pb-24">
      {/* Primary tagline */}
      <FieldReactive glow={0.8} radius={350}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5, ease: EASE }}
          className="text-base md:text-lg tracking-[0.25em] text-white/30 font-light cursor-default"
          data-cursor="expand"
        >
          The future is material.
        </motion.p>
      </FieldReactive>

      {/* Lab-style specimen label — very faint, appears later */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 3 }}
        className="mt-4 text-[9px] tracking-[0.3em] text-white/[0.05] font-mono cursor-default"
      >
        specimen 001 — active substrate
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 5 }}
          className="text-[8px] tracking-[0.4em] text-white/[0.06] uppercase font-mono"
        >
          observe
        </motion.span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-6 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent"
        />
      </motion.div>
    </section>
  );
}

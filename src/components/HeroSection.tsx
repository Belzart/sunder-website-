"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-end pb-28 md:pb-32 pointer-events-none">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
        className="text-base md:text-lg tracking-[0.2em] text-white/40 font-light"
      >
        The future is material.
      </motion.p>
    </section>
  );
}

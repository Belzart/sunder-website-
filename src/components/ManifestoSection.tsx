"use client";

import { motion } from "framer-motion";

export default function ManifestoSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-8 md:px-12">
      <div className="max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-2xl md:text-4xl font-light leading-relaxed md:leading-relaxed text-white/80 tracking-tight"
        >
          The industries shaping tomorrow are constrained by the materials of
          today.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-8 text-base md:text-lg font-light text-white/30 tracking-wide"
        >
          We&apos;re changing that.
        </motion.p>
      </div>
    </section>
  );
}

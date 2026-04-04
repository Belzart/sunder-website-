"use client";

import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-8 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center"
      >
        <p className="text-sm md:text-base tracking-[0.15em] text-white/30 font-light mb-10">
          Interested in what we&apos;re building?
        </p>
        <a
          href="mailto:hello@sunder.com"
          className="inline-block text-xs font-medium tracking-[0.2em] text-white/70 border border-white/20 rounded-full px-8 py-3.5 transition-all duration-500 hover:text-white hover:border-white/50 hover:bg-white/5 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        >
          GET IN TOUCH
        </a>
      </motion.div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

const quoteWords = "The industries shaping tomorrow are constrained by the materials of today.".split(" ");

export default function ManifestoSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-8 md:px-12">
      <div className="max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-2xl md:text-4xl font-light leading-relaxed md:leading-relaxed tracking-tight cursor-default"
          data-cursor="expand"
        >
          {quoteWords.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block text-white/80"
              style={{ marginRight: "0.25em" }}
              whileHover={{ color: "rgba(255,255,255,1)", scale: 1.05 }}
              transition={{ duration: 0.15 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-8 text-base md:text-lg font-light text-white/30 tracking-wide cursor-default"
          whileHover={{ textShadow: "0 0 20px rgba(255,255,255,0.3)" }}
          data-cursor="expand"
        >
          We&apos;re changing that.
        </motion.p>
      </div>
    </section>
  );
}

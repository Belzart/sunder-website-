"use client";

import { motion } from "framer-motion";
import FieldReactive from "@/components/field/FieldReactive";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export default function ThesisSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-8 md:px-16">
      <div className="max-w-3xl">
        {/* Lab section label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-[10px] tracking-[0.4em] text-white/[0.06] uppercase mb-12 font-mono"
        >
          Observation
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <FieldReactive glow={0.6} displace={4} radius={400}>
            <h2
              className="text-2xl md:text-4xl lg:text-5xl font-light leading-[1.35] tracking-tight text-white/60 cursor-default"
              data-cursor="expand"
            >
              We engineer matter that responds
              <span className="text-white/20">
                {" "}— materials that sense force and reconfigure under signal,
                heat, or field.
              </span>
            </h2>
          </FieldReactive>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12"
        >
          <FieldReactive glow={0.4} radius={300}>
            <p
              className="text-sm md:text-base tracking-[0.15em] text-white/[0.12] font-light cursor-default"
              data-cursor="expand"
            >
              From passive substrate to active interface.
            </p>
          </FieldReactive>
        </motion.div>
      </div>
    </section>
  );
}

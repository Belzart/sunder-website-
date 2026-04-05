"use client";

import { motion } from "framer-motion";
import FieldReactive from "@/components/field/FieldReactive";

interface Props {
  text: string;
}

/**
 * A single atmospheric statement. Used as a transition between sections.
 * Very restrained — low opacity, generous spacing, field-reactive glow.
 */
export default function ManifestoFragment({ text }: Props) {
  return (
    <section className="min-h-[40vh] flex items-center justify-center px-8 md:px-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2 }}
        viewport={{ once: true, margin: "-80px" }}
      >
        <FieldReactive glow={0.7} radius={350}>
          <p
            className="text-sm md:text-base font-light text-white/[0.10] tracking-[0.15em] text-center cursor-default"
            data-cursor="expand"
          >
            {text}
          </p>
        </FieldReactive>
      </motion.div>
    </section>
  );
}

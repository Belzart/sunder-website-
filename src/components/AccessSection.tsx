"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FieldReactive from "@/components/field/FieldReactive";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export default function AccessSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-8 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center"
      >
        <FieldReactive glow={0.5} radius={350}>
          <p className="text-[10px] tracking-[0.4em] text-white/[0.06] uppercase mb-12 font-mono">
            Access
          </p>

          <p className="text-sm md:text-base font-light text-white/20 tracking-wide mb-10 max-w-sm mx-auto leading-relaxed">
            Early access is limited. We are selectively onboarding partners, investors, and collaborators.
          </p>

          <Link
            href="/access"
            className="inline-block text-[11px] tracking-[0.3em] text-white/25 hover:text-white/60 border border-white/[0.06] hover:border-white/[0.15] px-8 py-3.5 transition-all duration-500 uppercase"
            data-cursor="expand"
          >
            Request access
          </Link>

          <p className="mt-10 text-[9px] tracking-[0.15em] text-white/[0.05] font-mono">
            hello@sunder.com
          </p>
        </FieldReactive>
      </motion.div>
    </section>
  );
}

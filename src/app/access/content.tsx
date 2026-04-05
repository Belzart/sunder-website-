"use client";

import { motion } from "framer-motion";
import FieldReactive from "@/components/field/FieldReactive";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export default function AccessContent() {
  return (
    <section className="min-h-screen flex items-center justify-center px-8 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
        className="text-center max-w-md"
      >
        <FieldReactive glow={0.5} radius={400}>
          <p className="text-[10px] tracking-[0.5em] text-white/[0.06] uppercase mb-16 font-mono">
            Access
          </p>

          <p className="text-sm md:text-base font-light text-white/25 leading-relaxed tracking-wide mb-6">
            Request early access to the research interface.
          </p>

          <p className="text-[11px] font-light text-white/[0.12] leading-relaxed tracking-wide mb-12">
            We are selectively onboarding partners, investors,
            and technical collaborators with relevant domain expertise.
          </p>

          <a
            href="mailto:hello@sunder.com"
            className="inline-block text-base md:text-lg tracking-[0.1em] text-white/30 hover:text-white/70 transition-colors duration-500 font-light"
            data-cursor="expand"
          >
            hello@sunder.com
          </a>

          <div className="mt-16 flex items-center justify-center gap-6">
            <span className="text-[9px] tracking-[0.2em] text-white/[0.05] font-mono">
              Partnership
            </span>
            <span className="w-px h-2 bg-white/[0.04]" />
            <span className="text-[9px] tracking-[0.2em] text-white/[0.05] font-mono">
              Investment
            </span>
            <span className="w-px h-2 bg-white/[0.04]" />
            <span className="text-[9px] tracking-[0.2em] text-white/[0.05] font-mono">
              Collaboration
            </span>
          </div>
        </FieldReactive>
      </motion.div>
    </section>
  );
}

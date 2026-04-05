"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const industries = ["Robotics", "Space", "Defense", "Energy"];

// Generate a fresh set of per-letter scatter offsets
function makeOffsets(word: string) {
  return word.split("").map(() => ({
    x: (Math.random() - 0.5) * 20,
    y: (Math.random() - 0.5) * 20,
  }));
}

// Initial static offsets computed once at module level (never during render)
const initialOffsets: Record<string, { x: number; y: number }[]> = {};
for (const industry of industries) {
  initialOffsets[industry] = makeOffsets(industry);
}

function IndustryLabel({ industry, index }: { industry: string; index: number }) {
  const [glitching, setGlitching] = useState(false);
  const [offsets, setOffsets] = useState(initialOffsets[industry]);

  useEffect(() => {
    if (!glitching) return;
    const timer = setTimeout(() => setGlitching(false), 300);
    return () => clearTimeout(timer);
  }, [glitching]);

  const handleClick = () => {
    setOffsets(makeOffsets(industry));
    setGlitching(true);
  };

  const letters = industry.split("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: "easeOut",
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative group"
    >
      <motion.span
        className="block text-xs md:text-sm tracking-[0.4em] text-white/20 uppercase font-light cursor-default select-none"
        whileHover={{ scale: 1.15, color: "rgba(255,255,255,0.9)", letterSpacing: "0.5em" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        onClick={handleClick}
        data-cursor="expand"
      >
        {glitching
          ? letters.map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                animate={{ x: offsets[i].x, y: offsets[i].y }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              >
                {letter}
              </motion.span>
            ))
          : industry}
      </motion.span>
      <div className="h-px bg-white/30 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5" />
    </motion.div>
  );
}

export default function IndustriesSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center px-8 md:px-12">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-x-12">
        {industries.map((industry, i) => (
          <IndustryLabel key={industry} industry={industry} index={i} />
        ))}
      </div>
    </section>
  );
}

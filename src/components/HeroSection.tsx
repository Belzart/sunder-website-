"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const MaterialSphere = dynamic(() => import("./MaterialSphere"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#0A0A0A]" />,
});

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 3D Sphere */}
      <div className="absolute inset-0">
        <MaterialSphere />
      </div>

      {/* Tagline */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-28 md:pb-32 pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
          className="text-base md:text-lg tracking-[0.2em] text-white/40 font-light"
        >
          The future is material.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] text-white/20 uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-6 bg-gradient-to-b from-white/20 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}

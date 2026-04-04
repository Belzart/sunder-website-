"use client";

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 md:px-12"
    >
      <span className="text-sm font-medium tracking-[0.3em] text-white/90">
        SUNDER
      </span>
      <a
        href="mailto:hello@sunder.com"
        className="text-xs font-medium tracking-[0.15em] text-white/50 border border-white/15 rounded-full px-5 py-2.5 transition-all duration-300 hover:text-white/90 hover:border-white/40 hover:bg-white/5"
      >
        REQUEST ACCESS
      </a>
    </motion.nav>
  );
}

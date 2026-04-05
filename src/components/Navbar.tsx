"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SunderWordmark from "@/components/SunderWordmark";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 md:px-12"
    >
      <Link href="/" aria-label="Home">
        <SunderWordmark />
      </Link>

      <div className="flex items-center gap-6 md:gap-8">
        <Link
          href="/research"
          className="text-[10px] tracking-[0.3em] text-white/[0.10] hover:text-white/40 transition-colors duration-500 uppercase"
          data-cursor="expand"
        >
          Research
        </Link>
        <Link
          href="/access"
          className="text-[10px] tracking-[0.3em] text-white/[0.10] hover:text-white/40 transition-colors duration-500 uppercase"
          data-cursor="expand"
        >
          Access
        </Link>
      </div>
    </motion.nav>
  );
}

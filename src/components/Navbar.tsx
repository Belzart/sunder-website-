"use client";

import { motion } from "framer-motion";
import SunderWordmark from "@/components/SunderWordmark";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-start px-8 py-6 md:px-12"
    >
      <SunderWordmark />
    </motion.nav>
  );
}

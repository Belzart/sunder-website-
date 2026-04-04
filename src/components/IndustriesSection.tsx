"use client";

import { motion } from "framer-motion";

const industries = ["Robotics", "Space", "Defense", "Energy"];

export default function IndustriesSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center px-8 md:px-12">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-x-12">
        {industries.map((industry, i) => (
          <motion.span
            key={industry}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: i * 0.15,
              ease: "easeOut",
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-xs md:text-sm tracking-[0.4em] text-white/20 uppercase font-light"
          >
            {industry}
          </motion.span>
        ))}
      </div>
    </section>
  );
}

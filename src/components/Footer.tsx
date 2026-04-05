"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const taglineLetters = "Materials for the future".split("");

// Pre-computed per-letter random offsets so they're stable across renders
const letterOffsets = taglineLetters.map(() => ({
  y: Math.random() * 6 - 3,
  delay: Math.random() * 0.08,
}));

export default function Footer() {
  const [copyrightHovered, setCopyrightHovered] = useState(false);
  const [taglineHovered, setTaglineHovered] = useState(false);

  return (
    <footer className="py-8 px-8 md:px-12 border-t border-white/5">
      <div className="flex items-center justify-between">
        <span
          className="relative text-[10px] tracking-[0.3em] text-white/15 uppercase cursor-default"
          onMouseEnter={() => setCopyrightHovered(true)}
          onMouseLeave={() => setCopyrightHovered(false)}
          data-cursor="expand"
        >
          <AnimatePresence mode="wait">
            {copyrightHovered ? (
              <motion.span
                key="built"
                className="block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                Built different.
              </motion.span>
            ) : (
              <motion.span
                key="copyright"
                className="block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                &copy; Sunder {new Date().getFullYear()}
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        <span
          className="text-[10px] tracking-[0.2em] text-white/10 cursor-default flex"
          onMouseEnter={() => setTaglineHovered(true)}
          onMouseLeave={() => setTaglineHovered(false)}
          data-cursor="expand"
        >
          {taglineLetters.map((letter, i) => (
            <motion.span
              key={i}
              className="inline-block whitespace-pre"
              animate={
                taglineHovered
                  ? { y: letterOffsets[i].y }
                  : { y: 0 }
              }
              transition={{
                duration: 0.3,
                delay: taglineHovered ? letterOffsets[i].delay : 0,
                ease: "easeOut",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </span>
      </div>
    </footer>
  );
}

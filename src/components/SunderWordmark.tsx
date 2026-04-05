"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useAnimate } from "framer-motion";

const WORD = "SUNDER";
const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";
const LETTER_STAGGER_MS = 80;
const GLITCH_DURATION_MS = 150;
const GLITCH_INTERVAL_MS = 40;

function randomGlyphExcept(exclude: string): string {
  let ch: string;
  do {
    ch = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
  } while (ch === exclude);
  return ch;
}

export default function SunderWordmark() {
  // Track what each letter is displaying: null = hidden, string = the char shown
  const [letters, setLetters] = useState<(string | null)[]>(
    Array(WORD.length).fill(null)
  );
  const [allRevealed, setAllRevealed] = useState(false);
  const [scanScope, scanAnimate] = useAnimate();
  const glitchTimers = useRef<ReturnType<typeof setInterval>[]>([]);
  const settleTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Stagger each letter reveal
    WORD.split("").forEach((realChar, i) => {
      const startDelay = i * LETTER_STAGGER_MS;

      // After startDelay: begin glitching
      const glitchStart = setTimeout(() => {
        // Show the letter slot immediately as a random char
        setLetters((prev) => {
          const next = [...prev];
          next[i] = randomGlyphExcept(realChar);
          return next;
        });

        // Rapidly cycle glitch characters
        const interval = setInterval(() => {
          setLetters((prev) => {
            const next = [...prev];
            next[i] = randomGlyphExcept(realChar);
            return next;
          });
        }, GLITCH_INTERVAL_MS);
        glitchTimers.current.push(interval);

        // After glitch duration, settle to real char
        const settleTimer = setTimeout(() => {
          clearInterval(interval);
          setLetters((prev) => {
            const next = [...prev];
            next[i] = realChar;
            return next;
          });

          // After last letter settles, trigger scan line
          if (i === WORD.length - 1) {
            setAllRevealed(true);
          }
        }, GLITCH_DURATION_MS);
        settleTimers.current.push(settleTimer);
      }, startDelay);

      settleTimers.current.push(glitchStart);
    });

    const gt = glitchTimers.current;
    const st = settleTimers.current;
    return () => {
      gt.forEach(clearInterval);
      st.forEach(clearTimeout);
    };
  }, []);

  // Trigger scan line after all letters reveal
  useEffect(() => {
    if (!allRevealed) return;
    const timer = setTimeout(() => {
      scanAnimate(
        scanScope.current,
        { x: ["calc(-100% - 20px)", "calc(200% + 20px)"] },
        { duration: 0.6, ease: "easeInOut" }
      );
    }, 50); // small buffer after state update
    return () => clearTimeout(timer);
  }, [allRevealed, scanAnimate, scanScope]);

  return (
    <motion.div
      className="relative inline-flex items-center overflow-visible cursor-default select-none"
      whileHover="hover"
    >
      {/* Letters */}
      <div className="relative flex items-center gap-0">
        {WORD.split("").map((realChar, i) => (
          <LetterSlot
            key={i}
            index={i}
            displayChar={letters[i]}
            realChar={realChar}
          />
        ))}
      </div>

      {/* Scan-line overlay — only rendered once allRevealed */}
      {allRevealed && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ borderRadius: 2 }}
        >
          <div
            ref={scanScope}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: 40,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              transform: "translateX(calc(-100% - 20px))",
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

// Individual letter with entrance + hover scatter
interface LetterSlotProps {
  index: number;
  displayChar: string | null;
  realChar: string;
}

// Pre-computed scatter values at module level for purity
const SCATTER_VALUES = WORD.split("").map((_, i) => ({
  x: parseFloat(((Math.sin(i * 7.3 + 1.7) * 3)).toFixed(1)),
  y: parseFloat(((Math.cos(i * 5.1 + 2.3) * 2)).toFixed(1)),
}));

function LetterSlot({ index, displayChar, realChar }: LetterSlotProps) {
  const isVisible = displayChar !== null;

  const scatterX = SCATTER_VALUES[index].x;
  const scatterY = SCATTER_VALUES[index].y;

  return (
    <motion.span
      className="text-sm font-medium tracking-[0.3em] text-white/90 inline-block"
      initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
      animate={
        isVisible
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: -20, filter: "blur(8px)" }
      }
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      variants={{
        hover: {
          x: scatterX,
          y: scatterY,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: index * 0.02,
          },
        },
      }}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {isVisible ? displayChar : realChar}
    </motion.span>
  );
}

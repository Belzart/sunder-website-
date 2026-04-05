"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFieldSubscribe } from "@/lib/field-context";

/**
 * Idle discovery system.
 * When the user does nothing for a sustained period, a message
 * fades in — rewarding patience and observation.
 * Disappears when the cursor moves again.
 */

const IDLE_MESSAGES = [
  "Sample responsive. Awaiting input.",
  "Substrate active.",
  "Field nominal. Begin observation.",
  "Material state: resting.",
  "The specimen is waiting.",
];

const IDLE_THRESHOLD_MS = 12000; // 12 seconds of stillness
const FADE_THRESHOLD_MS = 2000; // disappears 2s after movement resumes

export default function IdleDiscovery() {
  const [message, setMessage] = useState<string | null>(null);
  const lastMoveTime = useRef(performance.now());
  const messageIndex = useRef(0);
  const showTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFieldSubscribe((s) => {
    if (s.speed > 0.5) {
      lastMoveTime.current = performance.now();

      // Schedule hide if message is showing
      if (message !== null && !hideTimeout.current) {
        hideTimeout.current = setTimeout(() => {
          setMessage(null);
          hideTimeout.current = null;
        }, FADE_THRESHOLD_MS);
      }
    }
  });

  // Check for idle state periodically
  useEffect(() => {
    const check = setInterval(() => {
      const elapsed = performance.now() - lastMoveTime.current;
      if (elapsed > IDLE_THRESHOLD_MS && message === null) {
        const msg = IDLE_MESSAGES[messageIndex.current % IDLE_MESSAGES.length];
        messageIndex.current++;
        setMessage(msg);

        // Clear any pending hide
        if (hideTimeout.current) {
          clearTimeout(hideTimeout.current);
          hideTimeout.current = null;
        }
      }
    }, 2000);

    return () => {
      clearInterval(check);
      if (showTimeout.current) clearTimeout(showTimeout.current);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [message]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 3 }}
      aria-hidden
    >
      <AnimatePresence>
        {message && (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-[10px] md:text-[11px] tracking-[0.2em] text-white/[0.06] font-mono"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

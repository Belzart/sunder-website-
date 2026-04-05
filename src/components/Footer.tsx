"use client";

import { useState, useEffect } from "react";

/**
 * Minimal lab-style footer.
 * Includes a live timestamp that updates every second —
 * reinforces the "active lab" feel.
 */
export default function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toISOString().replace("T", " ").slice(0, 19) + " UTC"
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="py-8 px-8 md:px-12 border-t border-white/[0.03]">
      <div className="flex items-center justify-between">
        <span className="text-[9px] tracking-[0.2em] text-white/[0.06] font-mono">
          &copy; Sunder {new Date().getFullYear()}
        </span>

        <span className="text-[9px] tracking-[0.12em] text-white/[0.04] font-mono">
          {time}
        </span>

        <a
          href="mailto:hello@sunder.com"
          className="text-[9px] tracking-[0.2em] text-white/[0.06] hover:text-white/20 transition-colors duration-500 font-mono"
          data-cursor="expand"
        >
          hello@sunder.com
        </a>
      </div>
    </footer>
  );
}

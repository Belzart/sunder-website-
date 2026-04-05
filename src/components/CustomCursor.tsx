"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const current = useRef({ x: -999, y: -999 });
  const isExpanded = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Detect touch device — hide cursor entirely
    if (window.matchMedia("(hover: none)").matches) {
      return;
    }

    const dot = dotRef.current;
    if (!dot) return;

    dot.style.opacity = "1";

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      const target = e.target as Element | null;
      const expandEl = target?.closest("[data-cursor='expand']");
      const shouldExpand = expandEl !== null && expandEl !== undefined;

      if (shouldExpand !== isExpanded.current) {
        isExpanded.current = shouldExpand;
        if (shouldExpand) {
          // Hot orange molten glow
          dot.style.width = "12px";
          dot.style.height = "12px";
          dot.style.background = "#ff6a00";
          dot.style.border = "none";
          dot.style.marginLeft = "-6px";
          dot.style.marginTop = "-6px";
          dot.style.mixBlendMode = "normal";
          dot.style.boxShadow = "0 0 12px rgba(255, 106, 0, 0.5), 0 0 24px rgba(255, 106, 0, 0.2)";
        } else {
          dot.style.width = "6px";
          dot.style.height = "6px";
          dot.style.background = "white";
          dot.style.border = "none";
          dot.style.marginLeft = "-3px";
          dot.style.marginTop = "-3px";
          dot.style.mixBlendMode = "difference";
          dot.style.boxShadow = "none";
        }
      }
    };

    const loop = () => {
      // Snappier lerp — 0.35 instead of 0.15
      const LERP = 0.35;
      current.current.x += (mouse.current.x - current.current.x) * LERP;
      current.current.y += (mouse.current.y - current.current.y) * LERP;

      if (dot) {
        dot.style.left = `${current.current.x}px`;
        dot.style.top = `${current.current.y}px`;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 6,
        height: 6,
        marginLeft: -3,
        marginTop: -3,
        borderRadius: "50%",
        background: "white",
        border: "none",
        mixBlendMode: "difference",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0,
        transition:
          "width 0.15s ease, height 0.15s ease, background 0.15s ease, border 0.15s ease, margin 0.15s ease, box-shadow 0.15s ease, mix-blend-mode 0.15s ease",
        willChange: "left, top",
      }}
    />
  );
}

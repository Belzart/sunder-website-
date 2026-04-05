"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  // Lerp target
  const mouse = useRef({ x: -999, y: -999 });
  // Current lerped position
  const current = useRef({ x: -999, y: -999 });
  const isExpanded = useRef(false);
  const rafId = useRef<number | null>(null);
  const isTouch = useRef(false);

  useEffect(() => {
    // Detect touch device — hide cursor entirely on touch
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches
    ) {
      isTouch.current = true;
      return;
    }

    const dot = dotRef.current;
    if (!dot) return;

    // Show the dot
    dot.style.opacity = "1";

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Check if hovered element (or any ancestor) has data-cursor="expand"
      const target = e.target as Element | null;
      const expandEl = target?.closest("[data-cursor='expand']");
      const shouldExpand = expandEl !== null && expandEl !== undefined;

      if (shouldExpand !== isExpanded.current) {
        isExpanded.current = shouldExpand;
        if (shouldExpand) {
          dot.style.width = "40px";
          dot.style.height = "40px";
          dot.style.background = "transparent";
          dot.style.border = "1.5px solid white";
          dot.style.marginLeft = "-20px";
          dot.style.marginTop = "-20px";
        } else {
          dot.style.width = "6px";
          dot.style.height = "6px";
          dot.style.background = "white";
          dot.style.border = "none";
          dot.style.marginLeft = "-3px";
          dot.style.marginTop = "-3px";
        }
      }
    };

    const loop = () => {
      const LERP = 0.15;
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
          "width 0.2s ease, height 0.2s ease, background 0.2s ease, border 0.2s ease, margin 0.2s ease",
        willChange: "transform, left, top",
      }}
    />
  );
}

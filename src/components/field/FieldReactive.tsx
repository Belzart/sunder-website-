"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { useFieldSubscribe } from "@/lib/field-context";

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Push away from cursor (px at full proximity) */
  displace?: number;
  /** Pull toward cursor (px at full proximity) */
  attract?: number;
  /** Brightness boost at full proximity (0–1 range) */
  glow?: number;
  /** 3D tilt degrees at full proximity */
  tilt?: number;
  /** Scale boost at full proximity (e.g. 0.05 = 5 % larger) */
  scale?: number;
  /** Max effect radius in px */
  radius?: number;
}

/**
 * Wrapper that makes its children react to cursor proximity.
 *
 * Physics rule — non-Newtonian stiffness:
 *   fast cursor → stiffer (less displacement)
 *   slow cursor → more fluid (more displacement)
 *
 * All updates are direct DOM mutations inside a rAF subscriber —
 * zero React re-renders.
 */
export default function FieldReactive({
  children,
  className,
  style,
  displace = 0,
  attract = 0,
  glow = 0,
  tilt = 0,
  scale = 0,
  radius = 300,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useFieldSubscribe((s) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = s.x - cx;
    const dy = s.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > radius) {
      el.style.transform = "";
      el.style.filter = "";
      return;
    }

    // Proximity: 0 at edge → 1 at center, smoothstepped
    const raw = 1 - dist / radius;
    const t = raw * raw * (3 - 2 * raw);

    // Non-Newtonian: high speed = stiffer response
    const stiffness = 1 / (1 + s.speed * 0.04);
    const e = t * stiffness;

    const parts: string[] = [];

    if (displace > 0 && dist > 0.1) {
      const nx = dx / dist;
      const ny = dy / dist;
      parts.push(`translate(${(-nx * displace * e).toFixed(2)}px, ${(-ny * displace * e).toFixed(2)}px)`);
    }

    if (attract > 0 && dist > 0.1) {
      const nx = dx / dist;
      const ny = dy / dist;
      parts.push(`translate(${(nx * attract * e).toFixed(2)}px, ${(ny * attract * e).toFixed(2)}px)`);
    }

    if (scale > 0) {
      const sv = 1 + scale * e;
      parts.push(`scale(${sv.toFixed(4)})`);
    }

    if (tilt > 0) {
      parts.push(
        `perspective(800px) rotateX(${((-dy / radius) * tilt * e).toFixed(2)}deg) rotateY(${((dx / radius) * tilt * e).toFixed(2)}deg)`
      );
    }

    el.style.transform = parts.join(" ");
    el.style.filter = glow > 0 ? `brightness(${(1 + glow * e).toFixed(3)})` : "";
  });

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: "transform, filter", ...style }}
    >
      {children}
    </div>
  );
}

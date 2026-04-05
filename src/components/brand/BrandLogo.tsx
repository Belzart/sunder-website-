"use client";

import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

/* ── Concept 1: Fracture Mark ───────────────────────────────────────── */
function FractureMark() {
  // Blocky angular S built from two zigzag halves, offset by 3px, with a fracture line
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top half of S — upper bracket shape, shifted left 1.5px */}
      <g transform="translate(-1.5, -1.5)">
        <path
          d="M 120 30 L 60 30 L 60 55 L 110 55 L 110 75 L 60 75 L 60 98"
          stroke="white"
          strokeWidth="18"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </g>

      {/* Bottom half of S — lower bracket shape, shifted right 1.5px */}
      <g transform="translate(1.5, 1.5)">
        <path
          d="M 80 102 L 80 125 L 130 125 L 130 145 L 80 145 L 80 170 L 140 170"
          stroke="white"
          strokeWidth="18"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </g>

      {/* Fracture line in molten orange cutting diagonally through the center */}
      <line
        x1="55"
        y1="88"
        x2="148"
        y2="112"
        stroke="#ff6a00"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Secondary fracture glow */}
      <line
        x1="55"
        y1="88"
        x2="148"
        y2="112"
        stroke="#ff6a00"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.25"
      />
    </svg>
  );
}

/* ── Concept 2: Crystal Lattice ─────────────────────────────────────── */
function CrystalLattice() {
  // 6 small hexagons arranged in an S-curve, connected by bond lines
  const R = 16; // hexagon circumradius

  // Centers arranged in a loose S path
  const centers: [number, number][] = [
    [120, 38],
    [100, 62],
    [80, 86],
    [100, 110],
    [120, 134],
    [100, 158],
  ];

  function hexPath(cx: number, cy: number): string {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 180) * (60 * i - 30);
      return `${cx + R * Math.cos(angle)},${cy + R * Math.sin(angle)}`;
    });
    return `M ${pts.join(" L ")} Z`;
  }

  return (
    <svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bond lines */}
      {centers.slice(0, -1).map(([x1, y1], i) => {
        const [x2, y2] = centers[i + 1];
        return (
          <line
            key={`bond-${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="white"
            strokeWidth="1"
            opacity="0.3"
          />
        );
      })}
      {/* Cross-bond from node 1 to node 3 */}
      <line x1={centers[1][0]} y1={centers[1][1]} x2={centers[3][0]} y2={centers[3][1]}
        stroke="white" strokeWidth="1" opacity="0.15" />

      {/* Hexagons */}
      {centers.map(([cx, cy], i) => (
        <path
          key={`hex-${i}`}
          d={hexPath(cx, cy)}
          stroke="white"
          strokeWidth="1.5"
          opacity={i === 0 || i === 5 ? 0.9 : 0.6}
        />
      ))}

      {/* Dot at each center */}
      {centers.map(([cx, cy], i) => (
        <circle key={`dot-${i}`} cx={cx} cy={cy} r="2.5" fill="white" opacity="0.5" />
      ))}
    </svg>
  );
}

/* ── Concept 3: Split Prism ─────────────────────────────────────────── */
function SplitPrism() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="prismGap" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6a00" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff6a00" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="topFace" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="bottomFace" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Top prism half — slight counter-clockwise rotate around its center */}
      <g transform="rotate(-3, 100, 72)">
        {/* Front face */}
        <path
          d="M 68 40 L 132 40 L 132 104 L 68 104 Z"
          stroke="white"
          strokeWidth="1.5"
          fill="white"
          fillOpacity="0.06"
        />
        {/* Top face perspective */}
        <path
          d="M 68 40 L 132 40 L 148 24 L 84 24 Z"
          fill="url(#topFace)"
          fillOpacity="0.12"
          stroke="white"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        {/* Right face */}
        <path
          d="M 132 40 L 148 24 L 148 88 L 132 104 Z"
          fill="white"
          fillOpacity="0.08"
          stroke="white"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
      </g>

      {/* Gap — orange gradient fill */}
      <path
        d="M 62 104 L 138 108 L 138 116 L 62 112 Z"
        fill="url(#prismGap)"
      />

      {/* Bottom prism half — slight clockwise rotate */}
      <g transform="rotate(3, 100, 140)">
        {/* Front face */}
        <path
          d="M 68 116 L 132 116 L 132 168 L 68 168 Z"
          stroke="white"
          strokeWidth="1.5"
          fill="white"
          fillOpacity="0.06"
        />
        {/* Bottom face */}
        <path
          d="M 68 168 L 132 168 L 148 152 L 84 152 Z"
          fill="url(#bottomFace)"
          fillOpacity="0.08"
          stroke="white"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        {/* Right face */}
        <path
          d="M 132 116 L 148 100 L 148 152 L 132 168 Z"
          fill="white"
          fillOpacity="0.06"
          stroke="white"
          strokeWidth="1"
          strokeOpacity="0.25"
        />
      </g>

      {/* Edge highlights on split */}
      <line x1="62" y1="104" x2="138" y2="108" stroke="white" strokeWidth="0.75" strokeOpacity="0.4" />
      <line x1="62" y1="112" x2="138" y2="116" stroke="white" strokeWidth="0.75" strokeOpacity="0.4" />
    </svg>
  );
}

/* ── Concept 4: Atomic Bond ─────────────────────────────────────────── */
function AtomicBond() {
  return (
    <svg viewBox="0 0 200 200" width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bond lines connecting atoms */}
      {/* Top atom to middle atom */}
      <line x1="125" y1="58" x2="88" y2="100" stroke="white" strokeWidth="1.5" opacity="0.4" />
      {/* Middle atom to bottom atom */}
      <line x1="88" y1="100" x2="112" y2="148" stroke="white" strokeWidth="1.5" opacity="0.4" />

      {/* Faint orbital ring around top atom */}
      <ellipse cx="125" cy="58" rx="42" ry="12" stroke="white" strokeWidth="0.75" opacity="0.12"
        transform="rotate(-30, 125, 58)" />

      {/* Faint orbital ring around bottom atom */}
      <ellipse cx="112" cy="148" rx="42" ry="12" stroke="white" strokeWidth="0.75" opacity="0.12"
        transform="rotate(30, 112, 148)" />

      {/* Top atom (larger) */}
      <circle cx="125" cy="58" r="30" stroke="white" strokeWidth="1.5" opacity="0.85" />
      <circle cx="125" cy="58" r="4" fill="white" opacity="0.6" />

      {/* Middle atom (smaller, offset) */}
      <circle cx="88" cy="100" r="15" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <circle cx="88" cy="100" r="3" fill="white" opacity="0.4" />

      {/* Bottom atom (larger) */}
      <circle cx="112" cy="148" r="30" stroke="white" strokeWidth="1.5" opacity="0.85" />
      <circle cx="112" cy="148" r="4" fill="white" opacity="0.6" />
    </svg>
  );
}

/* ── Concept data ───────────────────────────────────────────────────── */
const concepts = [
  {
    id: "fracture",
    name: "Fracture Mark",
    description: "An angular S cleaved in two. The gap reveals molten energy.",
    Render: FractureMark,
  },
  {
    id: "lattice",
    name: "Crystal Lattice",
    description: "Hexagonal crystalline nodes forming an S-curve. Molecular precision.",
    Render: CrystalLattice,
  },
  {
    id: "prism",
    name: "Split Prism",
    description: "A geometric prism cleaved diagonally, light escaping the gap.",
    Render: SplitPrism,
  },
  {
    id: "atomic",
    name: "Atomic Bond",
    description: "Two atoms joined by a bond, tracing an S-like orbital flow.",
    Render: AtomicBond,
  },
];

export default function BrandLogo() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Section label */}
          <motion.p variants={itemVariants} className="text-xs text-white/30 tracking-[0.3em] uppercase mb-3">
            02 — Logo
          </motion.p>
          <motion.h2 variants={itemVariants} className="text-2xl font-light text-white/80 mb-16">
            Mark Concepts
          </motion.h2>

          {/* 2×2 logo grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            {concepts.map(({ id, name, description, Render }) => (
              <motion.div
                key={id}
                variants={itemVariants}
                className="flex flex-col items-center gap-5 p-8 rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <div className="flex items-center justify-center w-[200px] h-[200px]">
                  <Render />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium tracking-[0.2em] text-white/70 uppercase mb-1">
                    {name}
                  </p>
                  <p className="text-xs text-white/30 max-w-[220px]">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Wordmark variants */}
          <motion.div variants={itemVariants}>
            <p className="text-xs text-white/30 tracking-[0.3em] uppercase mb-8">Wordmark</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              {/* Dark on transparent */}
              <div className="flex flex-col items-start gap-3">
                <span
                  className="text-2xl font-medium tracking-[0.3em] text-white"
                  style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                >
                  SUNDER
                </span>
                <p className="text-xs text-white/20 tracking-[0.1em]">White on dark</p>
              </div>

              <div className="h-12 w-px bg-white/10 hidden sm:block" />

              {/* Dark on white */}
              <div className="flex flex-col items-start gap-3">
                <div className="px-6 py-3 bg-white rounded-lg">
                  <span
                    className="text-2xl font-medium tracking-[0.3em] text-[#0A0A0A]"
                    style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                  >
                    SUNDER
                  </span>
                </div>
                <p className="text-xs text-white/20 tracking-[0.1em]">Dark on white</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

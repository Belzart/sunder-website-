# Animation System

## Three Animation Layers

The site uses three distinct animation systems, chosen for their strengths:

### 1. Framer Motion — Entrance + Layout Animations
- **What**: Scroll-triggered entrances (whileInView), page transitions, hover states
- **When**: Component mount, viewport entry, layout changes
- **Why**: Declarative, works with React lifecycle, good for staggered sequences
- **Performance**: React state-driven — acceptable for infrequent events (scroll triggers), NOT for per-frame updates

### 2. Field System (useFieldSubscribe) — Per-Frame DOM Mutations
- **What**: Cursor proximity effects, material status updates, idle discovery
- **When**: Every animation frame (60fps)
- **Why**: Zero React re-renders. Direct DOM mutations via `el.style.transform`. Subscription model avoids context re-render cascades.
- **Performance**: Excellent. ~15-20 DOM style mutations per frame = trivially cheap. No layout thrashing because we only set `transform` and `filter`.

### 3. Three.js useFrame — 3D Scene Updates
- **What**: Blob physics, material uniform updates, cursor raycasting, particle rotation
- **When**: Every render frame (synced with Three.js render loop)
- **Why**: Direct access to Three.js objects. Ref-based updates, no React overhead.
- **Performance**: Bounded by GPU shader cost (simplex noise on 2304 vertices per blob × blob count)

## Which System for Which Effect

| Effect Type | System | Reason |
|-------------|--------|--------|
| Section fade-in on scroll | Framer Motion | One-time trigger, stagger support |
| Card hover scale | Framer Motion whileHover | Simple state toggle |
| Card 3D tilt tracking cursor | Direct DOM (onMouseMove) | Per-mouse-event, too frequent for React state |
| Text glow on cursor proximity | Field System | Per-frame, needs smoothstep proximity calc |
| Floating word drift | Field System | Per-frame ambient + proximity |
| Blob deformation | Three.js useFrame | GPU shader, Three.js refs |
| Material preset cycling | Three.js useFrame | Uniform interpolation in render loop |
| Idle discovery messages | React state (useState) | Infrequent toggle (once per 12s), needs AnimatePresence |
| Film grain | CSS animation | Pure CSS keyframes, zero JS cost |
| Field glow following cursor | Field System | Per-frame background-image update |

## Stagger Conventions

All staggered animations follow these rules:
- **Direction**: Top-to-bottom, left-to-right
- **Base delay**: 0.1s per element (sections), 0.08s per letter (wordmark)
- **Maximum accumulated delay**: 0.6s (never wait more than this for the last element)
- **Easing**: material-ease `[0.25, 0.46, 0.45, 0.94]` for entrances

## Spring Physics

Used in Framer Motion transitions and conceptually in blob physics:

| Preset | Stiffness | Damping | Use |
|--------|-----------|---------|-----|
| stiff | 400 | 30 | Snap-back, release recoil |
| medium | 200 | 20 | Card hover, element enter |
| soft | 100 | 15 | Text fade-in, ambient drift |
| gooey | 80 | 8 | Blob wobble, fluid settle |

## CSS Animation (Film Grain)

The grain overlay uses a stepped CSS animation to avoid smooth interpolation (which would look like sliding):
- 10 discrete positions over 8 seconds
- `steps(10)` timing function
- 200% oversized element with translate offsets
- SVG feTurbulence noise as background-image
- 1.8% opacity, mix-blend-mode: overlay

## Anti-Patterns

- **Never use React state for per-frame updates** — useState in a rAF loop causes 60 re-renders/second
- **Never use CSS transitions for cursor-tracking effects** — the lag compounds and feels sluggish
- **Never animate layout properties** (width, height, top, left) — only transform and opacity
- **Never use setInterval for animations** — always requestAnimationFrame
- **Never animate text content directly** — only transform/filter on the container

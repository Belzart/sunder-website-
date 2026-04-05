# Interaction System

## Core Principle

Every interaction should feel physically inspired. The entire interface behaves as if it exists within the material's field of influence. Nothing animates arbitrarily — everything has a physics-based reason.

## The Non-Newtonian Rule

This is the master rule that governs all interactions:
- **Fast input → stiffer response** (more resistance, less displacement)
- **Slow input → more fluid response** (more yielding, more deformation)

This applies to: cursor proximity effects, drag behaviors, scroll momentum, hover responses, and transitions.

## Interaction Taxonomy

### Cursor (Passive)
- **Default**: Small white dot (6px), mix-blend-mode: difference
- **On interactive elements**: Expands to 12px, turns molten orange with glow
- **Field glow**: Radial light follows cursor across entire viewport
- **Lab readouts**: Cursor coordinates and velocity displayed at viewport edges (5% opacity)

### Hover (Pre-click)
- **Field-reactive elements**: Brighten on proximity (brightness filter)
- **Domain cards**: 3D perspective tilt tracks cursor position, inner glow follows
- **Text**: Subtle displacement away from cursor (push effect)
- **Properties words**: Brighten from near-invisible (3-7%) to visible (15-20%)
- **Hidden content**: Begins to appear on sustained hover proximity

### Click / Tap
- **Blob grab**: Cursor changes to "grabbing", material deforms toward cursor
- **Cards**: Elastic compression before action (scale 0.98 → 1.0 with spring)
- **Links**: No decoration change, only cursor state change

### Drag
- **Blob**: Stretches, deforms, follows cursor with viscous resistance
- **Pull strength**: Ramps up smoothly, not instant (viscous ramping)
- **Fast drag**: Material stiffens (non-Newtonian), less displacement per px
- **Slow drag**: Material yields more, taffy-like stretching

### Press / Hold (Future)
- **Blob**: Compression effect, flattening under sustained pressure
- **Cards**: Reveal deeper information on sustained hold
- **Hidden zones**: Extended hold reveals lab notes or data

### Release
- **Blob**: Snap-back with overshoot and wobble (underdamped spring)
- **Cards**: Spring return to rest (cubic-bezier 0.23, 1, 0.32, 1)
- **All field effects**: Smooth decay, not instant reset

### Scroll
- **Sections**: Framer Motion whileInView triggers with margin offsets
- **Parallax**: Minimal, tasteful — not aggressive
- **Scroll velocity**: (Future) affects ambient motion intensity

### Split / Tear
- **Trigger**: Pull strength exceeds 2.5× blob radius
- **Result**: Volume-preserving split (child radius = parent × ∛0.5)
- **Direction**: Children spawn along pull vector
- **Post-split**: Wobble boost, distortion spike

### Merge / Reassemble
- **Trigger**: Double-click or 'R' key
- **Result**: All fragments merge back to single blob at origin
- **Animation**: Spawn wobble on new combined blob

## Field Influence on UI

The cursor and blob create invisible force fields. Nearby HTML elements respond:

| Element | Effect | Radius | Strength |
|---------|--------|--------|----------|
| Headings | Displacement + glow | 400px | 4px push, 0.6 brightness |
| Body text | Glow only | 300px | 0.4 brightness |
| Labels | Glow only | 250px | 0.3 brightness |
| Properties words | Push + glow | 350px | 30px push, 3× brightness |
| Cards | 3D tilt + inner glow | Card bounds | 10° tilt, radial glow |
| Dividers | (Future) Curve toward cursor | 200px | Bezier displacement |

## Hidden Interactions

These are discoverable, not announced:
- Rapid clicking in empty space: subtle field pulse
- Holding cursor still for 5+ seconds: ambient annotation appears
- Dragging blob to edge of viewport: boundary resistance effect
- Pressing 'R': reassembles all blob fragments
- (Future) Keyboard shortcuts for material presets
- (Future) Secret coordinates that trigger easter eggs

## Discoverable States

Content or behaviors that reward exploration:
- Properties words at 3% opacity — invisible until cursor passes near
- Lab annotations at 5% opacity — visible only on close inspection
- Material preset cycling — noticed only by those who watch long enough
- (Future) Hidden pages accessible through specific interactions

# Art Direction

## Palette

### Core
- **Void Black** `#0A0A0A` — primary background, the darkness of the lab
- **Pure White** `#FFFFFF` — text, used at extreme opacity reduction (5%–90%)
- **Molten** `#FF6A00` — the only warm accent. Used sparingly: cursor expand state, material preset, rare highlights. Never decorative — always functional.

### Material Presets (3D Blob)
- Titanium `#B8BCC0` — metallic silver, high-end default
- Carbon `#1A1A1A` — matte dark, subtle emissive blue-black
- Frost `#CDE0F0` — translucent, glassy, cool
- Molten `#FF6A00` — hot, emissive, the moment of activation

### Opacity Scale
White text is always rendered at partial opacity. This creates depth and hierarchy without introducing new colors.
- 90% — primary headings (rare, for maximum emphasis)
- 70% — secondary headings
- 40% — body text
- 25% — supporting text
- 15% — labels, annotations
- 8% — ghost text, hidden until revealed
- 5% — instrument readouts, nearly invisible

## Typography

- **Font**: Inter (variable weight)
- **Weights**: 300 (light), 400 (regular) only. Never bold. Never heavy.
- **Tracking scale**:
  - 0.1em — body text
  - 0.15em — supporting text
  - 0.2em — small labels
  - 0.3em — section labels, nav
  - 0.4em — uppercase category labels
  - 0.5em — extreme spread (rare, for atmosphere)
- **Size**: Restrained. Largest text is still only ~48px. Nothing screams.

## Spacing

- Cinematic. Generous. Every section breathes.
- Min section height: 60vh–100vh
- Content max-width: 3xl–4xl (never edge-to-edge)
- Padding: 8px mobile, 12–16px desktop (horizontal)
- Vertical gaps between elements: generous (mt-8 to mt-16)

## Texture

- Subtle film grain acceptable (CSS noise overlay at ≤2% opacity)
- No patterns. No gradients except the field glow.
- No colored backgrounds. Always Void Black.
- No borders thicker than 1px. Borders at ≤6% opacity.

## Light

- The cursor creates a subtle radial light (field glow)
- The blob emits light through emissive materials
- Point lights in the 3D scene provide ambient dimensionality
- Everything else is dark. The light sources are the material and the user.

## What to Avoid

- Neon, cyberpunk, tron aesthetics
- Bright accent colors (no blue buttons, no green CTAs)
- Rounded cards or pill shapes
- Drop shadows on UI elements
- Blurred glass / glassmorphism
- Generic icon libraries
- Stock photography
- Decorative illustrations
- Any visual element that could appear on a generic SaaS template

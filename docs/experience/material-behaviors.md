# Material Behaviors

## What the Central Artifact Represents

The blob/material is not decoration. It is a literal future material sample — the core specimen of the lab. Everything on the site exists in relationship to it.

## Material Properties (Narrative, Not Scientific)

- **Semi-living** — it breathes, idles, reacts. It has presence even when untouched.
- **Controllable but not fully obedient** — it responds to user input but has its own physics. You influence it, you don't command it.
- **Shape-shifting** — it deforms, stretches, tears, recombines. It is not a fixed shape.
- **Responsive** — it reacts to force, speed, proximity, and interaction type.
- **Seductive** — it should be beautiful to look at and satisfying to manipulate.
- **Strange** — it should feel like nothing the visitor has encountered before.
- **Premium** — the rendering quality, motion, and behavior should feel expensive.

## Behavioral Rules

### Non-Newtonian Response
Fast input → stiffer, more resistant. Slow input → more fluid, more yielding. This is the core physics metaphor and it applies everywhere — not just the blob, but all UI interactions.

### Interaction Modes (Current)

| Mode | Trigger | Behavior |
|------|---------|----------|
| **Idle** | No input | Organic simplex noise deformation, gentle breathing, color cycling |
| **Proximity** | Cursor within 3× radius | Gentle stretch toward cursor without click |
| **Grab** | Click on blob | Strong pull, blob follows cursor with viscous resistance |
| **Fast pull** | Drag past 2.5× radius | Volume-preserving split into two children |
| **Release** | Let go | Snap-back with overshoot, wobble boost, distort spike |
| **Reassemble** | Double-click or press 'R' | All fragments merge back into single blob at origin |

### Interaction Modes (Planned)

| Mode | Trigger | Behavior |
|------|---------|----------|
| **Compression** | Click-and-hold on blob | Flattening, pressure data overlay |
| **Temperature** | Slider or keyboard | Material shifts between frost/titanium/molten presets |
| **Resonance** | Rapid clicks | High-frequency wobble state, decays over 3-5 seconds |
| **Multi-point** | Two-finger touch | Deformation between two contact points |

## Material Presets

| Name | Color | Metalness | Roughness | Emissive | Feel |
|------|-------|-----------|-----------|----------|------|
| Titanium | #B8BCC0 | 0.95 | 0.35 | None | Cool, premium, default |
| Carbon | #1A1A1A | 0.60 | 0.45 | #050508 | Dark, matte, stealth |
| Frost | #CDE0F0 | 0.10 | 0.15 | #1A2A3A | Translucent, glassy, cold |
| Molten | #FF6A00 | 0.85 | 0.25 | #FF4400 | Hot, emissive, activated |

Presets cycle every 4 seconds with Hermite interpolation.

## Field Influence

The material's presence creates a "field" that influences nearby UI. Text, cards, dividers, and labels subtly respond to proximity to the cursor and (eventually) the blob itself. This is what makes it feel like the material affects the whole interface, not just the hero.

### Current Field Effects
- Cursor radial glow (FieldGlow)
- Text displacement on proximity (FieldReactive displace)
- Text brightness on proximity (FieldReactive glow)
- Card 3D tilt on hover (DomainsSection, ResearchContent)
- Properties word push + brighten (PropertiesSection)

### Planned Field Effects
- Blob position influences nearby HTML elements
- Divider lines curve toward cursor
- Cards flex/stretch before opening
- Type warps subtly under field influence

## What the Material Should Never Feel Like

- A screensaver
- A toy or game element
- A generic WebGL demo
- An afterthought
- Disconnected from the rest of the site
- Fully predictable or controllable
- Cheap or low-quality in rendering

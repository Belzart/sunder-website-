# Motion System

## Core Physics

All motion in the system derives from physical metaphors. No arbitrary easing. Every transition has a reason rooted in material behavior.

## Spring Presets

| Name | Stiffness | Damping | Use Case |
|------|-----------|---------|----------|
| **stiff** | 400 | 30 | Snap-back, release recoil |
| **medium** | 200 | 20 | Card hover, element enter |
| **soft** | 100 | 15 | Text fade-in, ambient drift |
| **gooey** | 80 | 8 | Blob wobble, fluid settle |

## Easing Curves

| Name | Value | Use Case |
|------|-------|----------|
| **material-ease** | cubic-bezier(0.25, 0.46, 0.45, 0.94) | Primary entrance animation |
| **spring-return** | cubic-bezier(0.23, 1, 0.32, 1) | Return to rest after interaction |
| **viscous** | cubic-bezier(0.4, 0, 0.2, 1) | Slow, heavy transitions |

## Duration Rules

- **Entrance animations**: 0.8–1.4s (generous, cinematic)
- **Hover responses**: 0.15–0.3s (immediate but smooth)
- **Spring returns**: 0.4–0.6s (deliberate settle)
- **Opacity transitions**: 0.3–0.5s (text), 0.15s (cursor state)
- **Color transitions**: 0.5s (never instant)
- **Page transitions**: 0.6–1.0s (matter reforming)

## Velocity Response

All field-reactive elements follow the non-Newtonian rule:

```
stiffness = 1 / (1 + speed * 0.04)
effectiveDisplacement = baseDisplacement * proximity * stiffness
```

Fast cursor = less effect. Slow cursor = more effect.

## Proximity Falloff

All proximity effects use smoothstep for organic falloff:

```
raw = 1 - distance / radius
t = raw² × (3 - 2 × raw)
```

This creates a soft boundary — no hard edges, no sudden activation.

## Velocity Decay

Cursor velocity decays at 0.9× per frame (at 60fps). This provides:
- Smooth deceleration after cursor stops
- Brief afterglow of velocity-dependent effects
- Natural settling behavior

## Ambient Motion

### Blob Idle
- Simplex noise displacement on vertex shader
- Time-scaled: `time / 50.0`
- Amplitude controlled by `distort` parameter (0.2–0.4)
- Creates organic, breathing motion

### Blob Drift
- Sinusoidal position offset per blob, seeded by ID
- Frequency: 0.2–0.3 Hz
- Amplitude: ±0.001 units/frame
- Keeps blob from ever being perfectly still

### Properties Word Drift
- Per-word sinusoidal offset
- Unique seed per word (`i * 2.7`)
- Frequency: 0.15–0.2 Hz
- Amplitude: 8–12px

### Particle Rotation
- Background particles rotate at 0.015 rad/frame
- Constant, never stops
- Creates deep-space observatory feel

## Stagger Rules

- **Section entrance**: 0.1s stagger per child element
- **Letter reveal**: 80ms stagger (wordmark)
- **Card entrance**: 0.1s stagger per card
- **Property words**: 0.1s stagger
- **Stagger always increases downward and left-to-right**

## What to Never Do

- Bounce animations (too playful)
- Linear easing on anything visible (feels robotic)
- Instant show/hide without transition (breaks the material metaphor)
- Overshoot greater than 20% on UI elements (only the blob overshoots aggressively)
- Animated gradients or color cycling on text (tacky)
- Parallax stronger than 10% of scroll distance (nauseating)

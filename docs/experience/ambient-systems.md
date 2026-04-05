# Ambient Systems

## Purpose

Ambient systems make the site feel alive without user input. They create the sense that this lab is always running, always active. The material has its own life. The interface is an instrument always measuring.

## Active Ambient Systems

### 1. Blob Idle Motion
- **Source**: Simplex noise in vertex shader
- **Behavior**: Continuous organic deformation
- **Parameters**: distort (0.2–0.4), time scaling (time/50)
- **Feel**: Breathing, pulsing, alive

### 2. Material Color Cycling
- **Source**: PhysicsBlob.tsx preset interpolation
- **Behavior**: Cycles through 4 material presets (titanium → carbon → frost → molten)
- **Duration**: 4 seconds per transition, 16-second full cycle
- **Interpolation**: Hermite (smoothstep) on all material properties
- **Feel**: The material shifts between states, like it's being tested

### 3. Background Particles
- **Source**: SphereScene.tsx
- **Count**: 50 points at radius 3–8
- **Motion**: Slow rotation (0.015 rad/frame)
- **Size**: 0.012, 40% opacity, gray
- **Feel**: Deep space. Observatory. The material exists in a vast dark environment.

### 4. Field Glow
- **Source**: FieldGlow.tsx
- **Behavior**: Radial gradient follows cursor, intensity scales with speed
- **Base intensity**: 1.5% opacity
- **Speed boost**: Up to 6% on fast movement
- **Feel**: The cursor has physical presence. It emits light.

### 5. Lab Annotations
- **Source**: FieldAnnotations.tsx
- **Behavior**: Cursor coordinates and velocity displayed at viewport corners
- **Opacity**: 5% — nearly invisible, discovered on close inspection
- **Format**: "847 · 392" (position), "δ 2.3" (velocity)
- **Feel**: Instrument readouts. The lab is measuring the user's input.

### 6. Properties Word Drift
- **Source**: PropertiesSection.tsx
- **Behavior**: 8 floating words drift on sinusoidal paths
- **Unique seeding**: Each word has a different phase and frequency
- **Feel**: Material vocabulary floating in the field, waiting to be found

## Planned Ambient Systems

### 7. Subtle Film Grain (Not Yet Implemented)
- CSS noise overlay on body at ≤2% opacity
- Adds tactile quality to the darkness
- Should animate slowly (not static)

### 8. Environmental Audio (Future Consideration)
- Very subtle, opt-in
- Low-frequency hum
- Responsive to interaction (pitch/volume shift on drag)
- HIGH RISK of being annoying — only implement if truly tasteful

### 9. Slow Data Stream (Future)
- Tiny scrolling numbers or status text at viewport edge
- Like a terminal log running in the background
- Updates in real-time based on material state
- "specimen.integrity: 1.000", "field.amplitude: 0.023"

### 10. Idle Discovery (Future)
- If the user does nothing for 10+ seconds, something subtle happens
- A word fades in, a particle pulse occurs, the blob shifts state
- Rewards patience and observation

## Rules for Ambient Systems

1. **Never distracting** — ambient means background. If you notice it consciously, it's too much.
2. **Never repetitive** — procedural variation. No exact loops. Noise-driven, not keyframed.
3. **Always purposeful** — every ambient element reinforces the lab/material thesis.
4. **Performance-conscious** — ambient systems run constantly. They must be cheap.
5. **Layered** — multiple subtle systems create depth. One system alone is not enough.

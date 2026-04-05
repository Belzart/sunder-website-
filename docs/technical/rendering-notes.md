# Rendering Notes

## Three.js Setup

### Canvas Configuration
- **Camera**: Perspective, position [0, 0, 6], FOV 45°
- **DPR**: [1, 1.5] (capped for performance)
- **Antialiasing**: Enabled
- **Tone mapping**: ACESFilmicToneMapping (cinematic look)
- **Exposure**: 1.1 (slightly boosted)

### Lighting
- Ambient: 0.3 intensity
- Directional (key): [5, 5, 5], 0.8 intensity, white
- Directional (fill): [-3, -2, -4], 0.3 intensity, cool blue (#8899bb)
- Point (top): [0, 3, 4], 0.4 intensity, blue-white (#aaccff)
- Point (bottom): [0, -4, 2], 0.15 intensity, molten orange (#ff6a00)

### Blob Geometry
- Base: SphereGeometry with 48×48 segments
- Deformation: Vertex shader displacement via simplex noise
- Radius: Viewport-responsive, `min(width, height) * 0.28`

## Custom Shader (FluidMaterial)

### Architecture
Extends `MeshPhysicalMaterial` via `onBeforeCompile`. Injects custom vertex shader code at the `#include <begin_vertex>` insertion point.

### Vertex Displacement (Two Stages)

**Stage 1: Idle Wobble**
```glsl
float noise = snoise(vec3(position / 2.0 + updateTime * 5.0));
vec3 transformed = vec3(position * (noise * pow(distort, 2.0) + radius));
```

**Stage 2: Cursor Pull**
```glsl
float influence = smoothstep(pullRadius, pullRadius * 0.05, dist) * pullStrength;
transformed += normalize(toPull) * influence;
```

### Uniforms
| Uniform | Type | Range | Purpose |
|---------|------|-------|---------|
| time | float | 0–∞ | Animation time |
| distort | float | 0.2–0.4 | Noise amplitude |
| radius | float | ~1.0 | Base scale |
| localPullPoint | vec3 | — | Cursor in local space |
| pullStrength | float | 0–3× radius | Deformation strength |
| pullRadius | float | 0.5× radius | Falloff zone |

## Layer Stack (Z-Index)

```
z-9999  CustomCursor (fixed)
z-50    Navbar (fixed)
z-10    Page content (relative, scrollable)
z-2     FieldAnnotations (fixed)
z-1     FieldGlow (fixed)
z-0     Three.js Canvas (fixed)
```

## Raycasting

PlaygroundScene uses a Raycaster to project the 2D mouse pointer to 3D world coordinates on the z=0 plane. This cursor position is shared with all blob instances via a ref.

## Material Preset Interpolation

4 presets cycle with Hermite interpolation (smoothstep):
```
t = rawT² × (3 - 2 × rawT)
```
All material properties (color, emissive, metalness, roughness, emissiveIntensity) interpolate simultaneously.

# Performance Notes

## Current Performance Strategy

### Zero-Render Field System
The most important performance decision. The FieldProvider never triggers React re-renders:
- Mouse state stored in refs
- Subscribers called via rAF loop
- Components apply effects via direct DOM mutations (el.style.transform)
- Result: 60fps field effects with zero React overhead

### Three.js Optimizations
- Single raycaster + shared cursor vector (reused each frame, no allocations)
- Material instance reused per blob (no texture creation per update)
- Uniforms updated via refs in `useFrame` (no React re-renders)
- Vertex shader injection at compile time (no shader recompilation)
- DPR capped at 1.5 (prevents expensive 2x/3x rendering)

### Blob Count Cap
- MAX_BLOBS = 12
- Prevents unbounded blob spawning
- Each blob = 1 mesh with 48×48 sphere geometry + custom material

### CSS Performance
- `will-change: transform, filter` on field-reactive elements
- CSS transitions only on mouse leave (not during active tracking)
- Direct style mutations (not class toggling) for per-frame updates
- `pointer-events: none` on content overlay reduces event processing

## Performance Budgets (Targets)

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | <2s | ~1s (static HTML fast) |
| Largest Contentful Paint | <3s | ~2s (Canvas loads async) |
| Time to Interactive | <3s | ~2s |
| Frame rate (idle) | 60fps | 60fps |
| Frame rate (interaction) | 55-60fps | ~58fps |
| JS bundle (main) | <200KB gzipped | ~150KB |
| Three.js + R3F | <300KB gzipped | ~280KB |

## Known Bottlenecks

### 1. Simplex Noise in Vertex Shader
- Runs on every vertex (48×48 = 2304 vertices) every frame per blob
- Mitigation: Low distort values, reasonable vertex count
- Future: Could LOD on mobile (reduce to 32×32)

### 2. Field Subscriber Count
- Each `useFieldSubscribe` adds a callback to the rAF loop
- Currently ~10-15 subscribers on home page
- Each does 1-8 DOM mutations per frame
- This is trivially cheap but worth monitoring as more components are added

### 3. Canvas Size
- Full-viewport Canvas at up to 1.5 DPR
- On 4K monitors: 5760×3240 effective pixels
- Mitigation: DPR cap at 1.5

## Mobile Considerations (Future)

- Touch devices: disable field effects entirely (no cursor)
- Reduce blob vertex count to 32×32
- Reduce particle count from 50 to 25
- Disable FieldGlow (no cursor to follow)
- Simplify material presets (reduce shader complexity)
- Consider static fallback for very low-power devices

## Measurement

### How to Profile
1. Chrome DevTools → Performance tab → Record during interaction
2. Check for: long frames (>16ms), layout thrashing, forced reflows
3. Three.js: `renderer.info` for draw calls, triangles, textures

### What to Watch
- Draw call count (should be <20)
- Triangle count (should be <50K with all blobs)
- DOM mutation count per frame (should be <30)
- Memory: stable, no leaks (check blob cleanup on split/merge)

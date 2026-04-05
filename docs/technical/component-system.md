# Component System

## Naming Conventions

- **Page sections**: `[Name]Section.tsx` (e.g., ThesisSection, DomainsSection)
- **Field components**: `field/Field[Name].tsx` (e.g., FieldGlow, FieldReactive)
- **3D components**: `sphere/[Name].tsx` (e.g., PhysicsBlob, FluidMaterial)
- **Layout components**: Plain name (Navbar, Footer, FieldShell)

## Component Categories

### Infrastructure
Components that provide context or structure. Never render visible content themselves.

| Component | Purpose |
|-----------|---------|
| FieldShell | Client boundary, wraps FieldProvider + persistent background layers |
| FieldProvider | Mouse tracking context (zero re-renders) |
| SphereBackground | Dynamic import wrapper for Three.js Canvas |

### Field Components
Components that create or respond to the cursor field. All use `useFieldSubscribe` for zero-render updates.

| Component | Purpose |
|-----------|---------|
| FieldGlow | Viewport-wide radial gradient following cursor |
| FieldReactive | Universal wrapper adding proximity effects to children |
| FieldAnnotations | Lab-instrument coordinate/velocity readouts |

### 3D Components
Three.js scene components. All updates happen in `useFrame` callbacks.

| Component | Purpose |
|-----------|---------|
| MaterialSphere (index.tsx) | Canvas setup with SSR guard |
| SphereScene | Lighting + particles + PlaygroundScene |
| PlaygroundScene | Multi-blob state, cursor raycasting, split/merge logic |
| PhysicsBlob | Individual blob physics, material updates, event handlers |
| FluidMaterial | Custom MeshPhysicalMaterial with vertex shader injection |

### Page Sections
Content sections composed into pages. All are client components (Framer Motion).

| Component | Purpose |
|-----------|---------|
| HeroSection | Full-viewport hero with tagline + scroll indicator |
| ThesisSection | Main thesis statement with field reactivity |
| DomainsSection | 4 application domain cards with 3D tilt |
| PropertiesSection | Floating discoverable material vocabulary |
| AccessSection | Access CTA with email link |

### Shared UI
Reusable UI elements.

| Component | Purpose |
|-----------|---------|
| Navbar | Fixed navigation with wordmark + access link |
| Footer | Minimal copyright + email |
| CustomCursor | Custom cursor dot with expand states |
| SunderWordmark | Glitch-reveal animated wordmark |

## Composition Patterns

### FieldReactive Wrapping
Any element can become field-reactive by wrapping in FieldReactive:
```tsx
<FieldReactive glow={0.5} displace={3} radius={300}>
  <p>This text now reacts to cursor proximity</p>
</FieldReactive>
```

### Section Pattern
All sections follow:
1. Motion entrance wrapper (Framer Motion whileInView)
2. Optional FieldReactive inner wrapper
3. Content with appropriate opacity/tracking

### Card Pattern (DomainsSection)
Cards use direct DOM manipulation for real-time tilt + glow:
- `onMouseEnter`: disable CSS transition (for instant response)
- `onMouseMove`: apply 3D transform + inner glow
- `onMouseLeave`: enable CSS transition, reset transform

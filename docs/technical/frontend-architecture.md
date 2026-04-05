# Frontend Architecture

## Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **3D**: Three.js via @react-three/fiber + @react-three/drei
- **Animation**: Framer Motion (layout/entrance), custom RAF (per-frame)
- **Styling**: Tailwind CSS v4 (PostCSS)
- **Deployment**: Vercel

## Architecture Layers

```
┌─────────────────────────────────────────────┐
│  Layout (layout.tsx)                        │
│  ├── CustomCursor (fixed, z-9999)           │
│  └── FieldShell (client boundary)           │
│      ├── FieldProvider (context)            │
│      ├── SphereBackground (Canvas, z-0)     │
│      ├── FieldGlow (fixed div, z-1)         │
│      ├── FieldAnnotations (fixed div, z-2)  │
│      └── {children} (pages, z-10)           │
│          └── pointer-events-none wrapper    │
│              ├── Navbar (fixed, z-50)       │
│              ├── Page sections              │
│              └── Footer                     │
└─────────────────────────────────────────────┘
```

## Key Architectural Decisions

### 1. Zero-Render Field System
The FieldProvider tracks mouse state in refs, not React state. A rAF loop notifies subscribers via callbacks. Components use `useFieldSubscribe` to run per-frame DOM mutations without triggering React re-renders. This is critical for smooth 60fps interactions across many elements.

### 2. Blob in Layout
SphereBackground lives in FieldShell (part of layout.tsx). This means the Three.js Canvas persists across route changes — the blob never unmounts. Page navigation changes content around the blob, not the blob itself.

### 3. Pointer-Events Architecture
The Three.js Canvas is at z-0 with full pointer events (for blob interaction). Content sits at z-10 with `pointer-events-none`. Interactive content elements re-enable pointer events via CSS selectors: `[&_a]:pointer-events-auto`, `[&_[data-cursor='expand']]:pointer-events-auto`, etc.

### 4. Client/Server Boundary
- `layout.tsx` is a server component
- `FieldShell` creates the client boundary (wraps everything interactive)
- Page components (page.tsx) can be server components
- Section components are client components (use Framer Motion / field hooks)

## State Management

- **Mouse/field state**: FieldProvider (ref + subscription, no re-renders)
- **Blob state**: PlaygroundScene useState (blob array, split/merge)
- **Material uniforms**: Direct ref mutations in useFrame (Three.js)
- **Animation state**: Framer Motion (entrance animations)
- **UI state**: Minimal — most interactions are stateless DOM mutations

## File Organization

```
src/
  app/
    layout.tsx          Server layout, imports FieldShell
    page.tsx            Home page, composes sections
    globals.css         Global styles
    access/
      page.tsx          Access route
      content.tsx       Access client content
    brand/
      page.tsx          Internal brand guide
  components/
    field/
      FieldGlow.tsx     Cursor radial glow
      FieldReactive.tsx Proximity-reactive wrapper
      FieldAnnotations.tsx Lab readouts
    sphere/
      index.tsx         Canvas wrapper
      SphereScene.tsx   Scene setup + lighting
      PlaygroundScene.tsx Multi-blob state management
      PhysicsBlob.tsx   Individual blob physics
      FluidMaterial.tsx Custom shader material
    FieldShell.tsx      Client provider wrapper
    Navbar.tsx          Navigation
    HeroSection.tsx     Hero with tagline
    ThesisSection.tsx   Thesis statement
    DomainsSection.tsx  Application domain cards
    PropertiesSection.tsx Floating material vocabulary
    AccessSection.tsx   Access CTA
    Footer.tsx          Minimal footer
    CustomCursor.tsx    Custom cursor dot
    SunderWordmark.tsx  Glitch wordmark
    SphereBackground.tsx Dynamic import wrapper
  lib/
    field-context.tsx   Field system (provider + hooks)
    interactions.ts     Magnetic effect hook (legacy)
```

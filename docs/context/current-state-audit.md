# Current State Audit

*Last updated: 2026-04-04*

## What Works

### Core Material Experience
- The blob physics are convincing — grab, stretch, split, merge all feel physical
- Simplex noise idle motion gives the blob genuine organic presence
- Material preset cycling (titanium → carbon → frost → molten) keeps it visually alive
- The 3D lighting creates depth and dimensionality

### Field Interaction System
- Zero-render subscription architecture is smart and performant
- Non-Newtonian stiffness rule (fast = stiff, slow = fluid) is felt, not just theorized
- FieldReactive wrapper is composable — any element can become field-responsive
- Cursor radial glow creates physical presence for the cursor

### Atmosphere
- Film grain adds tactile quality without being visible as a pattern
- Material status readouts at 4% opacity feel like instrument telemetry
- Lab annotations (coordinates, velocity) reinforce the observation-interface metaphor
- Idle discovery messages reward patience — feel like the lab is alive

### Copy
- "The future is material." is strong, loaded, memorable
- "We engineer matter that responds" is specific without revealing too much
- Domain descriptors use real material science vocabulary
- Manifesto fragments ("Every surface is a decision.") add atmospheric depth

### Code Quality
- TypeScript strict, clean modular architecture
- Performance-conscious at every layer (refs, rAF, direct DOM mutations)
- Reusable components (FieldReactive, ManifestoFragment)
- Build is clean, no warnings

## What Feels Shallow

- The blob and the HTML content still feel like two separate worlds — the blob doesn't influence text/cards yet
- Domain cards are good but could go deeper — hovering one should change the blob's material
- The Properties section is atmospheric but doesn't teach anything
- No way to "test" the material beyond grab/split — no experiments yet
- Page transitions are standard route changes, not matter-reforming

## What Feels Generic

- The Access page copy could be more distinctive ("Request early access to the research interface" is functional but not loaded enough)
- Footer, while cleaner, is still basically copyright + email
- The "observe" scroll indicator is close but could be more integrated with the material system

## What Breaks the Lab Illusion

- Navigating between pages is a hard cut, not a reformation
- No keyboard shortcuts for power users (beyond 'R' to reassemble)
- The research page cards look like nice cards, not like research instruments
- No data or readings change based on what the user actually does to the blob
- Touch/mobile has no special handling — field effects just don't exist there

## Disconnected Elements

- The /brand page is internal but accessible — should be unlisted or protected
- IndustriesSection.tsx, ManifestoSection.tsx, CTASection.tsx still exist in the codebase but are unused — should be cleaned up
- interactions.ts (useMagneticEffect) is unused legacy code

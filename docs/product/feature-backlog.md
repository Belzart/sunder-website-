# Feature Backlog

## Priority: High (Next Build Pass)

### 1. Film Grain Overlay
- Subtle CSS noise on body at ≤2% opacity
- Adds tactile quality to the darkness
- Low effort, high atmospheric impact

### 2. Material Status Bar
- Persistent thin bar or annotation showing material state
- "specimen.state: idle" / "field.active" / "substrate.responsive"
- Updates based on interaction (grabbed, split, idle)
- Very low opacity, lab-instrument feel

### 3. Research Page
- 3-4 research area modules
- Each with name, description, and material behavior association
- Field-reactive cards
- Manifesto fragments between modules

### 4. Application Preset Switching
- Hovering an application card changes the blob's material preset
- Creates direct link between UI content and 3D material
- Makes applications feel real, not abstract

### 5. Page Transition System
- Content fade out → blob morph → content fade in
- Framer Motion AnimatePresence or layout animations
- Makes navigation feel like matter reforming

## Priority: Medium (Depth Pass)

### 6. Hold-to-Reveal Interaction
- Press and hold on certain elements to reveal deeper content
- Lab notes, research annotations, hidden data
- Adds discovery layer without cluttering surface

### 7. Mini Experiments
- Small interactive modules where user can "test" the material
- E.g., "Apply pressure" slider, "Measure response" readout
- Lives on /research or as hidden home page interactions
- Must feel premium, not gimmicky

### 8. Idle Discovery System
- If user does nothing for 10+ seconds, something appears
- A word, a pulse, a state change
- Rewards patience and observation

### 9. Keyboard Shortcuts
- Number keys 1-4 switch material presets
- 'R' already reassembles (keep)
- 'F' toggles field visibility (annotations)
- 'L' toggles lab mode (more data overlays)

### 10. Scroll-Velocity Responsive
- Faster scrolling subtly affects ambient motion intensity
- Blob reacts to scroll momentum
- Sections compress or expand based on scroll speed

## Priority: Low (Polish Pass)

### 11. Sound Design (Optional)
- Very subtle, opt-in only
- Low-frequency ambient hum
- Interaction sounds (stretch, snap, split)
- HIGH RISK — only if truly tasteful

### 12. Touch/Mobile Optimization
- Touch gestures for blob interaction
- Simplified field effects for performance
- Responsive layout for all sections

### 13. Performance Mode
- Detect low-power devices
- Reduce particle count, simplify shader
- Disable field effects below threshold

### 14. Analytics-Ready Events
- Track: blob interactions, page depth, time on site
- Custom events for: first grab, first split, access click
- No visible impact on experience

### 15. SEO / Meta
- OG images (rendered from blob)
- Structured data
- Proper meta descriptions per page

# Experiments

## What This Means

"Experiments" are interactive moments where the user does something to the material and observes the result. They transform the site from "look at this" to "test this." This is the core differentiator between a pretty landing page and a lab interface.

## Implemented Experiments

### 1. Grab and Deform
- **Trigger**: Click and drag the blob
- **Behavior**: Material stretches toward cursor with viscous resistance
- **Observation**: Non-Newtonian response — fast pull = stiff, slow pull = fluid
- **Status**: Working

### 2. Split Under Force
- **Trigger**: Pull blob past 2.5× its radius
- **Behavior**: Volume-preserving split into two children
- **Observation**: Material has a breaking point, but mass is conserved
- **Status**: Working

### 3. Reassemble
- **Trigger**: Double-click or press 'R'
- **Behavior**: All fragments merge back into one blob
- **Observation**: The material can reconstitute
- **Status**: Working

### 4. Probe the Field
- **Trigger**: Move cursor slowly through the Properties section
- **Behavior**: Hidden words brighten and push away
- **Observation**: The material's vocabulary is embedded in its field
- **Status**: Working

## Planned Experiments

### 5. Pressure Test
- **Concept**: User presses and holds on the blob. It compresses, flattens.
- **Data overlay**: "Pressure: 0.3 MPa" counter increases with hold duration
- **Release behavior**: Blob springs back to shape with overshoot
- **Reads as**: Material stress testing

### 6. Temperature Response
- **Concept**: User scrolls a "temperature" control. Material shifts presets.
- **Cold**: Frost preset (brittle, translucent, slower motion)
- **Room**: Titanium preset (balanced)
- **Hot**: Molten preset (fluid, emissive, faster motion)
- **Reads as**: Thermal characterization

### 7. Field Strength Test
- **Concept**: User adjusts a slider or drags a radial control
- **Effect**: Field influence radius and strength on nearby text changes in real-time
- **Observation**: The material's field extends beyond its body
- **Reads as**: Field measurement

### 8. Resonance Discovery
- **Concept**: Rapid click pattern triggers a resonance mode
- **Effect**: Blob enters a high-frequency wobble state
- **Duration**: Decays over 3-5 seconds
- **Reads as**: Finding the material's resonant frequency

### 9. Multi-Point Deformation (Future, Touch)
- **Concept**: Two-finger pinch/stretch on touch devices
- **Effect**: Material deforms between two contact points
- **Reads as**: Multi-axis stress testing

## Design Rules for Experiments

1. **No instructions** — the experiment should be discoverable through natural interaction
2. **Lab-like, not game-like** — avoid scores, achievements, or gamification
3. **Real-feeling data** — any numbers shown should feel like instrument readings
4. **Brief** — experiments take 2-10 seconds, not minutes
5. **Repeatable** — the user can run the same experiment again with different parameters
6. **Connected** — experiments should feel like different tests on the same material, not disconnected demos

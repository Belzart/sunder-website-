# Hidden Interactions

## Philosophy

Hidden interactions reward curiosity. They are never required to understand the site. They are gifts for people who explore, linger, or experiment. They make the site feel deeper than it appears — "nearly infinite through layers, not through content."

Every hidden interaction should feel like discovering something in a lab — not like unlocking an achievement.

## Implemented

### 1. Discoverable Properties (PropertiesSection)
- **What**: 8 material science terms floating at 3-7% opacity
- **Discovery**: Cursor proximity brightens them up to 4× and pushes them away
- **Feel**: Scanning the material's field reveals its vocabulary
- **Percentage of visitors who will find this**: ~60% (subtle but in the scroll path)

### 2. Idle Discovery (IdleDiscovery)
- **What**: Messages appear after 12 seconds of cursor stillness
- **Messages**: "Sample responsive. Awaiting input." / "Substrate active." / "Field nominal. Begin observation." / "Material state: resting." / "The specimen is waiting."
- **Disappears**: 2 seconds after cursor moves again
- **Feel**: The lab is talking to you when you stop
- **Percentage**: ~15% (most people don't stay still that long)

### 3. Lab Annotations (FieldAnnotations)
- **What**: Cursor coordinates and velocity at viewport corners, 5% opacity
- **Discovery**: Only visible on close inspection or to detail-oriented visitors
- **Feel**: Instrument readouts — the interface is measuring your input
- **Percentage**: ~20%

### 4. Material Status (MaterialStatus)
- **What**: specimen.state / field.amplitude / substrate.integrity readouts at left edge, 4% opacity
- **Discovery**: Near-invisible until you look for them
- **Updates**: Responds to cursor speed and interaction state
- **Feel**: Live telemetry from the specimen
- **Percentage**: ~10%

### 5. Blob Split/Merge
- **What**: Pulling the blob hard enough splits it; double-click reassembles
- **Discovery**: Requires active experimentation with the blob
- **Feel**: Material has a breaking point, but can reconstitute
- **Percentage**: ~30%

### 6. Keyboard Reassemble
- **What**: Press 'R' to reassemble all blob fragments
- **Discovery**: Not announced anywhere
- **Feel**: Lab shortcut, power user
- **Percentage**: ~5%

### 7. Research Card Lab Notes
- **What**: Each research card has a 4% opacity lab note at the bottom
- **Discovery**: Only visible on hover when the card brightens
- **Note format**: "stimulus → structural response → emergent computation"
- **Feel**: Research annotations, like reading the margins of a paper
- **Percentage**: ~25%

## Planned

### 8. Material Preset Keyboard Shortcuts
- **Trigger**: Keys 1-4
- **Effect**: Instantly switch blob to Titanium/Carbon/Frost/Molten
- **Data overlay**: Brief flash showing preset name
- **Percentage**: ~3%

### 9. Extended Hold Reveal
- **Trigger**: Click and hold on a research card for 3+ seconds
- **Effect**: Deeper content fades in — a sentence or data point not visible otherwise
- **Feel**: Like holding a specimen under a microscope longer
- **Percentage**: ~8%

### 10. Cursor Stillness Over Blob
- **Trigger**: Park cursor directly over the blob for 5+ seconds
- **Effect**: Blob slowly reaches toward cursor, slight color shift
- **Feel**: The material is curious about the observer
- **Percentage**: ~5%

### 11. Rapid Click Resonance
- **Trigger**: Click 5+ times rapidly in empty space
- **Effect**: Field pulse ripple, blob wobble spike
- **Feel**: Exciting the material's resonant frequency
- **Percentage**: ~10%

### 12. Secret Route
- **Trigger**: Type a specific word or key sequence
- **Effect**: Access a hidden /lab page with more experimental interactions
- **Feel**: Internal access to a deeper layer
- **Percentage**: <1%

## Design Rules

1. **Never announce hidden interactions** — no tooltips, no tutorials, no "try clicking here"
2. **Never require them** — the site works fully without discovering any
3. **Always feel physical** — every hidden interaction should have a material-science justification
4. **Scale reward to effort** — easy discoveries are subtle, deep discoveries are more dramatic
5. **Never break the world** — hidden interactions should deepen the illusion, not break it
6. **Keep count reasonable** — 10-15 total hidden interactions is ideal. More feels like a game.

# Unresolved Questions

## Brand / Positioning

1. **Should there be a team or "About" section?**
   - Current stance: No. Artifact first, people later.
   - Risk: Investors often look for founder credentials. A complete absence of human information could feel evasive rather than mysterious.
   - Possible middle ground: A single line like "Founded by engineers from [institutions]" deep in the experience.

2. **Should the /brand page be public or protected?**
   - Currently accessible at /brand with no protection
   - It contains internal brand guidelines, logo concepts, design rules
   - Options: password-protect, remove from build, or leave as-is as a subtle signal of seriousness

3. **When does "stealth" become "unclear"?**
   - The mystery is intentional, but at some point visitors need enough information to act
   - Is the current level of explanation sufficient for an investor to take a meeting?
   - Should there be a brief "What we're building" sentence that's more concrete?

## Experience

4. **Should the blob respond to page context?**
   - Currently the blob is the same on every page
   - On /research, should it be smaller, more subdued, or split into area-specific specimens?
   - On /access, should it be minimal?
   - This is high-impact but architecturally complex (requires page-level blob configuration)

5. **Is the hero interaction clear enough?**
   - First-time visitors may not realize the blob is interactive
   - Should there be any hint (beyond "observe" text) that the material can be manipulated?
   - Risk of tooltip: breaks the mystery. Risk of no hint: visitors miss the core interaction.

6. **How much interaction is too much?**
   - The hidden interaction philosophy is "rewards for explorers"
   - But if the core experience is 5 seconds for most visitors, are we over-investing in depth that 5% of people will find?
   - Counter-argument: the 5% who find it are the exact audience we want (technical, curious, detail-oriented)

7. **Should page transitions be custom?**
   - Currently standard Next.js route changes (hard cut)
   - Custom transitions (content fades, blob morphs) would strengthen the "one world" illusion
   - Cost: significant engineering effort, potential complexity with Next.js App Router
   - Possible simple version: just a fade-through-black using AnimatePresence in layout

## Technical

8. **Should the blob bridge to HTML?**
   - Currently the Three.js blob and HTML content are separate layers
   - Projecting the blob's screen position into the field system would allow text to warp near the blob
   - This is the single highest-leverage technical improvement for making the site feel unified
   - Complexity: moderate (project blob center to screen coords in each frame, add to field state)

9. **What's the mobile strategy?**
   - Currently: touch devices get no field effects, no custom cursor
   - The blob should still be interactive via touch (it already supports pointer events)
   - But the atmospheric layers (grain, glow, annotations, status) assume a cursor
   - Options: simplified mobile experience, or invest in touch-specific interactions

10. **Should we add analytics?**
    - Tracking blob interactions, page depth, time on site, access clicks would inform decisions
    - But analytics scripts add weight and privacy implications
    - Possible: minimal custom event tracking without a third-party SDK

## Content

11. **Is "The future is material." the right hero line?**
    - It's good: short, memorable, double meaning (both "the future matters" and "the future is made of material")
    - But is it specific enough? Could it be about any materials company?
    - Alternatives considered: "Matter, engineered to respond." / "The next surface." / "Material intelligence."
    - Current decision: keep it. It's the strongest option and has the right weight.

12. **Should there be long-form content anywhere?**
    - Currently everything is fragments, labels, and short statements
    - A "Manifesto" page or deeper research write-ups could serve technical talent and curious investors
    - Risk: long text breaks the atmospheric quality
    - Possible: a manifesto that appears line-by-line as you scroll, maintaining the sparse feel

13. **What's the email strategy?**
    - Currently: mailto link to hello@sunder.com
    - Should there be a form? An access request form with fields (name, company, interest)?
    - A form signals more seriousness but requires backend infrastructure
    - For v1.0, mailto is probably sufficient

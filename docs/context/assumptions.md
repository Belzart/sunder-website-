# Assumptions

## Business Assumptions

1. **Sunder is real but early.** The company has founders and a thesis but no shipped products yet. The website is the primary touchpoint for all audiences right now.

2. **Stealth is strategic, not defensive.** Being in stealth creates intrigue and scarcity. It's not because there's nothing to show — it's because controlled reveals are more powerful than premature ones.

3. **The website IS the product for now.** Until physical materials exist, the site's interaction quality is the strongest proof of the team's taste, ambition, and technical depth. Every interaction is a credibility signal.

4. **Investors are the primary short-term audience.** The site needs to generate meetings. It should make investors feel they're seeing something early that will be important later.

5. **The company could pivot.** "Materials science" is the starting frame, but Sunder could become a materials company, a sensing company, a robotics actuator company, or a platform. The site should be broad enough to accommodate this without needing a full redesign.

## Design Assumptions

6. **Desktop-first is acceptable for now.** The primary audience (investors, technical talent) will mostly visit on desktop. Mobile is important but can be a simplified experience rather than a full port.

7. **Performance on modern hardware is the target.** We're building for 2024+ MacBooks and decent Windows machines, not for 5-year-old phones. The Three.js blob is the heaviest element and requires a real GPU.

8. **Interaction quality > content volume.** One deeply interactive page is worth more than ten static ones. Depth over breadth.

9. **Copy should be minimal enough to be memorable.** No one remembers a paragraph. Everyone remembers "The future is material."

10. **The blob is the brand.** If someone screenshots this site, the blob is what they'd share. It needs to be that good.

## Technical Assumptions

11. **Next.js App Router is the right foundation.** Server components for pages, client components for interactions, layout-level persistence for the blob.

12. **Three.js performance is manageable.** With DPR capped at 1.5, max 12 blobs, and 48×48 sphere geometry, the GPU cost is reasonable for target hardware.

13. **The field system will scale.** The current subscription-based architecture can handle 30+ subscribers per frame without measurable overhead.

14. **Vercel deployment is sufficient.** No server-side rendering requirements beyond static generation. No database. No API routes needed yet.

## Assumptions That Could Be Wrong

- That investors will spend enough time on the site to discover hidden interactions (they might bounce in 5 seconds)
- That the blob is impressive enough as-is (it might need to be more dramatic or more refined)
- That three pages is enough depth (some visitors may want more substance)
- That no team/about section is needed (some investors specifically look for founder credentials)
- That sound is unnecessary (subtle audio could dramatically improve the tactile feel)

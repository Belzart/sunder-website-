@AGENTS.md

# Sunder Website

## What is Sunder?
Sunder is a materials science/technology company solving material problems for industries shaping the future — robotics, space, defense, and energy. Tagline: "The future is material."

## Tech Stack
- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (via PostCSS)
- **3D:** Three.js via @react-three/fiber + @react-three/drei
- **Animation:** Framer Motion
- **Font:** Inter (Google Fonts via next/font)
- **Deployment:** Vercel

## Project Structure
```
src/
  app/
    layout.tsx        — Root layout, metadata, Inter font, dark bg (#0A0A0A)
    page.tsx          — Home page, composes all sections
    globals.css       — Global styles
    favicon.ico
  components/
    Navbar.tsx        — Fixed top nav with "SUNDER" wordmark + "REQUEST ACCESS" CTA
    HeroSection.tsx   — Full-screen hero with 3D sphere + "The future is material." tagline
    MaterialSphere.tsx — Three.js sphere with cycling material presets (titanium, carbon fiber, frosted glass, molten metal), mouse-reactive rotation, floating particles
    ManifestoSection.tsx — Statement: "The industries shaping tomorrow are constrained by the materials of today."
    IndustriesSection.tsx — Lists target industries: Robotics, Space, Defense, Energy
    CTASection.tsx    — "Interested in what we're building?" + "GET IN TOUCH" mailto link
    Footer.tsx        — Minimal footer with copyright
```

## Design Language
- Dark theme: background #0A0A0A, white text at various opacities
- Ultra-minimal, high-end aesthetic — lots of whitespace, wide letter-spacing
- Subtle animations (fade-in, scroll-triggered via Framer Motion)
- Contact: hello@sunder.com

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint

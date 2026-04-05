# Site Architecture

## Principle

Depth over breadth. A few modes of a coherent world, not many pages of a corporate site.

## Architecture

```
/                   Home / Material — the encounter
/research           Research — what we're exploring (future)
/applications       Applications — where it goes (future)
/access             Access — the gate
/brand              Brand system — internal reference (exists, non-public)
```

## Navigation Model

### Primary Nav (Always Visible)
- **Left**: SUNDER wordmark → links to /
- **Right**: "Access" → links to /access

### Extended Nav (Future)
- **Left**: SUNDER
- **Right**: Research · Applications · Access
- Navigation text at 10-15% opacity, brightens on hover

### No Hamburger Menu
The site has 3-5 pages maximum. No hidden nav needed. If it doesn't fit in a single line, there are too many pages.

## Information Hierarchy

### Layer 1: Surface (Everyone Sees)
- The material/blob
- "The future is material."
- The general impression of a premium lab interface

### Layer 2: Structure (Scrollers See)
- Thesis statement
- Domain cards
- Access CTA

### Layer 3: Texture (Explorers Discover)
- Properties words (near-invisible, cursor-revealed)
- Lab annotations (coordinate readouts)
- Material color cycling
- Blob split/merge mechanics

### Layer 4: Depth (Deep Explorers Find)
- Hidden keyboard shortcuts
- Extended hover states
- Sustained interaction rewards
- (Future) Secret pages or modes

## Content Strategy

### What Goes Where

| Content Type | Location | When |
|-------------|----------|------|
| Core thesis | Home / Thesis section | Always visible |
| Application areas | Home / Domains + /applications | Surface + depth |
| Material vocabulary | Home / Properties section | Discoverable |
| Research areas | /research | Deeper exploration |
| Contact/access | /access + Home / Access section | Always available |
| Team info | Nowhere (for now) | Only if explicitly needed later |
| Technical details | Nowhere (for now) | Revealed through interaction quality |

## URL Structure

Clean, single-word slugs. No nested routes. No query parameters.
- `/` — Home
- `/research` — Research
- `/applications` — Applications
- `/access` — Access
- `/brand` — Brand system (internal)

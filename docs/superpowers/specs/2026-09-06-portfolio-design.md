# Portfolio Site — Design Spec

**Date:** 2026-09-06
**Owner:** Mohammad Arif Hossain
**Status:** Approved for planning

---

## 1. Purpose and audience

A personal portfolio site that a recruiter reaches from the CV, and that an
engineer reaches from GitHub.

**Priority order is explicit:** recruiter / hiring manager first, engineer
second. The technical character of the site is *not* negotiable against that
priority — it must serve both, but where the two conflict, the recruiter's
20-second skim wins on structure and the engineer wins on accuracy.

Two consequences follow, and every decision below traces to one of them:

- **Structure is conventional.** Who → what shipped → stack → contact, in that
  order, readable top to bottom without interaction.
- **The technical concept is literally true.** No decorative fake code, no
  meaningless token animation. Anything presented as a runtime concept must
  correspond to something real, because a shallow version reads worse to an
  engineer than no concept at all.

### Success criteria

1. A recruiter can answer "senior full stack, how long, what did he ship?"
   within 20 seconds of landing, without scrolling past the first screen.
2. An engineer inspecting the concept finds the mappings defensible.
3. Lighthouse 100 across Performance, Accessibility, Best Practices, SEO.
4. Deploys to GitHub Pages on push, with no manual step.

---

## 2. Concept: the page is an execution context

Loading the page creates a global execution context. The site presents itself
as that runtime.

The concept was chosen over a compiler pipeline, a polyglot three-runtime
layout, and a JVM class-loading treatment because of one property the others
lack: **reverse-chronological experience is already a call stack.** The current
role is the top frame; earlier roles are the frames beneath it. That is
simultaneously correct computer science and correct CV convention, so the same
markup satisfies both audiences without compromise.

---

## 3. Information architecture

| # | Section | Runtime element | Justification |
|---|---------|-----------------|---------------|
| 1 | Hero / identity | Global execution context | Page load genuinely creates one; identity is the global scope. |
| 2 | Employment | Call stack | LIFO; newest frame on top; the current role is the executing frame. |
| 3 | Selected work | Heap | Projects are long-lived allocated objects that stack frames hold references to. |
| 4 | Skills | Scope chain | Resolution proceeds outward: Proficient = local, Comfortable = closure, Familiar = global. Reaching further costs more, which is exactly what the tiers mean. |
| 5 | Education & certifications | Module resolution | Dependencies resolved before execution begins. |
| 6 | References | Linker references | Section label stays plainly "References". |
| 7 | Footer | Event loop | One ambient tick; the only self-running motion on the page. |

### 3.1 The stack→heap edge

The defining interaction. Focusing or hovering a stack frame draws pointer
lines from that frame to the heap objects it allocated — the Penta frame points
to BEZA OSS, the Election Commission system, and ContentOps.

This exists because it answers a hiring manager's real question ("what did
*this* job actually produce?") with a gesture instead of a paragraph, and
because it is the one relationship a linear CV structurally cannot express.

Implemented as an SVG overlay layer computing edge geometry from element
positions, recalculated on resize. Pointer lines are progressive enhancement:
with JavaScript disabled or motion reduced, each project still names its
employer in text.

### 3.2 The 2021 concurrency

HW Saver LLP (31/12/2020 – 10/07/2021) and CogniAble (22/04/2021 – 20/09/2021)
overlap by roughly three months. This is factually correct: two internships were
held concurrently, and CogniAble subsequently converted the role to full-time
remote.

A call stack cannot hold two simultaneously executing frames, and an engineer
will notice. Rather than flattening the history to protect the metaphor, that
stack level **splits into two parallel lanes**, labelled as concurrent, with
CogniAble's conversion to full-time marked on its lane.

This is a deliberate inversion: the apparent flaw becomes the most distinctive
detail on the page, and it demonstrates the honesty the rest of the CV claims.

---

## 4. Content: single source of truth

All content lives in `src/data/cv.ts` as typed exports, transcribed from
`~/Documents/resume/Mohammad_Arif_Hossain_Resume.md`. No content is authored in
components. This guarantees the site and the CV cannot silently drift.

Shape:

```ts
type Tier = 'proficient' | 'comfortable' | 'familiar';

interface Employment {
  id: string;              // referenced by Project.employmentId
  company: string;
  location: string;
  role: string;
  start: string;           // ISO
  end: string | null;      // null = executing
  concurrentWith?: string; // employment id, for the 2021 lanes
  note?: string;           // e.g. 'converted to full-time remote'
  points: string[];
}

interface Project {
  id: string;
  name: string;
  employmentId: string | null;  // null = independent client work
  kind: string;
  stack: string[];
  period: string;
  features: string[];
}
```

### 4.1 Experience duration

Stated as **5+ years**, computed from the earliest start date (31/12/2020),
which is 5.68 years as of 2026-09-06.

This deliberately supersedes the "7+ years" currently on the CV. See §12 —
the CV must be corrected in the same change, because a site saying 5+ beside a
CV saying 7+ is worse than either figure alone.

---

## 5. Visual system

### 5.1 Rejected direction

The default developer-portfolio look — near-black ground, neon green
monospace, terminal chrome — is explicitly rejected. It is the most
over-produced aesthetic in this category and would make the site
indistinguishable from hundreds of others, defeating the "eye-catching"
requirement it superficially seems to serve.

### 5.2 Chosen direction

Carry the CV's existing identity forward, shifted into an instrument register.
A recruiter who reads the PDF and then opens the site sees one coherent person;
that continuity is worth more than novelty.

**Light (default — matches the CV a recruiter just read):**

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F6F7F4` | page ground |
| `--sheet` | `#FFFFFF` | raised surfaces |
| `--ink` | `#16201C` | primary text |
| `--ink-2` | `#4A554F` | secondary text |
| `--ink-3` | `#77827B` | metadata |
| `--rule` | `#D7DDD6` | borders |
| `--rule-soft` | `#E7EBE5` | dividers |
| `--accent` | `#1E5B45` | identity green |
| `--accent-2` | `#2F7A5E` | accent hover |
| `--live` | `#B4741A` | **currently executing** |
| `--live-wash` | `#FBF2E2` | executing frame ground |

**Dark:**

| Token | Value |
|---|---|
| `--paper` | `#0F1411` |
| `--sheet` | `#161C18` |
| `--ink` | `#E6EBE6` |
| `--ink-2` | `#A8B3AC` |
| `--ink-3` | `#78837C` |
| `--rule` | `#2A332D` |
| `--rule-soft` | `#212823` |
| `--accent` | `#6FBF97` |
| `--accent-2` | `#4FA37B` |
| `--live` | `#E0A44A` |
| `--live-wash` | `#2A2115` |

Two functional colors, each with exactly one job: **green marks identity,
amber marks *now***. Amber is the debugger convention for the active frame,
which is why it is the right color for the executing role rather than an
arbitrary pop.

### 5.3 Theming mechanics

Three states, per standard practice:

- `:root` declares the **complete** light palette. Every token is defined here.
- `@media (prefers-color-scheme: dark)`, guarded `:root:not([data-theme="light"])`,
  redefines tokens only.
- `:root[data-theme="dark"]` redefines them again so an explicit toggle wins.

No color may have its only definition inside a media or `[data-theme]` block.
`body` sets an explicit token background.

### 5.4 Typography

The same three faces as the CV, re-proportioned so monospace dominates:

- **Newsreader** — display, used sparingly
- **Public Sans** — body
- **IBM Plex Mono** — all structural labels, frame headers, metadata, stack
  addresses

Loaded from Google Fonts with real fallback stacks. Running text near 65
characters. `text-wrap: balance` on headings. `font-variant-numeric:
tabular-nums` wherever dates or counts align.

### 5.5 Layout

A fixed left instrument rail reports current runtime state as the reader
scrolls (active section, stack depth, event-loop tick). Main column centred at
~65ch. Below 900px the rail collapses to a slim top status bar.

---

## 6. Motion

Exactly two moving things.

**Cold start (orchestrated, once, on load).** Under 1.5s: the global execution
context is created, the portrait and identity push on as the first frame, the
event loop begins. It then settles and stays still.

**Event-loop tick (ambient).** One quiet indicator in the rail and footer.

Everything else is state-driven only — hover and focus reveal the heap pointers.

**Constraints:**

- The page is fully readable in its first still frame. Nothing meaningful is
  parked at `opacity: 0` waiting on an animation or an observer.
- `prefers-reduced-motion: reduce` resolves the boot to its settled state
  immediately and stops the tick.

---

## 7. Portrait handling

Source is `~/Documents/resume/Arif =Lif (1).jpg`, 210×270 px — passport-sized,
which rules out a full-bleed hero and sets a hard ceiling on display size.

Measured compression:

| Encoding | Size |
|---|---|
| source JPEG | 53,200 B |
| WebP q72 | 3,982 B |
| WebP q80 | 4,958 B |
| **WebP q88 (chosen)** | **6,928 B** |

At 6.9 KB the image is **inlined as a base64 data URI** (~9.2 KB of HTML). This
eliminates the network request entirely — nothing to wait on, nothing to
preload, no layout shift.

Rendered at 120×154 CSS px inside the global-context frame, with explicit
`width`/`height` attributes and meaningful `alt` text. Displayed at native
resolution rather than upscaled.

---

## 8. Tech stack and repository structure

Vite + React 19 + TypeScript. `vite-plugin-singlefile` so the build emits one
self-contained `index.html` deployable to GitHub Pages, Vercel or Firebase
unchanged, and previewable as an Artifact during review.

```
portfolio/
  index.html
  vite.config.ts
  tsconfig.json
  package.json
  src/
    main.tsx
    App.tsx
    data/cv.ts                  content, single source of truth
    components/
      InstrumentRail.tsx
      GlobalContext.tsx         hero + portrait
      CallStack.tsx
      StackFrame.tsx
      ConcurrentLanes.tsx       the 2021 split
      Heap.tsx
      HeapObject.tsx
      PointerLayer.tsx          SVG stack→heap edges
      ScopeChain.tsx            skills tiers
      ModuleResolution.tsx      education + certifications
      References.tsx
      EventLoop.tsx
      ThemeToggle.tsx
    hooks/
      useReducedMotion.ts
      useBootSequence.ts
      useTheme.ts
    styles/
      tokens.css
      base.css
    assets/portrait.webp
  .github/workflows/deploy.yml
  docs/superpowers/specs/
```

No runtime dependency beyond React and its DOM renderer. Vite, TypeScript,
Vitest and React Testing Library are devDependencies and ship nothing to the
browser.

**Component boundaries.** Each component takes typed data and renders; none
fetches, and none reaches into another's internals. `PointerLayer` is the only
component that reads DOM geometry, and it does so through refs passed down
rather than by querying globally — so the stack and heap remain independently
testable.

---

## 9. Build and deploy

**Target: GitHub Pages user site — repository `a1barif2h.github.io`.**

Local working directory is `~/Documents/portfolio`; its `origin` is the
`a1barif2h.github.io` repository. The directory name and the repository name
deliberately differ, and only the repository name determines the served URL.

Chosen over a project repo because a user site serves from the root, avoiding
`base` path configuration and the broken-relative-asset class of bug entirely.
Final URL: `https://a1barif2h.github.io`.

The previously advertised Firebase host `arif-hossain-portfolio.web.app` is
**dead** and is abandoned, not migrated.

Workflow on push to `main`: checkout → setup-node 24 → `npm ci` →
`npm run build` → `actions/upload-pages-artifact` (`dist/`) →
`actions/deploy-pages`.

---

## 10. Accessibility and performance

- Semantic HTML with a correct heading outline. The call stack is an ordered
  list, because it is one.
- Visible keyboard focus on every interactive element. The stack→heap pointers
  are reachable by keyboard, not hover-only.
- Colour is never the sole carrier of meaning: the executing frame is labelled
  as well as amber.
- Contrast meets WCAG AA in both themes.
- Wide content scrolls inside its own container; the body never scrolls
  sideways.
- Budget: one HTML document, zero image requests, one Google Fonts stylesheet
  request plus its woff2 files. Target
  LCP under 1.2s on a cold 4G load, Lighthouse 100 across all four categories.

**Known trade-off:** single-file inlining means the JavaScript cannot be cached
separately from the markup, so a repeat visitor re-downloads everything on
change. Accepted deliberately in exchange for host portability, and immaterial
at this page weight.

---

## 11. Testing

Vitest + React Testing Library.

**Data integrity** — every employment entry has the required fields; dates
parse; entries are ordered descending by start date; every `Project.employmentId`
resolves to a real employment id (this is what keeps the stack→heap pointers
from ever dangling).

**Rendering** — the call stack renders newest-first; exactly one frame is marked
executing; the concurrent 2021 lanes render side by side.

**Behaviour** — under `prefers-reduced-motion`, the boot sequence resolves
immediately rather than animating.

**Structure** — heading order is valid and unskipped.

Plus a typecheck and a production build in CI.

---

## 12. Required downstream CV changes

These are **not optional** and ship with this work, because leaving them
undone makes the CV actively wrong:

1. **Portfolio URL.** Replace the dead `https://arif-hossain-portfolio.web.app/`
   with `https://a1barif2h.github.io` in `Mohammad_Arif_Hossain_Resume.md`,
   `.html` and `.gdoc.html`; re-render the PDF; republish the Artifact; update
   the Google Doc. The CV currently advertises a broken link.
2. **Experience duration.** "7+ years" → "5+ years" in the summary, matching
   §4.1. A site and a CV stating different figures is worse than either.

---

## 13. Out of scope (YAGNI)

Blog, CMS, contact form backend, analytics, internationalisation, custom
domain, downloadable-CV generation on the client, and any live GitHub API
integration. The site is static content about a fixed history; none of these
serve the success criteria.

---

## 14. Decision log

| Decision | Chosen | Rejected |
|---|---|---|
| Audience priority | Recruiter first, engineer second, technical feel non-negotiable | Engineer-first |
| Concept | JS execution context / call stack | Compiler pipeline; polyglot runtimes; JVM class loading |
| Stack | Vite + React + TS, single-file output | Hand-built vanilla; Next.js on Vercel |
| First screen | Cold start boot, under 1.5s | Live REPL; motionless engine diagram |
| Host | GitHub Pages user site | Firebase (dead URL); Vercel |
| Palette | CV identity + amber "executing" | Near-black + neon green terminal |
| Portrait | WebP q88 inlined as data URI | Separate file request; upscaled hero |
| 2021 overlap | Rendered honestly as concurrent lanes | Flattened to a clean linear stack |
| Duration claim | 5+ years (measured) | 7+ years (unsupported by dates) |

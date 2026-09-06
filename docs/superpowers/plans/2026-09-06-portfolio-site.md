# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a static portfolio site at `https://a1barif2h.github.io` that presents Mohammad Arif Hossain's career as a JavaScript execution context, and correct the four factual errors in the CV it links to.

**Architecture:** A single-page Vite + React + TypeScript app with no runtime dependency beyond React. All content lives in one typed data module; every claim about overlaps and durations is *derived* from dates rather than stored, so the timeline cannot drift from the statements made about it. The build emits one self-contained `index.html` deployable to any static host.

**Tech Stack:** Vite 7, React 19, TypeScript 5.7, `vite-plugin-singlefile`, Vitest 3, React Testing Library 16, jsdom, GitHub Actions → GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-06-portfolio-design.md`

## Global Constraints

- **Repo/host:** `a1barif2h.github.io`, GitHub Pages user site, served from root. No `base` path.
- **Runtime deps:** `react` and `react-dom` only. Everything else is a devDependency.
- **Node:** 24 (matches the local toolchain and the CI workflow).
- **Typefaces:** exactly two — **IBM Plex Mono** (display + machine-rendered content) and **Public Sans** (body prose). Newsreader is NOT used.
- **Palette (light):** `--paper #F6F7F4`, `--sheet #FFFFFF`, `--ink #16201C`, `--ink-2 #4A554F`, `--ink-3 #77827B`, `--rule #D7DDD6`, `--rule-soft #E7EBE5`, `--accent #1E5B45`, `--accent-2 #2F7A5E`, `--live #B4741A`, `--live-wash #FBF2E2`.
- **Palette (dark):** `--paper #0F1411`, `--sheet #161C18`, `--ink #E6EBE6`, `--ink-2 #A8B3AC`, `--ink-3 #78837C`, `--rule #2A332D`, `--rule-soft #212823`, `--accent #6FBF97`, `--accent-2 #4FA37B`, `--live #E0A44A`, `--live-wash #2A2115`.
- **Theming:** every token declared in bare `:root`; `@media (prefers-color-scheme: dark)` guarded as `:root:not([data-theme="light"])`; `:root[data-theme="dark"]` overrides again. No color defined only inside a media or attribute block. `body` sets an explicit token background.
- **Prohibited copy/visual patterns:** tracked-out ALL-CAPS eyebrow labels; meta strings joined with middle dots (`A · B · C`); `→` appended to link or button text; accenting a single word inside a headline; uniform rounded cards with one shared shadow; fade-and-slide-up entrances on every section.
- **Motion:** exactly two moving things — the one-time boot sequence (<1.5s) and the ambient event-loop tick. `prefers-reduced-motion: reduce` resolves the boot instantly and stops the tick. Nothing meaningful may be parked at `opacity: 0` awaiting an observer.
- **Accessibility:** correct heading outline, visible keyboard focus everywhere, stack→heap pointers reachable by keyboard (not hover-only), color never the sole carrier of meaning, WCAG AA contrast in both themes.
- **Employment facts (authoritative — LinkedIn, not the current CV):**
  | id | Company | Commitment | Nature | Mode | Role(s) | Period | Location |
  |---|---|---|---|---|---|---|---|
  | `penta` | Penta Global Limited | full-time | permanent | onsite | Frontend Web Developer (2021-09→2024-02), Full Stack Engineer (2024-02→now) | 2021-09 – present | Gulshan, Dhaka, Bangladesh |
  | `cogniable` | CogniAble | full-time | permanent | remote | React Developer | 2021-04 – 2021-10 | Gurugram, Haryana, India |
  | `hwsaver` | HW Saver LLP | part-time | internship | remote | Frontend Web Developer | 2021-01 – 2021-10 | Uttar Pradesh, India |
  | `virtuera` | Virtuera | part-time | internship | remote | Frontend Web Developer | 2020-12 – 2021-04 | Mumbai, Maharashtra, India |
- **Derived facts that tests must assert:** 5 concurrent pairs; peak concurrency 3, reached in `2021-04` and `2021-09`–`2021-10`; experience headline `5+ years`.

---

## File Structure

| File | Responsibility |
|---|---|
| `package.json`, `tsconfig.json`, `tsconfig.node.json` | Toolchain and TS config |
| `vite.config.ts` | Single-file build, asset inlining, Vitest config |
| `vitest.setup.ts` | jest-dom matchers, `matchMedia` stub |
| `index.html` | Document shell, font links, meta |
| `src/main.tsx` | React root mount |
| `src/App.tsx` | Section composition and document order only |
| `src/data/cv.ts` | **All** content. Single source of truth. No content elsewhere. |
| `src/lib/timeline.ts` | Pure date math: overlaps, peak concurrency, duration. No React. |
| `src/hooks/useTheme.ts` | Three-state theme resolution and toggle |
| `src/hooks/useReducedMotion.ts` | `prefers-reduced-motion` subscription |
| `src/hooks/useBootSequence.ts` | Boot phase state machine |
| `src/components/Identity.tsx` | Hero: global execution context, portrait, contacts, CV download |
| `src/components/StackFrame.tsx` | One employment frame; tonal recession by depth |
| `src/components/CallStack.tsx` | Ordered list of frames, newest first |
| `src/components/ParallelRegion.tsx` | 2020–21 lanes on a shared time axis |
| `src/components/Heap.tsx`, `HeapObject.tsx` | Projects as allocated objects |
| `src/components/PointerLayer.tsx` | SVG stack→heap edges; only component reading DOM geometry |
| `src/components/ScopeChain.tsx` | Skills tiers |
| `src/components/ModuleResolution.tsx` | Education + certifications |
| `src/components/References.tsx` | Referees |
| `src/components/InstrumentRail.tsx` | Runtime readout rail |
| `src/components/EventLoop.tsx` | Ambient tick |
| `src/styles/tokens.css`, `base.css` | Palette tokens; element defaults |
| `src/assets/portrait.webp` | Portrait, inlined at build |
| `public/cv.pdf` | Corrected CV, served at `/cv.pdf` |
| `.github/workflows/deploy.yml` | Build and deploy to Pages |

---

### Task 1: Project scaffold and test harness

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `vitest.setup.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `App` (default export from `src/App.tsx`); working `npm test`, `npm run build`, `npm run typecheck`.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "portfolio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc -b --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^26.0.0",
    "typescript": "^5.7.2",
    "vite": "^7.0.0",
    "vite-plugin-singlefile": "^2.1.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json` and `tsconfig.node.json`**

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noEmit": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "vitest.setup.ts"]
}
```

`tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["vite.config.ts"]
}
```

Note: `tsc -b` in the build script uses `tsconfig.json` only; `tsconfig.node.json` exists so editors type `vite.config.ts` correctly and is not referenced by the build.

- [ ] **Step 3: Create `vite.config.ts`**

`assetsInlineLimit` is raised to 100 000 bytes so the 6 928-byte portrait is emitted as a data URI rather than a separate file (spec §7).

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    assetsInlineLimit: 100_000,
    cssCodeSplit: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: false,
  },
});
```

- [ ] **Step 4: Create `vitest.setup.ts`**

jsdom does not implement `matchMedia`, and three hooks depend on it. The stub defaults every query to non-matching; individual tests override it.

```ts
import '@testing-library/jest-dom/vitest';
import { vi, beforeEach } from 'vitest';

export function setMedia(matches: Record<string, boolean>) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: matches[query] ?? false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

beforeEach(() => setMedia({}));
```

- [ ] **Step 5: Create `index.html`**

Two typefaces only, one stylesheet request, preconnected.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mohammad Arif Hossain</title>
    <meta name="description" content="Full Stack Engineer in Dhaka, Bangladesh. Five years building government-scale platforms in React, Spring Boot and FastAPI." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Public+Sans:wght@400;500;600&display=swap"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Write the failing test**

`src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the subject name as the page heading', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: /Mohammad Arif Hossain/i }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 7: Install dependencies and run the test to verify it fails**

Run: `npm install && npx vitest run src/App.test.tsx`
Expected: FAIL — `Failed to resolve import "./App"`.

- [ ] **Step 8: Write the minimal implementation**

`src/App.tsx`:

```tsx
export default function App() {
  return <h1>Mohammad Arif Hossain</h1>;
}
```

`src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 9: Run the test to verify it passes**

Run: `npx vitest run src/App.test.tsx`
Expected: PASS, 1 test.

- [ ] **Step 10: Verify the single-file build works**

Run: `npm run build && ls dist/`
Expected: `dist/` contains `index.html` and nothing else (no `assets/` directory). Confirm with:

Run: `test ! -d dist/assets && echo "single file confirmed"`
Expected: `single file confirmed`

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json tsconfig.json tsconfig.node.json vite.config.ts vitest.setup.ts index.html src/main.tsx src/App.tsx src/App.test.tsx
git commit -m "chore: scaffold Vite + React + TS with single-file build and Vitest"
```

---

### Task 2: Content data module

**Files:**
- Create: `src/data/cv.ts`
- Test: `src/data/cv.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: types `Role`, `Employment`, `Project`, `Tier`, `SkillTier`, `Credential`, `Education`, `Reference`; constants `IDENTITY`, `EMPLOYMENT`, `PROJECTS`, `SKILLS`, `EDUCATION`, `CREDENTIALS`, `REFERENCES`, `CV_URL`, `NOW`.

`NOW` is the month the derived values are computed against — `'2026-09'`. Exported so tests are deterministic.

- [ ] **Step 1: Write the failing test**

`src/data/cv.test.ts`:

```ts
import { EMPLOYMENT, PROJECTS, SKILLS, REFERENCES, IDENTITY } from './cv';

describe('employment data', () => {
  it('is ordered newest first by start date', () => {
    const starts = EMPLOYMENT.map((e) => e.start);
    expect([...starts].sort().reverse()).toEqual(starts);
  });

  it('gives every employment a non-empty roles list', () => {
    for (const e of EMPLOYMENT) {
      expect(e.roles.length).toBeGreaterThan(0);
    }
  });

  it('has roles that tile the employment span with no gap or overlap', () => {
    for (const e of EMPLOYMENT) {
      expect(e.roles[0].start).toBe(e.start);
      expect(e.roles[e.roles.length - 1].end).toBe(e.end);
      for (let i = 1; i < e.roles.length; i++) {
        expect(e.roles[i].start).toBe(e.roles[i - 1].end);
      }
    }
  });

  it('records Penta as a promotion from frontend to full stack in Feb 2024', () => {
    const penta = EMPLOYMENT.find((e) => e.id === 'penta')!;
    expect(penta.roles).toEqual([
      { title: 'Frontend Web Developer', start: '2021-09', end: '2024-02' },
      { title: 'Full Stack Engineer', start: '2024-02', end: null },
    ]);
  });

  it('marks the two internships as part-time and the two others as full-time', () => {
    const byId = Object.fromEntries(EMPLOYMENT.map((e) => [e.id, e]));
    expect(byId.virtuera.commitment).toBe('part-time');
    expect(byId.hwsaver.commitment).toBe('part-time');
    expect(byId.cogniable.commitment).toBe('full-time');
    expect(byId.penta.commitment).toBe('full-time');
  });

  it('includes Virtuera, which the CV omits', () => {
    expect(EMPLOYMENT.map((e) => e.id)).toContain('virtuera');
  });
});

describe('project data', () => {
  it('never dangles: every employmentId resolves to a real employment', () => {
    const ids = new Set(EMPLOYMENT.map((e) => e.id));
    for (const p of PROJECTS) {
      if (p.employmentId !== null) expect(ids).toContain(p.employmentId);
    }
  });

  it('gives every project at least one stack entry and one feature', () => {
    for (const p of PROJECTS) {
      expect(p.stack.length).toBeGreaterThan(0);
      expect(p.features.length).toBeGreaterThan(0);
    }
  });
});

describe('skills and references', () => {
  it('has exactly the three tiers in resolution order', () => {
    expect(SKILLS.map((s) => s.tier)).toEqual([
      'proficient',
      'comfortable',
      'familiar',
    ]);
  });

  it('gives each referee a distinct email address', () => {
    const emails = REFERENCES.map((r) => r.email);
    expect(new Set(emails).size).toBe(emails.length);
  });
});

describe('identity', () => {
  it('does not advertise the dead Firebase portfolio URL', () => {
    expect(JSON.stringify(IDENTITY)).not.toContain('web.app');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/data/cv.test.ts`
Expected: FAIL — `Failed to resolve import "./cv"`.

- [ ] **Step 3: Write `src/data/cv.ts`**

```ts
export const NOW = '2026-09';
export const CV_URL = '/cv.pdf';

export interface Role {
  title: string;
  start: string;
  end: string | null;
}

export interface Employment {
  id: string;
  company: string;
  location: string;
  commitment: 'full-time' | 'part-time';
  nature: 'internship' | 'permanent';
  mode: 'onsite' | 'remote';
  roles: Role[];
  start: string;
  end: string | null;
  points: string[];
}

export interface Project {
  id: string;
  name: string;
  employmentId: string | null;
  kind: string;
  stack: string[];
  period: string;
  features: string[];
}

export type Tier = 'proficient' | 'comfortable' | 'familiar';

export interface SkillTier {
  tier: Tier;
  label: string;
  scope: string;
  items: string[];
}

export interface Education {
  qualification: string;
  institute: string;
  detail: string[];
}

export interface Credential {
  title: string;
  institute: string;
  detail: string[];
}

export interface Reference {
  name: string;
  position: string;
  company: string;
  email: string;
  linkedin: string;
}

export const IDENTITY = {
  name: 'Mohammad Arif Hossain',
  title: 'Full Stack Engineer',
  location: 'Dhaka, Bangladesh',
  email: 'mohammadarifhossain80@gmail.com',
  phone: '+8801682221674',
  github: 'https://github.com/a1barif2h',
  linkedin: 'https://www.linkedin.com/in/arifhossain80/',
  summary:
    'Full Stack Engineer building and running government-scale web platforms end to end — React and Next.js front ends, Java Spring Boot, Node.js and Python FastAPI services, on Docker.',
} as const;

export const EMPLOYMENT: Employment[] = [
  {
    id: 'penta',
    company: 'Penta Global Limited',
    location: 'Gulshan, Dhaka, Bangladesh',
    commitment: 'full-time',
    nature: 'permanent',
    mode: 'onsite',
    start: '2021-09',
    end: null,
    roles: [
      { title: 'Frontend Web Developer', start: '2021-09', end: '2024-02' },
      { title: 'Full Stack Engineer', start: '2024-02', end: null },
    ],
    points: [
      'Lead front-end developer for the BEZA One Stop Service portal — a 70k+ line React application covering investor registration, application submission, desk approvals and certificate issuance; over 1,000 commits, the largest single contribution in the repository.',
      'Built and maintained the certificate service (Node.js, Puppeteer, pdf-lib, QR and barcode generation) that issues legally binding certificates — trade licences, occupancy certificates, land use permissions — with config-driven, multi-tenant organisation branding.',
      'Worked across the Java Spring Boot core service, the Camunda BPMN process-flow service, and the Spring Boot integration gateway connecting BEZA to the Bangladesh and National Single Window systems.',
      'Designed and shipped a transactional integration outbox with an Apache Airflow drain DAG, giving safe, idempotency-aware, retry-capped delivery to a non-idempotent external government system.',
      'Delivered the Bangladesh Election Commission online nomination system: the React and TypeScript candidate portal, the returning officer portal, and the Node.js reporting service that generates official result, funding and Barta reports as paginated PDFs.',
      'Designed and built ContentOps almost single-handedly — a FastAPI and Next.js 15 content operations platform with Celery and Redis background pipelines, LLM-driven content generation, scheduled multi-channel publishing, and a 171-file test suite.',
      'Secured applications with Keycloak and OIDC, including a customised Keycloakify login theme, and shipped to staging and production via Docker and Jenkins.',
      'Mentored junior developers joining the team — onboarding them into a 15-repo microservice codebase, pairing through debugging and architecture walkthroughs, and teaching unfamiliar parts of the stack until they could take tickets on their own.',
      'Reviewed and merged 256 pull requests across the Penta repositories, and set the front-end patterns and conventions the team builds against.',
    ],
  },
  {
    id: 'cogniable',
    company: 'CogniAble',
    location: 'Gurugram, Haryana, India',
    commitment: 'full-time',
    nature: 'permanent',
    mode: 'remote',
    start: '2021-04',
    end: '2021-10',
    roles: [{ title: 'React Developer', start: '2021-04', end: '2021-10' }],
    points: [
      'Built and maintained web applications in React.',
      'Built mobile applications with React Native.',
      'Consumed a GraphQL API as the primary data layer.',
    ],
  },
  {
    id: 'hwsaver',
    company: 'HW Saver LLP',
    location: 'Uttar Pradesh, India',
    commitment: 'part-time',
    nature: 'internship',
    mode: 'remote',
    start: '2021-01',
    end: '2021-10',
    roles: [{ title: 'Frontend Web Developer', start: '2021-01', end: '2021-10' }],
    points: ['Built and maintained web applications in React under tight delivery deadlines.'],
  },
  {
    id: 'virtuera',
    company: 'Virtuera',
    location: 'Mumbai, Maharashtra, India',
    commitment: 'part-time',
    nature: 'internship',
    mode: 'remote',
    start: '2020-12',
    end: '2021-04',
    roles: [{ title: 'Frontend Web Developer', start: '2020-12', end: '2021-04' }],
    points: [],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'beza',
    name: 'BEZA One Stop Service',
    employmentId: 'penta',
    kind: 'Government platform',
    period: '2021 – present',
    stack: [
      'React', 'Redux', 'Java', 'Spring Boot', 'Node.js', 'PostgreSQL',
      'Camunda BPMN', 'Keycloak', 'Apache Airflow', 'Docker',
    ],
    features: [
      'Single national window for investors to register, apply for and renew economic-zone services online.',
      '15-service microservice architecture: core, process flow (BPMN desk approvals), certificate, PDF, file, email, integration gateway and config server.',
      'Automated certificate issuance with QR and barcode verification and per-organisation branding.',
      'Two-way integration with the Bangladesh and National Single Window systems through a transactional outbox and Airflow-scheduled delivery.',
    ],
  },
  {
    id: 'ec',
    name: 'Bangladesh Election Commission — Online Nomination',
    employmentId: 'penta',
    kind: 'Government platform',
    period: '2023 – 2026',
    stack: [
      'React 18', 'TypeScript', 'Vite', 'Redux Toolkit', 'Keycloak',
      'Node.js', 'Express.js', 'Puppeteer', 'PDFKit', 'Cypress', 'Docker',
    ],
    features: [
      'Secure online submission of candidate nomination papers, replacing a paper-based process.',
      'Returning officer portal for scrutiny and decision workflows.',
      'Reporting service generating official national and constituency-level result, funding and Barta reports as paginated PDFs.',
    ],
  },
  {
    id: 'contentops',
    name: 'ContentOps',
    employmentId: 'penta',
    kind: 'AI content platform',
    period: '2026 — primary author',
    stack: [
      'FastAPI', 'Python 3.13', 'SQLAlchemy 2.0', 'PostgreSQL 17', 'Celery',
      'Redis', 'Next.js 15', 'React 19', 'TypeScript', 'TanStack Query',
      'Zustand', 'TailwindCSS 4', 'shadcn/ui', 'Docker',
    ],
    features: [
      'End-to-end content operations: brand ideation, draft generation, asset and image pipelines, scheduling and multi-channel publishing.',
      'LLM-backed generation and brand crawling on Celery with separate queues, so image fan-out cannot starve the control plane.',
      'Modular monolith with a three-layer router, service and repository architecture, and clean-architecture modules for complex domains.',
      'Fully typed frontend and backend contract via generated OpenAPI types, with a 170-file async test suite.',
    ],
  },
  {
    id: 'badlao',
    name: 'Badlao',
    employmentId: null,
    kind: 'Client project — fintech, SME lending',
    period: '2025 – 2026',
    stack: [
      'Next.js 15', 'React', 'TypeScript', 'TailwindCSS', 'shadcn/ui',
      'React Hook Form', 'Zod', 'Recharts', 'Strapi', 'PostgreSQL', 'Docker',
    ],
    features: [
      'Loan application, business valuation and instalment-tracking workflows for SME borrowers.',
      'Reusable dynamic form-table component driving complex multi-section financial forms.',
      'Internationalised App Router frontend with a dashboard and downloadable reports.',
    ],
  },
];

export const SKILLS: SkillTier[] = [
  {
    tier: 'proficient',
    label: 'Proficient',
    scope: 'local scope',
    items: [
      'React', 'Next.js', 'TypeScript', 'JavaScript', 'Redux Toolkit',
      'TanStack Query', 'Zustand', 'React Hook Form', 'TailwindCSS',
      'shadcn/ui', 'Bootstrap', 'Ant Design', 'SASS', 'Node.js',
      'Express.js', 'REST API design',
    ],
  },
  {
    tier: 'comfortable',
    label: 'Comfortable',
    scope: 'closure scope',
    items: [
      'Python', 'FastAPI', 'Celery', 'NestJS', 'Java', 'Spring Boot',
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLAlchemy', 'Alembic',
      'Flyway', 'Sequelize', 'Mongoose', 'Docker', 'Docker Compose',
      'Keycloak / OIDC', 'Camunda BPMN', 'Apache Airflow', 'Pytest', 'Jest',
      'React Testing Library',
    ],
  },
  {
    tier: 'familiar',
    label: 'Familiar',
    scope: 'global scope',
    items: [
      'Flutter', 'Dart', 'React Native', 'Kubernetes', 'Helm', 'Jenkins',
      'Cypress', 'Spring Cloud Config', 'Nginx',
    ],
  },
];

export const EDUCATION: Education[] = [
  {
    qualification: 'Diploma in Computer Science and Application',
    institute: 'Bangladesh Open University',
    detail: ['Session 2021–2023', 'Result 3.76 of 4.00'],
  },
  {
    qualification: 'Higher Secondary Certificate',
    institute: 'Hazi Misir Ali University',
    detail: ['Dhaka board, 2012', 'Result 4.00 of 5.00'],
  },
];

export const CREDENTIALS: Credential[] = [
  {
    title: 'Certified Web Developer',
    institute: 'Programming Hero',
    detail: ['10 months', 'Top 5 percent, Black Belt', 'Advanced JavaScript, React, Node.js, Next.js, Redux, React Native'],
  },
  {
    title: 'CSE Fundamentals',
    institute: 'Phitron',
    detail: ['1.5 years, completed', 'C, C++, Python', 'Data structures, algorithms, OOP', 'Databases, deployment, cloud'],
  },
];

export const REFERENCES: Reference[] = [
  {
    name: 'MD. Nazmul Huda',
    position: 'Tech Lead',
    company: 'Penta Global Ltd.',
    email: 'nazmulfarhan@gmail.com',
    linkedin: 'https://www.linkedin.com/in/md-nazmul-huda-prince/',
  },
  {
    name: 'A.K.M Ariful Islam Shimul',
    position: 'Senior Java Developer',
    company: 'Penta Global Ltd.',
    email: 'arif18bari@gmail.com',
    linkedin: 'https://www.linkedin.com/in/arif18bari/',
  },
];
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/data/cv.test.ts`
Expected: PASS, 11 tests.

- [ ] **Step 5: Commit**

```bash
git add src/data/cv.ts src/data/cv.test.ts
git commit -m "feat: add CV content module with corrected employment history

Adds Virtuera, corrects the HW Saver and CogniAble end dates and the
CogniAble title, records the Feb 2024 promotion at Penta, and marks the
two internships part-time. Tests assert the roles tile each employment
span exactly and that no project references a missing employer."
```

---

### Task 3: Derived timeline

Nothing about overlaps or durations is stored. All of it is computed, so a date correction changes the claims automatically instead of leaving them stale.

**Files:**
- Create: `src/lib/timeline.ts`
- Test: `src/lib/timeline.test.ts`

**Interfaces:**
- Consumes: `Employment`, `EMPLOYMENT`, `NOW` from `src/data/cv.ts`.
- Produces: `Span`, `toMonths`, `fromMonths`, `overlaps`, `concurrentPairs`, `peakConcurrency`, `PeakResult`, `yearsSince`, `experienceHeadline`, `spansOf`, `axisBounds`.

- [ ] **Step 1: Write the failing test**

`src/lib/timeline.test.ts`:

```ts
import { EMPLOYMENT, NOW } from '../data/cv';
import {
  toMonths, fromMonths, overlaps, concurrentPairs,
  peakConcurrency, yearsSince, experienceHeadline, spansOf, axisBounds,
} from './timeline';

const spans = spansOf(EMPLOYMENT);

describe('month arithmetic', () => {
  it('round-trips a month string', () => {
    expect(fromMonths(toMonths('2021-04'))).toBe('2021-04');
  });

  it('orders months correctly across a year boundary', () => {
    expect(toMonths('2021-01')).toBeGreaterThan(toMonths('2020-12'));
  });
});

describe('overlaps', () => {
  it('counts a single shared month as an overlap', () => {
    expect(
      overlaps(
        { id: 'a', start: '2020-12', end: '2021-04' },
        { id: 'b', start: '2021-04', end: '2021-10' },
        NOW,
      ),
    ).toBe(true);
  });

  it('rejects spans that merely touch end-to-start with a gap', () => {
    expect(
      overlaps(
        { id: 'a', start: '2020-12', end: '2021-03' },
        { id: 'b', start: '2021-04', end: '2021-10' },
        NOW,
      ),
    ).toBe(false);
  });

  it('treats a null end as running to NOW', () => {
    expect(
      overlaps(
        { id: 'a', start: '2021-09', end: null },
        { id: 'b', start: '2026-01', end: '2026-02' },
        NOW,
      ),
    ).toBe(true);
  });
});

describe('concurrentPairs', () => {
  it('finds exactly five overlapping pairs in the real history', () => {
    const pairs = concurrentPairs(spans, NOW).map(([a, b]) => [a, b].sort().join('+')).sort();
    expect(pairs).toEqual([
      'cogniable+hwsaver',
      'cogniable+penta',
      'cogniable+virtuera',
      'hwsaver+penta',
      'hwsaver+virtuera',
    ]);
  });
});

describe('peakConcurrency', () => {
  it('peaks at three, reached in Apr 2021 and again Sep-Oct 2021', () => {
    const peak = peakConcurrency(spans, NOW);
    expect(peak.count).toBe(3);
    expect(peak.windows).toEqual([
      { from: '2021-04', to: '2021-04' },
      { from: '2021-09', to: '2021-10' },
    ]);
  });
});

describe('experience duration', () => {
  it('measures from the earliest start', () => {
    const years = yearsSince('2020-12', new Date('2026-09-06T00:00:00Z'));
    expect(years).toBeGreaterThan(5.7);
    expect(years).toBeLessThan(5.9);
  });

  it('reads as 5+ years today', () => {
    expect(experienceHeadline(spans, new Date('2026-09-06T00:00:00Z'))).toBe('5+ years');
  });

  it('still reads 5+ when counted from the first full-time role', () => {
    const fullTime = spansOf(EMPLOYMENT.filter((e) => e.commitment === 'full-time'));
    expect(experienceHeadline(fullTime, new Date('2026-09-06T00:00:00Z'))).toBe('5+ years');
  });
});

describe('axisBounds', () => {
  it('spans the earliest start to NOW', () => {
    expect(axisBounds(spans, NOW)).toEqual({ from: '2020-12', to: NOW });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/timeline.test.ts`
Expected: FAIL — `Failed to resolve import "./timeline"`.

- [ ] **Step 3: Write `src/lib/timeline.ts`**

```ts
import type { Employment } from '../data/cv';

export interface Span {
  id: string;
  start: string;
  end: string | null;
}

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

export function toMonths(ym: string): number {
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
}

export function fromMonths(n: number): string {
  const y = Math.floor(n / 12);
  const m = (n % 12) + 1;
  return `${y}-${String(m).padStart(2, '0')}`;
}

export function spansOf(employment: Employment[]): Span[] {
  return employment.map(({ id, start, end }) => ({ id, start, end }));
}

function endMonth(s: Span, now: string): number {
  return toMonths(s.end ?? now);
}

export function overlaps(a: Span, b: Span, now: string): boolean {
  return (
    toMonths(a.start) <= endMonth(b, now) && toMonths(b.start) <= endMonth(a, now)
  );
}

export function concurrentPairs(spans: Span[], now: string): Array<[string, string]> {
  const pairs: Array<[string, string]> = [];
  for (let i = 0; i < spans.length; i++) {
    for (let j = i + 1; j < spans.length; j++) {
      if (overlaps(spans[i], spans[j], now)) pairs.push([spans[i].id, spans[j].id]);
    }
  }
  return pairs;
}

export interface PeakResult {
  count: number;
  windows: Array<{ from: string; to: string }>;
}

export function peakConcurrency(spans: Span[], now: string): PeakResult {
  const { from, to } = axisBounds(spans, now);
  const lo = toMonths(from);
  const hi = toMonths(to);

  const active: number[] = [];
  for (let m = lo; m <= hi; m++) {
    active.push(
      spans.filter((s) => toMonths(s.start) <= m && m <= endMonth(s, now)).length,
    );
  }

  const count = Math.max(...active);
  const windows: Array<{ from: string; to: string }> = [];
  let open: number | null = null;

  for (let i = 0; i < active.length; i++) {
    const isPeak = active[i] === count;
    if (isPeak && open === null) open = i;
    if (!isPeak && open !== null) {
      windows.push({ from: fromMonths(lo + open), to: fromMonths(lo + i - 1) });
      open = null;
    }
  }
  if (open !== null) {
    windows.push({ from: fromMonths(lo + open), to: fromMonths(hi) });
  }

  return { count, windows };
}

export function axisBounds(spans: Span[], now: string): { from: string; to: string } {
  const starts = spans.map((s) => toMonths(s.start));
  const ends = spans.map((s) => endMonth(s, now));
  return { from: fromMonths(Math.min(...starts)), to: fromMonths(Math.max(...ends)) };
}

export function yearsSince(startYm: string, now: Date): number {
  const [y, m] = startYm.split('-').map(Number);
  const start = Date.UTC(y, m - 1, 1);
  return (now.getTime() - start) / MS_PER_YEAR;
}

export function experienceHeadline(spans: Span[], now: Date): string {
  const earliest = spans.reduce(
    (min, s) => (toMonths(s.start) < toMonths(min) ? s.start : min),
    spans[0].start,
  );
  return `${Math.floor(yearsSince(earliest, now))}+ years`;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/timeline.test.ts`
Expected: PASS, 10 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/timeline.ts src/lib/timeline.test.ts
git commit -m "feat: derive overlaps and experience duration from dates

Overlaps, peak concurrency and the years figure are computed rather than
stored, so correcting a date changes every claim that depends on it. Tests
pin the real history: five overlapping pairs and a peak of three reached
in Apr 2021 and again Sep-Oct 2021."
```

---

### Task 4: Design tokens and theming

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`, `src/hooks/useTheme.ts`
- Modify: `src/main.tsx` (import the stylesheets)
- Test: `src/hooks/useTheme.test.tsx`

**Interfaces:**
- Consumes: `setMedia` from `vitest.setup.ts`.
- Produces: `useTheme(): { theme: 'light' | 'dark'; explicit: boolean; toggle: () => void }`. Toggling stamps `data-theme` on `document.documentElement`.

- [ ] **Step 1: Write the failing test**

`src/hooks/useTheme.test.tsx`:

```tsx
import { renderHook, act } from '@testing-library/react';
import { setMedia } from '../../vitest.setup';
import { useTheme } from './useTheme';

const DARK = '(prefers-color-scheme: dark)';

beforeEach(() => {
  document.documentElement.removeAttribute('data-theme');
});

describe('useTheme', () => {
  it('follows the system preference when nothing is stamped', () => {
    setMedia({ [DARK]: true });
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(result.current.explicit).toBe(false);
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('reports light when the system prefers light', () => {
    setMedia({ [DARK]: false });
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  it('stamps the opposite theme on toggle, overriding the system', () => {
    setMedia({ [DARK]: true });
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggle());
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(result.current.theme).toBe('light');
    expect(result.current.explicit).toBe(true);
  });

  it('toggles back to dark from an explicit light', () => {
    setMedia({ [DARK]: false });
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggle());
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/hooks/useTheme.test.tsx`
Expected: FAIL — `Failed to resolve import "./useTheme"`.

- [ ] **Step 3: Write `src/hooks/useTheme.ts`**

```ts
import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const QUERY = '(prefers-color-scheme: dark)';

function systemTheme(): Theme {
  return window.matchMedia(QUERY).matches ? 'dark' : 'light';
}

export function useTheme() {
  const [explicit, setExplicit] = useState<Theme | null>(null);
  const [system, setSystem] = useState<Theme>(() => systemTheme());

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setSystem(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const theme: Theme = explicit ?? system;

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setExplicit(next);
    document.documentElement.setAttribute('data-theme', next);
  }, [theme]);

  return { theme, explicit: explicit !== null, toggle };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/hooks/useTheme.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 5: Write `src/styles/tokens.css`**

Every token is declared in the bare `:root`; the two override blocks redefine only values.

```css
:root {
  --paper: #F6F7F4;
  --sheet: #FFFFFF;
  --ink: #16201C;
  --ink-2: #4A554F;
  --ink-3: #77827B;
  --rule: #D7DDD6;
  --rule-soft: #E7EBE5;
  --accent: #1E5B45;
  --accent-2: #2F7A5E;
  --live: #B4741A;
  --live-wash: #FBF2E2;

  --f-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --f-body: "Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;

  --rail: 190px;
  --measure: 65ch;
  --step: 0.35rem;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --paper: #0F1411;
    --sheet: #161C18;
    --ink: #E6EBE6;
    --ink-2: #A8B3AC;
    --ink-3: #78837C;
    --rule: #2A332D;
    --rule-soft: #212823;
    --accent: #6FBF97;
    --accent-2: #4FA37B;
    --live: #E0A44A;
    --live-wash: #2A2115;
  }
}

:root[data-theme="dark"] {
  --paper: #0F1411;
  --sheet: #161C18;
  --ink: #E6EBE6;
  --ink-2: #A8B3AC;
  --ink-3: #78837C;
  --rule: #2A332D;
  --rule-soft: #212823;
  --accent: #6FBF97;
  --accent-2: #4FA37B;
  --live: #E0A44A;
  --live-wash: #2A2115;
}
```

- [ ] **Step 6: Write `src/styles/base.css`**

```css
*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--f-body);
  font-size: 16px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: var(--f-mono);
  font-weight: 500;
  text-wrap: balance;
  margin: 0;
}

a { color: var(--accent); text-underline-offset: 0.18em; }
a:hover { color: var(--accent-2); }

:focus-visible {
  outline: 2px solid var(--live);
  outline-offset: 3px;
  border-radius: 2px;
}

.mono { font-family: var(--f-mono); font-variant-numeric: tabular-nums; }

.scroll-x { overflow-x: auto; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 7: Import the stylesheets in `src/main.tsx`**

Add above the `App` import:

```tsx
import './styles/tokens.css';
import './styles/base.css';
```

- [ ] **Step 8: Verify typecheck and full test suite pass**

Run: `npm run typecheck && npm test`
Expected: typecheck clean; all tests PASS.

- [ ] **Step 9: Commit**

```bash
git add src/styles src/hooks/useTheme.ts src/hooks/useTheme.test.tsx src/main.tsx
git commit -m "feat: add design tokens and three-state theming

Every token is declared in the bare :root so no color exists only behind a
media query or attribute selector. Dark is applied both by system
preference (guarded against an explicit light choice) and by the toggle."
```

---

### Task 5: Motion hooks

**Files:**
- Create: `src/hooks/useReducedMotion.ts`, `src/hooks/useBootSequence.ts`
- Test: `src/hooks/useBootSequence.test.tsx`

**Interfaces:**
- Consumes: nothing beyond React.
- Produces: `useReducedMotion(): boolean`; `useBootSequence(): BootPhase` where `type BootPhase = 'creating' | 'pushed' | 'settled'`.

The contract that matters: under reduced motion the hook returns `'settled'` on the very first render, never `'creating'`. No content may be hidden in any phase — phases drive emphasis only.

- [ ] **Step 1: Write the failing test**

`src/hooks/useBootSequence.test.tsx`:

```tsx
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { setMedia } from '../../vitest.setup';
import { useBootSequence } from './useBootSequence';

const REDUCE = '(prefers-reduced-motion: reduce)';

describe('useBootSequence', () => {
  it('starts settled when reduced motion is requested', () => {
    setMedia({ [REDUCE]: true });
    const { result } = renderHook(() => useBootSequence());
    expect(result.current).toBe('settled');
  });

  it('runs creating then pushed then settled otherwise', () => {
    vi.useFakeTimers();
    setMedia({ [REDUCE]: false });
    const { result } = renderHook(() => useBootSequence());

    expect(result.current).toBe('creating');
    act(() => { vi.advanceTimersByTime(600); });
    expect(result.current).toBe('pushed');
    act(() => { vi.advanceTimersByTime(800); });
    expect(result.current).toBe('settled');

    vi.useRealTimers();
  });

  it('settles within the 1.5s budget', () => {
    vi.useFakeTimers();
    setMedia({ [REDUCE]: false });
    const { result } = renderHook(() => useBootSequence());
    act(() => { vi.advanceTimersByTime(1500); });
    expect(result.current).toBe('settled');
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/hooks/useBootSequence.test.tsx`
Expected: FAIL — `Failed to resolve import "./useBootSequence"`.

- [ ] **Step 3: Write `src/hooks/useReducedMotion.ts`**

```ts
import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
```

- [ ] **Step 4: Write `src/hooks/useBootSequence.ts`**

```ts
import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export type BootPhase = 'creating' | 'pushed' | 'settled';

const PUSH_AT = 600;
const SETTLE_AT = 1400;

export function useBootSequence(): BootPhase {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<BootPhase>(() =>
    reduced ? 'settled' : 'creating',
  );

  useEffect(() => {
    if (reduced) {
      setPhase('settled');
      return;
    }
    const a = window.setTimeout(() => setPhase('pushed'), PUSH_AT);
    const b = window.setTimeout(() => setPhase('settled'), SETTLE_AT);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [reduced]);

  return phase;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/hooks/useBootSequence.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useReducedMotion.ts src/hooks/useBootSequence.ts src/hooks/useBootSequence.test.tsx
git commit -m "feat: add boot sequence and reduced-motion hooks

The boot phase machine returns 'settled' on first render under reduced
motion rather than animating and then snapping."
```

---

### Task 6: Portrait pipeline and the identity section

**Files:**
- Create: `src/assets/portrait.webp`, `src/components/Identity.tsx`
- Test: `src/components/Identity.test.tsx`

**Interfaces:**
- Consumes: `IDENTITY`, `CV_URL`, `EMPLOYMENT`, `NOW` from `src/data/cv.ts`; `spansOf`, `experienceHeadline` from `src/lib/timeline.ts`; `useBootSequence` from `src/hooks/useBootSequence.ts`.
- Produces: `<Identity />`.

- [ ] **Step 1: Generate the portrait asset**

The source is 210×270. It is not upscaled. Quality 88 was chosen by measurement: 6 928 bytes, small enough to inline.

```bash
mkdir -p src/assets
python3 - <<'PY'
from PIL import Image
im = Image.open('/home/arif/Documents/resume/Arif =Lif (1).jpg')
assert im.size == (210, 270), im.size
im.save('src/assets/portrait.webp', 'WEBP', quality=88, method=6)
PY
ls -l src/assets/portrait.webp
```

Expected: file present, roughly 6.9 KB.

- [ ] **Step 2: Add the asset type declaration**

Create `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 3: Write the failing test**

`src/components/Identity.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import Identity from './Identity';

describe('Identity', () => {
  it('renders the name as the single h1', () => {
    render(<Identity />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Mohammad Arif Hossain',
    );
  });

  it('states the derived experience headline, not a hard-coded one', () => {
    render(<Identity />);
    expect(screen.getByText(/5\+ years/)).toBeInTheDocument();
  });

  it('renders the portrait at its native size with alt text', () => {
    render(<Identity />);
    const img = screen.getByAltText(/Mohammad Arif Hossain/i) as HTMLImageElement;
    expect(img).toHaveAttribute('width', '210');
    expect(img).toHaveAttribute('height', '270');
  });

  it('offers the CV download', () => {
    render(<Identity />);
    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute(
      'href',
      '/cv.pdf',
    );
  });

  it('links GitHub, LinkedIn and email', () => {
    render(<Identity />);
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/a1barif2h',
    );
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/arifhossain80/',
    );
    expect(screen.getByRole('link', { name: /mohammadarifhossain80/i })).toHaveAttribute(
      'href',
      'mailto:mohammadarifhossain80@gmail.com',
    );
  });

  it('shows all content immediately, without waiting on the boot animation', () => {
    render(<Identity />);
    const shell = screen.getByTestId('global-context');
    expect(shell).toBeVisible();
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npx vitest run src/components/Identity.test.tsx`
Expected: FAIL — `Failed to resolve import "./Identity"`.

- [ ] **Step 5: Write `src/components/Identity.tsx`**

Note the copy rules: no ALL-CAPS eyebrow, no middle-dot meta string, no `→` on the download link.

```tsx
import portrait from '../assets/portrait.webp';
import { IDENTITY, CV_URL, EMPLOYMENT } from '../data/cv';
import { spansOf, experienceHeadline } from '../lib/timeline';
import { useBootSequence } from '../hooks/useBootSequence';
import './Identity.css';

export default function Identity() {
  const phase = useBootSequence();
  const headline = experienceHeadline(spansOf(EMPLOYMENT), new Date());

  return (
    <header
      className="ctx"
      data-testid="global-context"
      data-phase={phase}
      aria-label="Global execution context"
    >
      <p className="ctx-label mono">global execution context</p>

      <div className="ctx-body">
        <img
          className="ctx-portrait"
          src={portrait}
          width={210}
          height={270}
          alt="Mohammad Arif Hossain"
          decoding="async"
        />

        <div className="ctx-text">
          <h1>{IDENTITY.name}</h1>
          <p className="ctx-role mono">
            {IDENTITY.title}, {headline}, {IDENTITY.location}
          </p>
          <p className="ctx-summary">{IDENTITY.summary}</p>

          <nav className="ctx-links" aria-label="Contact">
            <a className="ctx-cv" href={CV_URL}>Download CV</a>
            <a href={IDENTITY.github}>GitHub</a>
            <a href={IDENTITY.linkedin}>LinkedIn</a>
            <a href={`mailto:${IDENTITY.email}`}>{IDENTITY.email}</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 6: Write `src/components/Identity.css`**

```css
.ctx {
  border: 1px solid var(--rule);
  background: var(--sheet);
  padding: calc(var(--step) * 5);
  max-width: var(--measure);
}

.ctx-label {
  font-size: 0.75rem;
  color: var(--ink-3);
  margin: 0 0 calc(var(--step) * 3);
}

.ctx-body {
  display: flex;
  gap: calc(var(--step) * 5);
  align-items: flex-start;
  flex-wrap: wrap;
}

.ctx-portrait {
  width: 105px;
  height: 135px;
  object-fit: cover;
  border: 1px solid var(--rule);
  filter: grayscale(1);
  transition: filter 400ms ease;
}

.ctx[data-phase="settled"] .ctx-portrait { filter: grayscale(0); }

.ctx-text { flex: 1 1 20rem; }

.ctx h1 {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.ctx-role {
  font-size: 0.9rem;
  color: var(--live);
  margin: calc(var(--step) * 2) 0 0;
}

.ctx-summary {
  margin: calc(var(--step) * 3) 0 0;
  color: var(--ink-2);
}

.ctx-links {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--step) * 2) calc(var(--step) * 5);
  margin-top: calc(var(--step) * 4);
  font-family: var(--f-mono);
  font-size: 0.85rem;
}

.ctx-cv {
  border: 1px solid var(--accent);
  padding: calc(var(--step)) calc(var(--step) * 3);
  text-decoration: none;
}

.ctx-cv:hover { background: var(--accent); color: var(--paper); }
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npx vitest run src/components/Identity.test.tsx`
Expected: PASS, 6 tests.

- [ ] **Step 8: Wire it into `App.tsx` and confirm the app test still passes**

```tsx
import Identity from './components/Identity';

export default function App() {
  return (
    <main>
      <Identity />
    </main>
  );
}
```

Run: `npm test`
Expected: all tests PASS.

- [ ] **Step 9: Verify the portrait actually inlined**

Run: `npm run build && grep -c "data:image/webp;base64" dist/index.html`
Expected: `1`. If `0`, `assetsInlineLimit` is too low — raise it in `vite.config.ts`.

- [ ] **Step 10: Commit**

```bash
git add src/assets/portrait.webp src/vite-env.d.ts src/components/Identity.tsx src/components/Identity.css src/components/Identity.test.tsx src/App.tsx
git commit -m "feat: add identity section with inlined portrait

Portrait is WebP q88 at its native 210x270 and inlines as a data URI, so
the hero costs no network request. The experience figure is derived at
render rather than written into the copy."
```

---

### Task 7: Call stack and stack frames

**Files:**
- Create: `src/components/StackFrame.tsx`, `src/components/StackFrame.css`, `src/components/CallStack.tsx`
- Test: `src/components/CallStack.test.tsx`

**Interfaces:**
- Consumes: `EMPLOYMENT`, `Employment` from `src/data/cv.ts`.
- Produces: `<CallStack onFrameFocus?: (id: string | null) => void />`; `<StackFrame employment depth executing onFocus onBlur />`.

Only `penta` is executing (`end === null`). Depth drives tonal recession via a `--depth` custom property.

- [ ] **Step 1: Write the failing test**

`src/components/CallStack.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import CallStack from './CallStack';

describe('CallStack', () => {
  it('is an ordered list, because a stack is ordered', () => {
    render(<CallStack />);
    expect(screen.getByRole('list', { name: /call stack/i }).tagName).toBe('OL');
  });

  it('renders frames newest first', () => {
    render(<CallStack />);
    const items = screen.getAllByRole('listitem');
    expect(within(items[0]).getByText('Penta Global Limited')).toBeInTheDocument();
    expect(within(items[3]).getByText('Virtuera')).toBeInTheDocument();
  });

  it('marks exactly one frame as executing', () => {
    render(<CallStack />);
    expect(screen.getAllByText(/executing/i)).toHaveLength(1);
  });

  it('labels the executing frame in text, not only in colour', () => {
    render(<CallStack />);
    const items = screen.getAllByRole('listitem');
    expect(within(items[0]).getByText(/executing/i)).toBeInTheDocument();
  });

  it('assigns increasing depth so frames recede tonally', () => {
    render(<CallStack />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveStyle({ '--depth': '0' });
    expect(items[3]).toHaveStyle({ '--depth': '3' });
  });

  it('shows both Penta roles with the Feb 2024 transition', () => {
    render(<CallStack />);
    const penta = screen.getAllByRole('listitem')[0];
    expect(within(penta).getByText(/Frontend Web Developer/)).toBeInTheDocument();
    expect(within(penta).getByText(/Full Stack Engineer/)).toBeInTheDocument();
    expect(within(penta).getByText(/2024-02/)).toBeInTheDocument();
  });

  it('states commitment and mode for each frame', () => {
    render(<CallStack />);
    const virtuera = screen.getAllByRole('listitem')[3];
    expect(within(virtuera).getByText(/part-time/)).toBeInTheDocument();
    expect(within(virtuera).getByText(/remote/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/CallStack.test.tsx`
Expected: FAIL — `Failed to resolve import "./CallStack"`.

- [ ] **Step 3: Write `src/components/StackFrame.tsx`**

```tsx
import type { CSSProperties } from 'react';
import type { Employment } from '../data/cv';
import './StackFrame.css';

interface Props {
  employment: Employment;
  depth: number;
  executing: boolean;
  onActivate?: (id: string | null) => void;
}

function period(start: string, end: string | null): string {
  return `${start} to ${end ?? 'present'}`;
}

export default function StackFrame({ employment, depth, executing, onActivate }: Props) {
  const e = employment;

  return (
    <li
      className="frame"
      data-executing={executing || undefined}
      style={{ '--depth': String(depth) } as CSSProperties}
      tabIndex={0}
      onFocus={() => onActivate?.(e.id)}
      onBlur={() => onActivate?.(null)}
      onMouseEnter={() => onActivate?.(e.id)}
      onMouseLeave={() => onActivate?.(null)}
    >
      <div className="frame-head">
        <h3>{e.company}</h3>
        {executing && <span className="frame-state mono">executing</span>}
      </div>

      <p className="frame-meta mono">
        {period(e.start, e.end)}, {e.commitment}, {e.mode}
        {e.nature === 'internship' ? ', internship' : ''}
      </p>
      <p className="frame-meta mono">{e.location}</p>

      <ol className="frame-roles">
        {e.roles.map((r) => (
          <li key={r.title}>
            <span className="frame-role">{r.title}</span>{' '}
            <span className="mono frame-role-span">
              {r.start} to {r.end ?? 'present'}
            </span>
          </li>
        ))}
      </ol>

      {e.points.length > 0 && (
        <ul className="frame-points">
          {e.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
    </li>
  );
}
```

- [ ] **Step 4: Write `src/components/StackFrame.css`**

Depth is encoded tonally. There is no per-frame border or card shadow.

```css
.frame {
  --recede: calc(var(--depth) * 16%);
  color: color-mix(in oklab, var(--ink) calc(100% - var(--recede)), var(--paper));
  padding: calc(var(--step) * 4) 0;
  border-top: 1px solid var(--rule-soft);
  list-style: none;
}

.frame:first-child { border-top: 0; }

.frame[data-executing] {
  background: var(--live-wash);
  padding-inline: calc(var(--step) * 4);
  margin-inline: calc(var(--step) * -4);
}

.frame-head {
  display: flex;
  align-items: baseline;
  gap: calc(var(--step) * 3);
  flex-wrap: wrap;
}

.frame h3 { font-size: 1.15rem; }

.frame-state {
  font-size: 0.72rem;
  color: var(--live);
  border: 1px solid var(--live);
  padding: 0 calc(var(--step));
}

.frame-meta {
  font-size: 0.8rem;
  color: color-mix(in oklab, var(--ink-3) calc(100% - var(--recede)), var(--paper));
  margin: calc(var(--step)) 0 0;
}

.frame-roles {
  list-style: none;
  padding: 0;
  margin: calc(var(--step) * 3) 0 0;
}

.frame-role { font-weight: 500; }
.frame-role-span { font-size: 0.78rem; color: var(--ink-3); }

.frame-points {
  margin: calc(var(--step) * 3) 0 0;
  padding-left: 1.1rem;
  max-width: var(--measure);
}

.frame-points li { margin-top: calc(var(--step) * 2); }
```

- [ ] **Step 5: Write `src/components/CallStack.tsx`**

```tsx
import { EMPLOYMENT } from '../data/cv';
import StackFrame from './StackFrame';

interface Props {
  onActivate?: (id: string | null) => void;
}

export default function CallStack({ onActivate }: Props) {
  return (
    <section aria-labelledby="call-stack-heading">
      <h2 id="call-stack-heading">Call stack</h2>
      <ol className="stack" aria-label="Call stack" style={{ padding: 0, margin: 0 }}>
        {EMPLOYMENT.map((e, i) => (
          <StackFrame
            key={e.id}
            employment={e}
            depth={i}
            executing={e.end === null}
            onActivate={onActivate}
          />
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run src/components/CallStack.test.tsx`
Expected: PASS, 7 tests.

- [ ] **Step 7: Commit**

```bash
git add src/components/StackFrame.tsx src/components/StackFrame.css src/components/CallStack.tsx src/components/CallStack.test.tsx
git commit -m "feat: render employment as a call stack with tonal depth

Frames are an ordered list because a stack is ordered. Depth recedes
tonally rather than through borders or cards, and the executing frame is
labelled in text so colour is not the only carrier of meaning."
```

---

### Task 8: Parallel region

**Files:**
- Create: `src/components/ParallelRegion.tsx`, `src/components/ParallelRegion.css`
- Test: `src/components/ParallelRegion.test.tsx`

**Interfaces:**
- Consumes: `EMPLOYMENT`, `NOW`; `spansOf`, `toMonths`, `peakConcurrency`, `concurrentPairs` from `src/lib/timeline.ts`.
- Produces: `<ParallelRegion />`.

Lanes are positioned by percentage across a shared axis bounded by the settled roles (Dec 2020 – Oct 2021). Lane weight encodes commitment.

- [ ] **Step 1: Write the failing test**

`src/components/ParallelRegion.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import ParallelRegion from './ParallelRegion';

describe('ParallelRegion', () => {
  it('renders one lane per settled early role', () => {
    render(<ParallelRegion />);
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });

  it('reports the derived peak concurrency rather than a written number', () => {
    render(<ParallelRegion />);
    expect(screen.getByText(/three at once/i)).toBeInTheDocument();
  });

  it('distinguishes part-time lanes from full-time ones', () => {
    render(<ParallelRegion />);
    const lanes = screen.getAllByRole('listitem');
    const virtuera = lanes.find((l) => within(l).queryByText('Virtuera'))!;
    const cogniable = lanes.find((l) => within(l).queryByText('CogniAble'))!;
    expect(virtuera).toHaveAttribute('data-commitment', 'part-time');
    expect(cogniable).toHaveAttribute('data-commitment', 'full-time');
  });

  it('positions each lane along the shared axis', () => {
    render(<ParallelRegion />);
    const virtuera = screen
      .getAllByRole('listitem')
      .find((l) => within(l).queryByText('Virtuera'))!;
    const bar = within(virtuera).getByTestId('lane-bar');
    expect(bar.style.left).toBe('0%');
    expect(parseFloat(bar.style.width)).toBeGreaterThan(0);
  });

  it('gives each lane an accessible period description', () => {
    render(<ParallelRegion />);
    expect(screen.getByText(/2020-12 to 2021-04/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/ParallelRegion.test.tsx`
Expected: FAIL — `Failed to resolve import "./ParallelRegion"`.

- [ ] **Step 3: Write `src/components/ParallelRegion.tsx`**

```tsx
import { EMPLOYMENT, NOW } from '../data/cv';
import { spansOf, toMonths, peakConcurrency } from '../lib/timeline';
import './ParallelRegion.css';

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five'];

export default function ParallelRegion() {
  const early = EMPLOYMENT.filter((e) => e.end !== null || e.id === 'penta');
  const spans = spansOf(early);

  const lo = Math.min(...spans.map((s) => toMonths(s.start)));
  const hiCandidates = early
    .filter((e) => e.end !== null)
    .map((e) => toMonths(e.end as string));
  const hi = Math.max(...hiCandidates);
  const width = hi - lo;

  const peak = peakConcurrency(spans, NOW);

  const ordered = [...early].sort((a, b) => toMonths(a.start) - toMonths(b.start));

  return (
    <section aria-labelledby="parallel-heading" className="parallel">
      <h2 id="parallel-heading">Parallel region, settled</h2>
      <p className="parallel-note">
        Four roles across eleven months, peaking at{' '}
        <strong>{WORDS[peak.count]} at once</strong>. Two were part-time
        internships, which is what makes the overlap ordinary rather than
        remarkable.
      </p>

      <ol className="lanes" aria-label="Concurrent early roles">
        {ordered.map((e) => {
          const start = toMonths(e.start);
          const end = e.end ? toMonths(e.end) : hi;
          const left = ((start - lo) / width) * 100;
          const span = ((end - start) / width) * 100;

          return (
            <li key={e.id} className="lane" data-commitment={e.commitment}>
              <div className="lane-label">
                <span className="lane-company">{e.company}</span>
                <span className="mono lane-period">
                  {e.start} to {e.end ?? 'present'}
                </span>
              </div>
              <div className="lane-track">
                <span
                  className="lane-bar"
                  data-testid="lane-bar"
                  style={{ left: `${left}%`, width: `${span}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
```

- [ ] **Step 4: Write `src/components/ParallelRegion.css`**

```css
.parallel-note {
  max-width: var(--measure);
  color: var(--ink-2);
  margin: calc(var(--step) * 2) 0 calc(var(--step) * 5);
}

.lanes { list-style: none; padding: 0; margin: 0; }

.lane { margin-top: calc(var(--step) * 3); }

.lane-label {
  display: flex;
  justify-content: space-between;
  gap: calc(var(--step) * 3);
  font-size: 0.85rem;
}

.lane-company { font-weight: 500; }
.lane-period { color: var(--ink-3); font-size: 0.78rem; }

.lane-track {
  position: relative;
  height: 14px;
  margin-top: calc(var(--step));
  border-bottom: 1px solid var(--rule-soft);
}

.lane-bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--accent);
  border-radius: 1px;
}

.lane[data-commitment="full-time"] .lane-bar { height: 10px; }

.lane[data-commitment="part-time"] .lane-bar {
  height: 5px;
  background: color-mix(in oklab, var(--accent) 45%, var(--paper));
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/ParallelRegion.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/ParallelRegion.tsx src/components/ParallelRegion.css src/components/ParallelRegion.test.tsx
git commit -m "feat: draw the 2020-21 roles as a settled parallel region

Lane weight encodes commitment, so two part-time internships read as
lighter than the full-time roles beside them. The peak count is taken
from the derived timeline rather than written into the copy."
```

---

### Task 9: Heap

**Files:**
- Create: `src/components/HeapObject.tsx`, `src/components/Heap.tsx`, `src/components/Heap.css`
- Test: `src/components/Heap.test.tsx`

**Interfaces:**
- Consumes: `PROJECTS`, `EMPLOYMENT`.
- Produces: `<Heap activeEmploymentId?: string | null registerRef?: (id: string, el: HTMLElement | null) => void />`.

Stack lists render as array literals, never middle-dot strings.

- [ ] **Step 1: Write the failing test**

`src/components/Heap.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import Heap from './Heap';

describe('Heap', () => {
  it('renders one object per project', () => {
    render(<Heap />);
    expect(screen.getAllByRole('article')).toHaveLength(4);
  });

  it('renders the stack as an array literal, not a middle-dot string', () => {
    render(<Heap />);
    const beza = screen.getByRole('article', { name: /BEZA One Stop Service/i });
    const stack = within(beza).getByTestId('stack-literal');
    expect(stack.textContent).toMatch(/^\['React', 'Redux'/);
    expect(stack.textContent).not.toContain('·');
  });

  it('names the allocating employer in text so the link survives without JS', () => {
    render(<Heap />);
    const beza = screen.getByRole('article', { name: /BEZA One Stop Service/i });
    expect(within(beza).getByText(/Penta Global Limited/)).toBeInTheDocument();
  });

  it('marks the independent client project as having no allocating frame', () => {
    render(<Heap />);
    const badlao = screen.getByRole('article', { name: /Badlao/i });
    expect(within(badlao).getByText(/independent client/i)).toBeInTheDocument();
  });

  it('highlights only the objects allocated by the active frame', () => {
    render(<Heap activeEmploymentId="penta" />);
    expect(screen.getByRole('article', { name: /BEZA/i })).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('article', { name: /Badlao/i })).not.toHaveAttribute('data-active');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/Heap.test.tsx`
Expected: FAIL — `Failed to resolve import "./Heap"`.

- [ ] **Step 3: Write `src/components/HeapObject.tsx`**

```tsx
import type { Project } from '../data/cv';

interface Props {
  project: Project;
  allocatedBy: string | null;
  active: boolean;
  registerRef?: (id: string, el: HTMLElement | null) => void;
}

export default function HeapObject({ project, allocatedBy, active, registerRef }: Props) {
  return (
    <article
      className="obj"
      aria-label={project.name}
      data-active={active || undefined}
      ref={(el) => registerRef?.(project.id, el)}
    >
      <h3>{project.name}</h3>

      <p className="obj-meta mono">
        {project.kind}, {project.period}
      </p>

      <p className="obj-alloc mono">
        {allocatedBy
          ? `allocated by ${allocatedBy}`
          : 'independent client work, no allocating frame'}
      </p>

      <p className="obj-stack mono scroll-x" data-testid="stack-literal">
        [{project.stack.map((s) => `'${s}'`).join(', ')}]
      </p>

      <ul className="obj-features">
        {project.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </article>
  );
}
```

- [ ] **Step 4: Write `src/components/Heap.tsx`**

```tsx
import { PROJECTS, EMPLOYMENT } from '../data/cv';
import HeapObject from './HeapObject';
import './Heap.css';

interface Props {
  activeEmploymentId?: string | null;
  registerRef?: (id: string, el: HTMLElement | null) => void;
}

export default function Heap({ activeEmploymentId = null, registerRef }: Props) {
  const companyOf = (id: string | null) =>
    id === null ? null : (EMPLOYMENT.find((e) => e.id === id)?.company ?? null);

  return (
    <section aria-labelledby="heap-heading">
      <h2 id="heap-heading">Heap</h2>
      <div className="heap">
        {PROJECTS.map((p) => (
          <HeapObject
            key={p.id}
            project={p}
            allocatedBy={companyOf(p.employmentId)}
            active={activeEmploymentId !== null && p.employmentId === activeEmploymentId}
            registerRef={registerRef}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Write `src/components/Heap.css`**

Heap objects are raised surfaces because they are discrete allocations. Stack frames deliberately are not.

```css
.heap {
  display: grid;
  gap: calc(var(--step) * 4);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
  margin-top: calc(var(--step) * 4);
}

.obj {
  background: var(--sheet);
  border: 1px solid var(--rule);
  padding: calc(var(--step) * 4);
  transition: border-color 200ms ease, box-shadow 200ms ease;
}

.obj[data-active] {
  border-color: var(--live);
  box-shadow: 0 0 0 1px var(--live);
}

.obj h3 { font-size: 1.02rem; }

.obj-meta, .obj-alloc {
  font-size: 0.76rem;
  color: var(--ink-3);
  margin: calc(var(--step)) 0 0;
}

.obj-stack {
  font-size: 0.74rem;
  color: var(--accent);
  margin: calc(var(--step) * 3) 0 0;
  white-space: nowrap;
  padding-bottom: calc(var(--step));
}

.obj-features {
  margin: calc(var(--step) * 3) 0 0;
  padding-left: 1.1rem;
  font-size: 0.92rem;
  color: var(--ink-2);
}

.obj-features li { margin-top: calc(var(--step) * 2); }
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run src/components/Heap.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 7: Commit**

```bash
git add src/components/HeapObject.tsx src/components/Heap.tsx src/components/Heap.css src/components/Heap.test.tsx
git commit -m "feat: render projects as heap objects

Stacks print as array literals rather than middle-dot meta strings, and
each object names its allocating employer in text so the stack-to-heap
relationship survives without JavaScript."
```

---

### Task 10: Pointer layer

The only component that reads DOM geometry. It receives element refs from above rather than querying the document, so the stack and heap stay independently testable.

**Files:**
- Create: `src/components/PointerLayer.tsx`, `src/components/PointerLayer.css`
- Test: `src/components/PointerLayer.test.tsx`

**Interfaces:**
- Consumes: nothing from data.
- Produces: `<PointerLayer edges: Array<{ from: DOMRect; to: DOMRect }> containerRect: DOMRect | null />`.

- [ ] **Step 1: Write the failing test**

`src/components/PointerLayer.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import PointerLayer from './PointerLayer';

const rect = (x: number, y: number, w = 100, h = 40) =>
  ({ x, y, width: w, height: h, top: y, left: x, right: x + w, bottom: y + h } as DOMRect);

describe('PointerLayer', () => {
  it('renders nothing when there are no edges', () => {
    const { container } = render(<PointerLayer edges={[]} containerRect={rect(0, 0, 800, 600)} />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('draws one path per edge', () => {
    render(
      <PointerLayer
        edges={[
          { from: rect(0, 0), to: rect(400, 200) },
          { from: rect(0, 0), to: rect(400, 300) },
        ]}
        containerRect={rect(0, 0, 800, 600)}
      />,
    );
    expect(screen.getByTestId('pointer-layer').querySelectorAll('path')).toHaveLength(2);
  });

  it('is hidden from assistive technology, since the relationship is also in text', () => {
    render(
      <PointerLayer edges={[{ from: rect(0, 0), to: rect(400, 200) }]} containerRect={rect(0, 0, 800, 600)} />,
    );
    expect(screen.getByTestId('pointer-layer')).toHaveAttribute('aria-hidden', 'true');
  });

  it('positions coordinates relative to the container, not the viewport', () => {
    render(
      <PointerLayer
        edges={[{ from: rect(100, 100), to: rect(500, 300) }]}
        containerRect={rect(50, 50, 800, 600)}
      />,
    );
    const d = screen.getByTestId('pointer-layer').querySelector('path')!.getAttribute('d')!;
    expect(d.startsWith('M 150 70')).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/PointerLayer.test.tsx`
Expected: FAIL — `Failed to resolve import "./PointerLayer"`.

- [ ] **Step 3: Write `src/components/PointerLayer.tsx`**

```tsx
import './PointerLayer.css';

export interface Edge {
  from: DOMRect;
  to: DOMRect;
}

interface Props {
  edges: Edge[];
  containerRect: DOMRect | null;
}

export default function PointerLayer({ edges, containerRect }: Props) {
  if (!containerRect || edges.length === 0) return null;

  const path = (e: Edge) => {
    const x1 = e.from.right - containerRect.left;
    const y1 = e.from.top + e.from.height / 2 - containerRect.top;
    const x2 = e.to.left - containerRect.left;
    const y2 = e.to.top + e.to.height / 2 - containerRect.top;
    const mid = x1 + (x2 - x1) / 2;
    return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
  };

  return (
    <svg
      className="pointers"
      data-testid="pointer-layer"
      aria-hidden="true"
      width={containerRect.width}
      height={containerRect.height}
      viewBox={`0 0 ${containerRect.width} ${containerRect.height}`}
    >
      {edges.map((e, i) => (
        <path key={i} d={path(e)} fill="none" />
      ))}
    </svg>
  );
}
```

- [ ] **Step 4: Write `src/components/PointerLayer.css`**

```css
.pointers {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.pointers path {
  stroke: var(--live);
  stroke-width: 1.25;
  stroke-dasharray: 3 3;
  opacity: 0.85;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/PointerLayer.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/PointerLayer.tsx src/components/PointerLayer.css src/components/PointerLayer.test.tsx
git commit -m "feat: draw stack-to-heap pointer edges

Geometry comes in as rects from the parent rather than being queried from
the document, so the layer is pure and the stack and heap stay
independently testable. Hidden from assistive tech because the same
relationship is stated in text."
```

---

### Task 11: Scope chain, module resolution, references

**Files:**
- Create: `src/components/ScopeChain.tsx`, `src/components/ScopeChain.css`, `src/components/ModuleResolution.tsx`, `src/components/References.tsx`, `src/components/Listing.css`
- Test: `src/components/ScopeChain.test.tsx`, `src/components/ModuleResolution.test.tsx`, `src/components/References.test.tsx`

**Interfaces:**
- Consumes: `SKILLS`, `EDUCATION`, `CREDENTIALS`, `REFERENCES`.
- Produces: `<ScopeChain />`, `<ModuleResolution />`, `<References />`.

- [ ] **Step 1: Write the failing tests**

`src/components/ScopeChain.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import ScopeChain from './ScopeChain';

describe('ScopeChain', () => {
  it('renders the three tiers in resolution order', () => {
    render(<ScopeChain />);
    const groups = screen.getAllByRole('group');
    expect(within(groups[0]).getByText('Proficient')).toBeInTheDocument();
    expect(within(groups[1]).getByText('Comfortable')).toBeInTheDocument();
    expect(within(groups[2]).getByText('Familiar')).toBeInTheDocument();
  });

  it('names the scope each tier corresponds to', () => {
    render(<ScopeChain />);
    expect(screen.getByText('local scope')).toBeInTheDocument();
    expect(screen.getByText('closure scope')).toBeInTheDocument();
    expect(screen.getByText('global scope')).toBeInTheDocument();
  });

  it('lists React under the proficient tier', () => {
    render(<ScopeChain />);
    const groups = screen.getAllByRole('group');
    expect(within(groups[0]).getByText('React')).toBeInTheDocument();
  });
});
```

`src/components/ModuleResolution.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import ModuleResolution from './ModuleResolution';

describe('ModuleResolution', () => {
  it('lists both education entries', () => {
    render(<ModuleResolution />);
    expect(screen.getByText(/Diploma in Computer Science/)).toBeInTheDocument();
    expect(screen.getByText(/Higher Secondary Certificate/)).toBeInTheDocument();
  });

  it('lists both credentials', () => {
    render(<ModuleResolution />);
    expect(screen.getByText('Certified Web Developer')).toBeInTheDocument();
    expect(screen.getByText('CSE Fundamentals')).toBeInTheDocument();
  });

  it('does not invent a name for the HSC institute', () => {
    render(<ModuleResolution />);
    expect(screen.queryByText(/University College/)).not.toBeInTheDocument();
  });
});
```

`src/components/References.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import References from './References';

describe('References', () => {
  it('lists both referees with mailto links', () => {
    render(<References />);
    expect(screen.getByRole('link', { name: 'nazmulfarhan@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:nazmulfarhan@gmail.com',
    );
    expect(screen.getByRole('link', { name: 'arif18bari@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:arif18bari@gmail.com',
    );
  });

  it('gives each referee a distinct email', () => {
    render(<References />);
    const links = screen.getAllByRole('link', { name: /@gmail\.com$/ });
    const hrefs = links.map((l) => l.getAttribute('href'));
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/ScopeChain.test.tsx src/components/ModuleResolution.test.tsx src/components/References.test.tsx`
Expected: FAIL — three unresolved imports.

- [ ] **Step 3: Write `src/components/ScopeChain.tsx`**

```tsx
import { SKILLS } from '../data/cv';
import './ScopeChain.css';

export default function ScopeChain() {
  return (
    <section aria-labelledby="scope-heading">
      <h2 id="scope-heading">Scope chain</h2>
      <p className="scope-note">
        Resolution proceeds outward. Nearer scopes are reached faster.
      </p>

      <div className="scopes">
        {SKILLS.map((tier, i) => (
          <div
            key={tier.tier}
            role="group"
            aria-label={tier.label}
            className="scope"
            style={{ ['--depth' as string]: String(i) }}
          >
            <div className="scope-head">
              <h3>{tier.label}</h3>
              <span className="mono scope-kind">{tier.scope}</span>
            </div>
            <ul className="scope-items">
              {tier.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Write `src/components/ScopeChain.css`**

```css
.scope-note { color: var(--ink-2); margin: calc(var(--step) * 2) 0 calc(var(--step) * 4); }

.scopes { display: grid; gap: calc(var(--step) * 3); }

.scope {
  --recede: calc(var(--depth) * 15%);
  border-left: 2px solid color-mix(in oklab, var(--accent) calc(100% - var(--recede)), var(--paper));
  padding-left: calc(var(--step) * 4);
}

.scope-head {
  display: flex;
  align-items: baseline;
  gap: calc(var(--step) * 3);
  flex-wrap: wrap;
}

.scope h3 { font-size: 1rem; }
.scope-kind { font-size: 0.74rem; color: var(--ink-3); }

.scope-items {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--step)) calc(var(--step) * 3);
  padding: 0;
  margin: calc(var(--step) * 2) 0 0;
  font-family: var(--f-mono);
  font-size: 0.82rem;
  color: color-mix(in oklab, var(--ink-2) calc(100% - var(--recede)), var(--paper));
}
```

- [ ] **Step 5: Write `src/components/ModuleResolution.tsx` and `src/components/References.tsx`**

`ModuleResolution.tsx`:

```tsx
import { EDUCATION, CREDENTIALS } from '../data/cv';
import './Listing.css';

export default function ModuleResolution() {
  return (
    <section aria-labelledby="modules-heading">
      <h2 id="modules-heading">Module resolution</h2>
      <p className="listing-note">Resolved before execution began.</p>

      <div className="listing">
        {EDUCATION.map((e) => (
          <div key={e.qualification} className="entry">
            <h3>{e.qualification}</h3>
            <p className="entry-sub">{e.institute}</p>
            <ul className="entry-detail mono">
              {e.detail.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        ))}
        {CREDENTIALS.map((c) => (
          <div key={c.title} className="entry">
            <h3>{c.title}</h3>
            <p className="entry-sub">{c.institute}</p>
            <ul className="entry-detail mono">
              {c.detail.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

`References.tsx`:

```tsx
import { REFERENCES } from '../data/cv';
import './Listing.css';

export default function References() {
  return (
    <section aria-labelledby="refs-heading">
      <h2 id="refs-heading">References</h2>
      <div className="listing">
        {REFERENCES.map((r) => (
          <div key={r.email} className="entry">
            <h3>{r.name}</h3>
            <p className="entry-sub">
              {r.position}, {r.company}
            </p>
            <ul className="entry-detail mono">
              <li>
                <a href={`mailto:${r.email}`}>{r.email}</a>
              </li>
              <li>
                <a href={r.linkedin}>LinkedIn profile</a>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Write `src/components/Listing.css`**

The grid places entries in row-major order so dividers align across columns regardless of entry height — the same problem the CV had.

```css
.listing-note { color: var(--ink-2); margin: calc(var(--step) * 2) 0 calc(var(--step) * 4); }

.listing {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: calc(var(--step) * 5) calc(var(--step) * 6);
}

.entry h3 { font-size: 0.98rem; }
.entry-sub { margin: calc(var(--step)) 0 0; color: var(--ink-2); font-size: 0.9rem; }

.entry-detail {
  list-style: none;
  padding: 0;
  margin: calc(var(--step) * 2) 0 0;
  font-size: 0.76rem;
  color: var(--ink-3);
}

.entry-detail li { margin-top: calc(var(--step)); }
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx vitest run src/components/ScopeChain.test.tsx src/components/ModuleResolution.test.tsx src/components/References.test.tsx`
Expected: PASS, 8 tests.

- [ ] **Step 8: Commit**

```bash
git add src/components/ScopeChain.tsx src/components/ScopeChain.css src/components/ModuleResolution.tsx src/components/References.tsx src/components/Listing.css src/components/ScopeChain.test.tsx src/components/ModuleResolution.test.tsx src/components/References.test.tsx
git commit -m "feat: add scope chain, module resolution and references

Skill tiers recede tonally with scope distance, matching the stack. A
regression test pins the HSC institute name, which an earlier draft of the
CV had embellished."
```

---

### Task 12: Rail, event loop, and app composition

**Files:**
- Create: `src/components/InstrumentRail.tsx`, `src/components/InstrumentRail.css`, `src/components/EventLoop.tsx`, `src/components/EventLoop.css`, `src/components/ThemeToggle.tsx`, `src/App.css`
- Modify: `src/App.tsx`
- Test: `src/App.test.tsx` (extend), `src/components/EventLoop.test.tsx`

**Interfaces:**
- Consumes: everything built so far.
- Produces: the composed page. `App` owns the `activeEmploymentId` state, holds refs for frames and heap objects, and computes edges for `PointerLayer`.

- [ ] **Step 1: Write the failing tests**

`src/components/EventLoop.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { setMedia } from '../../vitest.setup';
import EventLoop from './EventLoop';

const REDUCE = '(prefers-reduced-motion: reduce)';

describe('EventLoop', () => {
  it('ticks when motion is allowed', () => {
    setMedia({ [REDUCE]: false });
    render(<EventLoop />);
    expect(screen.getByTestId('tick')).toHaveAttribute('data-running', 'true');
  });

  it('stops ticking under reduced motion', () => {
    setMedia({ [REDUCE]: true });
    render(<EventLoop />);
    expect(screen.getByTestId('tick')).not.toHaveAttribute('data-running');
  });
});
```

Replace `src/App.test.tsx` with:

```tsx
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the subject name as the page heading', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: /Mohammad Arif Hossain/i }),
    ).toBeInTheDocument();
  });

  it('has exactly one h1', () => {
    render(<App />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('never skips a heading level', () => {
    render(<App />);
    const levels = screen
      .getAllByRole('heading')
      .map((h) => Number(h.tagName[1]));
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  it('presents the sections in recruiter reading order', () => {
    render(<App />);
    const h2s = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(h2s).toEqual([
      'Call stack',
      'Parallel region, settled',
      'Heap',
      'Scope chain',
      'Module resolution',
      'References',
    ]);
  });

  it('offers a theme toggle', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/App.test.tsx src/components/EventLoop.test.tsx`
Expected: FAIL — missing sections and unresolved `./EventLoop`.

- [ ] **Step 3: Write `src/components/EventLoop.tsx` and its CSS**

```tsx
import { useReducedMotion } from '../hooks/useReducedMotion';
import './EventLoop.css';

export default function EventLoop() {
  const reduced = useReducedMotion();
  return (
    <p className="loop mono">
      <span className="loop-dot" data-testid="tick" data-running={!reduced || undefined} />
      event loop, idle
    </p>
  );
}
```

```css
.loop {
  display: flex;
  align-items: center;
  gap: calc(var(--step) * 2);
  font-size: 0.72rem;
  color: var(--ink-3);
  margin: 0;
}

.loop-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ink-3);
}

.loop-dot[data-running] {
  background: var(--live);
  animation: tick 2.4s ease-in-out infinite;
}

@keyframes tick {
  0%, 100% { opacity: 0.25; }
  50%      { opacity: 1; }
}
```

- [ ] **Step 4: Write `src/components/ThemeToggle.tsx`**

```tsx
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button type="button" className="mono" onClick={toggle} aria-label="Switch theme">
      theme: {theme}
    </button>
  );
}
```

- [ ] **Step 5: Write `src/components/InstrumentRail.tsx` and its CSS**

```tsx
import { EMPLOYMENT } from '../data/cv';
import EventLoop from './EventLoop';
import ThemeToggle from './ThemeToggle';
import './InstrumentRail.css';

interface Props {
  activeEmploymentId: string | null;
}

export default function InstrumentRail({ activeEmploymentId }: Props) {
  const active = EMPLOYMENT.find((e) => e.id === activeEmploymentId);

  return (
    <aside className="rail" aria-label="Runtime state">
      <dl className="rail-readout mono">
        <dt>stack depth</dt>
        <dd>{EMPLOYMENT.length}</dd>
        <dt>executing</dt>
        <dd>{EMPLOYMENT.find((e) => e.end === null)?.company ?? 'none'}</dd>
        <dt>selected frame</dt>
        <dd>{active ? active.company : 'none'}</dd>
      </dl>
      <EventLoop />
      <ThemeToggle />
    </aside>
  );
}
```

```css
.rail {
  display: flex;
  flex-direction: column;
  gap: calc(var(--step) * 4);
  font-size: 0.75rem;
}

.rail-readout { margin: 0; }
.rail-readout dt { color: var(--ink-3); }
.rail-readout dd { margin: 0 0 calc(var(--step) * 2); color: var(--ink); }

.rail button {
  background: transparent;
  border: 1px solid var(--rule);
  color: var(--ink-2);
  padding: calc(var(--step)) calc(var(--step) * 2);
  font-size: 0.72rem;
  cursor: pointer;
  align-self: flex-start;
}

@media (min-width: 900px) {
  .rail {
    position: sticky;
    top: calc(var(--step) * 6);
  }
}
```

- [ ] **Step 6: Write `src/App.tsx` and `src/App.css`**

```tsx
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import Identity from './components/Identity';
import CallStack from './components/CallStack';
import ParallelRegion from './components/ParallelRegion';
import Heap from './components/Heap';
import ScopeChain from './components/ScopeChain';
import ModuleResolution from './components/ModuleResolution';
import References from './components/References';
import InstrumentRail from './components/InstrumentRail';
import PointerLayer, { type Edge } from './components/PointerLayer';
import { PROJECTS } from './data/cv';
import './App.css';

export default function App() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  const shell = useRef<HTMLDivElement>(null);
  const frameEls = useRef(new Map<string, HTMLElement>());
  const objectEls = useRef(new Map<string, HTMLElement>());

  const registerObject = useCallback((id: string, el: HTMLElement | null) => {
    if (el) objectEls.current.set(id, el);
    else objectEls.current.delete(id);
  }, []);

  const recompute = useCallback(() => {
    if (!shell.current || activeId === null) {
      setEdges([]);
      return;
    }
    const from = frameEls.current.get(activeId);
    if (!from) {
      setEdges([]);
      return;
    }
    const next: Edge[] = PROJECTS.filter((p) => p.employmentId === activeId)
      .map((p) => objectEls.current.get(p.id))
      .filter((el): el is HTMLElement => Boolean(el))
      .map((el) => ({ from: from.getBoundingClientRect(), to: el.getBoundingClientRect() }));

    setContainerRect(shell.current.getBoundingClientRect());
    setEdges(next);
  }, [activeId]);

  useLayoutEffect(() => {
    recompute();
    window.addEventListener('resize', recompute);
    return () => window.removeEventListener('resize', recompute);
  }, [recompute]);

  const handleActivate = useCallback((id: string | null) => setActiveId(id), []);

  return (
    <div className="page">
      <InstrumentRail activeEmploymentId={activeId} />

      <main className="content" ref={shell}>
        <Identity />
        <PointerLayer edges={edges} containerRect={containerRect} />

        <div
          ref={(el) => {
            if (!el) return;
            el.querySelectorAll<HTMLElement>('.frame').forEach((frameEl, i) => {
              const id = ['penta', 'cogniable', 'hwsaver', 'virtuera'][i];
              frameEls.current.set(id, frameEl);
            });
          }}
        >
          <CallStack onActivate={handleActivate} />
        </div>

        <ParallelRegion />
        <Heap activeEmploymentId={activeId} registerRef={registerObject} />
        <ScopeChain />
        <ModuleResolution />
        <References />
      </main>
    </div>
  );
}
```

```css
.page {
  display: grid;
  gap: calc(var(--step) * 6);
  padding: calc(var(--step) * 6) calc(var(--step) * 5);
  max-width: 78rem;
  margin: 0 auto;
}

.content {
  position: relative;
  display: grid;
  gap: calc(var(--step) * 12);
}

.content > section > h2 {
  font-size: 0.95rem;
  color: var(--ink-3);
  border-bottom: 1px solid var(--rule-soft);
  padding-bottom: calc(var(--step) * 2);
  margin-bottom: calc(var(--step) * 4);
}

@media (min-width: 900px) {
  .page {
    grid-template-columns: var(--rail) minmax(0, 1fr);
    gap: calc(var(--step) * 10);
    padding-block: calc(var(--step) * 10);
  }
}
```

- [ ] **Step 7: Run the full suite**

Run: `npm test`
Expected: all tests PASS.

- [ ] **Step 8: Typecheck and build**

Run: `npm run typecheck && npm run build`
Expected: clean typecheck; `dist/index.html` produced with no `dist/assets/` directory.

- [ ] **Step 9: Commit**

```bash
git add src/components/InstrumentRail.tsx src/components/InstrumentRail.css src/components/EventLoop.tsx src/components/EventLoop.css src/components/EventLoop.test.tsx src/components/ThemeToggle.tsx src/App.tsx src/App.css src/App.test.tsx
git commit -m "feat: compose the page and wire stack-to-heap pointers

App owns the active-frame state and computes pointer geometry, keeping
PointerLayer pure. Tests pin the heading outline and the section order a
recruiter reads."
```

---

### Task 13: Correct the CV

The site links to `/cv.pdf`. That file must be the corrected CV, not the current one. This task is the highest-value change in the plan: the CV as it stands omits an employer and misstates two end dates.

**Files:**
- Modify: `/home/arif/Documents/resume/Mohammad_Arif_Hossain_Resume.md`, `.html`, `.gdoc.html`
- Create: `public/cv.pdf`

- [ ] **Step 1: Back up the current resume files**

```bash
cd /home/arif/Documents/resume
for f in Mohammad_Arif_Hossain_Resume.md Mohammad_Arif_Hossain_Resume.html Mohammad_Arif_Hossain_Resume.gdoc.html; do
  cp "$f" "$f.pre-employment-fix"
done
ls -1 *.pre-employment-fix
```

Expected: three backup files.

- [ ] **Step 2: Replace the Employment section in the markdown**

Replace the block from `**Employment**` up to (not including) `**Certifications**` in `Mohammad_Arif_Hossain_Resume.md` with:

```markdown
**Employment**

1. **Penta Global Limited**, Gulshan, Dhaka, Bangladesh

   Position: Full Stack Engineer (Full-time, onsite)

   Frontend Web Developer: 09/2021 – 02/2024

   Full Stack Engineer: 02/2024 – Present

   **Key Responsibilities:**

* [keep the nine existing Penta bullets unchanged]


2. **CogniAble**, Gurugram, Haryana, India

   Position: React Developer (Full-time, remote)

   Duration: 04/2021 – 10/2021

   **Key Responsibilities:**

* **Built and maintained web applications in React.**
* **Built mobile applications with React Native.**
* **Consumed a GraphQL API as the primary data layer.**


3. **HW Saver LLP**, Uttar Pradesh, India

   Position: Frontend Web Developer (Internship, part-time, remote)

   Duration: 01/2021 – 10/2021

   **Key Responsibilities:**

* **Built and maintained web applications in React under tight delivery deadlines.**


4. **Virtuera**, Mumbai, Maharashtra, India

   Position: Frontend Web Developer (Internship, part-time, remote)

   Duration: 12/2020 – 04/2021
```

- [ ] **Step 3: Fix the summary line and the dead portfolio URL**

```bash
cd /home/arif/Documents/resume
sed -i 's/7+ years of experience/5+ years of experience/' Mohammad_Arif_Hossain_Resume.md
sed -i 's|https://arif-hossain-portfolio.web.app/|https://a1barif2h.github.io|g' \
  Mohammad_Arif_Hossain_Resume.md Mohammad_Arif_Hossain_Resume.html Mohammad_Arif_Hossain_Resume.gdoc.html
grep -c "web.app" Mohammad_Arif_Hossain_Resume.md Mohammad_Arif_Hossain_Resume.html Mohammad_Arif_Hossain_Resume.gdoc.html
```

Expected: `0` for all three files.

- [ ] **Step 4: Apply the same employment corrections to the two HTML files**

Both files carry the employment entries in their Experience section. Update each to match Step 2: add the Virtuera entry, change the HW Saver end to 10/2021 and its label to part-time internship, change CogniAble to "React Developer" ending 10/2021, and split the Penta role into the two dated titles. Also change `7+ years` to `5+ years` in the summary of each.

- [ ] **Step 5: Verify no stale facts remain**

```bash
cd /home/arif/Documents/resume
grep -n "7+ years\|20/09/2021\|10/07/2021\|Gurgaon\|Full-time remote intern" \
  Mohammad_Arif_Hossain_Resume.md Mohammad_Arif_Hossain_Resume.html Mohammad_Arif_Hossain_Resume.gdoc.html
grep -c "Virtuera" Mohammad_Arif_Hossain_Resume.md Mohammad_Arif_Hossain_Resume.html Mohammad_Arif_Hossain_Resume.gdoc.html
```

Expected: the first command prints nothing; the second prints a non-zero count for all three files.

- [ ] **Step 6: Re-render the PDF**

```bash
cd /home/arif/Documents/resume
timeout 120 google-chrome --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer \
  --virtual-time-budget=12000 \
  --print-to-pdf=/home/arif/Documents/resume/Mohammad_Arif_Hossain_Resume.pdf \
  "file:///home/arif/Documents/resume/Mohammad_Arif_Hossain_Resume.html"
pdfinfo Mohammad_Arif_Hossain_Resume.pdf | grep -E "Pages|Page size"
pdftotext Mohammad_Arif_Hossain_Resume.pdf - | grep -c "Virtuera"
```

Expected: A4 page size; `Virtuera` appears at least once in the extracted text.

- [ ] **Step 7: Copy the PDF into the site**

```bash
mkdir -p /home/arif/Documents/portfolio/public
cp /home/arif/Documents/resume/Mohammad_Arif_Hossain_Resume.pdf \
   /home/arif/Documents/portfolio/public/cv.pdf
ls -l /home/arif/Documents/portfolio/public/cv.pdf
```

- [ ] **Step 8: Verify the build copies it through**

Run: `cd /home/arif/Documents/portfolio && npm run build && ls dist/cv.pdf`
Expected: `dist/cv.pdf` exists.

- [ ] **Step 9: Commit**

```bash
cd /home/arif/Documents/portfolio
git add public/cv.pdf
git commit -m "feat: serve the corrected CV at /cv.pdf

Adds Virtuera, corrects the HW Saver and CogniAble end dates and the
CogniAble title, marks both internships part-time, records the Feb 2024
promotion, replaces the dead Firebase portfolio URL, and changes the
unsupported '7+ years' to the measured '5+ years'."
```

---

### Task 14: Deploy to GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write the workflow**

```yaml
name: Deploy to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

The workflow runs the typecheck and the full test suite before building, so a broken factual assertion blocks the deploy rather than shipping.

- [ ] **Step 2: Enable Pages with the Actions build type**

```bash
gh api -X POST repos/a1barif2h/a1barif2h.github.io/pages -f build_type=workflow
```

Expected: JSON response. If it returns `409 Conflict`, Pages is already configured — update it instead:

```bash
gh api -X PUT repos/a1barif2h/a1barif2h.github.io/pages -f build_type=workflow
```

- [ ] **Step 3: Commit and push**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: build, test and deploy to GitHub Pages on push to main"
git push origin main
```

- [ ] **Step 4: Verify the deployment succeeded**

```bash
gh run watch --exit-status
curl -sS -o /dev/null -w "%{http_code}\n" https://a1barif2h.github.io
curl -sS -o /dev/null -w "%{http_code}\n" https://a1barif2h.github.io/cv.pdf
```

Expected: the run completes green; both URLs return `200`.

- [ ] **Step 5: Confirm the deployed page carries the corrected facts**

```bash
curl -sS https://a1barif2h.github.io | grep -c "Virtuera"
curl -sS https://a1barif2h.github.io | grep -c "web.app"
```

Expected: first non-zero, second `0`.

---

## Self-Review

**Spec coverage:**

| Spec section | Task |
|---|---|
| §1 success criteria | 12 (reading order, heading outline), 14 (deploy) |
| §2 concept | 6, 7, 8, 9, 11 |
| §3 architecture table | 12 (section order test) |
| §3.1 stack→heap edge | 10, 12 |
| §3.2 parallel region | 3, 8 |
| §3.3 Penta promotion | 2, 7 |
| §4 single source of truth | 2 |
| §4.1 derived values | 3 |
| §5.2 palette | 4 |
| §5.3 theming mechanics | 4 |
| §5.4 typography, prohibitions | 1 (font links), 4, 6, 9 |
| §5.5 tonal recession, array literals | 7, 9, 11 |
| §5.6 anti-default audit | enforced in Global Constraints |
| §6 motion | 5, 12 |
| §7 portrait | 6 |
| §8 repo structure | File Structure table |
| §9 build and deploy | 1, 14 |
| §10 accessibility and performance | 6, 7, 10, 12 |
| §11 testing | every task |
| §12 CV corrections | 13 |
| §13.1 CV download | 6, 13 |

No gaps.

**Placeholder scan:** one intentional editorial marker in Task 13 Step 2 — `[keep the nine existing Penta bullets unchanged]` — which instructs preservation of existing text rather than deferring work. Task 13 Step 4 describes HTML edits in prose because the two HTML files' exact markup must be read at execution time; Step 5 gives the mechanical verification that proves the edit landed.

**Type consistency:** `Employment.commitment`/`nature`/`mode`/`roles` are defined in Task 2 and consumed identically in Tasks 3, 7, 8 and 12. `Span`, `spansOf`, `experienceHeadline`, `peakConcurrency` are defined in Task 3 and used in Tasks 6 and 8 with matching signatures. `Edge` is exported from Task 10 and imported by name in Task 12. `onActivate` is named consistently in `StackFrame`, `CallStack` and `App`. `registerRef` is named consistently in `HeapObject`, `Heap` and `App`.

---

## Two content gaps to resolve before Task 13

1. **Virtuera has no bullet content.** It was never on the CV, so there is nothing to carry over. `points: []` renders the role, dates, commitment and location only — honest, and nothing is invented. One or two lines about what was built there would strengthen it.

2. **Sep–Oct 2021 shows two full-time roles overlapping.** CogniAble runs to Oct 2021 and Penta starts Sep 2021. That reads naturally as a notice period, and the design does not editorialise, but the dates are now stated precisely enough that a reader will notice. Confirm they are right.

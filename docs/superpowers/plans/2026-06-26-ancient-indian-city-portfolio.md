# Ancient Indian City 3D Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an explorable, stylized (Raji-inspired) ancient Indian city as Vinayak Koli's web portfolio, with first/third-person movement, holographic project displays, a journey-based progressive reveal, and a recruiter "skip → resume" fallback.

**Architecture:** A single React + Vite + TypeScript app rendering a three.js scene via React Three Fiber. The app lives in a new `city3d/` source project and deploys to a `/city3d` path; the existing root site (`index.html`) is retained as the lightweight 2D fallback that the "Skip → Resume / Info" button opens. All portfolio copy lives in one data module; the 3D scene reads from it. Player movement uses a Rapier kinematic character controller; a single camera rig toggles first/third person. Testable logic (state, content, proximity/waypoint math, camera-mode math) is built TDD-first with Vitest; visual scene components get smoke-render tests plus explicit manual-verification steps.

**Tech Stack:** React 18, Vite, TypeScript, three.js, @react-three/fiber, @react-three/drei, @react-three/rapier, @react-three/postprocessing, zustand, Vitest, @react-three/test-renderer, @testing-library/react.

## Global Constraints

- **Platform:** Web only. React Three Fiber + three.js. NOT Unity/Unreal/Blender. Must open from a single URL.
- **Art style:** Stylized low-to-mid poly, Raji-inspired. Unified palette + fog + color grade hide asset mismatches.
- **Brand colors (exact):** base `#0D0D0D`, deep-red accent `#8B0000`, text white `#FFFFFF` / soft gray `#B3B3B3`.
- **Camera:** user-toggleable first-person / third-person (keybind `V` + on-screen button).
- **Projects:** displayed as 3D holograms — NEVER a flat 2D card/image.
- **Narrative:** journey-based progressive reveal — phases unlock as the player crosses waypoints in order.
- **Escape hatch:** persistent "Skip → Resume / Info" button, works on every device, opens 2D modal that also links to the existing root site.
- **Content centralization:** ALL portfolio copy/links live in `city3d/src/data/content.ts`. No hardcoded copy in components.
- **Assets:** free only (Sketchfab CC0/CC-BY, Poly Haven CC0, Quaternius/Kenney CC0, Mixamo). Every asset credited in `city3d/CREDITS.md` with source URL + license.
- **Performance:** first interactive < ~10s desktop broadband; ≥30fps mid mobile or clean fallback. Draco compression, capped pixel ratio, fog draw-distance cap, quality tiers (High/Medium/Lite).
- **Hard fallback:** if WebGL unavailable or device too weak → render the 2D info modal; never a broken canvas.
- **Resume file:** `Vinayak koli resume software.pdf` (root). Essays: HTML in `articles/`, PDFs in root.
- **Node/npm:** Node 22.x, npm 11.x (confirmed available).

---

## File Structure

```
city3d/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  vitest.setup.ts
  CREDITS.md
  public/
    assets/            # GLB models, HDRIs, textures (downloaded by Vinayak)
  src/
    main.tsx           # React root mount
    App.tsx            # Canvas + HUD composition + WebGL guard
    data/
      content.ts       # ALL portfolio data (single source of truth)
      content.test.ts
    state/
      useStore.ts      # zustand store
      useStore.test.ts
    scene/
      City.tsx         # scene root: lights, sky, fog, ground, districts
      Environment.tsx  # sky/HDRI + fog + lighting
      PostFX.tsx       # postprocessing color grade
      districts/
        Gateway.tsx
        Temple.tsx
        ArtisansQuarter.tsx
        ProjectShrines.tsx
        Scriptorium.tsx
        Ghats.tsx
        BellTower.tsx
      layout.ts        # district world positions (shared constants)
      layout.test.ts
    player/
      PlayerController.tsx
      CameraRig.tsx
      cameraMath.ts     # pure camera offset math
      cameraMath.test.ts
    interaction/
      proximity.ts      # pure proximity detection
      proximity.test.ts
      ProximityPrompt.tsx
    components/
      Hologram.tsx
    journey/
      waypoints.ts
      journey.ts        # pure phase-progression logic
      journey.test.ts
      JourneySystem.tsx
      JourneyCaption.tsx
    ui/
      HUD.tsx
      SkipResumeModal.tsx
      LoadingScreen.tsx
      webgl.ts          # WebGL capability + device tier detection
      webgl.test.ts
```

---

## Task 1: Scaffold project + test harness

**Files:**
- Create: `city3d/package.json`, `city3d/tsconfig.json`, `city3d/vite.config.ts`, `city3d/index.html`, `city3d/vitest.setup.ts`, `city3d/src/main.tsx`, `city3d/src/App.tsx`, `city3d/src/smoke.test.ts`

**Interfaces:**
- Produces: a runnable Vite app (`npm run dev`), `npm test` runs Vitest, `npm run build` produces `dist/`.

- [ ] **Step 1: Create the Vite app and install deps**

Run from repo root:
```bash
cd "city3d" 2>/dev/null || (mkdir -p city3d && cd city3d)
npm create vite@latest . -- --template react-ts
npm install three @react-three/fiber @react-three/drei @react-three/rapier @react-three/postprocessing zustand
npm install -D vitest @react-three/test-renderer @testing-library/react @testing-library/jest-dom jsdom @types/three
```

- [ ] **Step 2: Configure Vite base path + Vitest**

`city3d/vite.config.ts`:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/city3d/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
} as any);
```

`city3d/vitest.setup.ts`:
```ts
import '@testing-library/jest-dom';
```

Add to `city3d/package.json` `"scripts"`: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 3: Write a smoke test**

`city3d/src/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest';

describe('harness', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 4: Run the test**

Run: `cd city3d && npm test`
Expected: PASS (1 test).

- [ ] **Step 5: Verify dev server boots**

Run: `cd city3d && npm run build`
Expected: build succeeds, `dist/` created.

- [ ] **Step 6: Commit**

```bash
git add city3d
git commit -m "feat(city3d): scaffold R3F app with vitest harness"
```

---

## Task 2: Portfolio content data module

**Files:**
- Create: `city3d/src/data/content.ts`, `city3d/src/data/content.test.ts`

**Interfaces:**
- Produces:
  - `type Project = { id: string; title: string; description: string; tech: string[]; github?: string; live?: string }`
  - `type Essay = { id: string; title: string; summary: string; href: string; pdf?: string }`
  - `type SkillGroup = { category: string; items: string[] }`
  - `type EduEntry = { institution: string; detail: string; period: string }`
  - `content: { hero, about, skills: SkillGroup[], projects: Project[], essays: Essay[], education: EduEntry[], contact, resumeHref }`

- [ ] **Step 1: Write the failing test**

`city3d/src/data/content.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { content } from './content';

describe('content', () => {
  it('has all sections populated', () => {
    expect(content.hero.name).toBe('Vinayak Koli');
    expect(content.projects.length).toBeGreaterThanOrEqual(4);
    expect(content.essays.length).toBeGreaterThanOrEqual(4);
    expect(content.skills.length).toBeGreaterThanOrEqual(3);
    expect(content.education.length).toBeGreaterThanOrEqual(2);
  });

  it('every project has title, description, and at least one tech', () => {
    for (const p of content.projects) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.description.length).toBeGreaterThan(0);
      expect(p.tech.length).toBeGreaterThan(0);
    }
  });

  it('every essay href points to an articles page', () => {
    for (const e of content.essays) {
      expect(e.href).toMatch(/articles\//);
    }
  });

  it('resume href points to the resume pdf', () => {
    expect(content.resumeHref).toMatch(/resume/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd city3d && npx vitest run src/data/content.test.ts`
Expected: FAIL ("Cannot find module './content'").

- [ ] **Step 3: Implement the content module**

`city3d/src/data/content.ts`:
```ts
export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
};
export type Essay = { id: string; title: string; summary: string; href: string; pdf?: string };
export type SkillGroup = { category: string; items: string[] };
export type EduEntry = { institution: string; detail: string; period: string };

// Paths are relative to the deployed root (existing site), one level up from /city3d/.
const ROOT = '..';

export const content = {
  hero: {
    name: 'Vinayak Koli',
    title: 'Computer Science & Social Sciences — IIIT Delhi',
    tagline: 'Aspiring Software Engineer building scalable systems and intelligent solutions.',
  },
  about:
    'Second-year Computer Science and Social Sciences student at IIIT Delhi. I build structured backend systems in Java, Python, and FastAPI, and I write on law, secularism, and democracy. This city is where those two worlds meet.',
  skills: [
    { category: 'Languages', items: ['Java', 'Python', 'SQL', 'C++'] },
    { category: 'Tools & Tech', items: ['Git', 'Docker', 'Linux', 'FastAPI', 'React Native', 'Laravel'] },
    { category: 'Concepts', items: ['OOP', 'Data Structures', 'DBMS', 'AI/ML Basics', 'System Design'] },
  ] as SkillGroup[],
  projects: [
    {
      id: 'orbitguard',
      title: 'OrbitGuard',
      description: 'Satellite/space-themed system project — Project 08 in the portfolio.',
      tech: ['Python'],
      github: 'https://github.com/vinayakkoli2005',
    },
    {
      id: 'course-registration',
      title: 'University Course Registration System',
      description: 'Terminal-based system handling student, professor, and admin roles using OOP principles.',
      tech: ['Java', 'OOP'],
      github: 'https://github.com/vinayakkoli2005',
    },
    {
      id: 'dbms-sim',
      title: 'DBMS Simulation Platform',
      description: 'SQL-based database interactions with query simulation and structured schema design.',
      tech: ['SQL', 'HTML', 'CSS', 'JavaScript'],
      github: 'https://github.com/vinayakkoli2005',
    },
    {
      id: 'ai-classification',
      title: 'AI Classification Model',
      description: 'Classification model built in Python with performance-metric evaluation.',
      tech: ['Python'],
      github: 'https://github.com/vinayakkoli2005',
    },
    {
      id: 'ai-model-eval-app',
      title: 'AI Model Evaluation App',
      description: 'Cross-platform mobile app evaluating AI models.',
      tech: ['React Native'],
      github: 'https://github.com/vinayakkoli2005',
    },
  ] as Project[],
  essays: [
    {
      id: 'multiculturalism',
      title: 'Multiculturalism and Secularism',
      summary: 'On the tension between group rights and the secular state.',
      href: `${ROOT}/articles/multiculturalism-and-secularism.html`,
      pdf: `${ROOT}/Multiculturalisms and secularism.pdf`,
    },
    {
      id: 'ucc',
      title: 'The UCC Debate',
      summary: 'Targeted reforms versus a uniform civil code.',
      href: `${ROOT}/articles/ucc-debate.html`,
      pdf: `${ROOT}/UCC debate.pdf`,
    },
    {
      id: 'poverty-democracy',
      title: 'Poverty and Democracy',
      summary: 'How democratic institutions interact with poverty.',
      href: `${ROOT}/articles/poverty-and-democracy.html`,
      pdf: `${ROOT}/poverty and democracy.pdf`,
    },
    {
      id: 'welfare-schemes',
      title: 'India Welfare Schemes',
      summary: 'A response paper on Indian welfare schemes.',
      href: `${ROOT}/articles/india-welfare-schemes.html`,
      pdf: `${ROOT}/response paper on schemes.pdf`,
    },
  ] as Essay[],
  education: [
    { institution: 'IIIT Delhi', detail: 'B.Tech — Computer Science & Social Sciences', period: '2024 – present' },
    { institution: 'KHMS', detail: 'Higher Secondary Education', period: 'completed' },
  ] as EduEntry[],
  contact: {
    email: 'vinayak23597@iiitd.ac.in',
    linkedin: 'https://www.linkedin.com/in/vinayak-koli-940b0728b/',
    github: 'https://github.com/vinayakkoli2005',
  },
  resumeHref: `${ROOT}/Vinayak koli resume software.pdf`,
};
```

> NOTE for executor: education `period` years and the OrbitGuard description are best-guess — flag to Vinayak for confirmation during review. Do not block on it.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd city3d && npx vitest run src/data/content.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add city3d/src/data
git commit -m "feat(city3d): add centralized portfolio content module"
```

---

## Task 3: Global state store (zustand)

**Files:**
- Create: `city3d/src/state/useStore.ts`, `city3d/src/state/useStore.test.ts`

**Interfaces:**
- Produces:
  - `type CameraMode = 'first' | 'third'`
  - `useStore` with: `cameraMode`, `toggleCamera()`, `journeyPhase: number`, `advancePhase()`, `setPhase(n)`, `activeDistrict: string | null`, `setActiveDistrict(id|null)`, `showSkipModal: boolean`, `setShowSkipModal(b)`, `loaded: boolean`, `setLoaded(b)`, `qualityTier: 'high'|'medium'|'lite'`, `setQualityTier(t)`.
  - Constant `TOTAL_PHASES = 6`.

- [ ] **Step 1: Write the failing test**

`city3d/src/state/useStore.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useStore, TOTAL_PHASES } from './useStore';

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({ cameraMode: 'third', journeyPhase: 0, activeDistrict: null });
  });

  it('toggles camera mode', () => {
    expect(useStore.getState().cameraMode).toBe('third');
    useStore.getState().toggleCamera();
    expect(useStore.getState().cameraMode).toBe('first');
    useStore.getState().toggleCamera();
    expect(useStore.getState().cameraMode).toBe('third');
  });

  it('advances phase but never past the last phase', () => {
    for (let i = 0; i < TOTAL_PHASES + 5; i++) useStore.getState().advancePhase();
    expect(useStore.getState().journeyPhase).toBe(TOTAL_PHASES - 1);
  });

  it('sets active district', () => {
    useStore.getState().setActiveDistrict('temple');
    expect(useStore.getState().activeDistrict).toBe('temple');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd city3d && npx vitest run src/state/useStore.test.ts`
Expected: FAIL ("Cannot find module './useStore'").

- [ ] **Step 3: Implement the store**

`city3d/src/state/useStore.ts`:
```ts
import { create } from 'zustand';

export type CameraMode = 'first' | 'third';
export type QualityTier = 'high' | 'medium' | 'lite';
export const TOTAL_PHASES = 6;

type State = {
  cameraMode: CameraMode;
  toggleCamera: () => void;
  journeyPhase: number;
  advancePhase: () => void;
  setPhase: (n: number) => void;
  activeDistrict: string | null;
  setActiveDistrict: (id: string | null) => void;
  showSkipModal: boolean;
  setShowSkipModal: (b: boolean) => void;
  loaded: boolean;
  setLoaded: (b: boolean) => void;
  qualityTier: QualityTier;
  setQualityTier: (t: QualityTier) => void;
};

export const useStore = create<State>((set) => ({
  cameraMode: 'third',
  toggleCamera: () =>
    set((s) => ({ cameraMode: s.cameraMode === 'third' ? 'first' : 'third' })),
  journeyPhase: 0,
  advancePhase: () =>
    set((s) => ({ journeyPhase: Math.min(s.journeyPhase + 1, TOTAL_PHASES - 1) })),
  setPhase: (n) => set({ journeyPhase: Math.max(0, Math.min(n, TOTAL_PHASES - 1)) }),
  activeDistrict: null,
  setActiveDistrict: (id) => set({ activeDistrict: id }),
  showSkipModal: false,
  setShowSkipModal: (b) => set({ showSkipModal: b }),
  loaded: false,
  setLoaded: (b) => set({ loaded: b }),
  qualityTier: 'high',
  setQualityTier: (t) => set({ qualityTier: t }),
}));
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd city3d && npx vitest run src/state/useStore.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add city3d/src/state
git commit -m "feat(city3d): add zustand global state store"
```

---

## Task 4: District layout constants

**Files:**
- Create: `city3d/src/scene/layout.ts`, `city3d/src/scene/layout.test.ts`

**Interfaces:**
- Produces: `type Vec3 = [number, number, number]`; `DISTRICTS: { id: string; label: string; position: Vec3; phase: number }[]` (7 entries). `getDistrict(id)`.

- [ ] **Step 1: Write the failing test**

`city3d/src/scene/layout.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { DISTRICTS, getDistrict } from './layout';

describe('layout', () => {
  it('defines exactly 7 districts with unique ids', () => {
    expect(DISTRICTS.length).toBe(7);
    const ids = new Set(DISTRICTS.map((d) => d.id));
    expect(ids.size).toBe(7);
  });

  it('every district has a finite 3D position', () => {
    for (const d of DISTRICTS) {
      expect(d.position).toHaveLength(3);
      d.position.forEach((c) => expect(Number.isFinite(c)).toBe(true));
    }
  });

  it('getDistrict returns the matching district', () => {
    expect(getDistrict('temple')?.label).toContain('Temple');
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `cd city3d && npx vitest run src/scene/layout.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement layout**

`city3d/src/scene/layout.ts`:
```ts
export type Vec3 = [number, number, number];

export const DISTRICTS: { id: string; label: string; position: Vec3; phase: number }[] = [
  { id: 'gateway', label: 'Grand Gateway', position: [0, 0, 40], phase: 0 },
  { id: 'temple', label: 'Central Temple', position: [0, 0, 10], phase: 1 },
  { id: 'artisans', label: "Artisans' Quarter", position: [-30, 0, 0], phase: 2 },
  { id: 'projects', label: 'Project Shrines', position: [30, 0, -10], phase: 3 },
  { id: 'scriptorium', label: 'The Scriptorium', position: [-25, 0, -40], phase: 4 },
  { id: 'ghats', label: 'The Ghats', position: [0, 0, -60], phase: 4 },
  { id: 'belltower', label: 'Bell Tower', position: [25, 0, -75], phase: 5 },
];

export function getDistrict(id: string) {
  return DISTRICTS.find((d) => d.id === id);
}
```

- [ ] **Step 4: Run to verify pass**

Run: `cd city3d && npx vitest run src/scene/layout.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add city3d/src/scene/layout.ts city3d/src/scene/layout.test.ts
git commit -m "feat(city3d): add district layout constants"
```

---

## Task 5: Environment + base scene + WebGL guard

**Files:**
- Create: `city3d/src/scene/Environment.tsx`, `city3d/src/scene/City.tsx`, `city3d/src/ui/webgl.ts`, `city3d/src/ui/webgl.test.ts`
- Modify: `city3d/src/App.tsx`

**Interfaces:**
- Consumes: `useStore` (Task 3).
- Produces: `detectWebGL(): boolean`, `detectTier(): QualityTier`; `<City/>` scene root; `<App/>` renders Canvas or fallback.

- [ ] **Step 1: Write the failing test (WebGL detection logic)**

`city3d/src/ui/webgl.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest';
import { detectWebGL } from './webgl';

describe('detectWebGL', () => {
  it('returns false when getContext yields null', () => {
    const spy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null as any);
    expect(detectWebGL()).toBe(false);
    spy.mockRestore();
  });

  it('returns true when a webgl context exists', () => {
    const spy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as any);
    expect(detectWebGL()).toBe(true);
    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `cd city3d && npx vitest run src/ui/webgl.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement webgl util**

`city3d/src/ui/webgl.ts`:
```ts
import type { QualityTier } from '../state/useStore';

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function detectTier(): QualityTier {
  const cores = (navigator as any).hardwareConcurrency ?? 4;
  const mem = (navigator as any).deviceMemory ?? 4;
  const mobile = /Mobi|Android/i.test(navigator.userAgent);
  if (mobile || cores <= 4 || mem <= 4) return mobile && (cores <= 4) ? 'lite' : 'medium';
  return 'high';
}
```

- [ ] **Step 4: Run to verify pass**

Run: `cd city3d && npx vitest run src/ui/webgl.test.ts`
Expected: PASS.

- [ ] **Step 5: Implement Environment + City (placeholder geometry)**

`city3d/src/scene/Environment.tsx`:
```tsx
import { Sky } from '@react-three/drei';

export function Environment() {
  return (
    <>
      <color attach="background" args={['#0D0D0D']} />
      <fog attach="fog" args={['#0D0D0D', 25, 120]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 30, 10]} intensity={1.2} color="#ffd9a0" castShadow />
      <Sky sunPosition={[10, 2, 8]} turbidity={8} rayleigh={2} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#2a2320" />
      </mesh>
    </>
  );
}
```

`city3d/src/scene/City.tsx`:
```tsx
import { Environment } from './Environment';
import { DISTRICTS } from './layout';

export function City() {
  return (
    <>
      <Environment />
      {DISTRICTS.map((d) => (
        <mesh key={d.id} position={[d.position[0], 2, d.position[2]]} castShadow>
          <boxGeometry args={[6, 4, 6]} />
          <meshStandardMaterial color="#8B0000" />
        </mesh>
      ))}
    </>
  );
}
```

- [ ] **Step 6: Wire App with WebGL fallback**

`city3d/src/App.tsx`:
```tsx
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { City } from './scene/City';
import { detectWebGL, detectTier } from './ui/webgl';
import { useStore } from './state/useStore';

export default function App() {
  const [supported, setSupported] = useState(true);
  const setQualityTier = useStore((s) => s.setQualityTier);

  useEffect(() => {
    setSupported(detectWebGL());
    setQualityTier(detectTier());
  }, [setQualityTier]);

  if (!supported) {
    return (
      <div style={{ color: '#fff', background: '#0D0D0D', padding: 40, minHeight: '100vh' }}>
        <h1>Vinayak Koli</h1>
        <p>Your device can't render the 3D city. <a style={{ color: '#8B0000' }} href="../index.html">View the standard portfolio →</a></p>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0D0D0D' }}>
      <Canvas shadows camera={{ position: [0, 5, 55], fov: 60 }} dpr={[1, 2]}>
        <City />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 7: Manual verification**

Run: `cd city3d && npm run dev`
Expected: browser shows a dark ground plane, sky, and 7 red placeholder boxes. No console errors.

- [ ] **Step 8: Commit**

```bash
git add city3d/src/scene city3d/src/ui/webgl.ts city3d/src/ui/webgl.test.ts city3d/src/App.tsx
git commit -m "feat(city3d): base scene, environment, and WebGL fallback guard"
```

---

## Task 6: Camera math + camera rig (first/third toggle)

**Files:**
- Create: `city3d/src/player/cameraMath.ts`, `city3d/src/player/cameraMath.test.ts`, `city3d/src/player/CameraRig.tsx`

**Interfaces:**
- Consumes: `useStore.cameraMode`.
- Produces: `cameraOffset(mode, yaw): Vec3` (pure); `<CameraRig targetRef />` that positions the camera each frame.

- [ ] **Step 1: Write the failing test**

`city3d/src/player/cameraMath.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { cameraOffset } from './cameraMath';

describe('cameraOffset', () => {
  it('first-person offset is near head height and close in', () => {
    const [x, y, z] = cameraOffset('first', 0);
    expect(y).toBeCloseTo(1.6, 1);
    expect(Math.hypot(x, z)).toBeLessThan(0.5);
  });

  it('third-person offset sits behind and above', () => {
    const [, y, z] = cameraOffset('third', 0);
    expect(y).toBeGreaterThan(2);
    expect(z).toBeGreaterThan(2); // behind along +z when yaw=0
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `cd city3d && npx vitest run src/player/cameraMath.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement camera math**

`city3d/src/player/cameraMath.ts`:
```ts
import type { CameraMode } from '../state/useStore';
export type Vec3 = [number, number, number];

const THIRD_DIST = 6;
const THIRD_HEIGHT = 3;
const HEAD_HEIGHT = 1.6;

export function cameraOffset(mode: CameraMode, yaw: number): Vec3 {
  if (mode === 'first') {
    return [Math.sin(yaw) * 0.1, HEAD_HEIGHT, Math.cos(yaw) * 0.1];
  }
  return [Math.sin(yaw) * THIRD_DIST, THIRD_HEIGHT, Math.cos(yaw) * THIRD_DIST];
}
```

- [ ] **Step 4: Run to verify pass**

Run: `cd city3d && npx vitest run src/player/cameraMath.test.ts`
Expected: PASS.

- [ ] **Step 5: Implement CameraRig**

`city3d/src/player/CameraRig.tsx`:
```tsx
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../state/useStore';
import { cameraOffset } from './cameraMath';
import * as THREE from 'three';
import { RefObject } from 'react';

export function CameraRig({ targetRef, yawRef }: { targetRef: RefObject<THREE.Object3D>; yawRef: RefObject<number> }) {
  const camera = useThree((s) => s.camera);
  const mode = useStore((s) => s.cameraMode);
  const tmp = new THREE.Vector3();

  useFrame(() => {
    const target = targetRef.current;
    if (!target) return;
    const yaw = yawRef.current ?? 0;
    const [ox, oy, oz] = cameraOffset(mode, yaw);
    tmp.set(target.position.x + ox, target.position.y + oy, target.position.z + oz);
    camera.position.lerp(tmp, 0.15);
    camera.lookAt(target.position.x, target.position.y + 1.4, target.position.z);
  });
  return null;
}
```

- [ ] **Step 6: Commit**

```bash
git add city3d/src/player/cameraMath.ts city3d/src/player/cameraMath.test.ts city3d/src/player/CameraRig.tsx
git commit -m "feat(city3d): camera offset math and first/third-person rig"
```

---

## Task 7: Player controller (movement + collision)

**Files:**
- Create: `city3d/src/player/PlayerController.tsx`
- Modify: `city3d/src/scene/City.tsx`, `city3d/src/App.tsx`

**Interfaces:**
- Consumes: Rapier `<Physics>`, `CameraRig` (Task 6).
- Produces: `<PlayerController/>` rendering a capsule (placeholder body) with keyboard + pointer movement; exposes `yawRef`.

- [ ] **Step 1: Implement PlayerController with Rapier**

`city3d/src/player/PlayerController.tsx`:
```tsx
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { useStore } from '../state/useStore';

const SPEED = 6;
const keys: Record<string, boolean> = {};

export function PlayerController() {
  const body = useRef<RapierRigidBody>(null);
  const visual = useRef<THREE.Group>(null);
  const yaw = useRef(0);
  const { gl } = useThree();
  const toggleCamera = useStore((s) => s.toggleCamera);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys[e.code] = true;
      if (e.code === 'KeyV') toggleCamera();
    };
    const up = (e: KeyboardEvent) => (keys[e.code] = false);
    const move = (e: MouseEvent) => {
      if (document.pointerLockElement === gl.domElement) yaw.current -= e.movementX * 0.002;
    };
    const click = () => gl.domElement.requestPointerLock?.();
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('mousemove', move);
    gl.domElement.addEventListener('click', click);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('mousemove', move);
      gl.domElement.removeEventListener('click', click);
    };
  }, [gl, toggleCamera]);

  useFrame(() => {
    const b = body.current;
    if (!b) return;
    const dir = new THREE.Vector3();
    if (keys['KeyW'] || keys['ArrowUp']) dir.z -= 1;
    if (keys['KeyS'] || keys['ArrowDown']) dir.z += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) dir.x -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) dir.x += 1;
    dir.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);
    const v = b.linvel();
    b.setLinvel({ x: dir.x * SPEED, y: v.y, z: dir.z * SPEED }, true);
    const t = b.translation();
    if (visual.current) {
      visual.current.position.set(t.x, t.y, t.z);
      if (dir.lengthSq() > 0) visual.current.rotation.y = Math.atan2(dir.x, dir.z);
    }
  });

  return (
    <>
      <RigidBody ref={body} colliders={false} mass={1} enabledRotations={[false, false, false]} position={[0, 2, 50]}>
        <CapsuleCollider args={[0.6, 0.4]} />
      </RigidBody>
      <group ref={visual}>
        <mesh castShadow position={[0, 1, 0]}>
          <capsuleGeometry args={[0.4, 1.2, 4, 8]} />
          <meshStandardMaterial color="#cfc3a0" />
        </mesh>
      </group>
      <CameraRig targetRef={visual} yawRef={yaw} />
    </>
  );
}
```

- [ ] **Step 2: Wrap scene in Physics and add ground collider**

In `city3d/src/scene/City.tsx`, wrap content with Rapier and give the ground a collider:
```tsx
import { Physics, RigidBody } from '@react-three/rapier';
import { Environment } from './Environment';
import { DISTRICTS } from './layout';
import { PlayerController } from '../player/PlayerController';

export function City() {
  return (
    <Physics gravity={[0, -20, 0]}>
      <Environment />
      <RigidBody type="fixed" colliders="cuboid">
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[400, 0.2, 400]} />
          <meshStandardMaterial color="#2a2320" />
        </mesh>
      </RigidBody>
      {DISTRICTS.map((d) => (
        <RigidBody key={d.id} type="fixed" colliders="cuboid" position={[d.position[0], 2, d.position[2]]}>
          <mesh castShadow>
            <boxGeometry args={[6, 4, 6]} />
            <meshStandardMaterial color="#8B0000" />
          </mesh>
        </RigidBody>
      ))}
      <PlayerController />
    </Physics>
  );
}
```
> Remove the duplicate ground plane in `Environment.tsx` (the physics ground replaces it) to avoid z-fighting — delete the `<mesh>` plane block there.

- [ ] **Step 3: Manual verification**

Run: `cd city3d && npm run dev`
Expected: click canvas to lock pointer; WASD walks the capsule; mouse turns; pressing `V` switches between close (first-person) and behind (third-person) camera; capsule collides with boxes/ground.

- [ ] **Step 4: Commit**

```bash
git add city3d/src/player/PlayerController.tsx city3d/src/scene/City.tsx city3d/src/scene/Environment.tsx
git commit -m "feat(city3d): rapier player controller with first/third camera toggle"
```

---

## Task 8: Character model + Mixamo animations

**Files:**
- Modify: `city3d/src/player/PlayerController.tsx`
- Create: `city3d/src/player/Avatar.tsx`, `city3d/CREDITS.md`
- Add asset: `city3d/public/assets/avatar.glb`

**Interfaces:**
- Consumes: `cameraMode` (hide avatar in first person).
- Produces: `<Avatar moving={boolean} hidden={boolean} />`.

- [ ] **Step 1: Download a free rigged avatar (Vinayak action)**

Process (document in CREDITS.md):
1. Get a stylized character from Mixamo (free, Adobe account) or a CC0 character from Quaternius.
2. On Mixamo, apply **Idle**, **Walking**, **Running**; download as glTF (or FBX → convert with `npx gltfjsx`/Blender) merged into one `avatar.glb` with named animation clips `Idle`, `Walk`.
3. Place at `city3d/public/assets/avatar.glb`.

- [ ] **Step 2: Implement Avatar**

`city3d/src/player/Avatar.tsx`:
```tsx
import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Avatar({ moving, hidden }: { moving: boolean; hidden: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/city3d/assets/avatar.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const next = moving ? actions['Walk'] : actions['Idle'];
    next?.reset().fadeIn(0.2).play();
    return () => void next?.fadeOut(0.2);
  }, [moving, actions]);

  return <group ref={group} visible={!hidden}><primitive object={scene} /></group>;
}
useGLTF.preload('/city3d/assets/avatar.glb');
```

- [ ] **Step 3: Swap the capsule for Avatar in PlayerController**

In `PlayerController.tsx`, replace the visual capsule `<mesh>` with `<Avatar moving={movingRef} hidden={mode==='first'} />`. Track `moving` via a ref set in `useFrame` (`dir.lengthSq() > 0`), and read `mode = useStore((s)=>s.cameraMode)`. Keep the capsule as a fallback if the GLB fails to load (wrap Avatar in `<Suspense fallback={<capsule .../>}>`).

- [ ] **Step 4: Manual verification**

Run: `cd city3d && npm run dev`
Expected: character visible in third person, animates idle/walk; in first person (`V`) the body is hidden and camera is at head height.

- [ ] **Step 5: Record attribution + commit**

`city3d/CREDITS.md` — add the avatar source URL + license. Then:
```bash
git add city3d/src/player/Avatar.tsx city3d/src/player/PlayerController.tsx city3d/CREDITS.md city3d/public/assets/avatar.glb
git commit -m "feat(city3d): add rigged avatar with idle/walk animations"
```

---

## Task 9: Proximity detection + ProximityPrompt

**Files:**
- Create: `city3d/src/interaction/proximity.ts`, `city3d/src/interaction/proximity.test.ts`, `city3d/src/interaction/ProximityPrompt.tsx`
- Modify: `city3d/src/scene/City.tsx`

**Interfaces:**
- Consumes: player position, `DISTRICTS`.
- Produces: `nearestDistrict(playerPos, districts, radius): string | null` (pure); `<ProximityPrompt/>` that calls `setActiveDistrict`.

- [ ] **Step 1: Write the failing test**

`city3d/src/interaction/proximity.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { nearestDistrict } from './proximity';

const D = [
  { id: 'a', position: [0, 0, 0] as [number, number, number] },
  { id: 'b', position: [50, 0, 0] as [number, number, number] },
];

describe('nearestDistrict', () => {
  it('returns the district within radius', () => {
    expect(nearestDistrict([1, 0, 1], D, 8)).toBe('a');
  });
  it('returns null when none within radius', () => {
    expect(nearestDistrict([25, 0, 0], D, 8)).toBeNull();
  });
  it('ignores y when within radius horizontally', () => {
    expect(nearestDistrict([0, 99, 0], D, 8)).toBe('a');
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `cd city3d && npx vitest run src/interaction/proximity.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement proximity**

`city3d/src/interaction/proximity.ts`:
```ts
type D = { id: string; position: [number, number, number] };

export function nearestDistrict(p: [number, number, number], districts: D[], radius: number): string | null {
  let best: string | null = null;
  let bestDist = radius;
  for (const d of districts) {
    const dx = p[0] - d.position[0];
    const dz = p[2] - d.position[2];
    const dist = Math.hypot(dx, dz);
    if (dist <= bestDist) {
      bestDist = dist;
      best = d.id;
    }
  }
  return best;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `cd city3d && npx vitest run src/interaction/proximity.test.ts`
Expected: PASS.

- [ ] **Step 5: Implement ProximityPrompt (R3F component)**

`city3d/src/interaction/ProximityPrompt.tsx`:
```tsx
import { useFrame } from '@react-three/fiber';
import { RefObject } from 'react';
import * as THREE from 'three';
import { DISTRICTS } from '../scene/layout';
import { nearestDistrict } from './proximity';
import { useStore } from '../state/useStore';

export function ProximityPrompt({ playerRef }: { playerRef: RefObject<THREE.Object3D> }) {
  const setActiveDistrict = useStore((s) => s.setActiveDistrict);
  useFrame(() => {
    const p = playerRef.current;
    if (!p) return;
    const id = nearestDistrict([p.position.x, p.position.y, p.position.z], DISTRICTS, 8);
    if (id !== useStore.getState().activeDistrict) setActiveDistrict(id);
  });
  return null;
}
```
Wire `<ProximityPrompt playerRef={visual} />` inside `PlayerController` (pass the `visual` group ref).

- [ ] **Step 6: Commit**

```bash
git add city3d/src/interaction city3d/src/scene/City.tsx city3d/src/player/PlayerController.tsx
git commit -m "feat(city3d): proximity detection sets active district"
```

---

## Task 10: InfoPanel (2D overlay driven by active district)

**Files:**
- Create: `city3d/src/ui/InfoPanel.tsx`, `city3d/src/ui/InfoPanel.test.tsx`
- Modify: `city3d/src/App.tsx`

**Interfaces:**
- Consumes: `useStore.activeDistrict`, `content` (Task 2).
- Produces: `<InfoPanel/>` HTML overlay showing the active district's content.

- [ ] **Step 1: Write the failing test**

`city3d/src/ui/InfoPanel.test.tsx`:
```tsx
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { InfoPanel } from './InfoPanel';
import { useStore } from '../state/useStore';

afterEach(cleanup);

describe('InfoPanel', () => {
  it('renders nothing when no active district', () => {
    useStore.setState({ activeDistrict: null });
    const { container } = render(<InfoPanel />);
    expect(container.firstChild).toBeNull();
  });

  it('shows About text at the temple', () => {
    useStore.setState({ activeDistrict: 'temple' });
    render(<InfoPanel />);
    expect(screen.getByText(/IIIT Delhi/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `cd city3d && npx vitest run src/ui/InfoPanel.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement InfoPanel**

`city3d/src/ui/InfoPanel.tsx`:
```tsx
import { useStore } from '../state/useStore';
import { content } from '../data/content';

function body(id: string) {
  switch (id) {
    case 'gateway':
      return <p>{content.hero.tagline}</p>;
    case 'temple':
      return <p>{content.about}</p>;
    case 'artisans':
      return (
        <ul>
          {content.skills.map((g) => (
            <li key={g.category}><strong>{g.category}:</strong> {g.items.join(', ')}</li>
          ))}
        </ul>
      );
    case 'scriptorium':
      return (
        <ul>
          {content.essays.map((e) => (
            <li key={e.id}><a href={e.href} style={{ color: '#8B0000' }}>{e.title}</a> — {e.summary}</li>
          ))}
        </ul>
      );
    case 'ghats':
      return (
        <ul>
          {content.education.map((e) => (
            <li key={e.institution}><strong>{e.institution}</strong> — {e.detail} ({e.period})</li>
          ))}
        </ul>
      );
    case 'belltower':
      return (
        <ul>
          <li>Email: {content.contact.email}</li>
          <li><a style={{ color: '#8B0000' }} href={content.contact.linkedin}>LinkedIn</a></li>
          <li><a style={{ color: '#8B0000' }} href={content.contact.github}>GitHub</a></li>
          <li><a style={{ color: '#8B0000' }} href={content.resumeHref}>Download Resume</a></li>
        </ul>
      );
    default:
      return null; // 'projects' handled by holograms in-scene
  }
}

const titles: Record<string, string> = {
  gateway: 'Welcome', temple: 'About Me', artisans: 'Technical Skills',
  scriptorium: 'Academic Writing', ghats: 'Education', belltower: 'Get In Touch',
};

export function InfoPanel() {
  const id = useStore((s) => s.activeDistrict);
  if (!id || !titles[id]) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: 24, maxWidth: 420, color: '#fff',
      background: 'rgba(13,13,13,0.85)', border: '1px solid #8B0000', borderRadius: 12,
      padding: 20, backdropFilter: 'blur(6px)', fontFamily: 'Inter, sans-serif',
    }}>
      <h2 style={{ margin: '0 0 8px', color: '#fff' }}>{titles[id]}</h2>
      {body(id)}
    </div>
  );
}
```

- [ ] **Step 4: Run to verify pass + wire into App**

Run: `cd city3d && npx vitest run src/ui/InfoPanel.test.tsx`
Expected: PASS. Then add `<InfoPanel />` to `App.tsx` (outside `<Canvas>`, as a sibling overlay).

- [ ] **Step 5: Commit**

```bash
git add city3d/src/ui/InfoPanel.tsx city3d/src/ui/InfoPanel.test.tsx city3d/src/App.tsx
git commit -m "feat(city3d): info panel overlay driven by active district"
```

---

## Task 11: Hologram component + project shrines

**Files:**
- Create: `city3d/src/components/Hologram.tsx`
- Modify: `city3d/src/scene/districts/ProjectShrines.tsx` (create), `city3d/src/scene/City.tsx`

**Interfaces:**
- Consumes: `content.projects`.
- Produces: `<Hologram title description tech links position />` (emissive rotating projection + drei `Html` label); `<ProjectShrines/>` maps projects to holograms.

- [ ] **Step 1: Implement Hologram**

`city3d/src/components/Hologram.tsx`:
```tsx
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export type HologramProps = {
  title: string;
  description: string;
  tech: string[];
  links: { label: string; href: string }[];
  position: [number, number, number];
};

export function Hologram({ title, description, tech, links, position }: HologramProps) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (mesh.current) mesh.current.rotation.y += dt * 0.6;
  });
  return (
    <group position={position}>
      {/* pedestal */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1, 1.2, 1, 12]} />
        <meshStandardMaterial color="#3a2f28" />
      </mesh>
      {/* holographic projection */}
      <mesh ref={mesh} position={[0, 2.2, 0]}>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#8B0000"
          emissive="#8B0000"
          emissiveIntensity={2}
          transparent
          opacity={0.55}
          wireframe
        />
      </mesh>
      <pointLight position={[0, 2.2, 0]} color="#8B0000" intensity={3} distance={6} />
      <Html position={[0, 3.6, 0]} center distanceFactor={10} style={{ pointerEvents: 'auto' }}>
        <div style={{
          width: 220, color: '#fff', background: 'rgba(13,13,13,0.8)',
          border: '1px solid #8B0000', borderRadius: 8, padding: 10, fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
        }}>
          <strong>{title}</strong>
          <p style={{ fontSize: 12, color: '#B3B3B3', margin: '6px 0' }}>{description}</p>
          <p style={{ fontSize: 11, color: '#8B0000' }}>{tech.join(' · ')}</p>
          {links.map((l) => (
            <a key={l.href} href={l.href} style={{ color: '#fff', fontSize: 12, display: 'block' }}>{l.label} ↗</a>
          ))}
        </div>
      </Html>
    </group>
  );
}
```

- [ ] **Step 2: Implement ProjectShrines using project data + layout**

`city3d/src/scene/districts/ProjectShrines.tsx`:
```tsx
import { Hologram } from '../../components/Hologram';
import { content } from '../../data/content';
import { getDistrict } from '../layout';

export function ProjectShrines() {
  const base = getDistrict('projects')!.position;
  return (
    <>
      {content.projects.map((p, i) => (
        <Hologram
          key={p.id}
          position={[base[0] + (i - 2) * 6, 0, base[2]]}
          title={p.title}
          description={p.description}
          tech={p.tech}
          links={p.github ? [{ label: 'GitHub', href: p.github }] : []}
        />
      ))}
    </>
  );
}
```
Add `<ProjectShrines />` inside `<City>` (inside `<Physics>` is fine; holograms have no colliders).

- [ ] **Step 3: Manual verification**

Run: `cd city3d && npm run dev`
Expected: walk to the projects district — 5 glowing rotating holograms with floating info cards, one per project. No flat 2D image used.

- [ ] **Step 4: Commit**

```bash
git add city3d/src/components/Hologram.tsx city3d/src/scene/districts/ProjectShrines.tsx city3d/src/scene/City.tsx
git commit -m "feat(city3d): holographic project displays"
```

---

## Task 12: Journey progression logic + system + captions

**Files:**
- Create: `city3d/src/journey/waypoints.ts`, `city3d/src/journey/journey.ts`, `city3d/src/journey/journey.test.ts`, `city3d/src/journey/JourneySystem.tsx`, `city3d/src/journey/JourneyCaption.tsx`
- Modify: `city3d/src/App.tsx`, `city3d/src/player/PlayerController.tsx`

**Interfaces:**
- Consumes: player position, `useStore.journeyPhase/advancePhase/setPhase`.
- Produces:
  - `WAYPOINTS: { phase: number; position: [number,number,number]; caption: string }[]`
  - `phaseForPosition(pos, waypoints, radius, currentPhase): number` (pure — only advances forward)
  - `<JourneySystem playerRef/>`, `<JourneyCaption/>`

- [ ] **Step 1: Write the failing test**

`city3d/src/journey/journey.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { phaseForPosition } from './journey';

const WP = [
  { phase: 0, position: [0, 0, 40] as [number, number, number], caption: 'a' },
  { phase: 1, position: [0, 0, 10] as [number, number, number], caption: 'b' },
  { phase: 2, position: [-30, 0, 0] as [number, number, number], caption: 'c' },
];

describe('phaseForPosition', () => {
  it('advances when reaching the next waypoint', () => {
    expect(phaseForPosition([0, 0, 10], WP, 8, 0)).toBe(1);
  });
  it('never moves backward', () => {
    expect(phaseForPosition([0, 0, 40], WP, 8, 2)).toBe(2);
  });
  it('stays put when between waypoints', () => {
    expect(phaseForPosition([0, 0, 25], WP, 8, 0)).toBe(0);
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `cd city3d && npx vitest run src/journey/journey.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement waypoints + journey logic**

`city3d/src/journey/waypoints.ts`:
```ts
export const WAYPOINTS: { phase: number; position: [number, number, number]; caption: string }[] = [
  { phase: 0, position: [0, 0, 40], caption: 'My journey begins at the gateway.' },
  { phase: 1, position: [0, 0, 10], caption: 'Phase I — Foundations: school at KHMS, then IIIT Delhi.' },
  { phase: 2, position: [-30, 0, 0], caption: 'Phase II — Learning the craft: languages and tools.' },
  { phase: 3, position: [30, 0, -10], caption: 'Phase III — Building: the projects I have shipped.' },
  { phase: 4, position: [-25, 0, -40], caption: 'Phase IV — Thinking & writing: law, secularism, democracy.' },
  { phase: 5, position: [25, 0, -75], caption: 'Phase V — What comes next. Let us talk.' },
];
```

`city3d/src/journey/journey.ts`:
```ts
type WP = { phase: number; position: [number, number, number]; caption: string };

export function phaseForPosition(
  pos: [number, number, number],
  waypoints: WP[],
  radius: number,
  currentPhase: number
): number {
  let result = currentPhase;
  for (const wp of waypoints) {
    if (wp.phase <= result) continue;
    const dist = Math.hypot(pos[0] - wp.position[0], pos[2] - wp.position[2]);
    if (dist <= radius) result = wp.phase;
  }
  return result;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `cd city3d && npx vitest run src/journey/journey.test.ts`
Expected: PASS.

- [ ] **Step 5: Implement JourneySystem + JourneyCaption**

`city3d/src/journey/JourneySystem.tsx`:
```tsx
import { useFrame } from '@react-three/fiber';
import { RefObject } from 'react';
import * as THREE from 'three';
import { WAYPOINTS } from './waypoints';
import { phaseForPosition } from './journey';
import { useStore } from '../state/useStore';

export function JourneySystem({ playerRef }: { playerRef: RefObject<THREE.Object3D> }) {
  const setPhase = useStore((s) => s.setPhase);
  useFrame(() => {
    const p = playerRef.current;
    if (!p) return;
    const cur = useStore.getState().journeyPhase;
    const next = phaseForPosition([p.position.x, p.position.y, p.position.z], WAYPOINTS, 8, cur);
    if (next !== cur) setPhase(next);
  });
  return null;
}
```

`city3d/src/journey/JourneyCaption.tsx`:
```tsx
import { useStore } from '../state/useStore';
import { WAYPOINTS } from './waypoints';

export function JourneyCaption() {
  const phase = useStore((s) => s.journeyPhase);
  const caption = WAYPOINTS.find((w) => w.phase === phase)?.caption ?? '';
  return (
    <div style={{
      position: 'fixed', top: 28, left: '50%', transform: 'translateX(-50%)',
      color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 18, textAlign: 'center',
      textShadow: '0 2px 8px #000', pointerEvents: 'none', maxWidth: '80vw',
    }}>
      {caption}
    </div>
  );
}
```
Wire `<JourneySystem playerRef={visual} />` in `PlayerController`, and `<JourneyCaption />` in `App.tsx` overlay.

- [ ] **Step 6: Commit**

```bash
git add city3d/src/journey city3d/src/App.tsx city3d/src/player/PlayerController.tsx
git commit -m "feat(city3d): journey-based progressive reveal with captions"
```

---

## Task 13: HUD — camera toggle, skip→resume modal

**Files:**
- Create: `city3d/src/ui/HUD.tsx`, `city3d/src/ui/SkipResumeModal.tsx`, `city3d/src/ui/SkipResumeModal.test.tsx`
- Modify: `city3d/src/App.tsx`

**Interfaces:**
- Consumes: `useStore` (cameraMode, showSkipModal), `content`.
- Produces: `<HUD/>` (toggle + skip buttons), `<SkipResumeModal/>` (2D info + resume + link to root site).

- [ ] **Step 1: Write the failing test**

`city3d/src/ui/SkipResumeModal.test.tsx`:
```tsx
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { SkipResumeModal } from './SkipResumeModal';
import { useStore } from '../state/useStore';

afterEach(cleanup);

describe('SkipResumeModal', () => {
  it('is hidden by default', () => {
    useStore.setState({ showSkipModal: false });
    const { container } = render(<SkipResumeModal />);
    expect(container.firstChild).toBeNull();
  });
  it('shows resume link when open', () => {
    useStore.setState({ showSkipModal: true });
    render(<SkipResumeModal />);
    expect(screen.getByText(/resume/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `cd city3d && npx vitest run src/ui/SkipResumeModal.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement SkipResumeModal + HUD**

`city3d/src/ui/SkipResumeModal.tsx`:
```tsx
import { useStore } from '../state/useStore';
import { content } from '../data/content';

export function SkipResumeModal() {
  const open = useStore((s) => s.showSkipModal);
  const setOpen = useStore((s) => s.setShowSkipModal);
  if (!open) return null;
  return (
    <div onClick={() => setOpen(false)} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 50,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 'min(560px, 90vw)', color: '#fff', background: '#0D0D0D',
        border: '1px solid #8B0000', borderRadius: 12, padding: 28, fontFamily: 'Inter, sans-serif',
      }}>
        <h2>{content.hero.name}</h2>
        <p style={{ color: '#B3B3B3' }}>{content.hero.title}</p>
        <p>{content.about}</p>
        <p><a style={{ color: '#8B0000' }} href={content.resumeHref}>⬇ Download Resume</a></p>
        <p>
          <a style={{ color: '#8B0000' }} href={content.contact.github}>GitHub</a> ·{' '}
          <a style={{ color: '#8B0000' }} href={content.contact.linkedin}>LinkedIn</a> ·{' '}
          <a style={{ color: '#8B0000' }} href={`mailto:${content.contact.email}`}>Email</a>
        </p>
        <p><a style={{ color: '#B3B3B3' }} href="../index.html">View the standard 2D portfolio →</a></p>
        <button onClick={() => setOpen(false)} style={{
          marginTop: 12, background: '#8B0000', color: '#fff', border: 'none',
          padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
        }}>Back to the city</button>
      </div>
    </div>
  );
}
```

`city3d/src/ui/HUD.tsx`:
```tsx
import { useStore } from '../state/useStore';

const btn: React.CSSProperties = {
  background: 'rgba(13,13,13,0.8)', color: '#fff', border: '1px solid #8B0000',
  padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
};

export function HUD() {
  const mode = useStore((s) => s.cameraMode);
  const toggleCamera = useStore((s) => s.toggleCamera);
  const setOpen = useStore((s) => s.setShowSkipModal);
  return (
    <div style={{ position: 'fixed', top: 16, right: 16, display: 'flex', gap: 10, zIndex: 40 }}>
      <button style={btn} onClick={toggleCamera}>View: {mode === 'third' ? '3rd' : '1st'} (V)</button>
      <button style={btn} onClick={() => setOpen(true)}>⏭ Skip → Resume / Info</button>
    </div>
  );
}
```

- [ ] **Step 4: Run to verify pass + wire**

Run: `cd city3d && npx vitest run src/ui/SkipResumeModal.test.tsx`
Expected: PASS. Add `<HUD />` and `<SkipResumeModal />` to `App.tsx` overlay.

- [ ] **Step 5: Commit**

```bash
git add city3d/src/ui/HUD.tsx city3d/src/ui/SkipResumeModal.tsx city3d/src/ui/SkipResumeModal.test.tsx city3d/src/App.tsx
git commit -m "feat(city3d): HUD with camera toggle and skip-to-resume modal"
```

---

## Task 14: Loading screen + Suspense

**Files:**
- Create: `city3d/src/ui/LoadingScreen.tsx`
- Modify: `city3d/src/App.tsx`

**Interfaces:**
- Consumes: drei `useProgress`.
- Produces: `<LoadingScreen/>` overlay shown until assets load.

- [ ] **Step 1: Implement LoadingScreen**

`city3d/src/ui/LoadingScreen.tsx`:
```tsx
import { useProgress } from '@react-three/drei';

export function LoadingScreen() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0D0D0D', color: '#fff', zIndex: 100,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      <h1 style={{ letterSpacing: 4 }}>VINAYAK KOLI</h1>
      <p style={{ color: '#B3B3B3' }}>Entering the city…</p>
      <div style={{ width: 240, height: 6, background: '#222', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#8B0000' }} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wrap Canvas children in Suspense + add LoadingScreen**

In `App.tsx`: import `Suspense` from React, wrap `<City />` in `<Suspense fallback={null}>`, and render `<LoadingScreen />` as a sibling overlay outside the Canvas.

- [ ] **Step 3: Manual verification**

Run: `cd city3d && npm run dev`
Expected: themed loading bar appears while the avatar/assets load, then disappears.

- [ ] **Step 4: Commit**

```bash
git add city3d/src/ui/LoadingScreen.tsx city3d/src/App.tsx
git commit -m "feat(city3d): themed loading screen with progress"
```

---

## Task 15: Postprocessing color grade (Raji look) + quality tiers

**Files:**
- Create: `city3d/src/scene/PostFX.tsx`
- Modify: `city3d/src/scene/City.tsx`, `city3d/src/App.tsx`

**Interfaces:**
- Consumes: `useStore.qualityTier`.
- Produces: `<PostFX/>` — bloom + vignette + tone curve, disabled on `lite`.

- [ ] **Step 1: Implement PostFX**

`city3d/src/scene/PostFX.tsx`:
```tsx
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing';
import { useStore } from '../state/useStore';

export function PostFX() {
  const tier = useStore((s) => s.qualityTier);
  if (tier === 'lite') return null;
  return (
    <EffectComposer>
      <Bloom intensity={tier === 'high' ? 0.9 : 0.5} luminanceThreshold={0.6} mipmapBlur />
      <Vignette eskil={false} offset={0.3} darkness={0.8} />
      <ToneMapping />
    </EffectComposer>
  );
}
```

- [ ] **Step 2: Add PostFX to scene and clamp dpr/shadows by tier**

Add `<PostFX />` inside `<Canvas>` (sibling of `<City />`). In `App.tsx`, set `shadows={qualityTier !== 'lite'}` and `dpr={qualityTier === 'high' ? [1, 2] : [1, 1.25]}` by reading the tier before first render (it's set in the mount effect; gate the Canvas render on `qualityTier` being resolved or default to medium).

- [ ] **Step 3: Manual verification**

Run: `cd city3d && npm run dev`
Expected: holograms bloom/glow, scene has cinematic vignette; the look matches the dark+deep-red Raji aesthetic.

- [ ] **Step 4: Commit**

```bash
git add city3d/src/scene/PostFX.tsx city3d/src/scene/City.tsx city3d/src/App.tsx
git commit -m "feat(city3d): postprocessing color grade and quality tiers"
```

---

## Task 16: Touch controls (mobile)

**Files:**
- Create: `city3d/src/ui/TouchControls.tsx`
- Modify: `city3d/src/player/PlayerController.tsx`, `city3d/src/App.tsx`

**Interfaces:**
- Produces: an on-screen joystick writing into a shared input ref/state the controller reads; drag-to-look on touch.

- [ ] **Step 1: Implement a minimal joystick that sets a movement vector**

`city3d/src/ui/TouchControls.tsx`:
```tsx
import { useRef } from 'react';

export const touchMove = { x: 0, y: 0 }; // module-level input shared with controller

export function TouchControls() {
  const base = useRef<HTMLDivElement>(null);
  if (!/Mobi|Android/i.test(navigator.userAgent)) return null;

  const onTouch = (e: React.TouchEvent) => {
    const el = base.current!;
    const r = el.getBoundingClientRect();
    const t = e.touches[0];
    const dx = (t.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (t.clientY - (r.top + r.height / 2)) / (r.height / 2);
    touchMove.x = Math.max(-1, Math.min(1, dx));
    touchMove.y = Math.max(-1, Math.min(1, dy));
  };
  const end = () => { touchMove.x = 0; touchMove.y = 0; };

  return (
    <div ref={base} onTouchStart={onTouch} onTouchMove={onTouch} onTouchEnd={end} style={{
      position: 'fixed', bottom: 30, left: 30, width: 120, height: 120, borderRadius: '50%',
      border: '2px solid #8B0000', background: 'rgba(13,13,13,0.5)', zIndex: 40, touchAction: 'none',
    }} />
  );
}
```

- [ ] **Step 2: Read touchMove in PlayerController**

In `PlayerController.tsx` `useFrame`, after keyboard input, add: `dir.x += touchMove.x; dir.z += touchMove.y;` (import `touchMove`). Add `<TouchControls />` to `App.tsx` overlay.

- [ ] **Step 3: Manual verification (mobile or devtools touch emulation)**

Expected: joystick moves the avatar on touch devices.

- [ ] **Step 4: Commit**

```bash
git add city3d/src/ui/TouchControls.tsx city3d/src/player/PlayerController.tsx city3d/src/App.tsx
git commit -m "feat(city3d): on-screen joystick for touch devices"
```

---

## Task 17: Swap placeholder geometry for downloaded stylized assets

**Files:**
- Create: `city3d/src/scene/districts/{Gateway,Temple,ArtisansQuarter,Scriptorium,Ghats,BellTower}.tsx`
- Modify: `city3d/src/scene/City.tsx`, `city3d/CREDITS.md`
- Add assets: `city3d/public/assets/*.glb`, HDRI, textures

**Interfaces:**
- Each district component loads a GLB at its layout position; keeps a fixed collider.

- [ ] **Step 1: Download cohesive stylized assets (Vinayak action)**

Per spec §12: temple/building set, torana arch, pillars, diyas, manuscripts, bell, stalls, foliage (Sketchfab CC0/CC-BY, Quaternius, Kenney) + a dusk HDRI (Poly Haven) + stone ground textures. Optimize each with `npx gltf-pipeline -i in.glb -o out.glb -d` (Draco). Place in `city3d/public/assets/`. Record every source URL + license in `CREDITS.md`.

- [ ] **Step 2: Create a reusable district component pattern**

Example `city3d/src/scene/districts/Temple.tsx`:
```tsx
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { getDistrict } from '../layout';

export function Temple() {
  const pos = getDistrict('temple')!.position;
  const { scene } = useGLTF('/city3d/assets/temple.glb');
  return (
    <RigidBody type="fixed" colliders="trimesh" position={pos}>
      <primitive object={scene} />
    </RigidBody>
  );
}
useGLTF.preload('/city3d/assets/temple.glb');
```
Repeat for each district, pointing at its GLB. Replace the placeholder box loop in `City.tsx` with `<Gateway/> <Temple/> <ArtisansQuarter/> <ProjectShrines/> <Scriptorium/> <Ghats/> <BellTower/>`. Wrap each in `<Suspense>` so a missing asset doesn't crash the scene.

- [ ] **Step 3: Replace the Environment Sky with the HDRI**

In `Environment.tsx`, swap drei `<Sky>` for `<Environment files="/city3d/assets/dusk.hdr" background />` (import `Environment as DreiEnvironment` from `@react-three/drei`), keeping the fog and brand background color.

- [ ] **Step 4: Manual verification**

Run: `cd city3d && npm run dev`
Expected: the stylized city replaces all placeholder boxes; cohesive lighting; holograms still float at the project shrines; navigation/collision intact.

- [ ] **Step 5: Commit**

```bash
git add city3d/src/scene city3d/public/assets city3d/CREDITS.md
git commit -m "feat(city3d): replace placeholders with stylized city assets"
```

---

## Task 18: Optional ambient audio

**Files:**
- Create: `city3d/src/ui/AudioToggle.tsx`
- Add asset: `city3d/public/assets/ambience.mp3`
- Modify: `city3d/src/App.tsx`

**Interfaces:**
- Produces: a mute/unmute button; loops a free CC0 sitar/temple ambience (starts muted; user opt-in for autoplay-policy compliance).

- [ ] **Step 1: Implement AudioToggle**

`city3d/src/ui/AudioToggle.tsx`:
```tsx
import { useRef, useState } from 'react';

export function AudioToggle() {
  const audio = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);
  return (
    <>
      <audio ref={audio} src="/city3d/assets/ambience.mp3" loop />
      <button
        onClick={() => { const a = audio.current!; if (on) a.pause(); else a.play(); setOn(!on); }}
        style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 40,
          background: 'rgba(13,13,13,0.8)', color: '#fff', border: '1px solid #8B0000',
          borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}
      >{on ? '🔊' : '🔇'} Ambience</button>
    </>
  );
}
```
Add `<AudioToggle />` to `App.tsx`. Record audio source/license in `CREDITS.md`.

- [ ] **Step 2: Commit**

```bash
git add city3d/src/ui/AudioToggle.tsx city3d/src/App.tsx city3d/public/assets/ambience.mp3 city3d/CREDITS.md
git commit -m "feat(city3d): optional ambient audio toggle"
```

---

## Task 19: Full test + build verification

**Files:** none (verification task)

- [ ] **Step 1: Run the whole test suite**

Run: `cd city3d && npm test`
Expected: ALL tests pass (content, store, layout, webgl, cameraMath, proximity, journey, InfoPanel, SkipResumeModal).

- [ ] **Step 2: Production build**

Run: `cd city3d && npm run build`
Expected: build succeeds; note the `dist/` bundle size. If the main chunk is large, confirm Draco assets are in `public/assets` (served, not bundled).

- [ ] **Step 3: Preview the build**

Run: `cd city3d && npm run preview`
Expected: the `/city3d/` base path serves correctly; full walk-through works (move, toggle view, holograms, journey captions, skip modal, resume link resolves to `../Vinayak koli resume software.pdf`).

- [ ] **Step 4: Commit any fixes**

```bash
git add -A city3d
git commit -m "test(city3d): full suite and production build green"
```

---

## Task 20: Deploy + link from existing site

**Files:**
- Modify: repo root `index.html` (add an entry link), deployment config

**Interfaces:** the existing root site links into the 3D city; the city's fallback links back.

- [ ] **Step 1: Decide deploy target & wire base path**

If GitHub Pages: build `city3d` and copy `city3d/dist` to a served `/city3d` path (or deploy via Actions). `vite.config.ts` `base: '/city3d/'` is already set for this. Document the exact deploy command used in `city3d/README.md`.

- [ ] **Step 2: Add an "Enter the 3D City" call-to-action to root `index.html`**

Add a prominent button in the hero linking to `city3d/` (or `/city3d/`). Keep the existing 2D site fully functional (it is the fallback).

- [ ] **Step 3: Manual verification (deployed URL)**

Expected: from the live root site, clicking "Enter the 3D City" loads the world from a single URL; the in-city "Skip → standard portfolio" returns to root; resume downloads.

- [ ] **Step 4: Commit**

```bash
git add index.html city3d/README.md
git commit -m "feat: link 3D city portfolio from main site and document deploy"
```

---

## Self-Review Notes (completed by author)

- **Spec coverage:** All 7 districts (Tasks 4, 10, 11, 17), first/third toggle (6,7), holograms (11), journey reveal (12), skip→resume (13), loading (14), Raji color grade (15), mobile/touch + tiers + WebGL fallback (5,15,16), free assets + CREDITS (8,17,18), deploy (20). Education years/OrbitGuard copy flagged for Vinayak in Task 2.
- **Open questions resolved:** (a) new app at `/city3d`, existing site kept as 2D fallback; (b) physics = Rapier; (c) audio = optional Task 18; (d) journey copy seeded in waypoints, dates to confirm.
- **Type consistency:** `CameraMode`, `QualityTier`, `Vec3`, `phaseForPosition`, `nearestDistrict`, `cameraOffset`, `TOTAL_PHASES` used consistently across tasks.
- **Placeholder scan:** Geometry placeholders are intentional, concrete, and explicitly swapped in Task 17 — not undefined work.
```

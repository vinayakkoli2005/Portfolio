# Design Spec — Ancient Indian City 3D Portfolio ("Vinayak's City")

**Date:** 2026-06-26
**Owner:** Vinayak Koli
**Status:** Approved design — ready for implementation planning (`/loop`)

---

## 1. Vision (one paragraph)

A web-based, explorable **stylized ancient Indian city** (art direction inspired by *Raji: An Ancient Epic* and *Journey*) that serves as Vinayak Koli's interactive portfolio. Visitors enter through a grand gateway and roam distinct districts, each surfacing a part of his profile. The city celebrates his rare duality — **Computer Science + Social Sciences** — pairing carved-stone temples with glowing holographic project displays. The experience must run instantly in a browser from a single link, look cinematic on desktop, degrade gracefully on mobile, and always offer a one-click "skip to resume" path for busy recruiters.

---

## 2. Locked Decisions (from brainstorming)

| Decision | Choice |
|---|---|
| **Platform** | Web — **React Three Fiber (R3F) + Three.js**. NOT Unity/Unreal/Blender. (Browser-first; recruiter must open via link.) |
| **Art style** | **Stylized low-to-mid poly**, Raji-inspired. Cohesive palette, strong silhouettes, hand-authored lighting, Indian motifs (toranas, mandalas, diyas, carved pillars). Unified color grade + fog to hide asset mismatches. |
| **Brand colors** | Carry over existing brand: dark base `#0D0D0D`, deep red accent `#8B0000`, white/soft-gray text. Warm temple lighting against dark/dusk sky. |
| **Movement** | Single shared character controller (movement + collision). **User-toggleable first-person / third-person** camera. |
| **Character** | Free rigged character + **Mixamo** animations (idle, walk, run). Model hidden in first-person. |
| **Projects display** | **3D holograms** — glowing rotating projection above a pedestal/shrine. No flat 2D images. |
| **Narrative** | **Journey-based progressive reveal** — walking the main path reveals Vinayak's story in chronological phases (step 1 = phase 1, step 2 = phase 2…). |
| **Escape hatch** | Persistent **"Skip exploration → Resume / Info"** button always on screen. |

---

## 3. Tech Stack & Tooling

- **Framework:** React + Vite + TypeScript
- **3D:** three.js via `@react-three/fiber`
- **Helpers:** `@react-three/drei` (loaders, controls, HTML overlays, environment, Sky), `@react-three/postprocessing` (bloom, ambient occlusion, vignette, color grade)
- **Physics/collision:** lightweight approach — `@react-three/rapier` (preferred) OR custom raycast-based collision if perf demands. Decide in plan.
- **State:** `zustand` (current district, camera mode, journey phase, UI panels)
- **Models:** glTF/GLB (Draco-compressed)
- **Hosting target:** static deploy (GitHub Pages / Vercel / Netlify) — must be a single shareable URL.

### Free asset sources (no paid assets, no hand-modeling)
- **Sketchfab** — filter **Downloadable + CC0/CC-BY** for temples, Indian architecture, props (attribution stored in `CREDITS.md`).
- **Poly Haven** — HDRIs (dusk/golden-hour sky), PBR stone/ground textures (fully free, CC0).
- **Quaternius / Kenney** — cohesive low-poly kits (buildings, nature, props) — CC0.
- **Mixamo** — free auto-rigged character animations (idle/walk/run).
- All third-party assets credited in `CREDITS.md` with source URL + license.

---

## 4. City Layout — District → Content Mapping

The city is laid out along a **main processional path** (the journey). Districts branch off it.

| # | City location | Portfolio content | Interaction |
|---|---|---|---|
| 1 | 🏛️ **Grand Gateway (Torana arch)** | Hero — name, title ("CS + Social Sciences, IIIT Delhi"), "Enter the city" | Title overlay fades; prompts to walk forward |
| 2 | 🛕 **Central Temple** | About Me — the CS + Social Sciences story | Approach → info panel / carved-wall text |
| 3 | ⚒️ **Artisans' Quarter** | Tech Skills — each workshop = a stack (Java, Python, SQL, C++, FastAPI, Docker, Git, Linux, React Native, Laravel) | Walk between workshop stalls; each glows + labels on proximity |
| 4 | 🏗️ **Project Shrines / Monuments** | Projects (OrbitGuard, University Course Registration System, DBMS Simulation Platform, AI Classification Model, AI model-evaluation mobile app) | Each shrine emits a **hologram** (see §6) |
| 5 | 📜 **The Scriptorium / Library** (palm-leaf manuscripts) | Academic Writing — Multiculturalism & Secularism, UCC Debate, Poverty & Democracy, Welfare Schemes (+ presentations) | Approach a manuscript → opens reader / links to existing article HTML pages & PDFs |
| 6 | 🌅 **The Ghats (river steps)** | Education timeline — IIIT Delhi (B.Tech CS+SS), KHMS | Steps descend chronologically |
| 7 | 🔔 **Bell Tower / Message Shrine** | Contact — Email, LinkedIn, GitHub, Resume download | Ring bell / approach → contact panel + resume button |

**Reuse existing content:** essays already exist as HTML in `articles/` and PDFs in root; link to them rather than rebuilding. Resume PDF already in root.

---

## 5. Journey-Based Progressive Reveal (narrative system)

- A defined **path of waypoints** runs through the city in chronological order of Vinayak's journey.
- As the player crosses each waypoint trigger zone, the **next "phase"** of his story is revealed: a cinematic text/voice-free caption fades in, the relevant district lights up, and previously-unvisited areas may remain dimmed/foggy until reached.
- Phases (draft — refine in plan): **(1)** Origins / KHMS → **(2)** Arrival at IIIT Delhi → **(3)** Learning to build (skills) → **(4)** Building things (projects) → **(5)** Thinking & writing (essays) → **(6)** Where I'm headed / contact.
- Implementation: waypoint trigger volumes + zustand `journeyPhase` state driving lighting, captions, and reveal of district markers. A subtle guiding element (light trail / floating diyas) nudges direction without forcing rails.
- **Non-linear allowed:** players may wander, but the guided path + reveal gives structure for those who want it.

---

## 6. Hologram Project Display System

- Each Project Shrine has a **pedestal** that projects a **holographic display** when the player is near.
- Hologram visuals: translucent cyan/red emissive material, scanline + flicker shader, slow rotation, soft bloom. (Custom shader material or layered emissive + postprocessing bloom.)
- Hologram content per project: a **rotating 3D model or floating mini-screen** showing the project, plus floating text: title, one-line description, tech stack, GitHub/live links (clickable via drei `Html`).
- Reusable `<Hologram>` component takes props: `{ title, description, techStack[], links[], model? }`.
- Fallback: if a project has no 3D model, hologram shows a stylized rotating panel/icon — never a plain 2D card.

---

## 7. Camera & Controls

- **Shared controller:** WASD / arrow keys + mouse-look on desktop; on-screen joystick + drag on touch.
- **Toggle button** switches first ↔ third person (keybind `V` + on-screen button).
  - Third-person: camera orbits behind/above character; character model visible & animated.
  - First-person: camera at character "head" bone; model hidden.
- Collision prevents walking through buildings; invisible boundary keeps player inside the city.
- Smooth camera damping; no motion-sickness-inducing snap.

---

## 8. UI / HUD (2D overlay over the canvas)

- **Persistent top-right:** "⏭ Skip → Resume / Info" button → opens a clean 2D modal with all portfolio info + resume download (the recruiter fast-path; effectively the old flat site as a fallback).
- **Persistent control:** first/third-person toggle, mute (if ambient audio added), reset position.
- **Proximity prompts:** "Press E / tap to view" when near an interactive object.
- **Loading screen:** themed progress bar (asset preload) with a tip/quote while GLBs load.
- **Mobile detection:** if low-power device, offer "Lite mode" (reduced effects) or route straight to the 2D info modal.

---

## 9. Performance Budget & Graceful Degradation

- Target: **first interactive < ~10s** on broadband desktop; **60fps** desktop, **≥30fps** mid mobile.
- Techniques: Draco compression, texture atlasing, instancing for repeated props, baked lighting where possible, frustum culling, LODs for heavy models, lazy-load distant districts, capped pixel ratio, fog to cut draw distance.
- **Tiered quality:** auto-detect → High / Medium / Lite. Lite disables postprocessing + shadows.
- Hard fallback: if WebGL unavailable or device too weak → render the **2D info modal** (no broken experience ever).

---

## 10. Proposed Project Structure

```
/ (new app lives in subfolder or replaces site — decide in plan)
  /city3d
    index.html
    package.json
    vite.config.ts
    /public/assets/        # GLB models, HDRIs, textures (downloaded by Vinayak)
    /src
      main.tsx
      App.tsx
      /scene
        City.tsx           # root scene, lighting, sky, fog, postprocessing
        Districts/*.tsx     # Gateway, Temple, ArtisansQuarter, ProjectShrines, Scriptorium, Ghats, BellTower
      /player
        PlayerController.tsx
        CameraRig.tsx       # first/third-person toggle
      /components
        Hologram.tsx
        InfoPanel.tsx
        ProximityPrompt.tsx
      /journey
        waypoints.ts
        JourneySystem.tsx
      /ui
        HUD.tsx
        SkipResumeModal.tsx
        LoadingScreen.tsx
      /state
        useStore.ts        # zustand
      /data
        content.ts         # all portfolio text/links in ONE file (no hardcoding in components)
    CREDITS.md             # asset attributions + licenses
```

- **All portfolio content centralized in `src/data/content.ts`** (skills, projects, essays, education, contact) — no hardcoded copy scattered in components.

---

## 11. Build Phases (for the implementation plan / `/loop`)

1. **Scaffold** — Vite + React + TS + R3F + drei + zustand; blank canvas renders; deploy pipeline smoke-test.
2. **Player & camera** — controller, collision, first/third-person toggle, Mixamo animations.
3. **Environment & art direction** — ground, sky/HDRI, fog, lighting, postprocessing color grade (Raji look) using placeholder + free assets.
4. **City blockout** — place all 7 districts with placeholder geometry; navigation works end-to-end.
5. **Content system** — `content.ts`, InfoPanel, ProximityPrompt, Scriptorium links to existing articles/PDFs.
6. **Hologram system** — `<Hologram>` shader + project shrines wired to project data.
7. **Journey reveal** — waypoints, phase state, captions, progressive lighting/reveal, guiding diyas.
8. **HUD & escape hatch** — Skip→Resume modal, toggles, loading screen.
9. **Asset swap** — replace placeholders with downloaded free stylized models (Vinayak provides per the asset shopping list).
10. **Performance & degradation** — quality tiers, mobile/Lite mode, WebGL fallback, optimization pass.
11. **Polish & deploy** — audio (optional), final color grade, credits, deploy to live URL, link from existing site.

---

## 12. Asset Shopping List (for Vinayak to download — exact links provided during build)

- 1 stylized character (rigged) + Mixamo idle/walk/run.
- Ancient Indian temple / city building set (stylized, CC0/CC-BY).
- Props: pillars, arches/torana, diyas/lamps, manuscripts, bells, market stalls, trees/foliage.
- 1 dusk/golden-hour HDRI (Poly Haven).
- Stone/ground PBR textures (Poly Haven).
- (Optional) small models per project for holograms, else stylized panels.

---

## 13. Open Questions to resolve in planning

- Does the new 3D app **replace** the current `index.html` site, or live at `/city3d` with the current site as the "Lite/2D" fallback? (Recommended: keep current site as the 2D fallback the Skip button opens.)
- Physics engine: Rapier vs custom raycast collision (perf vs simplicity).
- Ambient audio yes/no (sitar/temple ambience adds a lot but is optional).
- Exact chronological phase copy for the journey narrative (needs Vinayak's real timeline dates).

---

## 14. Success Criteria

- Opens from a single URL; interactive in ~10s on desktop.
- Visitor can explore the city in first OR third person, toggle freely.
- All 7 districts present and surface the correct content.
- Projects shown as holograms (never flat 2D cards).
- Journey reveals in chronological phases as the player advances.
- "Skip → Resume / Info" always available and works on any device.
- Cohesive Raji-style look; runs ≥30fps on mid mobile (or cleanly falls back).
- All assets free & credited in `CREDITS.md`.
```

# System Design Academy

An animated, zero-to-advanced **System Design** course — **13 sections · 45 concepts**, each with a live SVG animation, key mechanics, and a real-world use case. Built with **Vite + React**.

This is the modular build of the original single-file `SystemDesignAcademy.jsx`: every section, animation, and UI piece is now its own module.

## Getting started

```bash
npm install
npm run dev      # start the dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
├── main.jsx                 # React entry point
├── App.jsx                  # owns all state; composes Header + Sidebar + LessonView
├── theme.js                 # colors (C) + font stacks (mono, display)
│
├── lib/
│   └── animation.js         # useTick (rAF clock), ease, L (lerp)
│
├── components/
│   ├── GlobalStyles.jsx     # fonts, scrollbars, hover styles
│   ├── primitives.jsx       # SVG building blocks: Stage, N, D, K, T
│   ├── Header.jsx           # brand + search + progress meter
│   ├── Sidebar.jsx          # collapsible section nav with completion ticks
│   ├── AnimationFrame.jsx   # "browser window" chrome + play/pause around an animation
│   └── LessonView.jsx       # title, animation, mechanics, use case, nav
│
├── animations/              # 44 SVG animations, grouped by section
│   ├── index.js             # ANIM registry: anim key → component
│   ├── networking.jsx       # ip · dns · cs · proxy · lb · gw · cdn
│   ├── protocols.jsx        # tcpudp · http · rest · realtime · modernapi
│   ├── architecture.jsx     # tiers · micro · eventdriven
│   ├── web.jsx              # session · serial · cors
│   ├── scalability.jsx      # scaling · autoscale
│   ├── storage.jsx         # cap · sqlnosql · shardrep · object · dfs · bigdata
│   ├── performance.jsx      # cache · queue · concur · index
│   ├── reliability.jsx      # ha · backup · dr
│   ├── security.jsx         # auth · encrypt · netsec
│   ├── designs.jsx         # blueprint · urlshort · ticket
│   └── bonus.jsx           # idempotent · consensus · bloom · ratelimit · breaker
│
├── sections/                # curriculum content, ONE FILE PER SECTION
│   ├── 01-networking.js
│   ├── 02-protocols.js
│   ├── 03-architecture.js
│   ├── 04-web.js
│   ├── 05-scalability.js
│   ├── 06-storage.js
│   ├── 07-performance.js
│   ├── 08-reliability.js
│   ├── 09-security.js
│   ├── 10-blueprint.js
│   ├── 11-url-shortener.js
│   ├── 12-ticketing.js
│   └── 13-bonus.js
│
└── data/
    └── curriculum.js        # imports the 13 sections + flattenCurriculum() helper
```

## How to extend it

- **Add a concept** → add a lesson object to the relevant `src/sections/NN-*.js` file. Set its `anim` to a key in the `ANIM` registry.
- **Add a new animation** → write an `export function A_yourthing()` in the matching `src/animations/*.jsx` file, then register it in `src/animations/index.js`.
- **Add a whole section** → create `src/sections/14-yourtopic.js`, then import + append it in `src/data/curriculum.js`.
- **Restyle** → all colors and fonts live in `src/theme.js`.

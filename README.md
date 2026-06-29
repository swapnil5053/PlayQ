# ArcadeFlow

ArcadeFlow is a mobile application built with React and Vite, packaged as a native Android and iOS app via Natively.io. It digitises the physical arcade experience — replacing token systems and physical queues with virtual queue management, live score tracking, interactive maps, and a Gemini-powered in-app concierge.

The app is built as a Progressive Web App wrapped in a native shell. The frontend is a single-page React application; the backend is a Node.js/Express server handling queue state via Socket.IO, score persistence via Firebase Firestore, and AI responses via the Gemini API.

## Problem statement

Arcades are a bad queueing experience by default. Lines form physically around whichever machine is popular, there's no way to know your wait time without standing in it, and operators have no visibility into which machines are actually busy versus just look busy. ArcadeFlow moves the queue into software: position and wait time become data the app can show and update in real time, the floor map becomes something you can check before walking over, and a player's history and rank become things they can look back on instead of losing the moment they walk away from a machine.

## Architecture

The repo is an npm-workspaces monorepo with two apps under `apps/`: `web` (the frontend) and `api` (the backend). They communicate over plain REST plus a Socket.IO channel for queue position updates.

**Frontend -- `apps/web`.** React 18 on Vite, written in plain JavaScript (no TypeScript, no build-time type checking). Routing is React Router v6 with lazy-loaded screens and a `framer-motion`-driven page transition wrapper. Global app state -- current user, active game, queue state, favourites, toasts -- lives in a single Zustand store (`src/store/useAppStore.js`). Server data (game lists, leaderboards, score history) goes through React Query, which gives free caching and refetching without hand-rolled loading-state plumbing. Styling is CSS Modules exclusively; there's no Tailwind or styled-components in the project, so every component's classes live in a co-located `.module.css` file and the entire design system -- colors, spacing, type, radii, shadows -- is centralized as CSS variables in `src/theme/tokens.css`. The arcade floor map is `react-leaflet` over CartoDB's dark tile set, chosen specifically because it needs no API key and no billing account, which matters for a project meant to run with zero paid dependencies out of the box.

**Backend -- `apps/api`.** Express, talking to Firebase Firestore for persistence and Firebase Auth (via ID tokens verified in middleware) for identifying users. The existing route files and the server entry point were treated as fixed: this rebuild only adds new files, it doesn't rewrite the auth, games, queue, scores, concierge, or session routes that were already there. The one change to `src/index.js` wraps the existing Express `app` in a raw `http.createServer` and attaches a Socket.IO server to it, so the queue screen can get pushed position updates (`queue:${gameId}` rooms) instead of polling. The Virtual Concierge endpoint calls Google's Gemini API when `GEMINI_API_KEY` is set, and falls back to a canned-but-relevant response when it isn't, so the chat feature still works in a fresh checkout with no keys configured.

**Why this split.** Keeping queue/score/auth logic entirely server-side (rather than, say, computing queue position client-side) means multiple devices joining the same queue stay consistent, and a future kiosk or admin view could read the same Firestore data without re-implementing client logic.

## Technology choices

- **JavaScript over TypeScript:** the original codebase was TypeScript; this rebuild is intentionally plain JS per the project's spec, prioritizing speed of iteration on a project of this size over compile-time type safety.
- **CSS Modules over Tailwind:** Tailwind is fast to write but tends to produce illegible class soup in JSX and makes a "design system" implicit in scattered utility classes. CSS Modules plus a single `tokens.css` keeps the design system in one place and keeps component markup readable.
- **Zustand over Redux:** the global state here is small (current user, one active game, queue status, favourites, toasts) -- Zustand gives a single hook-based store without actions/reducers/boilerplate.
- **React Query over hand-written fetch + useEffect:** leaderboards, score history, and game details are all server data with the same shape of problem (loading state, caching, refetch-on-stale). React Query solves that once instead of five times.
- **Socket.IO over polling:** queue position needs to feel live. A short-interval poll would work but wastes requests; a room-per-game socket model pushes updates only when the room's occupancy actually changes.
- **react-leaflet + CartoDB tiles over Google Maps/Mapbox:** no API key, no billing account, no quota to hit during a demo. The tradeoff is a less polished default basemap, addressed with the dark tile theme and custom marker icons.
- **Firebase (Auth + Firestore) over a self-hosted database:** this was inherited from the existing backend and kept as-is -- it's the lowest-friction way to get auth and a document database running without provisioning infrastructure, and the app is written to degrade gracefully (mock data fallback) when Firebase isn't configured at all.

## Local setup

From the repository root:

```bash
npm install -w apps/web
npm install -w apps/api
```

(Run `npm install` from the repo root, not from inside `apps/web` or `apps/api` directly -- the root `package.json` declares npm workspaces, and npm's workspace-aware install commands only work when invoked from the root.)

Copy the environment templates and fill in real values where you have them:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```

`apps/web/.env` takes Firebase web config (`VITE_FIREBASE_*`) and `VITE_API_BASE_URL`, which should point at wherever the API is running (`http://localhost:4000` by default). `apps/api/.env` takes `GEMINI_API_KEY` for the concierge and a few other values; without Firebase Admin credentials configured (see `apps/api/firebase-service-account.json.example` for the expected shape), the backend's Firestore-backed routes won't have anything to talk to, but the frontend will still run against its built-in mock data.

Start both apps in separate terminals:

```bash
cd apps/api && npm start
cd apps/web && npm run dev
```

The web app (Vite) runs on port 3000 and the API runs on port 4000 by default -- if you change one port, update `VITE_API_BASE_URL` in `apps/web/.env` to match.

## Project structure

```text
ArcadeFlow/
├── apps/
│   ├── api/                       # Express backend
│   │   └── src/
│   │       ├── routes/            # REST endpoints (auth, games, queue, scores, concierge, session)
│   │       ├── middleware/        # verifyToken / verifyAdmin
│   │       ├── services/          # firebaseAdmin init
│   │       ├── socket/            # queueHandler.js -- Socket.IO room logic (new)
│   │       └── index.js           # entry point (existing routes untouched, sockets added)
│   └── web/                       # React + Vite frontend
│       └── src/
│           ├── theme/tokens.css   # design tokens (colors, spacing, type, shadows)
│           ├── store/             # Zustand global store
│           ├── services/          # api.js, firebase.js, gemini.js
│           ├── data/              # mock data fallback
│           ├── hooks/             # React Query hooks + queue socket hook
│           ├── components/        # shared + primitive (Button, BottomSheet, Badge, NavBar...)
│           ├── screens/           # one folder per screen, each with its .module.css
│           └── router/            # React Router v6 route table
└── package.json                   # npm workspaces root
```

## Known limitations

There's no automated test suite -- verification for this rebuild was a manual walkthrough of every nav tab and flow plus a production `vite build` to catch compile errors, not unit or integration tests. The "AR navigation" on the map screen is a directional placeholder (an arrow and a distance estimate), not real camera-based AR. Queue position progression is simulated client-side once a player joins (ticking down on a timer) rather than reflecting other real players actually being served, since there's no real arcade hardware in the loop to drive it. Firebase is optional at the code level -- the app falls back to mock data without it -- but that also means a backend running with no Firebase credentials configured will silently serve nothing real for any persisted data; it's not a bug your build will catch, but a "do I want to wire this up" decision.

## Credits

UI/UX design by [Phalak Bhandari](https://www.behance.net/phalakbhandari1) — user flows, wireframes, usability testing, and design system.  
Engineering by [Swapnil](https://github.com/swapnil5053) — frontend architecture, backend API, real-time queue system, and Firebase/Gem
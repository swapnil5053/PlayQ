# ArcadeFlow

A mobile app that digitises the arcade floor experience: virtual queues instead of physical lines, live wait times, an interactive arcade map, score tracking, and a Gemini-powered in-app concierge. Built with React + Vite, packaged as a native Android/iOS app via Natively.io.

**Problem:** Arcades run on physical lines and guesswork — no way to know your wait time without standing in it, no visibility into which machines are actually busy. ArcadeFlow turns that into data: live queue position, a map you can check before walking over, and score history you don't lose the moment you leave a machine.

## Tech stack

**Frontend** (`apps/web`) — React 18, Vite, plain JavaScript. React Router v6 with lazy-loaded routes and `framer-motion` page transitions. Zustand for global state, React Query for server data (caching/refetch handled for free). CSS Modules + a single `tokens.css` design-token file — no Tailwind. `react-leaflet` with CartoDB dark tiles for the arcade map (no API key required).

**Backend** (`apps/api`) — Node.js/Express, Firebase Firestore for persistence, Firebase Auth for identity, Socket.IO for live queue position pushes (room-per-game, no polling). The concierge endpoint calls the Gemini API when a key is configured, otherwise falls back to a relevant canned response — the chat still works on a fresh checkout with zero keys set.

**Key decisions:**
- Zustand over Redux — state here is small (user, active game, queue, favourites, toasts), doesn't need the boilerplate.
- Socket.IO over polling — queue position needs to feel live without wasting requests.
- react-leaflet/CartoDB over Google Maps/Mapbox — no API key or billing account needed for a demo.
- Firebase optional at the code level — the app degrades to mock data if it's not configured, so it always runs.

## Local setup

```bash
npm install -w apps/web
npm install -w apps/api
```
Run from the repo root — it's an npm workspaces monorepo, so workspace installs only work from there.

```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```
Fill in Firebase web config + `VITE_API_BASE_URL` in `apps/web/.env`, and `GEMINI_API_KEY` + Firebase Admin credentials in `apps/api/.env` (see `apps/api/firebase-service-account.json.example` for the expected shape). Without Firebase Admin set up, the frontend still runs on its built-in mock data.

```bash
cd apps/api && npm start    # :4000
cd apps/web && npm run dev  # :3000
```

## Project structure

```text
ArcadeFlow/
├── apps/
│   ├── api/                 # Express backend
│   │   └── src/
│   │       ├── routes/      # auth, games, queue, scores, concierge, session
│   │       ├── middleware/  # verifyToken / verifyAdmin
│   │       ├── services/    # firebaseAdmin init
│   │       └── socket/      # queueHandler.js — Socket.IO room logic
│   └── web/                 # React + Vite frontend
│       └── src/
│           ├── theme/       # tokens.css — design system
│           ├── store/       # Zustand global store
│           ├── services/    # api.js, firebase.js, gemini.js
│           ├── hooks/       # React Query hooks + queue socket hook
│           ├── components/  # shared + primitive UI
│           ├── screens/     # one folder per screen
│           └── router/      # React Router v6 route table
└── package.json             # npm workspaces root
```

## Known limitations

No automated test suite — verified manually plus a production `vite build`. Map "AR navigation" is a directional arrow + distance estimate, not camera-based AR. Queue position ticks down on a client-side timer rather than reflecting real players being served, since there's no real arcade hardware in the loop. Running the backend with no Firebase credentials means persisted data routes won't return anything real — by design, not a bug.

## Credits

UI/UX design by [Phalak Bhandari](https://www.behance.net/phalakbhandari1) — user flows, wireframes, usability testing, design system.
Engineering by [Swapnil](https://github.com/swapnil5053) — frontend architecture, backend API, real-time queue system, Firebase/Gemini integration.

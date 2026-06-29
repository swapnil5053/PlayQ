# ArcadeFlow

Digital queue management, live wait times, and an arcade floor map for physical arcades — built with React, Node.js, and Firebase.

## About

Arcades run on physical lines and guesswork — there's no way to know your wait time without standing in it, and no visibility into which machines are actually busy. ArcadeFlow replaces that with software: live queue position, a map you can check before walking over, and score history you don't lose the moment you leave a machine.

The app is a React PWA packaged into a native Android/iOS shell via Natively.io, backed by an Express API.

## Features

- **Virtual queueing** — join a queue from your phone, see live position and estimated wait, get pushed updates over Socket.IO instead of polling.
- **Arcade floor map** — interactive map of machines and zones, built on `react-leaflet` with a dark CartoDB tile set.
- **Score tracking & leaderboards** — score history per player, per-game leaderboards, personal bests.
- **AI concierge** — a Gemini-powered in-app chat that answers questions about games, wait times, and the arcade itself.
- **Auth** — Firebase Authentication, with the rest of the app degrading gracefully to mock data if Firebase isn't configured.

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React 18, Vite, React Router v6, Zustand, React Query, CSS Modules, `react-leaflet` |
| Backend | Node.js, Express, Socket.IO |
| Data & Auth | Firebase Firestore, Firebase Authentication |
| AI | Google Gemini API |

**Why these:**
- **Zustand over Redux** — global state is small (user, active game, queue, favourites, toasts); doesn't need the boilerplate.
- **React Query** — leaderboards, score history, and game details are all server data with the same caching/refetch needs; solved once instead of per-screen.
- **CSS Modules over Tailwind** — keeps the design system centralized in one `tokens.css` file instead of scattered utility classes.
- **Socket.IO over polling** — queue position needs to feel live without wasting requests.
- **react-leaflet + CartoDB over Google Maps/Mapbox** — no API key or billing account required to run the project.

## Getting started

### Prerequisites
- Node.js 18+
- A Firebase project (optional — the app runs on mock data without one)
- A Gemini API key (optional — the concierge falls back to canned responses without one)

### Installation

```bash
git clone https://github.com/swapnil5053/ArcadeFlow.git
cd ArcadeFlow
npm install -w apps/web
npm install -w apps/api
```

> Run installs from the repo root — this is an npm workspaces monorepo, so workspace installs only work from there.

### Configuration

```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```

- `apps/web/.env` — Firebase web config (`VITE_FIREBASE_*`) and `VITE_API_BASE_URL` (defaults to `http://localhost:4000`)
- `apps/api/.env` — `GEMINI_API_KEY` and Firebase Admin credentials (see `apps/api/firebase-service-account.json.example` for the expected shape)

### Run locally

```bash
cd apps/api && npm start    # API on :4000
cd apps/web && npm run dev  # Web app on :3000
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

- No automated test suite — verified manually plus a production `vite build`.
- Map "AR navigation" is a directional arrow + distance estimate, not camera-based AR.
- Queue position ticks down on a client-side timer rather than reflecting real players being served, since there's no real arcade hardware in the loop.
- Running the backend with no Firebase credentials means persisted-data routes won't return anything real — by design, not a bug.

## Credits

- UI/UX design — [Phalak Bhandari](https://www.behance.net/phalakbhandari1): user flows, wireframes, usability testing, design system.
- Engineering — [Swapnil](https://github.com/swapnil5053): frontend architecture, backend API, real-time queue system, Firebase/Gemini integration.

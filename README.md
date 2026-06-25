# ArcadeFlow

ArcadeFlow is a comprehensive mobile and web application designed to modernize the physical arcade experience. Built as my inaugural full-stack project, this application replaces traditional token-and-line systems with a digital infrastructure offering real-time virtual queueing, interactive mapping, and live session tracking. During the development process, AI-assisted coding tools were utilized to accelerate prototyping and implement complex architecture patterns, reflecting a modern approach to software engineering and rapid iteration.

## Architecture and Technology Stack

The project is structured as a monorepo, separating the client applications from the backend services to ensure scalability and maintainability.

### Frontend (Mobile & Web)
- **Frameworks**: React Native (Expo) for mobile, React 18 for web.
- **Routing**: React Navigation (Mobile), TanStack Router (Web).
- **State Management**: Zustand for global state, TanStack Query for server state.
- **Styling**: React Native StyleSheet, Tailwind CSS (Web).
- **Real-time Client**: Socket.IO Client.

### Backend (API)
- **Runtime**: Node.js with Express.js.
- **Database**: Firebase Firestore for cloud-native NoSQL data storage.
- **Real-time Server**: Socket.IO for WebSocket connections.
- **Authentication**: Firebase Authentication.
- **Integrations**: Google Generative AI (Gemini) for the Virtual Concierge service.

## Use Case & Problem Statement

**The Problem:** Traditional arcade venues suffer from high friction. Customers spend excessive time physically waiting in lines, managing physical tokens or tickets, and navigating chaotic, crowded spaces. For operators, there is limited real-time visibility into machine utilization, crowd bottlenecks, or player engagement.

**The Solution:** ArcadeFlow acts as a digital layer over the physical arcade. By allowing users to join virtual queues from their phones, track their progress in real-time, and locate available machines via interactive maps, the platform eliminates physical lines. Operators benefit from digitized metrics, and users enjoy a frictionless, gamified "theme park in your pocket" experience.

## Frontend Design Case Study

During the UI/UX development phase, the frontend architecture underwent a significant case study in balancing functional utility with an engaging, arcade-style aesthetic.
- **Initial Iteration:** The early UI relied heavily on generic components, standard border radii, and safe, muted color palettes. This led to user feedback that the app felt "sterile" or "made by AI."
- **Design Evolution:** To resolve this, a bespoke design system was integrated via a centralized `theme.js` file. The interface shifted to a dynamic, neon-accented dark mode (`COLORS.background` mapped to deep purples/blacks, with vibrant `COLORS.accent` for CTAs).
- **Interactive Elements:** Static lists were replaced with interactive, skeuomorphic-inspired cards. A custom `Hoverable` Higher-Order Component (HOC) was implemented to provide tactile micro-animations (scale and lift effects) when users interacted with game listings. 
- **User Hub Overhaul:** The account settings page was reimagined into a "Player Hub," gamifying the experience by placing Wallet Balances, a Rewards Dashboard with progress tracking, and Achievement Badges front and center.

## Core Features

- **Virtual Queue Management**: Players can join queues remotely via the application, receive real-time estimated wait times, and track their position dynamically without needing to physically stand in line.
- **Interactive Arcade Map**: A visual representation of the arcade floor featuring live heat maps for crowd density and an augmented reality (AR) navigation prototype.
- **Player Hub & Wallet**: A centralized dashboard tracking a user's arcade wallet balance, rewards progression, recent sessions, and unlockable achievements.
- **Global Leaderboards**: Real-time per-game ranking systems allowing players to compare their statistics against top performers globally.
- **Virtual Concierge**: An integrated support chat utilizing a tailored conversational model to assist users with navigation, queue management, and general inquiries.

## Local Development Setup

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn
- Expo CLI
- Firebase Project setup

### Installation

1. Clone the repository and install dependencies across the monorepo:
```bash
npm install
```

2. Configure environment variables. Create a `.env` file in both `apps/api` and `apps/mobile` containing your Firebase and API configurations:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
```

3. Start the backend API service:
```bash
cd apps/api
npm start
```

4. Start the frontend application (Mobile/Web):
```bash
cd apps/mobile
npm run web
```
*Note: The frontend can also be run on iOS or Android simulators using `npm run ios` or `npm run android`.*

## Project Structure

```text
arcade-flow/
├── apps/
│   ├── api/                  # Express Node.js backend
│   │   ├── src/
│   │   │   ├── routes/       # API endpoints (Queue, AI, Games)
│   │   │   ├── middleware/   # Authentication and validation
│   │   │   └── index.js      # Server entry point
│   │   └── package.json
│   └── mobile/               # React Native (Expo) frontend
│       ├── src/
│       │   ├── components/   # Reusable UI components
│       │   ├── navigation/   # React Navigation stacks
│       │   ├── screens/      # Application views
│       │   ├── services/     # API clients and Firebase config
│       │   └── theme.js      # Global design system
│       └── package.json
└── package.json              # Monorepo root
```

## Professional Development Outcomes

Developing ArcadeFlow provided practical experience in constructing a full-stack distributed system. Key learning outcomes include managing real-time data flow with WebSockets, structuring a scalable React Native codebase, integrating third-party APIs (Firebase, Google AI), and designing user-centric interfaces. The utilization of AI assistance throughout the development cycle demonstrated proficiency in modern tooling to optimize productivity and resolve complex debugging scenarios.

## Credits

- **Frontend UI/UX Design**: [Phalak Bhandari](https://www.behance.net/phalakbhandari1)

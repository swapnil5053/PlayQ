export type CrowdLevel = "low" | "medium" | "high";

export interface Game {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  rating: number;
  waitTime: number;
  crowdLevel: CrowdLevel;
  players: number;
  hue: number;
  description: string;
  popular: boolean;
  avgScore: number;
}

export const games: Game[] = [
  {
    id: "neon-racer",
    title: "Neon Racer",
    category: "Racing",
    difficulty: "Hard",
    tags: ["Action", "Hard"],
    rating: 4.8,
    waitTime: 5,
    crowdLevel: "low",
    players: 6,
    hue: 290,
    description:
      "Burn rubber through a synthwave cityscape. Drift through neon traffic and beat the clock in this high-octane racer.",
    popular: true,
    avgScore: 18400,
  },
  {
    id: "zombie-blast",
    title: "Zombie Blast",
    category: "Shooter",
    difficulty: "Medium",
    tags: ["Action", "Medium"],
    rating: 4.5,
    waitTime: 10,
    crowdLevel: "low",
    players: 9,
    hue: 150,
    description:
      "Survive endless waves of the undead. Aim fast, reload faster, and rack up the highest combo on the floor.",
    popular: true,
    avgScore: 12750,
  },
  {
    id: "pixel-punch",
    title: "Pixel Punch",
    category: "Fighting",
    difficulty: "Hard",
    tags: ["Fighting", "Hard"],
    rating: 4.7,
    waitTime: 25,
    crowdLevel: "high",
    players: 18,
    hue: 25,
    description:
      "Old-school brawler with pixel-perfect combos. Climb the ranks and become the arcade champion.",
    popular: true,
    avgScore: 9800,
  },
  {
    id: "star-voyage",
    title: "Star Voyage",
    category: "Arcade",
    difficulty: "Easy",
    tags: ["Arcade", "Easy"],
    rating: 4.3,
    waitTime: 15,
    crowdLevel: "medium",
    players: 12,
    hue: 262,
    description:
      "Pilot your ship through asteroid fields and alien fleets. A cosmic shoot-'em-up for all ages.",
    popular: false,
    avgScore: 21300,
  },
  {
    id: "puzzle-quest",
    title: "Puzzle Quest",
    category: "Puzzle",
    difficulty: "Medium",
    tags: ["Puzzle", "Medium"],
    rating: 4.6,
    waitTime: 5,
    crowdLevel: "low",
    players: 4,
    hue: 200,
    description:
      "Match, swap, and solve your way through 100 brain-bending levels under pressure.",
    popular: false,
    avgScore: 15600,
  },
  {
    id: "drift-king",
    title: "Drift King",
    category: "Racing",
    difficulty: "Hard",
    tags: ["Racing", "Hard"],
    rating: 4.9,
    waitTime: 30,
    crowdLevel: "high",
    players: 22,
    hue: 320,
    description:
      "Master the art of the drift across mountain passes and city streets. Precision is everything.",
    popular: true,
    avgScore: 27500,
  },
];

export const gameById = (id: string) => games.find((g) => g.id === id) ?? games[0];

export const crowdLabel: Record<CrowdLevel, string> = {
  low: "Low crowd",
  medium: "Medium crowd",
  high: "High crowd",
};

export const user = {
  displayName: "Player",
  level: 12,
  totalPoints: 48200,
};

export const leaderboard = [
  { rank: 1, name: "AcePilot", score: 27500 },
  { rank: 2, name: "NovaQueen", score: 24100 },
  { rank: 3, name: "RetroRex", score: 21980 },
  { rank: 4, name: "ByteBandit", score: 19840 },
  { rank: 5, name: "GhostRider", score: 18200 },
  { rank: 9, name: "You", score: 14760, isUser: true },
];

export const scoreHistory = [
  { date: "Jun 21", score: 14760 },
  { date: "Jun 18", score: 13200 },
  { date: "Jun 15", score: 11900 },
  { date: "Jun 12", score: 12400 },
  { date: "Jun 09", score: 9800 },
  { date: "Jun 05", score: 8600 },
];

export const friends = [
  { id: "f1", name: "NovaQueen", score: 24100 },
  { id: "f2", name: "RetroRex", score: 13200 },
  { id: "f3", name: "ByteBandit", score: 9840 },
];

export const summary = {
  gamesPlayed: 7,
  bestScore: 14760,
  totalTime: "2h 35m",
  message:
    "Incredible run today! You beat your personal best twice and climbed 3 spots on the leaderboard.",
};

export const dailyHigh = {
  value: 27500,
  game: gameById("drift-king"),
};

export const rewards = [
  { id: "r1", name: "First Win", earned: true, icon: "trophy" },
  { id: "r2", name: "Combo King", earned: true, icon: "zap" },
  { id: "r3", name: "Night Owl", earned: true, icon: "moon" },
  { id: "r4", name: "Sharpshooter", earned: false, icon: "target" },
  { id: "r5", name: "Marathon", earned: false, icon: "timer" },
  { id: "r6", name: "Legend", earned: false, icon: "crown" },
];

export const faqs = [
  {
    q: "How do virtual queues work?",
    a: "Join a queue from any game's detail screen. You'll see your live position and a countdown until it's your turn — no standing in line.",
  },
  {
    q: "Can I leave a queue after joining?",
    a: "Yes. Open the Queue Status screen and tap Leave Queue. You'll be asked to confirm before losing your spot.",
  },
  {
    q: "How are scores tracked?",
    a: "Every session is saved to your profile. View trends in Score History and compete on per-game leaderboards.",
  },
  {
    q: "How do I compare with friends?",
    a: "After finishing a game, tap Compare, then pick a friend or scan their QR code for a side-by-side breakdown.",
  },
];

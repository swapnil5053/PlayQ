export const GAME_GRADIENTS = {
  'dragon-strike':   'linear-gradient(135deg, #1a0a05 0%, #7c2d12 100%)',
  'racing-thunder':  'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
  'rhythm-beat':     'linear-gradient(135deg, #0d1117 0%, #134e4a 50%, #0f3d3a 100%)',
  'zombie-survival': 'linear-gradient(135deg, #0f0f0f 0%, #1a2e1a 100%)',
  'sky-pilot':       'linear-gradient(135deg, #0a0e27 0%, #0c1445 50%, #1a237e 100%)',
  'basketball-pro':  'linear-gradient(135deg, #1a0a00 0%, #3d1c00 100%)',
};

export const MOCK_GAMES = [
  {
    id: 'dragon-strike',
    name: 'Dragon Strike VR',
    genre: 'Action',
    difficulty: 'Hard',
    waitTime: 15,
    popularity: 92,
    rating: 4.8,
    thumbnail: null,
    zone: 'Zone A',
    description: 'Wield a photon blade against waves of mechanized dragons in full 360° VR. Combo chains build your multiplier -- the higher you climb, the harder they hit back.',
  },
  {
    id: 'racing-thunder',
    name: 'Racing Thunder',
    genre: 'Racing',
    difficulty: 'Medium',
    waitTime: 8,
    popularity: 78,
    rating: 4.5,
    thumbnail: null,
    zone: 'Zone B',
    description: 'Eight circuits, force-feedback steering wheels, and a drafting system that rewards patience. The final lap is always different.',
  },
  {
    id: 'rhythm-beat',
    name: 'Rhythm Beat',
    genre: 'Music',
    difficulty: 'Easy',
    waitTime: 5,
    popularity: 95,
    rating: 4.9,
    thumbnail: null,
    zone: 'Zone A',
    description: 'Hit pads in time with tracks from three decades of arcade music. Beginner-friendly on the surface, brutally difficult at Expert.',
  },
  {
    id: 'zombie-survival',
    name: 'Zombie Survival',
    genre: 'Shooter',
    difficulty: 'Hard',
    waitTime: 20,
    popularity: 88,
    rating: 4.7,
    thumbnail: null,
    zone: 'Zone C',
    description: 'Co-op light-gun shooter for up to four players. Ammo is finite, your friends are unreliable, and wave 12 is a wall.',
  },
  {
    id: 'sky-pilot',
    name: 'Sky Pilot',
    genre: 'Simulation',
    difficulty: 'Medium',
    waitTime: 12,
    popularity: 60,
    rating: 4.6,
    thumbnail: null,
    zone: 'Zone B',
    description: 'Sit-down flight simulator with a motion seat and stick controls. Land on a carrier deck in storm conditions to unlock the bonus campaign.',
  },
  {
    id: 'basketball-pro',
    name: 'Basketball Pro',
    genre: 'Sports',
    difficulty: 'Easy',
    waitTime: 3,
    popularity: 70,
    rating: 4.4,
    thumbnail: null,
    zone: 'Zone C',
    description: 'Precision shooting challenge with a real ball and a sensor-tracked hoop. Thirty seconds, as many baskets as you can sink.',
  },
];

export const MOCK_ZONES = [
  { id: 'zone-a', name: 'Zone A -- Arcade Core', lat: 12.9721, lng: 77.5950, crowd: 'high', gameIds: ['dragon-strike', 'rhythm-beat'] },
  { id: 'zone-b', name: 'Zone B -- Racing Bay', lat: 12.9712, lng: 77.5942, crowd: 'medium', gameIds: ['racing-thunder', 'sky-pilot'] },
  { id: 'zone-c', name: 'Zone C -- Sports & Survival', lat: 12.9715, lng: 77.5953, crowd: 'low', gameIds: ['zombie-survival', 'basketball-pro'] },
];

export const MOCK_LEADERBOARD = {
  'dragon-strike': [
    { userId: 'u1', name: 'Vikram S', score: 9840 },
    { userId: 'u2', name: 'Priya K', score: 9210 },
    { userId: 'mock-user-1', name: 'Aarav', score: 8765 },
    { userId: 'u3', name: 'Rohan T', score: 7990 },
    { userId: 'u4', name: 'Meera D', score: 7400 },
    { userId: 'u5', name: 'Sneha L', score: 6850 },
  ],
  'racing-thunder': [
    { userId: 'u3', name: 'Rohan T', score: 94200 },
    { userId: 'u6', name: 'Karthik V', score: 88500 },
    { userId: 'u1', name: 'Vikram S', score: 81300 },
    { userId: 'mock-user-1', name: 'Aarav', score: 76400 },
    { userId: 'u4', name: 'Meera D', score: 70100 },
  ],
  'rhythm-beat': [
    { userId: 'u2', name: 'Priya K', score: 512400 },
    { userId: 'mock-user-1', name: 'Aarav', score: 498200 },
    { userId: 'u5', name: 'Sneha L', score: 463900 },
    { userId: 'u1', name: 'Vikram S', score: 410800 },
  ],
};

export const MOCK_SCORE_HISTORY = {
  'dragon-strike': [
    { date: 'Jun 10', score: 6200 },
    { date: 'Jun 14', score: 7100 },
    { date: 'Jun 18', score: 6800 },
    { date: 'Jun 22', score: 8200 },
    { date: 'Jun 26', score: 8765 },
  ],
  'racing-thunder': [
    { date: 'Jun 9', score: 58400 },
    { date: 'Jun 15', score: 63100 },
    { date: 'Jun 21', score: 71900 },
    { date: 'Jun 27', score: 76400 },
  ],
};

export const MOCK_FRIENDS = [
  { id: 'u1', name: 'Vikram S', score: 9840 },
  { id: 'u2', name: 'Priya K', score: 9210 },
  { id: 'u3', name: 'Rohan T', score: 7990 },
];

export const MOCK_SESSION = {
  gamesPlayed: 4,
  bestScore: 8765,
  bestGame: 'Dragon Strike VR',
  totalMinutes: 87,
  message: "Strong session. Your Dragon Strike score jumped 22% from last time.",
};

export const MOCK_HIGH_SCORE = {
  gameId: 'dragon-strike',
  gameName: 'Dragon Strike VR',
  score: 9840,
  holder: 'Vikram S',
  yourBest: 8765,
  gap: 1075,
};

export function getGameById(id) {
  return MOCK_GAMES.find((g) => g.id === id);
}

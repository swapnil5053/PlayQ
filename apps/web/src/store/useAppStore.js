import { create } from 'zustand';

let toastId = 0;

export const useAppStore = create((set) => ({
  // --- current user (mock until Firebase auth is wired) ---
  currentUser: {
    uid: 'mock-user-1',
    name: 'Aarav',
    initials: 'AA',
    joinedAt: '2025-01-12',
    walletBalance: 240.0,
  },
  addWalletBalance: (amount) =>
    set((state) => ({
      currentUser: { ...state.currentUser, walletBalance: state.currentUser.walletBalance + amount },
    })),

  // --- auth ---
  authChecked: false,
  isAuthenticated: false,
  setAuthChecked: (val) => set({ authChecked: val }),
  setAuthUser: (user) =>
    set((state) => {
      if (!user) {
        return { isAuthenticated: false };
      }
      const name = user.displayName || state.currentUser.name || 'Player';
      const initials = name
        .split(' ')
        .filter(Boolean)
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'P';
      const joinedAt = user.metadata?.creationTime
        ? user.metadata.creationTime.slice(0, 10)
        : state.currentUser.joinedAt;
      return {
        isAuthenticated: true,
        currentUser: {
          ...state.currentUser,
          uid: user.uid,
          name,
          initials,
          email: user.email,
          joinedAt,
        },
      };
    }),
  logout: () =>
    set({
      isAuthenticated: false,
      currentUser: {
        uid: null,
        name: 'Player',
        initials: 'P',
        joinedAt: null,
        walletBalance: 0,
      },
      favouriteGameIds: [],
      activeGame: null,
      queueState: {
        gameId: null,
        position: null,
        queueLength: null,
        estimatedWaitMinutes: null,
        status: 'idle',
      },
      lastScore: null,
      bestScores: {},
    }),

  // --- favourites ---
  favouriteGameIds: [],
  toggleFavourite: (gameId) =>
    set((state) => ({
      favouriteGameIds: state.favouriteGameIds.includes(gameId)
        ? state.favouriteGameIds.filter((id) => id !== gameId)
        : [...state.favouriteGameIds, gameId],
    })),

  // --- active game / queue state ---
  activeGame: null,
  setActiveGame: (game) => set({ activeGame: game }),

  queueState: {
    gameId: null,
    position: null,
    queueLength: null,
    estimatedWaitMinutes: null,
    status: 'idle', // idle | waiting | almost | turn | left
  },
  setQueueState: (partial) =>
    set((state) => ({ queueState: { ...state.queueState, ...partial } })),
  resetQueueState: () =>
    set({
      queueState: {
        gameId: null,
        position: null,
        queueLength: null,
        estimatedWaitMinutes: null,
        status: 'idle',
      },
    }),

  // --- last score, used to feed GameComplete / Compare / Share ---
  lastScore: null,
  setLastScore: (scoreEntry) => set({ lastScore: scoreEntry }),

  // --- personal bests per game, used for the "New Personal Best" badge ---
  bestScores: {},
  updateBestScore: (gameId, score) =>
    set((state) => ({
      bestScores: { ...state.bestScores, [gameId]: score },
    })),

  // --- toasts ---
  toasts: [],
  pushToast: (message, variant = 'default') => {
    const id = ++toastId;
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 2500);
  },
}));

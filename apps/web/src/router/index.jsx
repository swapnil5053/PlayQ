import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import Skeleton from '../components/ui/Skeleton/Skeleton.jsx';

const AuthScreen = lazy(() => import('../screens/AuthScreen/AuthScreen.jsx'));
const HomeScreen = lazy(() => import('../screens/HomeScreen/HomeScreen.jsx'));
const DiscoverScreen = lazy(() => import('../screens/DiscoverScreen/DiscoverScreen.jsx'));
const GameDetailScreen = lazy(() => import('../screens/GameDetailScreen/GameDetailScreen.jsx'));
const QueueScreen = lazy(() => import('../screens/QueueScreen/QueueScreen.jsx'));
const GameCompleteScreen = lazy(() => import('../screens/GameCompleteScreen/GameCompleteScreen.jsx'));
const MapScreen = lazy(() => import('../screens/MapScreen/MapScreen.jsx'));
const AccountScreen = lazy(() => import('../screens/AccountScreen/AccountScreen.jsx'));
const ScoreHistoryScreen = lazy(() => import('../screens/ScoreHistoryScreen/ScoreHistoryScreen.jsx'));
const LeaderboardScreen = lazy(() => import('../screens/LeaderboardScreen/LeaderboardScreen.jsx'));
const CompareScreen = lazy(() => import('../screens/CompareScreen/CompareScreen.jsx'));
const ShareScreen = lazy(() => import('../screens/ShareScreen/ShareScreen.jsx'));
const TodaySummaryScreen = lazy(() => import('../screens/TodaySummaryScreen/TodaySummaryScreen.jsx'));
const ConciergeScreen = lazy(() => import('../screens/ConciergeScreen/ConciergeScreen.jsx'));
const HighScoreScreen = lazy(() => import('../screens/HighScoreScreen/HighScoreScreen.jsx'));
const FavouritesScreen = lazy(() => import('../screens/FavouritesScreen/FavouritesScreen.jsx'));
const RewardsScreen = lazy(() => import('../screens/RewardsScreen/RewardsScreen.jsx'));
const FamilyModeScreen = lazy(() => import('../screens/FamilyModeScreen/FamilyModeScreen.jsx'));
const TopUpScreen = lazy(() => import('../screens/TopUpScreen/TopUpScreen.jsx'));
const PlanVisitScreen = lazy(() => import('../screens/PlanVisitScreen/PlanVisitScreen.jsx'));
const NotFoundScreen = lazy(() => import('../screens/NotFoundScreen/NotFoundScreen.jsx'));

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

function Page({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{ height: '100%' }}
    >
      {children}
    </motion.div>
  );
}

function RouteFallback() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12, padding: '24px 16px' }}>
      <Skeleton height={120} radius={16} />
      <Skeleton height={14} width="60%" />
      <Skeleton height={14} width="40%" />
    </div>
  );
}

function RequireAuth({ children }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRouter() {
  const location = useLocation();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  return (
    <Suspense fallback={<RouteFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Page><AuthScreen /></Page>}
          />
          <Route path="/" element={<RequireAuth><Page><HomeScreen /></Page></RequireAuth>} />
          <Route path="/discover" element={<RequireAuth><Page><DiscoverScreen /></Page></RequireAuth>} />
          <Route path="/game/:gameId" element={<RequireAuth><Page><GameDetailScreen /></Page></RequireAuth>} />
          <Route path="/queue/:gameId" element={<RequireAuth><Page><QueueScreen /></Page></RequireAuth>} />
          <Route path="/game-complete/:gameId" element={<RequireAuth><Page><GameCompleteScreen /></Page></RequireAuth>} />
          <Route path="/map" element={<RequireAuth><Page><MapScreen /></Page></RequireAuth>} />
          <Route path="/account" element={<RequireAuth><Page><AccountScreen /></Page></RequireAuth>} />
          <Route path="/topup" element={<RequireAuth><Page><TopUpScreen /></Page></RequireAuth>} />
          <Route path="/plan-visit" element={<RequireAuth><Page><PlanVisitScreen /></Page></RequireAuth>} />
          <Route path="/scores/history" element={<RequireAuth><Page><ScoreHistoryScreen /></Page></RequireAuth>} />
          <Route path="/leaderboard" element={<RequireAuth><Page><LeaderboardScreen /></Page></RequireAuth>} />
          <Route path="/compare/:gameId" element={<RequireAuth><Page><CompareScreen /></Page></RequireAuth>} />
          <Route path="/share/:gameId" element={<RequireAuth><Page><ShareScreen /></Page></RequireAuth>} />
          <Route path="/summary" element={<RequireAuth><Page><TodaySummaryScreen /></Page></RequireAuth>} />
          <Route path="/concierge" element={<RequireAuth><Page><ConciergeScreen /></Page></RequireAuth>} />
          <Route path="/high-score" element={<RequireAuth><Page><HighScoreScreen /></Page></RequireAuth>} />
          <Route path="/favourites" element={<RequireAuth><Page><FavouritesScreen /></Page></RequireAuth>} />
          <Route path="/rewards" element={<RequireAuth><Page><RewardsScreen /></Page></RequireAuth>} />
          <Route path="/family" element={<RequireAuth><Page><FamilyModeScreen /></Page></RequireAuth>} />
          <Route path="*" element={<Page><NotFoundScreen /></Page>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

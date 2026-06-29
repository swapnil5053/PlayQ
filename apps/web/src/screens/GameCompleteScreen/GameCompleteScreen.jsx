import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_SCORE_HISTORY } from '../../data/mockGames';
import Button from '../../components/ui/Button/Button.jsx';
import styles from './GameCompleteScreen.module.css';

const CONFETTI_COLORS = ['#F59E0B', '#FBBF24', '#22C55E', '#38BDF8', '#EAB308'];

export default function GameCompleteScreen() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const lastScore = useAppStore((s) => s.lastScore);
  const bestScores = useAppStore((s) => s.bestScores);
  const updateBestScore = useAppStore((s) => s.updateBestScore);
  const score = lastScore?.score ?? 0;
  const rank = lastScore?.rank ?? 1;
  const [displayScore, setDisplayScore] = useState(0);
  const rafRef = useRef(null);

  const history = MOCK_SCORE_HISTORY[gameId] || [];
  const historicalBest = history.length ? Math.max(...history.map((h) => h.score)) : 0;
  const previousBest = Math.max(historicalBest, bestScores[gameId] ?? 0);
  const isNewBest = score > previousBest;

  useEffect(() => {
    if (isNewBest) updateBestScore(gameId, score);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewBest, gameId, score]);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayScore(Math.floor(eased * score));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [score]);

  return (
    <div className={styles.screen}>
      <div className={styles.confettiLayer}>
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className={styles.confettiPiece}
            style={{
              left: `${(i * 97) % 100}%`,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              animationDelay: `${(i % 6) * 0.08}s`,
            }}
          />
        ))}
      </div>

      <h1 className={styles.header}>Game Complete</h1>
      <p className={styles.label}>Your Score --</p>
      <div className={styles.score}>{displayScore.toLocaleString()}</div>
      <div className={styles.rankPill}>Rank: #{rank}</div>
      {isNewBest && <p className={styles.newBest}>↑ New Personal Best!</p>}

      <div className={styles.actions}>
        <Button fullWidth size="lg" onClick={() => navigate(`/game/${gameId}`)}>
          Play Again
        </Button>
        <Button fullWidth size="lg" variant="outlined" onClick={() => navigate(`/compare/${gameId}`)}>
          Compare
        </Button>
        <Button fullWidth size="lg" variant="outlined" icon={Share2} onClick={() => navigate(`/share/${gameId}`)}>
          Share
        </Button>
      </div>
    </div>
  );
}

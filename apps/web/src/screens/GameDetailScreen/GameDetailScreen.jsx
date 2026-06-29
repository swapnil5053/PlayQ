import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Heart } from 'lucide-react';
import { useGameDetails } from '../../hooks/useGameDetails';
import { useAppStore } from '../../store/useAppStore';
import { api } from '../../services/api';
import { GAME_GRADIENTS } from '../../data/mockGames';
import Badge from '../../components/ui/Badge/Badge.jsx';
import WaitBadge from '../../components/ui/WaitBadge/WaitBadge.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import styles from './GameDetailScreen.module.css';

export default function GameDetailScreen() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { data: game, isLoading } = useGameDetails(gameId);
  const setQueueState = useAppStore((s) => s.setQueueState);
  const setActiveGame = useAppStore((s) => s.setActiveGame);
  const pushToast = useAppStore((s) => s.pushToast);
  const favouriteIds = useAppStore((s) => s.favouriteGameIds);
  const toggleFavourite = useAppStore((s) => s.toggleFavourite);
  const [joining, setJoining] = useState(false);
  const isFavourite = favouriteIds.includes(gameId);

  if (isLoading || !game) {
    return <div className={styles.screen}><p className={styles.loadingText}>Loading game...</p></div>;
  }

  async function handleJoinQueue() {
    setJoining(true);
    setActiveGame(game);
    let position = Math.max(1, Math.round(game.waitTime / 2));
    let queueLength = position + 2;
    let estimatedWaitMinutes = game.waitTime;

    try {
      const res = await api.post('/api/queue/join', { gameId });
      if (res?.data) {
        position = res.data.position ?? position;
        queueLength = res.data.queueLength ?? queueLength;
        estimatedWaitMinutes = res.data.estimatedWaitMinutes ?? estimatedWaitMinutes;
      }
    } catch {
      // backend not reachable / unauthenticated -- let the user know, then fall
      // back to a simulated queue position so the demo still works end to end.
      pushToast('Failed to join queue. Try again.', 'danger');
    }

    setQueueState({ gameId, position, queueLength, estimatedWaitMinutes, status: 'waiting' });
    setJoining(false);
    navigate(`/queue/${gameId}`);
  }

  return (
    <div className={styles.screen}>
      <button className={styles.back} onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowLeft size={20} />
      </button>
      <button
        className={styles.favourite}
        onClick={() => {
          toggleFavourite(gameId);
          pushToast(
            isFavourite ? 'Removed from favourites.' : 'Added to favourites.',
            isFavourite ? 'info' : 'success'
          );
        }}
        aria-label="Toggle favourite"
      >
        <Heart size={18} fill={isFavourite ? 'currentColor' : 'none'} />
      </button>

      {game.thumbnail
        ? <img src={game.thumbnail} alt={game.name} className={styles.hero} />
        : <div className={styles.hero} style={{ background: GAME_GRADIENTS[game.id] || 'linear-gradient(135deg, #1a0533, #4c1d95)' }} />}

      <div className={styles.body}>
        <div className={styles.badgeRow}>
          <Badge variant="difficulty" difficulty={game.difficulty}>{game.difficulty}</Badge>
          <Badge>{game.genre}</Badge>
        </div>

        <div className={styles.ratingRow}>
          <span className={styles.rating}><Star size={14} fill="currentColor" /> {game.rating}</span>
          <WaitBadge minutes={game.waitTime} />
        </div>

        <h1 className={styles.name}>{game.name}</h1>
        <p className={styles.description}>{game.description}</p>

        <Button fullWidth size="lg" loading={joining} onClick={handleJoinQueue}>
          Join Queue
        </Button>
        <Button fullWidth size="lg" variant="outlined" onClick={() => navigate(`/leaderboard?gameId=${gameId}`)}>
          View Scores
        </Button>
      </div>
    </div>
  );
}

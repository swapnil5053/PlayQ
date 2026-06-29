import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Trophy } from 'lucide-react';
import { MOCK_GAMES } from '../../data/mockGames';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { useAppStore } from '../../store/useAppStore';
import Button from '../../components/ui/Button/Button.jsx';
import styles from './LeaderboardScreen.module.css';

function initials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

export default function LeaderboardScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [gameId, setGameId] = useState(params.get('gameId') || MOCK_GAMES[0].id);
  const { data: board = [], isLoading } = useLeaderboard(gameId);
  const currentUserId = useAppStore((s) => s.currentUser.uid);

  const sorted = [...board].sort((a, b) => b.score - a.score);
  const podium = sorted.slice(0, 3);
  const [first, second, third] = podium;

  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>Leaderboard</h1>

      <select className={styles.select} value={gameId} onChange={(e) => setGameId(e.target.value)}>
        {MOCK_GAMES.map((g) => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>

      {isLoading ? (
        <div className={styles.loadingState}>
          <Loader2 size={32} className={styles.spinner} />
          <p>Loading...</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className={styles.loadingState}>
          <Trophy size={56} color="var(--color-text-muted)" />
          <p>No leaderboard entries yet for this game.</p>
          <Button variant="outlined" onClick={() => navigate(`/game/${gameId}`)}>
            Go Play
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.podium}>
            {second && (
              <div className={styles.podiumSpot}>
                <div className={[styles.podiumAvatar, styles.silver].join(' ')}>{initials(second.name)}</div>
                <span className={styles.podiumName}>{second.name}</span>
                <span className={styles.podiumScore}>{second.score.toLocaleString()}</span>
                <span className={styles.podiumRank}>2</span>
              </div>
            )}
            {first && (
              <div className={[styles.podiumSpot, styles.podiumCenter].join(' ')}>
                <div className={[styles.podiumAvatar, styles.gold].join(' ')}>{initials(first.name)}</div>
                <span className={styles.podiumName}>{first.name}</span>
                <span className={styles.podiumScore}>{first.score.toLocaleString()}</span>
                <span className={styles.podiumRank}>1</span>
              </div>
            )}
            {third && (
              <div className={styles.podiumSpot}>
                <div className={[styles.podiumAvatar, styles.bronze].join(' ')}>{initials(third.name)}</div>
                <span className={styles.podiumName}>{third.name}</span>
                <span className={styles.podiumScore}>{third.score.toLocaleString()}</span>
                <span className={styles.podiumRank}>3</span>
              </div>
            )}
          </div>

          <div className={styles.list}>
            {sorted.map((entry, i) => (
              <div
                key={entry.userId}
                className={[styles.row, entry.userId === currentUserId ? styles.rowActive : ''].join(' ')}
              >
                <span className={styles.rank}>#{i + 1}</span>
                <span className={styles.rowName}>{entry.name}</span>
                <span className={styles.rowScore}>{entry.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <Button fullWidth variant="outlined" onClick={() => navigate(`/game/${gameId}`)}>
        Back to Game
      </Button>
    </div>
  );
}

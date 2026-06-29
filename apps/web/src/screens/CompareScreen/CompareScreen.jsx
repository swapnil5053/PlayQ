import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_FRIENDS, getGameById } from '../../data/mockGames';
import { useAppStore } from '../../store/useAppStore';
import Button from '../../components/ui/Button/Button.jsx';
import styles from './CompareScreen.module.css';

export default function CompareScreen() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = getGameById(gameId);
  const lastScore = useAppStore((s) => s.lastScore);
  const yourScore = lastScore?.score ?? 5000;
  const [friendId, setFriendId] = useState(MOCK_FRIENDS[0].id);

  const friend = MOCK_FRIENDS.find((f) => f.id === friendId);
  const friendScore = friend?.score ?? 0;
  const diff = yourScore - friendScore;

  return (
    <div className={styles.screen}>
      <p className={styles.context}>{game?.name} -- {new Date().toLocaleDateString()}</p>
      <h1 className={styles.title}>Compare Scores</h1>

      <select className={styles.select} value={friendId} onChange={(e) => setFriendId(e.target.value)}>
        {MOCK_FRIENDS.map((f) => (
          <option key={f.id} value={f.id}>{f.name}</option>
        ))}
      </select>

      <div className={styles.compareRow}>
        <div className={[styles.card, styles.youCard].join(' ')}>
          <span className={styles.cardLabel}>You</span>
          <span className={styles.cardScore}>{yourScore.toLocaleString()}</span>
        </div>
        <div className={[styles.diff, diff >= 0 ? styles.diffUp : styles.diffDown].join(' ')}>
          {diff >= 0 ? '+' : ''}{diff.toLocaleString()} {diff >= 0 ? 'Higher' : 'Lower'}
        </div>
        <div className={[styles.card, styles.friendCard].join(' ')}>
          <span className={styles.cardLabel}>{friend?.name}</span>
          <span className={styles.cardScore}>{friendScore.toLocaleString()}</span>
        </div>
      </div>

      <Button fullWidth size="lg" onClick={() => navigate(`/game/${gameId}`)}>
        Challenge Again
      </Button>
    </div>
  );
}

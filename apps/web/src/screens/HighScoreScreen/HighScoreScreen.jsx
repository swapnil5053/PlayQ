import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown } from 'lucide-react';
import { MOCK_GAMES } from '../../data/mockGames';
import Button from '../../components/ui/Button/Button.jsx';
import styles from './HighScoreScreen.module.css';

export default function HighScoreScreen() {
  const navigate = useNavigate();
  const game = MOCK_GAMES[0];

  return (
    <div className={styles.screen}>
      <button className={styles.back} onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowLeft size={20} />
      </button>
      <Crown size={36} className={styles.crown} />
      <p className={styles.label}>Today's High Score</p>
      <h1 className={styles.value}>9,840</h1>
      <p className={styles.game}>{game.name} -- held by Vikram S</p>
      <Button fullWidth size="lg" onClick={() => navigate(`/game/${game.id}`)}>
        Try to Beat It
      </Button>
    </div>
  );
}

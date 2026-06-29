import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Badge from '../ui/Badge/Badge.jsx';
import WaitBadge from '../ui/WaitBadge/WaitBadge.jsx';
import { GAME_GRADIENTS } from '../../data/mockGames';
import styles from './GameCard.module.css';

export default function GameCard({ game, hero = false }) {
  const navigate = useNavigate();
  const gradient = GAME_GRADIENTS[game.id] || 'linear-gradient(135deg, #14141f, #322a66)';

  if (hero) {
    return (
      <div className={styles.heroCard} onClick={() => navigate(`/game/${game.id}`)}>
        {game.thumbnail
          ? <img src={game.thumbnail} alt={game.name} className={styles.heroImage} />
          : <div className={styles.heroImage} style={{ background: gradient }} />}
        <div className={styles.heroOverlay}>
          <div className={styles.heroBadges}>
            <Badge variant="difficulty" difficulty={game.difficulty}>{game.difficulty}</Badge>
            <Badge>{game.genre}</Badge>
          </div>
          <h3 className={styles.heroName}>{game.name}</h3>
          <WaitBadge minutes={game.waitTime} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card} onClick={() => navigate(`/game/${game.id}`)}>
      {game.thumbnail
        ? <img src={game.thumbnail} alt={game.name} className={styles.thumb} />
        : <div className={styles.thumb} style={{ background: gradient }} />}
      <div className={styles.info}>
        <span className={styles.name}>{game.name}</span>
        <div className={styles.tags}>
          <Badge>{game.genre}</Badge>
          <Badge variant="difficulty" difficulty={game.difficulty}>{game.difficulty}</Badge>
        </div>
        <WaitBadge minutes={game.waitTime} compact />
      </div>
      <ChevronRight size={20} className={styles.chevron} />
    </div>
  );
}

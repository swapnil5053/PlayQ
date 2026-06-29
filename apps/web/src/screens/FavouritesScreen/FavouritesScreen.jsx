import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { MOCK_GAMES } from '../../data/mockGames';
import { useAppStore } from '../../store/useAppStore';
import GameCard from '../../components/GameCard/GameCard.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import styles from './FavouritesScreen.module.css';

export default function FavouritesScreen() {
  const navigate = useNavigate();
  const favouriteIds = useAppStore((s) => s.favouriteGameIds);
  const favourites = MOCK_GAMES.filter((g) => favouriteIds.includes(g.id));

  return (
    <div className={styles.screen}>
      <button className={styles.back} onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowLeft size={20} />
      </button>
      <h1 className={styles.title}>Favourites</h1>

      {favourites.length === 0 ? (
        <div className={styles.empty}>
          <Heart size={56} color="var(--color-text-muted)" />
          <p>No favourites yet. Tap the heart on a game's detail page to save it here.</p>
          <Button variant="outlined" onClick={() => navigate('/discover')}>
            Browse Games
          </Button>
        </div>
      ) : (
        <div className={styles.list}>
          {favourites.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </div>
  );
}

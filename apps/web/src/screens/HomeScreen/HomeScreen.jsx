import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Map, Heart, Gift, Users } from 'lucide-react';
import { useGames } from '../../hooks/useGameDetails';
import { useAppStore } from '../../store/useAppStore';
import { GAME_GRADIENTS, MOCK_HIGH_SCORE } from '../../data/mockGames';
import GameCard from '../../components/GameCard/GameCard.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import styles from './HomeScreen.module.css';

const QUICK_ACTIONS = [
  { label: 'Map View', icon: Map, to: '/map' },
  { label: 'Favourites', icon: Heart, to: '/favourites' },
  { label: 'Rewards', icon: Gift, to: '/rewards' },
  { label: 'Family Mode', icon: Users, to: '/family' },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const { data: games = [] } = useGames();
  const userName = useAppStore((s) => s.currentUser.name);
  const favouriteIds = useAppStore((s) => s.favouriteGameIds);
  const [query, setQuery] = useState('');

  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return games;
    return games.filter(
      (g) => g.name.toLowerCase().includes(q) || g.genre.toLowerCase().includes(q)
    );
  }, [games, query]);

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1 className={styles.greeting}>Hello, {userName}</h1>
        <p className={styles.subtitle}>welcome back to the arcade</p>
      </header>

      <div className={styles.search}>
        <Search size={18} />
        <input
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for games..."
          aria-label="Search games"
        />
      </div>

      <div className={styles.quickGrid}>
        {QUICK_ACTIONS.map(({ label, icon: Icon, to }) => (
          <button key={label} className={styles.quickAction} onClick={() => navigate(to)}>
            <Icon size={20} />
            <span>{label}</span>
            {label === 'Favourites' && favouriteIds.length > 0 && (
              <span className={styles.quickActionBadge}>{favouriteIds.length}</span>
            )}
          </button>
        ))}
      </div>

      {!query && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Today's High Score</h2>
          <div className={styles.highScoreCard}>
            <div
              className={styles.highScoreThumb}
              style={{ background: GAME_GRADIENTS[MOCK_HIGH_SCORE.gameId] }}
            />
            <div className={styles.highScoreInfo}>
              <p className={styles.highScoreLabel}>TODAY'S HIGH SCORE</p>
              <p className={styles.highScoreGame}>{MOCK_HIGH_SCORE.gameName}</p>
              <p className={styles.highScoreValue}>{MOCK_HIGH_SCORE.score.toLocaleString()}</p>
              <p className={styles.highScoreHolder}>by {MOCK_HIGH_SCORE.holder}</p>
              {MOCK_HIGH_SCORE.gap > 0 && (
                <p className={styles.highScoreGap}>You're {MOCK_HIGH_SCORE.gap.toLocaleString()} pts away</p>
              )}
            </div>
            <Button size="sm" onClick={() => navigate(`/game/${MOCK_HIGH_SCORE.gameId}`)}>Beat It</Button>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{query ? 'Search Results' : 'Popular Games'}</h2>
        {filteredGames.length === 0 ? (
          <div className={styles.emptySearch}>
            <span>No games found for &quot;{query}&quot;</span>
          </div>
        ) : (
          <div className={styles.gameList}>
            {filteredGames.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

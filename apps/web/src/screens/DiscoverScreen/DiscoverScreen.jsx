import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useGames } from '../../hooks/useGameDetails';
import GameCard from '../../components/GameCard/GameCard.jsx';
import BottomSheet from '../../components/ui/BottomSheet/BottomSheet.jsx';
import ScreenHeader from '../../components/ui/ScreenHeader/ScreenHeader.jsx';
import styles from './DiscoverScreen.module.css';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'low-wait', label: 'Low Wait Time' },
  { id: 'popular', label: 'Popular' },
  { id: 'high-action', label: 'High Action' },
];

function applyFilter(games, filterId) {
  switch (filterId) {
    case 'low-wait':
      return games.filter((g) => g.waitTime < 8);
    case 'popular':
      return [...games].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'high-action':
      return games.filter((g) => ['Action', 'Shooter', 'Racing'].includes(g.genre));
    default:
      return games;
  }
}

export default function DiscoverScreen() {
  const { data: games = [] } = useGames();
  const [activeFilter, setActiveFilter] = useState('all');
  const [sheetOpen, setSheetOpen] = useState(false);

  const filteredGames = useMemo(() => applyFilter(games, activeFilter), [games, activeFilter]);
  const featured = filteredGames[0];
  const rest = filteredGames.slice(1);

  return (
    <div className={styles.screen}>
      <ScreenHeader
        title="Discover"
        right={
          <button className={styles.filterIcon} onClick={() => setSheetOpen(true)} aria-label="Open filters">
            <SlidersHorizontal size={18} />
          </button>
        }
      />

      <div className={styles.content}>
        <div className={styles.pillRow}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={[styles.pill, activeFilter === f.id ? styles.pillActive : ''].join(' ')}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className={styles.count}>Showing {filteredGames.length} games</p>

        {featured && (
          <GameCard game={featured} hero />
        )}

        <div className={styles.list}>
          {rest.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </div>

      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="Filter games">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={styles.sheetOption}
            onClick={() => {
              setActiveFilter(f.id);
              setSheetOpen(false);
            }}
          >
            {f.label}
          </button>
        ))}
      </BottomSheet>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button/Button.jsx';
import { MOCK_SESSION } from '../../data/mockGames';
import styles from './TodaySummaryScreen.module.css';

export default function TodaySummaryScreen() {
  const navigate = useNavigate();
  const hours = Math.floor(MOCK_SESSION.totalMinutes / 60);
  const mins = MOCK_SESSION.totalMinutes % 60;
  const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const stats = [
    { label: 'Total Games Played', value: String(MOCK_SESSION.gamesPlayed) },
    { label: 'Best Score', value: MOCK_SESSION.bestScore.toLocaleString() },
    { label: 'Total Time Spent', value: timeDisplay },
  ];

  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>Today's Summary</h1>

      <div className={styles.statList}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <span className={styles.statLabel}>{s.label} --</span>
            <span className={styles.statValue}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.motivationCard}>
        {MOCK_SESSION.message}
      </div>

      <Button fullWidth size="lg" onClick={() => navigate('/plan-visit')}>
        Plan Next Visit
      </Button>
    </div>
  );
}

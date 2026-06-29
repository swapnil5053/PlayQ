import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_GAMES } from '../../data/mockGames';
import { useScoreHistory } from '../../hooks/useScoreHistory';
import ScoreRow from '../../components/ScoreRow/ScoreRow.jsx';
import styles from './ScoreHistoryScreen.module.css';

export default function ScoreHistoryScreen() {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState(MOCK_GAMES[0].id);
  const { data: history = [], isLoading } = useScoreHistory(gameId);
  const best = useMemo(() => (history.length ? Math.max(...history.map((h) => h.score)) : 0), [history]);

  return (
    <div className={styles.screen}>
      <button className={styles.back} onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowLeft size={20} />
      </button>
      <h1 className={styles.title}>Score History</h1>

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
      ) : history.length === 0 ? (
        <div className={styles.loadingState}>
          <p>No scores yet for this game. Play a round to start your history.</p>
        </div>
      ) : (
        <>
          <div className={styles.chartCard}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={history}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-hover)', borderRadius: 8 }}
                  labelStyle={{ color: 'var(--color-text-sub)' }}
                />
                <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-primary-light)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.listCard}>
            {history
              .slice()
              .reverse()
              .map((h) => (
                <ScoreRow key={h.date} date={h.date} score={h.score} isBest={h.score === best} />
              ))}
          </div>
        </>
      )}
    </div>
  );
}

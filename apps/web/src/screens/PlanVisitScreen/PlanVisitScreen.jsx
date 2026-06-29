import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, Users, Zap, Check } from 'lucide-react';
import { MOCK_GAMES } from '../../data/mockGames';
import styles from './PlanVisitScreen.module.css';

const TIME_SLOTS = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];
const VISIT_TYPES = [
  { id: 'solo', label: 'Solo', sub: 'Just me', icon: Zap },
  { id: 'duo', label: 'Duo', sub: 'Me + 1 friend', icon: Users },
  { id: 'group', label: 'Group', sub: '3 or more people', icon: Users },
];

export default function PlanVisitScreen() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [visitType, setVisitType] = useState('solo');
  const [selectedGames, setSelectedGames] = useState([]);
  const [planned, setPlanned] = useState(false);

  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const toggleGame = (id) => {
    setSelectedGames((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handlePlan = () => {
    if (!selectedDate || !selectedTime) return;
    setPlanned(true);
  };

  if (planned) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successIcon}>
          <Calendar size={36} color="#6C5BA8" />
        </div>
        <h2 className={styles.successTitle}>Visit planned</h2>
        <p className={styles.successSub}>
          {selectedDate?.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
          {' at '}{selectedTime}
        </p>
        {selectedGames.length > 0 && (
          <div className={styles.plannedGames}>
            <p className={styles.plannedLabel}>Games on your list</p>
            {MOCK_GAMES.filter((g) => selectedGames.includes(g.id)).map((g) => (
              <div key={g.id} className={styles.plannedGame}>
                <span>{g.name}</span>
                <span className={styles.plannedWait}>~{g.waitTime} min wait expected</span>
              </div>
            ))}
          </div>
        )}
        <button className={styles.doneBtn} onClick={() => navigate('/')}>
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={22} color="var(--color-text)" />
        </button>
        <h1 className={styles.title}>Plan your visit</h1>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>
          <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Pick a date
        </p>
        <div className={styles.dateRow}>
          {dates.map((d, i) => (
            <button
              key={i}
              className={`${styles.dateBtn} ${selectedDate?.toDateString() === d.toDateString() ? styles.selected : ''}`}
              onClick={() => setSelectedDate(d)}
            >
              <span className={styles.dateDayName}>
                {i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' })}
              </span>
              <span className={styles.dateNum}>{d.getDate()}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>
          <Clock size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Preferred time
        </p>
        <div className={styles.timeGrid}>
          {TIME_SLOTS.map((t) => (
            <button
              key={t}
              className={`${styles.timeBtn} ${selectedTime === t ? styles.selected : ''}`}
              onClick={() => setSelectedTime(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>
          <Users size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Who's coming?
        </p>
        <div className={styles.typeRow}>
          {VISIT_TYPES.map((vt) => {
            const Icon = vt.icon;
            return (
              <button
                key={vt.id}
                className={`${styles.typeCard} ${visitType === vt.id ? styles.selected : ''}`}
                onClick={() => setVisitType(vt.id)}
              >
                <Icon size={18} color={visitType === vt.id ? '#6C5BA8' : 'var(--color-text-muted)'} />
                <span className={styles.typeLabel}>{vt.label}</span>
                <span className={styles.typeSub}>{vt.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Add games to your wishlist (optional)</p>
        <div className={styles.gameList}>
          {MOCK_GAMES.map((g) => (
            <button
              key={g.id}
              className={`${styles.gameRow} ${selectedGames.includes(g.id) ? styles.gameSelected : ''}`}
              onClick={() => toggleGame(g.id)}
            >
              <span className={styles.gameName}>{g.name}</span>
              <span className={styles.gameWait}>~{g.waitTime} min</span>
              <div className={`${styles.checkbox} ${selectedGames.includes(g.id) ? styles.checked : ''}`}>
                {selectedGames.includes(g.id) && <Check size={12} strokeWidth={3} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.ctaWrap}>
        <button
          className={styles.planBtn}
          onClick={handlePlan}
          disabled={!selectedDate || !selectedTime}
        >
          {!selectedDate || !selectedTime ? 'Select date and time to continue' : 'Plan this visit'}
        </button>
      </div>
    </div>
  );
}

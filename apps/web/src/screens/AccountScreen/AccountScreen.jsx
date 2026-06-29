import { useNavigate } from 'react-router-dom';
import { History, Trophy, CalendarCheck, Star, ChevronRight, Plus, LogOut } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { signOut } from '../../services/firebase';
import Button from '../../components/ui/Button/Button.jsx';
import styles from './AccountScreen.module.css';

const NAV_CARDS = [
  { label: 'Score History', icon: History, to: '/scores/history' },
  { label: 'Leaderboard', icon: Trophy, to: '/leaderboard' },
  { label: "Today's Summary", icon: CalendarCheck, to: '/summary' },
  { label: "Today's High Score", icon: Star, to: '/high-score' },
];

export default function AccountScreen() {
  const navigate = useNavigate();
  const currentUser = useAppStore((s) => s.currentUser);
  const logout = useAppStore((s) => s.logout);
  const { balance } = useWalletBalance();

  async function handleSignOut() {
    await signOut();
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className={styles.screen}>
      <div className={styles.profile}>
        <div className={styles.avatar}>{currentUser.initials}</div>
        <div>
          <h1 className={styles.name}>{currentUser.name}</h1>
          <p className={styles.joined}>Player since {currentUser.joinedAt}</p>
        </div>
      </div>

      <div className={styles.walletCard}>
        <div>
          <p className={styles.walletLabel}>Wallet balance</p>
          <p className={styles.walletValue}>₹ {balance.toFixed(2)}</p>
        </div>
        <Button size="sm" icon={Plus} onClick={() => navigate('/topup')}>Top Up</Button>
      </div>

      <div className={styles.navList}>
        {NAV_CARDS.map(({ label, icon: Icon, to }) => (
          <button key={label} className={styles.navCard} onClick={() => navigate(to)}>
            <span className={styles.navCardLeft}>
              <span className={styles.navCardIcon}>
                <Icon size={18} />
              </span>
              {label}
            </span>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>

      <button className={styles.signOutButton} onClick={handleSignOut}>
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  );
}

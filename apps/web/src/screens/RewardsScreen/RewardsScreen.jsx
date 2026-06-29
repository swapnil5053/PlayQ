import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Ticket, Trophy } from 'lucide-react';
import styles from './RewardsScreen.module.css';

const REWARDS = [
  { icon: Ticket, title: 'Free Token', desc: 'Redeem 500 XP for one free game token', xp: 500 },
  { icon: Trophy, title: 'VIP Queue Skip', desc: 'Skip one queue instantly', xp: 1200 },
  { icon: Gift, title: 'Mystery Box', desc: 'Surprise arcade merchandise', xp: 2000 },
];

export default function RewardsScreen() {
  const navigate = useNavigate();
  const xp = 860;

  return (
    <div className={styles.screen}>
      <button className={styles.back} onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowLeft size={20} />
      </button>
      <h1 className={styles.title}>Rewards</h1>

      <div className={styles.xpCard}>
        <span className={styles.xpLabel}>Your XP</span>
        <span className={styles.xpValue}>{xp.toLocaleString()}</span>
        <div className={styles.xpBar}>
          <div className={styles.xpFill} style={{ width: `${Math.min(100, (xp / 2000) * 100)}%` }} />
        </div>
      </div>

      <div className={styles.list}>
        {REWARDS.map(({ icon: Icon, title, desc, xp: cost }) => (
          <div key={title} className={styles.rewardCard}>
            <Icon size={20} />
            <div className={styles.rewardInfo}>
              <span className={styles.rewardTitle}>{title}</span>
              <span className={styles.rewardDesc}>{desc}</span>
            </div>
            <span className={styles.rewardCost}>{cost} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}

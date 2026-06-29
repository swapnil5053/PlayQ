import ConciergeChat from '../../components/ConciergeChat/ConciergeChat.jsx';
import styles from './ConciergeScreen.module.css';

export default function ConciergeScreen() {
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1 className={styles.title}>Glitch</h1>
        <p className={styles.subtitle}>Your arcade ghost -- queues, games, and your stats, one chat away</p>
      </header>
      <div className={styles.chatWrap}>
        <ConciergeChat />
      </div>
    </div>
  );
}

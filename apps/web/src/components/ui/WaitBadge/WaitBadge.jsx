import styles from './WaitBadge.module.css';

function waitTier(minutes) {
  if (minutes < 5) return 'low';
  if (minutes < 15) return 'mid';
  return 'high';
}

export default function WaitBadge({ minutes, compact = false }) {
  const tier = waitTier(minutes);
  return (
    <span className={[styles.badge, styles[tier]].join(' ')}>
      <span className={styles.dot} />
      {compact ? `${minutes} min` : `${minutes} min wait`}
    </span>
  );
}

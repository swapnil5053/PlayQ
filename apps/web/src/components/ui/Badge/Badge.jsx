import styles from './Badge.module.css';

const DIFFICULTY_CLASS = {
  Easy: styles.easy,
  Medium: styles.medium,
  Hard: styles.hard,
};

export default function Badge({ children, variant, difficulty, className = '' }) {
  const difficultyClass = variant === 'difficulty' ? DIFFICULTY_CLASS[difficulty] || '' : '';
  return (
    <span className={[styles.badge, difficultyClass, className].join(' ').trim()}>
      {children}
    </span>
  );
}

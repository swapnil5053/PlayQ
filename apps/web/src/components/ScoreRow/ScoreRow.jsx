import styles from './ScoreRow.module.css';

export default function ScoreRow({ date, score, isBest = false }) {
  return (
    <div className={styles.row}>
      <span className={styles.date}>{date}</span>
      <span className={[styles.score, isBest ? styles.best : ''].join(' ')}>
        {isBest && <span className={styles.bestTag}>BEST</span>}
        {score.toLocaleString()}
      </span>
    </div>
  );
}

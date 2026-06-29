import { motion } from 'framer-motion';
import styles from './QueueStatus.module.css';

export default function QueueStatus({ position, queueLength, estimatedWaitMinutes, isAlmostUp }) {
  return (
    <div className={styles.wrap}>
      <motion.div
        key={position}
        className={styles.positionPill}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.4 }}
      >
        Position -- {position}/{queueLength}
      </motion.div>
      <p className={styles.estimate}>Estimated wait time -- ~{estimatedWaitMinutes} minutes</p>
      {isAlmostUp && <p className={styles.almost}>You're almost there!</p>}
    </div>
  );
}

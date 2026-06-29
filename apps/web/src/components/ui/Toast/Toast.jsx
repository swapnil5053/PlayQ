import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '../../../store/useAppStore';
import styles from './Toast.module.css';

export default function ToastHost() {
  const toasts = useAppStore((s) => s.toasts);

  return (
    <div className={styles.host}>
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className={[styles.toast, styles[t.variant] || ''].join(' ')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

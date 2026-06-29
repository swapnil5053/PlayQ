import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import styles from './BottomSheet.module.css';

export default function BottomSheet({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.sheet}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className={styles.handle} />
            {title && <h3 className={styles.title}>{title}</h3>}
            <div className={styles.content}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

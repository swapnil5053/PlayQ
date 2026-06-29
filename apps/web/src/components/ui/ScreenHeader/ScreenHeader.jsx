import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import styles from './ScreenHeader.module.css';

export default function ScreenHeader({ title, showBack = false, onBack, right = null }) {
  const navigate = useNavigate();

  return (
    <div className={styles.header}>
      {showBack && (
        <button
          type="button"
          className={styles.backBtn}
          onClick={onBack ?? (() => navigate(-1))}
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>
      )}
      <h1 className={styles.title}>{title}</h1>
      {right && <div className={styles.right}>{right}</div>}
    </div>
  );
}

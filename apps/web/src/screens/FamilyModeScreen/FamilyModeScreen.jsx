import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import Button from '../../components/ui/Button/Button.jsx';
import { useAppStore } from '../../store/useAppStore';
import styles from './FamilyModeScreen.module.css';

export default function FamilyModeScreen() {
  const navigate = useNavigate();
  const pushToast = useAppStore((s) => s.pushToast);
  const [enabled, setEnabled] = useState(false);

  return (
    <div className={styles.screen}>
      <button className={styles.back} onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowLeft size={20} />
      </button>
      <Users size={32} className={styles.icon} />
      <h1 className={styles.title}>Family Mode</h1>
      <p className={styles.desc}>
        Group multiple players under one wallet, share queue notifications across devices, and
        filter games by age-appropriate difficulty -- ideal for visiting the arcade together.
      </p>

      <button className={[styles.toggleCard, enabled ? styles.toggleOn : ''].join(' ')} onClick={() => {
        setEnabled((v) => !v);
        pushToast(enabled ? 'Family Mode disabled' : 'Family Mode enabled');
      }}>
        <span className={styles.toggleLeft}>
          <ShieldCheck size={18} />
          Family Mode
        </span>
        <span className={[styles.switch, enabled ? styles.switchOn : ''].join(' ')}>
          <span className={styles.knob} />
        </span>
      </button>

      <Button fullWidth size="lg" onClick={() => navigate('/discover')}>
        Browse Family-Friendly Games
      </Button>
    </div>
  );
}

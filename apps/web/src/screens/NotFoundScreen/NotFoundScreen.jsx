import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button/Button.jsx';
import Logo from '../../components/Logo/Logo.jsx';
import styles from './NotFoundScreen.module.css';

export default function NotFoundScreen() {
  const navigate = useNavigate();
  return (
    <div className={styles.screen}>
      <Logo size="sm" showWordmark={false} />
      <h1 className={styles.title}>Lost in the arcade</h1>
      <p className={styles.desc}>We couldn't find that screen.</p>
      <Button onClick={() => navigate('/')}>Back to Home</Button>
    </div>
  );
}

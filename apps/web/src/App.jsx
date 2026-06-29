import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firebaseEnabled } from './services/firebase';
import { useAppStore } from './store/useAppStore';
import AppRouter from './router/index.jsx';
import NavBar from './components/ui/NavBar/NavBar.jsx';
import ToastHost from './components/ui/Toast/Toast.jsx';
import Logo from './components/Logo/Logo.jsx';
import Skeleton from './components/ui/Skeleton/Skeleton.jsx';
import styles from './App.module.css';

export default function App() {
  const authChecked = useAppStore((s) => s.authChecked);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const setAuthChecked = useAppStore((s) => s.setAuthChecked);
  const setAuthUser = useAppStore((s) => s.setAuthUser);

  useEffect(() => {
    if (!firebaseEnabled) {
      setAuthUser({ uid: 'mock-user-1' });
      setAuthChecked(true);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, [setAuthChecked, setAuthUser]);

  if (!authChecked) {
    return (
      <div className={styles.appShell}>
        <div className={styles.mobileFrame}>
          <div className={styles.bootScreen}>
            <Logo size="lg" />
            <div className={styles.bootBars}>
              <Skeleton height={10} width="70%" />
              <Skeleton height={10} width="45%" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.appShell}>
      <div className={styles.mobileFrame}>
        <div className={styles.routerArea}>
          <AppRouter />
        </div>
        {isAuthenticated && <NavBar />}
      </div>
      <ToastHost />
    </div>
  );
}

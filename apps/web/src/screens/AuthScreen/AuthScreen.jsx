import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, firebaseEnabled } from '../../services/firebase';
import { useAppStore } from '../../store/useAppStore';
import Button from '../../components/ui/Button/Button.jsx';
import Logo from '../../components/Logo/Logo.jsx';
import styles from './AuthScreen.module.css';

function friendlyError(err) {
  const code = err?.code || '';
  if (code.includes('wrong-password') || code.includes('invalid-credential')) return 'Incorrect email or password.';
  if (code.includes('user-not-found')) return 'No account found with that email.';
  if (code.includes('email-already-in-use')) return 'An account with that email already exists.';
  if (code.includes('weak-password')) return 'Password should be at least 6 characters.';
  if (code.includes('invalid-email')) return 'Enter a valid email address.';
  if (code.includes('popup-closed-by-user')) return 'Sign-in was cancelled.';
  if (code.includes('operation-not-allowed')) return 'Email/password sign-in is not enabled for this project yet.';
  if (code.includes('network-request-failed')) return 'Network error. Check your connection and try again.';
  if (code.includes('configuration-not-found') || code.includes('invalid-api-key')) return 'Firebase is not configured correctly for this project.';
  if (code.includes('too-many-requests')) return 'Too many attempts. Please wait a moment and try again.';
  // Fall back to showing the raw Firebase error code/message so it's actually debuggable.
  return `Something went wrong${code ? ` (${code})` : ''}. Please try again.`;
}

export default function AuthScreen() {
  const navigate = useNavigate();
  const setAuthUser = useAppStore((s) => s.setAuthUser);
  const pushToast = useAppStore((s) => s.pushToast);

  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleEmailSubmit(e) {
    e.preventDefault();
    if (!firebaseEnabled) {
      setError('Sign-in is not configured for this build.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) {
          await updateProfile(cred.user, { displayName: name.trim() });
        }
        setAuthUser(cred.user);
        pushToast('Account created. Welcome!', 'success');
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        setAuthUser(cred.user);
        pushToast('Welcome back!', 'success');
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!firebaseEnabled) {
      setError('Sign-in is not configured for this build.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      setAuthUser(cred.user);
      pushToast('Welcome!', 'success');
      navigate('/', { replace: true });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.brand}>
        <Logo size="lg" />
        <p className={styles.subtitle}>Skip the line. Play more.</p>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={[styles.tab, mode === 'login' ? styles.tabActive : ''].join(' ')}
          onClick={() => { setMode('login'); setError(''); }}
        >
          Sign In
        </button>
        <button
          type="button"
          className={[styles.tab, mode === 'register' ? styles.tabActive : ''].join(' ')}
          onClick={() => { setMode('register'); setError(''); }}
        >
          Register
        </button>
      </div>

      <form className={styles.form} onSubmit={handleEmailSubmit}>
        {mode === 'register' && (
          <input
            className={styles.input}
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        )}
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          minLength={6}
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <Button type="submit" fullWidth loading={submitting}>
          {mode === 'register' ? 'Create Account' : 'Sign In'}
        </Button>
      </form>

      <div className={styles.divider}>
        <span>or</span>
      </div>

      <Button variant="outlined" fullWidth onClick={handleGoogleSignIn} disabled={submitting}>
        Continue with Google
      </Button>
    </div>
  );
}

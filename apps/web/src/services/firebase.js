import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signOut as firebaseSignOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase is optional in this build -- if no API key is configured we skip
// initialization entirely and let services/api.js fall back to mock data.
export const firebaseEnabled = Boolean(firebaseConfig.apiKey);

let app = null;
let auth = null;

if (firebaseEnabled && getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} else if (firebaseEnabled) {
  auth = getAuth();
}

export { app, auth };

export async function getIdToken() {
  if (!firebaseEnabled || !auth?.currentUser) return null;
  try {
    return await auth.currentUser.getIdToken();
  } catch {
    return null;
  }
}

export async function signOut() {
  if (!firebaseEnabled || !auth) return;
  try {
    await firebaseSignOut(auth);
  } catch {
    // already signed out or auth unreachable -- nothing more to do
  }
}

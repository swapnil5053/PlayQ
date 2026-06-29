import { useAppStore } from '../store/useAppStore';

/** Wallet balance currently lives on the mock user profile in the store.
 *  Swapping to a live Firestore-backed balance later only means changing
 *  this hook -- screens consume it the same way. */
export function useWalletBalance() {
  const balance = useAppStore((s) => s.currentUser.walletBalance);
  return { balance };
}

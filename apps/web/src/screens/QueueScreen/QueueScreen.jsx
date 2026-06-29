import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useQueueSocket } from '../../hooks/useQueueSocket';
import { api } from '../../services/api';
import BottomSheet from '../../components/ui/BottomSheet/BottomSheet.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import styles from './QueueScreen.module.css';

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function QueueScreen() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const activeGame = useAppStore((s) => s.activeGame);
  const queueState = useAppStore((s) => s.queueState);
  const resetQueueState = useAppStore((s) => s.resetQueueState);
  const currentUser = useAppStore((s) => s.currentUser);
  const setLastScore = useAppStore((s) => s.setLastScore);
  const pushToast = useAppStore((s) => s.pushToast);

  useQueueSocket(gameId, currentUser.uid);

  const [secondsLeft, setSecondsLeft] = useState((queueState.estimatedWaitMinutes || 5) * 60);
  const [leaveSheetOpen, setLeaveSheetOpen] = useState(false);
  const [turnOverlay, setTurnOverlay] = useState(false);
  const turnTimerRef = useRef(null);

  // Only resync the visible countdown from the backend's latest estimate when
  // it has drifted by more than 30s -- avoids the timer visibly jumping
  // around on every minor queue_updated broadcast.
  useEffect(() => {
    const serverSeconds = (queueState.estimatedWaitMinutes || 5) * 60;
    setSecondsLeft((current) => {
      if (Math.abs(current - serverSeconds) > 30) return serverSeconds;
      return current;
    });
  }, [queueState.estimatedWaitMinutes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (queueState.position === 1 && !turnOverlay) {
      setTurnOverlay(true);
      turnTimerRef.current = setTimeout(async () => {
        const score = Math.floor(4000 + Math.random() * 6000);
        const entry = { gameId, gameName: activeGame?.name, score, playedAt: new Date().toISOString() };
        try {
          const res = await api.post('/api/scores', {
            gameId,
            gameName: activeGame?.name,
            playerName: currentUser.name,
            userId: currentUser.uid,
            score,
          });
          setLastScore({ ...entry, rank: res?.data?.rank ?? Math.floor(Math.random() * 5) + 1 });
        } catch {
          setLastScore({ ...entry, rank: Math.floor(Math.random() * 5) + 1 });
        }
        navigate(`/game-complete/${gameId}`);
      }, 2000);
    }
    return () => clearTimeout(turnTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueState.position, turnOverlay, navigate, gameId]);

  async function confirmLeave() {
    try {
      await api.post('/api/queue/leave', { gameId });
    } catch {
      // ignore -- best effort
    }
    resetQueueState();
    setLeaveSheetOpen(false);
    pushToast('You have left the queue.', 'info');
    navigate(`/game/${gameId}`);
  }

  const isAlmostUp = queueState.position && queueState.position <= 3;
  const isUp = queueState.position === 1;

  return (
    <div className={styles.screen}>
      <h1 className={styles.gameName}>{activeGame?.name || 'Your Queue'}</h1>

      <div className={[styles.timerBox, isUp ? styles.timerBoxUp : ''].join(' ')}>
        {isUp && <span className={styles.pulseDot} />}
        <span className={styles.timer}>{formatTime(secondsLeft)}</span>
      </div>
      <p className={styles.timerLabel}>Time Remaining</p>

      <motion.div
        key={queueState.position}
        className={styles.positionPill}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.4 }}
      >
        Position -- {queueState.position ?? '--'}/{queueState.queueLength ?? '--'}
      </motion.div>

      <p className={styles.estimate}>
        Estimated wait time -- ~{Math.ceil(secondsLeft / 60)} minutes
      </p>

      {isAlmostUp && !isUp && <p className={styles.almost}>You're almost there!</p>}

      <Button variant="danger" fullWidth onClick={() => setLeaveSheetOpen(true)}>
        Leave Queue
      </Button>

      <BottomSheet isOpen={leaveSheetOpen} onClose={() => setLeaveSheetOpen(false)} title="Leave the queue?">
        <p className={styles.sheetText}>You'll lose your current position. This can't be undone.</p>
        <div className={styles.sheetActions}>
          <Button variant="primary" fullWidth onClick={() => setLeaveSheetOpen(false)}>Stay in Queue</Button>
          <Button variant="danger" fullWidth onClick={confirmLeave}>Leave</Button>
        </div>
      </BottomSheet>

      <AnimatePresence>
        {turnOverlay && (
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className={styles.overlayEmoji}>
              <Gamepad2 size={40} color="var(--color-accent)" />
            </motion.div>
            <motion.h2 initial={{ scale: 0.8 }} animate={{ scale: 1 }} className={styles.overlayText}>
              It's your turn!
            </motion.h2>
            <p className={styles.overlaySub}>Head to the machine now</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

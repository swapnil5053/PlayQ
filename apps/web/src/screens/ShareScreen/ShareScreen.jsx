import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { MessageCircle, QrCode, Link as LinkIcon } from 'lucide-react';
import { getGameById } from '../../data/mockGames';
import { useAppStore } from '../../store/useAppStore';
import Button from '../../components/ui/Button/Button.jsx';
import styles from './ShareScreen.module.css';

export default function ShareScreen() {
  const { gameId } = useParams();
  const game = getGameById(gameId);
  const lastScore = useAppStore((s) => s.lastScore);
  const currentUser = useAppStore((s) => s.currentUser);
  const pushToast = useAppStore((s) => s.pushToast);
  const score = lastScore?.score ?? 0;

  const shareUrl = `https://arcade.app/scores/${currentUser.uid}/${gameId}`;
  const shareText = `I just scored ${score.toLocaleString()} on ${game?.name} at the Arcade! Can you beat it?`;

  function copyLink() {
    navigator.clipboard?.writeText(shareUrl).then(() => pushToast('Link copied!', 'success'));
  }

  function openWhatsapp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  }

  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>Share Your Score</h1>

      <div className={styles.trophyCard}>
        <span className={styles.gameName}>{game?.name}</span>
        <span className={styles.score}>{score.toLocaleString()}</span>
        <span className={styles.tag}>NEW SCORE</span>
        <span className={styles.brand}>THE ARCADE</span>
      </div>

      <div className={styles.qrWrap}>
        <QRCodeSVG value={shareUrl} size={140} bgColor="transparent" fgColor="#F1F5F9" />
      </div>

      <div className={styles.iconRow}>
        <button className={styles.iconButton} onClick={openWhatsapp}>
          <MessageCircle size={20} />
          <span>WhatsApp</span>
        </button>
        <button className={styles.iconButton} onClick={() => pushToast('Scan the QR code above!')}>
          <QrCode size={20} />
          <span>QR Code</span>
        </button>
        <button className={styles.iconButton} onClick={copyLink}>
          <LinkIcon size={20} />
          <span>Copy Link</span>
        </button>
      </div>

      <Button fullWidth size="lg" onClick={openWhatsapp}>
        Share Now
      </Button>
    </div>
  );
}

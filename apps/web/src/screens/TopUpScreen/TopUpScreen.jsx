import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Smartphone, CreditCard, Landmark } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import ScreenHeader from '../../components/ui/ScreenHeader/ScreenHeader.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import styles from './TopUpScreen.module.css';

const AMOUNTS = [50, 100, 200, 500];

const METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'netbanking', label: 'Net Banking', icon: Landmark },
];

export default function TopUpScreen() {
  const navigate = useNavigate();
  const { balance } = useWalletBalance();
  const addWalletBalance = useAppStore((s) => s.addWalletBalance);

  const [step, setStep] = useState('amount'); // amount | method | confirm | success
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [method, setMethod] = useState(null);
  const [processing, setProcessing] = useState(false);

  const finalAmount = customAmount ? Number(customAmount) || 0 : amount;
  const balanceAfter = balance + finalAmount;

  function handleConfirm() {
    setProcessing(true);
    setTimeout(() => {
      addWalletBalance(finalAmount);
      setProcessing(false);
      setStep('success');
      setTimeout(() => {
        navigate('/account', { replace: true });
      }, 1800);
    }, 1200);
  }

  return (
    <div className={styles.screen}>
      <ScreenHeader title="Top Up Wallet" showBack onBack={() => navigate(-1)} />

      <div className={styles.content}>
        {step === 'amount' && (
          <>
            <p className={styles.label}>Current balance: ₹{balance.toFixed(2)}</p>

            <div className={styles.amountGrid}>
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  className={[styles.amountTile, !customAmount && amount === a ? styles.amountTileActive : ''].join(' ')}
                  onClick={() => { setAmount(a); setCustomAmount(''); }}
                >
                  ₹{a}
                </button>
              ))}
            </div>

            <input
              className={styles.customInput}
              type="number"
              min="1"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />

            <Button
              fullWidth
              disabled={finalAmount <= 0}
              onClick={() => setStep('method')}
            >
              Continue
            </Button>
          </>
        )}

        {step === 'method' && (
          <>
            <p className={styles.label}>Choose a payment method</p>
            <div className={styles.methodList}>
              {METHODS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={[styles.methodRow, method === id ? styles.methodRowActive : ''].join(' ')}
                  onClick={() => setMethod(id)}
                >
                  <span className={styles.methodLeft}>
                    <Icon size={18} />
                    {label}
                  </span>
                  <span className={[styles.radio, method === id ? styles.radioActive : ''].join(' ')} />
                </button>
              ))}
            </div>

            <Button fullWidth disabled={!method} onClick={() => setStep('confirm')}>
              Continue
            </Button>
          </>
        )}

        {step === 'confirm' && (
          <>
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>Amount</span>
                <span>₹{finalAmount.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Method</span>
                <span>{METHODS.find((m) => m.id === method)?.label}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Balance after</span>
                <span>₹{balanceAfter.toFixed(2)}</span>
              </div>
            </div>

            <Button fullWidth loading={processing} onClick={handleConfirm}>
              Confirm Payment
            </Button>
          </>
        )}

        {step === 'success' && (
          <div className={styles.successWrap}>
            <CheckCircle2 size={56} className={styles.successIcon} />
            <h2 className={styles.successTitle}>Top Up Successful</h2>
            <p className={styles.successSub}>₹{finalAmount.toFixed(2)} added to your wallet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  disabled,
  children,
  className = '',
  ...rest
}) {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className,
  ].join(' ').trim();

  return (
    <button className={classNames} disabled={disabled || loading} {...rest}>
      {loading ? (
        <span className={styles.spinnerWrap}>
          <Loader2 className={styles.spinner} size={16} />
          {children}
        </span>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={18} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={18} />}
        </>
      )}
    </button>
  );
}

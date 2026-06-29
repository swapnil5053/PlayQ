import styles from './Card.module.css';

export default function Card({ children, className = '', onClick, padded = true, ...rest }) {
  return (
    <div
      className={[styles.card, padded ? styles.padded : '', onClick ? styles.pressable : '', className].join(' ').trim()}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
}

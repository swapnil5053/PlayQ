import styles from './Skeleton.module.css';

/** Simple pulsing placeholder block, used while a screen waits on its first
 *  bit of data (auth check, socket connect, etc). Pass width/height in px
 *  or any CSS length, or rely on the defaults for a text-line shape. */
export default function Skeleton({ width = '100%', height = 14, radius = 8, className = '' }) {
  return (
    <span
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  );
}

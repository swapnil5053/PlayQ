import styles from './Logo.module.css';

// 11 x 11 pixel-grid bitmap of a classic arcade "ghost" silhouette.
const GHOST_ROWS = [
  '00111111100',
  '01111111110',
  '11111111111',
  '11111111111',
  '11011110111',
  '11011110111',
  '11111111111',
  '11111111111',
  '11111111111',
  '11101110111',
  '11011101101',
];

const CELL = 1.6;

function PixelGhost({ className }) {
  const cells = [];
  GHOST_ROWS.forEach((row, y) => {
    row.split('').forEach((bit, x) => {
      if (bit === '1') {
        cells.push(
          <rect
            key={`${x}-${y}`}
            x={x * CELL}
            y={y * CELL}
            width={CELL}
            height={CELL}
          />
        );
      }
    });
  });

  return (
    <svg
      viewBox={`0 0 ${11 * CELL} ${11 * CELL}`}
      className={className}
      shapeRendering="crispEdges"
      role="img"
      aria-label="The Arcade ghost mark"
    >
      <g className={styles.ghostBody}>{cells}</g>
      <rect x={2 * CELL} y={4 * CELL} width={CELL * 1.4} height={CELL * 1.6} className={styles.eye} />
      <rect x={6.6 * CELL} y={4 * CELL} width={CELL * 1.4} height={CELL * 1.6} className={styles.eye} />
      <rect x={2.5 * CELL} y={4.6 * CELL} width={CELL * 0.6} height={CELL * 0.8} className={styles.pupil} />
      <rect x={7.1 * CELL} y={4.6 * CELL} width={CELL * 0.6} height={CELL * 0.8} className={styles.pupil} />
    </svg>
  );
}

export default function Logo({ size = 'md', showWordmark = true, className = '' }) {
  return (
    <div className={[styles.logo, styles[size], className].join(' ')}>
      <div className={styles.badge}>
        <PixelGhost className={styles.ghostSvg} />
      </div>
      {showWordmark && (
        <div className={styles.wordmark}>
          <span className={styles.the}>THE</span>
          <span className={styles.arcade}>ARCADE</span>
        </div>
      )}
    </div>
  );
}

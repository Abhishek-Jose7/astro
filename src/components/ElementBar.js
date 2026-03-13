'use client';

import { motion } from 'framer-motion';
import styles from './ElementBar.module.css';

const ELEMENT_COLORS = {
  fire: 'var(--element-fire)',
  earth: 'var(--element-earth)',
  air: 'var(--element-air)',
  water: 'var(--element-water)',
};

const ELEMENT_LABELS = {
  fire: '🔥 Fire',
  earth: '🌿 Earth',
  air: '💨 Air',
  water: '🌊 Water',
};

export default function ElementBar({ balance }) {
  if (!balance) return null;

  const total = Object.values(balance).reduce((a, b) => a + b, 0) || 1;
  const dominant = Object.entries(balance).sort((a, b) => b[1] - a[1])[0];

  return (
    <motion.div
      className={`oracle-card ${styles.container}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <h3 className={`glow-text ${styles.title}`}>Elemental Balance</h3>
      <p className={styles.dominant}>
        Dominant: <span style={{ color: ELEMENT_COLORS[dominant[0]] }}>{ELEMENT_LABELS[dominant[0]]}</span>
      </p>

      <div className={styles.barContainer}>
        {Object.entries(balance).map(([element, count], i) => {
          const pct = Math.round((count / total) * 100);
          return (
            <div key={element} className={styles.barRow}>
              <span className={styles.label}>{ELEMENT_LABELS[element]}</span>
              <div className={styles.track}>
                <motion.div
                  className={styles.fill}
                  style={{ backgroundColor: ELEMENT_COLORS[element] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <span className={styles.pct}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

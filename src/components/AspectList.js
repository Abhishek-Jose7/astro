'use client';

import { motion } from 'framer-motion';
import styles from './AspectList.module.css';

const ASPECT_COLORS = {
  conjunction: '#FFD700',
  sextile: '#4A9EFF',
  square: '#FF6B6B',
  trine: '#50C878',
  opposition: '#D946EF',
};

const ASPECT_SYMBOLS = {
  conjunction: '☌',
  sextile: '⚹',
  square: '□',
  trine: '△',
  opposition: '☍',
};

export default function AspectList({ aspects }) {
  if (!aspects || aspects.length === 0) return null;

  return (
    <motion.div
      className={`oracle-card ${styles.container}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <h3 className={`glow-text ${styles.title}`}>Major Aspects</h3>
      <div className={styles.list}>
        {aspects.slice(0, 15).map((a, i) => (
          <motion.div
            key={`${a.planet1}-${a.planet2}-${a.type}`}
            className={styles.aspectRow}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.04 }}
          >
            <span
              className={styles.symbol}
              style={{ color: ASPECT_COLORS[a.type] }}
            >
              {ASPECT_SYMBOLS[a.type]}
            </span>
            <span className={styles.planets}>
              {a.planet1} — {a.planet2}
            </span>
            <span className={styles.type}>{a.type}</span>
            <span className={styles.orb}>{a.orb.toFixed(1)}°</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

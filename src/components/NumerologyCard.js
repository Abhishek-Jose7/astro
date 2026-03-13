'use client';

import { motion } from 'framer-motion';
import styles from './NumerologyCard.module.css';

export default function NumerologyCard({ numerology }) {
  if (!numerology) return null;

  return (
    <motion.div
      className={`oracle-card ${styles.container}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <h3 className={`glow-text ${styles.title}`}>Numerology</h3>
      <div className={styles.grid}>
        <div className={styles.numBox}>
          <div className={styles.number}>{numerology.lifePath}</div>
          <div className={styles.label}>Life Path</div>
        </div>
        <div className={styles.numBox}>
          <div className={styles.number}>{numerology.destiny || '—'}</div>
          <div className={styles.label}>Destiny</div>
        </div>
        <div className={styles.numBox}>
          <div className={styles.number}>{numerology.personality || '—'}</div>
          <div className={styles.label}>Personality</div>
        </div>
      </div>
      {numerology.description && (
        <p className={styles.description}>{numerology.description}</p>
      )}
    </motion.div>
  );
}

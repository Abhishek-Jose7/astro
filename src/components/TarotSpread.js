'use client';

import { motion } from 'framer-motion';
import styles from './TarotSpread.module.css';

function TarotCard({ entry, index }) {
  const isReversed = entry.orientation === 'Reversed';

  return (
    <motion.article
      className={styles.cardWrap}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 * index, duration: 0.55 }}
    >
      <header className={styles.cardHeader}>
        <span className={styles.positionLabel}>{entry.position.title}</span>
        <span className={styles.positionPrompt}>{entry.position.prompt}</span>
      </header>

      <div className={`${styles.card} ${styles[entry.card.palette]}`}>
        <div className={`${styles.cardFace} ${isReversed ? styles.reversed : ''}`}>
          <div className={styles.cardTop}>
            <span className={styles.arcana}>{entry.card.number}</span>
            <span className={styles.orientation}>{entry.orientation}</span>
          </div>

          <div className={styles.symbol}>{entry.card.icon}</div>
          <h3 className={styles.cardName}>{entry.card.name}</h3>

          <div className={styles.keywords}>
            {entry.keywords.map((keyword) => (
              <span key={keyword} className={styles.keywordChip}>{keyword}</span>
            ))}
          </div>
        </div>
      </div>

      <p className={styles.cardMessage}>{entry.message}</p>
    </motion.article>
  );
}

export default function TarotSpread({ tarot }) {
  if (!tarot?.cards?.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Tarot Chamber</p>
        <h2 className={styles.title}>Three-Card Psychic Draw</h2>
        <p className={styles.subtitle}>{tarot.summary}</p>
      </div>

      <div className={styles.grid}>
        {tarot.cards.map((entry, index) => (
          <TarotCard key={`${entry.position.key}-${entry.card.id}`} entry={entry} index={index} />
        ))}
      </div>
    </section>
  );
}

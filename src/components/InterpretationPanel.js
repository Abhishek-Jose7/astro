'use client';

import { motion } from 'framer-motion';
import { SUN_SIGN_READINGS, MOON_SIGN_READINGS, RISING_SIGN_READINGS } from '@/data/interpretations';
import { ZODIAC_GLYPHS } from '@/glyphs/zodiac';
import styles from './InterpretationPanel.module.css';

function SignSection({ label, emoji, sign, reading, delay = 0 }) {
  if (!sign || !reading) return null;
  const glyph = ZODIAC_GLYPHS[sign.toLowerCase()];

  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className={styles.sectionHeader}>
        <span className={styles.emoji}>{emoji}</span>
        <span className={styles.sectionLabel}>{label}</span>
        <span className={`${styles.signBadge} ${styles[glyph?.element || 'fire']}`}>
          {glyph?.symbol} {sign}
        </span>
      </div>
      {reading.title && <h4 className={styles.readingTitle}>{reading.title}</h4>}
      <p className={styles.readingText}>{reading.reading || reading}</p>
    </motion.div>
  );
}

export default function InterpretationPanel({ planets }) {
  if (!planets) return null;

  const sunSign = planets.sun?.sign?.toLowerCase();
  const moonSign = planets.moon?.sign?.toLowerCase();
  const risingSign = planets.ascendant?.toLowerCase?.() || null;

  const sunReading = sunSign ? SUN_SIGN_READINGS[sunSign] : null;
  const moonReading = moonSign ? MOON_SIGN_READINGS[moonSign] : null;
  const risingReading = risingSign ? RISING_SIGN_READINGS[risingSign] : null;

  if (!sunReading && !moonReading) return null;

  return (
    <motion.div
      className={`oracle-card ${styles.container}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <h3 className={`glow-text ${styles.title}`}>Your Cosmic Reading</h3>
      <div className={styles.divider} />

      <SignSection
        label="Sun Sign"
        emoji="☀️"
        sign={planets.sun?.sign}
        reading={sunReading}
        delay={0.4}
      />

      <SignSection
        label="Moon Sign"
        emoji="🌙"
        sign={planets.moon?.sign}
        reading={moonReading}
        delay={0.6}
      />

      {risingReading && (
        <SignSection
          label="Rising Sign"
          emoji="⬆️"
          sign={risingSign}
          reading={{ reading: risingReading }}
          delay={0.8}
        />
      )}
    </motion.div>
  );
}

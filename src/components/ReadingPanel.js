'use client';

import { motion } from 'framer-motion';
import ElementBar from './ElementBar';
import NumerologyCard from './NumerologyCard';
import ComprehensiveReport from './ComprehensiveReport';
import TarotSpread from './TarotSpread';
import styles from './ReadingPanel.module.css';

// Back arrow SVG
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Pulsing orb for fortune banner
const FortuneGlyph = () => (
  <div className={styles.fortuneOrbWrap}>
    <motion.div
      className={styles.fortuneOrbPulse}
      animate={{ scale: [1, 1.18, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.fortuneOrbSvg}>
      <circle cx="28" cy="28" r="26" stroke="rgba(124,92,191,0.5)" strokeWidth="1" />
      <circle cx="28" cy="28" r="18" stroke="rgba(196,160,85,0.35)" strokeWidth="0.8" strokeDasharray="3 5" />
      <circle cx="28" cy="28" r="8" fill="rgba(124,92,191,0.4)" />
      <circle cx="28" cy="28" r="4" fill="rgba(196,160,85,0.7)" />
    </svg>
  </div>
);

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] } },
};

export default function ReadingPanel({ reading, birthData, onBack }) {
  return (
    <div className={styles.container}>
      {/* Mystic Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      >
        <button className={styles.backBtn} onClick={onBack}>
          <BackIcon />
          New Reading
        </button>

        <div className={styles.headerCenter}>
          <p className={styles.headerEyebrow}>Oracle Ledger</p>
          <motion.h1
            className={styles.headerTitle}
            animate={{
              textShadow: [
                '0 0 20px rgba(124,92,191,0.3)',
                '0 0 40px rgba(124,92,191,0.6)',
                '0 0 20px rgba(124,92,191,0.3)',
              ],
            }}
            transition={{ duration: 3.5, repeat: Infinity }}
          >
            {reading.birthData?.name}
          </motion.h1>
          <p className={styles.meta}>
            Born {new Date(birthData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className={styles.sunSignBadge}>
          <span className={styles.signSymbol}>{reading.sunSign?.symbol}</span>
          <div>
            <p className={styles.signLabel}>Sun Sign</p>
            <p className={styles.signName}>{reading.sunSign?.name}</p>
          </div>
        </div>
      </motion.div>

      {/* Fortune Banner */}
      <motion.div
        className={styles.fortuneBanner}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <FortuneGlyph />
        <p className={styles.fortuneMessage}>{reading.fortune?.message}</p>
      </motion.div>

      {/* Lucky Vitals Grid */}
      <motion.section
        className={styles.luckyGrid}
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {[
          { num: 'I',   label: 'Lucky Numbers', value: reading.fortune?.luckyNumbers?.join(' · ') },
          { num: 'II',  label: 'Lucky Colors',  value: reading.fortune?.luckyColors?.join(' · ') },
          { num: 'III', label: 'Lucky Day',     value: reading.fortune?.luckyDay },
          { num: 'IV',  label: 'Power Hour',    value: reading.fortune?.powerHour },
        ].map((item, i) => (
          <motion.div
            key={item.num}
            className={`${styles.luckyCard} ${styles[`luckyCard${i + 1}`]}`}
            variants={fadeUp}
          >
            <span className={styles.luckyNum}>{item.num}</span>
            <span className={styles.luckyLabel}>{item.label}</span>
            <span className={styles.luckyValue}>{item.value}</span>
          </motion.div>
        ))}
      </motion.section>

      <TarotSpread tarot={reading.tarot} />

      {/* Element Balance + Numerology */}
      <section className={styles.twoCol}>
        <motion.div className={styles.panelA} variants={fadeUp} initial="hidden" animate="visible">
          <ElementBar balance={reading.elementBalance} />
        </motion.div>
        <motion.div className={styles.panelB} variants={fadeUp} initial="hidden" animate="visible">
          <NumerologyCard numerology={reading.numerology} />
        </motion.div>
      </section>

      {/* Comprehensive Analysis */}
      {reading.nameNumerology && reading.demographics && (
        <section className={styles.section}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className={styles.reportHeader}>
              <div className={styles.reportHeaderLine} />
              <h2 className={styles.reportTitle}>The Deep Dive</h2>
              <div className={styles.reportHeaderLine} />
            </div>
            <p className={styles.reportSubtitle}>
              Full-spectrum profile: numerology, psychology, romance, and pattern analysis
            </p>
            <ComprehensiveReport reading={reading} />
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <motion.footer
        className={styles.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p>The future responds to choices. Let this reading sharpen your next one.</p>
        <p className={styles.disclaimer}>Reflective entertainment only. Your decisions remain your own.</p>
      </motion.footer>
    </div>
  );
}

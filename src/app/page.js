'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import StarField from '@/components/StarField';
import BirthForm from '@/components/BirthForm';
import ReadingPanel from '@/components/ReadingPanel';
import { castChart } from '@/engine/castChart';
import { saveReading, getLastReading } from '@/engine/persistence';
import styles from './page.module.css';

// Isolated perpetual sigil orb — never triggers parent re-renders
const SigilOrb = () => (
  <motion.div
    className={styles.sigilOrb}
    animate={{ rotate: 360 }}
    transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
  >
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.sigilSvg}>
      <circle cx="100" cy="100" r="94" stroke="rgba(124,92,191,0.28)" strokeWidth="1" />
      <circle cx="100" cy="100" r="70" stroke="rgba(196,160,85,0.22)" strokeWidth="0.8" strokeDasharray="4 8" />
      <circle cx="100" cy="100" r="46" stroke="rgba(124,92,191,0.18)" strokeWidth="0.6" />
      {/* Pentagram lines */}
      <path d="M100 10 L121 76 L190 76 L134 117 L156 183 L100 142 L44 183 L66 117 L10 76 L79 76 Z"
        stroke="rgba(196,160,85,0.3)" strokeWidth="0.8" fill="none" />
      {/* Compass points */}
      <line x1="100" y1="6" x2="100" y2="20" stroke="rgba(196,160,85,0.5)" strokeWidth="1" />
      <line x1="194" y1="100" x2="180" y2="100" stroke="rgba(196,160,85,0.5)" strokeWidth="1" />
      <line x1="100" y1="194" x2="100" y2="180" stroke="rgba(196,160,85,0.5)" strokeWidth="1" />
      <line x1="6" y1="100" x2="20" y2="100" stroke="rgba(196,160,85,0.5)" strokeWidth="1" />
      <circle cx="100" cy="100" r="5" fill="rgba(196,160,85,0.6)" />
    </svg>
  </motion.div>
);

// Isolated floating rune symbols
const FloatingRunes = () => {
  const runes = [
    { glyph: 'ᚨ', x: '8%', y: '18%', delay: 0 },
    { glyph: 'ᚷ', x: '88%', y: '12%', delay: 1.2 },
    { glyph: 'ᛏ', x: '4%', y: '72%', delay: 2.4 },
    { glyph: 'ᚱ', x: '92%', y: '68%', delay: 0.8 },
    { glyph: 'ᛉ', x: '50%', y: '5%', delay: 1.8 },
    { glyph: 'ᚹ', x: '78%', y: '85%', delay: 3.0 },
    { glyph: 'ᛋ', x: '22%', y: '88%', delay: 0.4 },
  ];

  return (
    <div className={styles.runesLayer} aria-hidden="true">
      {runes.map((r, i) => (
        <motion.span
          key={i}
          className={styles.rune}
          style={{ left: r.x, top: r.y }}
          animate={{ opacity: [0.07, 0.22, 0.07], y: [0, -12, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, delay: r.delay, ease: 'easeInOut' }}
        >
          {r.glyph}
        </motion.span>
      ))}
    </div>
  );
};

// Candle flicker SVG
const CandleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="10" width="6" height="12" rx="1" fill="currentColor" opacity="0.7" />
    <path d="M12 10 C11 7 10 5 12 2 C14 5 13 7 12 10Z" fill="currentColor" />
    <line x1="12" y1="22" x2="12" y2="22" stroke="currentColor" />
  </svg>
);

const FEATURES = [
  { num: '01', label: 'Destiny Index', icon: <path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 21 12 16.5 5.8 21l2.4-7.1L2 9.4h7.6Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /> },
  { num: '02', label: 'Soul Signature', icon: <><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></> },
  { num: '03', label: 'Zodiac Motif', icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3l1.5 4.5L18 11l-4.5 1.5L12 17l-1.5-4.5L6 11l4.5-1.5L12 5z" fill="none" stroke="currentColor" strokeWidth="1.2" /> },
  { num: '04', label: 'Love Forecast', icon: <path d="M12 21C12 21 3 15.5 3 9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-9 12-9 12Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /> },
  { num: '05', label: 'Career Arc', icon: <><path d="M2 20h20M5 20V10l7-7 7 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><rect x="9" y="14" width="6" height="6" stroke="currentColor" strokeWidth="1.5" /></> },
  { num: '06', label: 'Fortune Codes', icon: <><path d="M9 19V6l12-3v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="6" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" /><circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" /></> },
];

export default function HomePage() {
  const [view, setView] = useState('form');
  const [reading, setReading] = useState(null);
  const [birthData, setBirthData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = getLastReading();
    if (saved?.reading && saved?.birthData) {
      setReading(saved.reading);
      setBirthData(saved.birthData);
      setView('reading');
    }
  }, []);

  function handleSubmit(data) {
    setLoading(true);
    setTimeout(() => {
      try {
        const result = castChart(data);
        setReading(result);
        setBirthData(data);
        setView('reading');
        saveReading(result, data);
      } catch (err) {
        console.error('Chart calculation error:', err);
      } finally {
        setLoading(false);
      }
    }, 900);
  }

  function handleBack() {
    setView('form');
    setReading(null);
    setBirthData(null);
  }

  return (
    <main className={styles.main}>
      <StarField />

      <AnimatePresence mode="wait">
        {view === 'form' ? (
          <motion.div
            key="form-view"
            className={styles.formView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.6 }}
          >
            <FloatingRunes />

            {/* Asymmetric Split: Left Hero / Right Form */}
            <div className={styles.splitLayout}>
              {/* ── Left Side: Hero ── */}
              <motion.div
                className={styles.heroSide}
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
              >
                <SigilOrb />

                <div className={styles.heroContent}>
                  <motion.p
                    className={styles.eyebrow}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                  >
                    <span className={styles.eyebrowDot} /> Psychic Reading Studio
                  </motion.p>

                  <motion.h1
                    className={styles.heroTitle}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <span className={styles.heroLine1}>The Velvet</span>
                    <span className={styles.heroLine2}>Oracle</span>
                  </motion.h1>

                  <motion.p
                    className={styles.tagline}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.8 }}
                  >
                    Where celestial mechanics meets ancient psychic tradition.
                    Your birth moment holds a precise cosmic signature — let the Oracle decode it.
                  </motion.p>

                  <motion.div
                    className={styles.divider}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.85, duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                  />

                  {/* Feature Grid */}
                  <motion.div
                    className={styles.features}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.7 }}
                  >
                    {FEATURES.map((f, i) => (
                      <motion.div
                        key={f.num}
                        className={styles.feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 + i * 0.08, duration: 0.5 }}
                      >
                        <span className={styles.featureNum}>{f.num}</span>
                        <svg className={styles.featureIconSvg} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {f.icon}
                        </svg>
                        <span className={styles.featureLabel}>{f.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* ── Right Side: Form ── */}
              <motion.div
                className={styles.formSide}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
              >
                <BirthForm onSubmit={handleSubmit} loading={loading} />
              </motion.div>
            </div>

            {/* Bottom ambient band */}
            <motion.div
              className={styles.ambientBand}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 1.0 }}
            >
              {['Numerology', 'Natal Chart', 'Tarot Draw', 'Elemental Balance', 'Fortune Codes', 'Name Vibration', 'Life Path'].map((t, i) => (
                <span key={i} className={styles.bandItem}>{t}</span>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="reading-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ReadingPanel
              reading={reading}
              birthData={birthData}
              onBack={handleBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

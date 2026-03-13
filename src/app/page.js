'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
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

const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 4h8l-2 5 3 3-1 1-4-2-2 7-1-1 2-7-4 2-1-1 3-3-2-5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const MatchboxIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 10h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const EyeCharmIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 12C4.8 8.3 8.1 6.5 12 6.5s7.2 1.8 9.5 5.5c-2.3 3.7-5.6 5.5-9.5 5.5S4.8 15.7 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const FEATURES = [
  { num: '01', label: 'Pendulum read', note: 'micro-timings and instincts', icon: <path d="M12 3v6l4 7a4 4 0 1 1-8 0l4-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /> },
  { num: '02', label: 'Wax-sealed clues', note: 'motives, blocks, repeats', icon: <><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></> },
  { num: '03', label: 'Zodiac ledger', note: 'angles, patterns, signatures', icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3l1.5 4.5L18 11l-4.5 1.5L12 17l-1.5-4.5L6 11l4.5-1.5L12 5z" fill="none" stroke="currentColor" strokeWidth="1.2" /> },
  { num: '04', label: 'Heart weather', note: 'attachments and timing', icon: <path d="M12 21C12 21 3 15.5 3 9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-9 12-9 12Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /> },
  { num: '05', label: 'Work omen', note: 'career arcs and pressure points', icon: <><path d="M2 20h20M5 20V10l7-7 7 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><rect x="9" y="14" width="6" height="6" stroke="currentColor" strokeWidth="1.5" /></> },
  { num: '06', label: 'Tarot spill', note: 'short-range future pressure', icon: <><path d="M9 19V6l12-3v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="6" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" /><circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" /></> },
];

const OBJECTS = [
  { label: 'Brass pendulum', meta: 'swing test', icon: <EyeCharmIcon /> },
  { label: 'Matchbook notes', meta: 'quick tells', icon: <MatchboxIcon /> },
  { label: 'Pinned vellum', meta: 'birth clues', icon: <PinIcon /> },
];

function TiltCard({ className, children, tilt = 10, ...motionProps }) {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 180, damping: 22, mass: 0.5 });
  const sy = useSpring(ry, { stiffness: 180, damping: 22, mass: 0.5 });

  function onMove(event) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rx.set((0.5 - py) * tilt);
    ry.set((px - 0.5) * tilt);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: sx, rotateY: sy, transformStyle: 'preserve-3d' }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

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

            <div className={styles.salonLayout}>
              <motion.section
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
                    <span className={styles.eyebrowDot} /> Midnight Reading Room
                  </motion.p>

                  <motion.h1
                    className={styles.heroTitle}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <span className={styles.heroLine1}>The</span>
                    <span className={styles.heroLine2}>Oracle</span>
                  </motion.h1>

                  <motion.p
                    className={styles.tagline}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.8 }}
                  >
                    Smoked glass, candle wax, brass trinkets, handwritten cards, and one unnervingly specific reading.
                    Bring a name and a birth date. Leave with the pattern underneath both.
                  </motion.p>

                  <motion.div
                    className={styles.divider}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.85, duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                  />

                  <motion.div
                    className={styles.objectRow}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.7 }}
                  >
                    {OBJECTS.map((item, i) => (
                      <TiltCard
                        key={item.label}
                        className={styles.objectCard}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 + i * 0.08, duration: 0.5 }}
                        tilt={8}
                      >
                        <span className={styles.objectIcon}>{item.icon}</span>
                        <span className={styles.objectLabel}>{item.label}</span>
                        <span className={styles.objectMeta}>{item.meta}</span>
                      </TiltCard>
                    ))}
                  </motion.div>
                </div>
              </motion.section>

              <TiltCard
                className={styles.notePanel}
                initial={{ opacity: 0, y: 28, rotate: -5 }}
                animate={{ opacity: 1, y: 0, rotate: -3 }}
                transition={{ delay: 0.35, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                tilt={6}
              >
                <span className={styles.notePin}><PinIcon /></span>
                <p className={styles.noteEyebrow}>Pinned To The Table</p>
                <h2 className={styles.noteTitle}>Tonight's spread has teeth.</h2>
                <div className={styles.noteList}>
                  {FEATURES.slice(0, 3).map((item) => (
                    <div key={item.num} className={styles.noteItem}>
                      <svg className={styles.noteIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {item.icon}
                      </svg>
                      <div>
                        <p className={styles.noteItemLabel}>{item.label}</p>
                        <p className={styles.noteItemMeta}>{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TiltCard>

              <motion.section
                className={styles.formSide}
                initial={{ opacity: 0, x: 60, y: 22 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.2, duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className={styles.formLabel}>Reservation slip</div>
                <BirthForm onSubmit={handleSubmit} loading={loading} />
              </motion.section>

              <motion.section
                className={styles.features}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.9 }}
              >
                {FEATURES.map((f, i) => (
                  <TiltCard
                    key={f.num}
                    className={styles.feature}
                    initial={{ opacity: 0, y: 20, rotate: i % 2 === 0 ? -4 : 5 }}
                    animate={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -4 : 5 }}
                    transition={{ delay: 0.7 + i * 0.07, duration: 0.5 }}
                    tilt={12}
                  >
                    <span className={styles.featureNum}>{f.num}</span>
                    <svg className={styles.featureIconSvg} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {f.icon}
                    </svg>
                    <span className={styles.featureLabel}>{f.label}</span>
                    <span className={styles.featureMeta}>{f.note}</span>
                  </TiltCard>
                ))}
              </motion.section>
            </div>

            <motion.div
              className={styles.ambientBand}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 1.0 }}
            >
              {['Smoked mirror', 'Tarot backs', 'Pinned vellum', 'Wax marks', 'Birth ledger', 'Glass tokens', 'Brass pendulum'].map((t, i) => (
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

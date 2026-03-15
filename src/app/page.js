'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion';
import StarField from '@/components/StarField';
import BirthForm from '@/components/BirthForm';
import ReadingPanel from '@/components/ReadingPanel';
import { castChart } from '@/engine/castChart';
import { saveReading, getLastReading } from '@/engine/persistence';
import styles from './page.module.css';

// ─────────────────────────────────────────────
// CONSTELLATION DATA
// ─────────────────────────────────────────────
const STARS = [
  { id: 0,  x: 50,  y: 44, r: 3.2, bright: true  },  // ← the chosen star, dead centre
  { id: 1,  x: 32,  y: 28, r: 1.4, bright: false },
  { id: 2,  x: 44,  y: 22, r: 1.8, bright: false },
  { id: 3,  x: 58,  y: 20, r: 1.2, bright: false },
  { id: 4,  x: 70,  y: 32, r: 1.6, bright: false },
  { id: 5,  x: 74,  y: 48, r: 1.3, bright: false },
  { id: 6,  x: 64,  y: 60, r: 2.0, bright: false },
  { id: 7,  x: 40,  y: 62, r: 1.5, bright: false },
  { id: 8,  x: 26,  y: 54, r: 1.1, bright: false },
  { id: 9,  x: 22,  y: 40, r: 1.7, bright: false },
  { id: 10, x: 37,  y: 14, r: 1.0, bright: false },
  { id: 11, x: 62,  y: 12, r: 1.3, bright: false },
  { id: 12, x: 80,  y: 22, r: 0.9, bright: false },
  { id: 13, x: 85,  y: 58, r: 1.1, bright: false },
  { id: 14, x: 18,  y: 68, r: 1.0, bright: false },
  { id: 15, x: 55,  y: 72, r: 1.2, bright: false },
  { id: 16, x: 12,  y: 30, r: 0.8, bright: false },
  { id: 17, x: 88,  y: 40, r: 0.9, bright: false },
];

// Lines connecting stars (pairs of star IDs)
const LINES = [
  [0,2],[0,4],[0,7],[0,9],
  [1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,1],
  [2,10],[3,11],[10,11],[11,12],[12,13],[5,13],
  [8,14],[14,15],[15,6],[7,15],
  [1,16],[9,16],[4,17],[5,17],
];

// ─────────────────────────────────────────────
// CONSTELLATION PRELOADER
// ─────────────────────────────────────────────
function ConstellationPreloader({ onDone }) {
  const [phase, setPhase] = useState('draw');   // draw | pulse | zoom | flash
  const svgRef = useRef(null);

  useEffect(() => {
    // Phase timeline
    const t1 = setTimeout(() => setPhase('pulse'),  2200);
    const t2 = setTimeout(() => setPhase('zoom'),   3400);
    const t3 = setTimeout(() => setPhase('flash'),  5000);
    const t4 = setTimeout(() => onDone(),           5700);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, [onDone]);

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => ({
      pathLength: 1,
      opacity: 0.22,
      transition: { duration: 0.55, delay: 0.04 * i, ease: 'easeOut' },
    }),
  };

  const starVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: STARS[i].bright ? 1 : 0.7,
      transition: { duration: 0.4, delay: 0.03 * i + 0.1, ease: [0.23,1,0.32,1] },
    }),
  };

  // Zoom: scale up toward the chosen star at 50%,44%
  const zoomAnim = phase === 'zoom' || phase === 'flash'
    ? { scale: 18, x: '-50%', y: '-44%', transition: { duration: 1.6, ease: [0.4,0,0.1,1] } }
    : {};

  const flashAnim = phase === 'flash'
    ? { opacity: 0, transition: { duration: 0.35, delay: 0.1 } }
    : {};

  return (
    <motion.div
      className={styles.preloader}
      {...flashAnim}
    >
      {/* Deep space background pulse */}
      <motion.div
        className={styles.preloaderBg}
        animate={phase === 'pulse' || phase === 'zoom'
          ? { opacity: [0.6,1,0.6], transition: { duration: 1.2, repeat: 2 } }
          : {}}
      />

      {/* SVG constellation — zooms toward chosen star */}
      <motion.div
        className={styles.constellationWrap}
        style={{ transformOrigin: '50% 44%' }}
        animate={zoomAnim}
      >
        <svg
          ref={svgRef}
          className={styles.constellationSvg}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Lines */}
          {LINES.map(([a,b], i) => {
            const A = STARS[a], B = STARS[b];
            return (
              <motion.line
                key={`l-${a}-${b}`}
                x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                stroke="rgba(196,160,85,0.55)"
                strokeWidth="0.18"
                custom={i}
                variants={lineVariants}
                initial="hidden"
                animate="visible"
              />
            );
          })}

          {/* Dim stars */}
          {STARS.filter(s => !s.bright).map((s, idx) => (
            <motion.g key={s.id} custom={s.id} variants={starVariants} initial="hidden" animate="visible">
              <motion.circle
                cx={s.x} cy={s.y} r={s.r * 1.8}
                fill="rgba(196,160,85,0.08)"
                animate={{ r: [s.r * 1.8, s.r * 2.8, s.r * 1.8] }}
                transition={{ duration: 2.8 + idx * 0.3, repeat: Infinity, ease: 'easeInOut' }}
              />
              <circle cx={s.x} cy={s.y} r={s.r} fill="rgba(230,218,255,0.85)" />
            </motion.g>
          ))}

          {/* The chosen bright star — extra glow rings */}
          {(() => {
            const s = STARS[0];
            return (
              <motion.g custom={0} variants={starVariants} initial="hidden" animate="visible">
                {/* Outer pulse ring */}
                <motion.circle
                  cx={s.x} cy={s.y} r={s.r * 5}
                  fill="none"
                  stroke="rgba(196,160,85,0.18)"
                  strokeWidth="0.3"
                  animate={phase === 'pulse' || phase === 'zoom'
                    ? { r: [s.r*5, s.r*9, s.r*5], opacity: [0.3,0,0.3] }
                    : {}}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.circle
                  cx={s.x} cy={s.y} r={s.r * 3}
                  fill="rgba(196,160,85,0.15)"
                  animate={{ r: [s.r*3, s.r*4.5, s.r*3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <circle cx={s.x} cy={s.y} r={s.r} fill="#f0d488" filter="url(#brightGlow)" />
                {/* 4-point star spike */}
                <motion.path
                  d={`M${s.x} ${s.y-s.r*3.5} L${s.x+0.3} ${s.y-0.3} L${s.x+s.r*3.5} ${s.y} L${s.x+0.3} ${s.y+0.3} L${s.x} ${s.y+s.r*3.5} L${s.x-0.3} ${s.y+0.3} L${s.x-s.r*3.5} ${s.y} L${s.x-0.3} ${s.y-0.3} Z`}
                  fill="rgba(240,212,138,0.55)"
                  animate={phase === 'pulse' || phase === 'zoom'
                    ? { opacity: [0.5,1,0.5], scale:[1,1.3,1], transformOrigin:`${s.x}px ${s.y}px` }
                    : { opacity: 0.5 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />

                <defs>
                  <filter id="brightGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="0.8" result="blur" />
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
              </motion.g>
            );
          })()}
        </svg>
      </motion.div>

      {/* Label */}
      <motion.p
        className={styles.preloaderLabel}
        animate={phase === 'zoom' || phase === 'flash' ? { opacity: 0 } : { opacity: [0,1], transition: { delay: 1.8 } }}
      >
        reading the heavens&hellip;
      </motion.p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// CRYSTAL BALL SVG (reusable, size-controlled)
// ─────────────────────────────────────────────
function CrystalBallSvg({ id = 'main', className, swirling = false }) {
  const uid = `cb_${id}`;
  return (
    <svg className={className} viewBox="0 0 260 290" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stand */}
      <ellipse cx="130" cy="272" rx="54" ry="10" fill={`url(#${uid}sg)`} opacity="0.9" />
      <rect x="107" y="246" width="46" height="28" rx="7" fill={`url(#${uid}sb)`} />
      <ellipse cx="130" cy="246" rx="23" ry="8" fill={`url(#${uid}st)`} />
      {/* Ball shadow */}
      <ellipse cx="130" cy="242" rx="94" ry="14" fill="rgba(0,0,0,0.42)" />
      {/* Sphere */}
      <circle cx="130" cy="124" r="108" fill={`url(#${uid}bo)`} />
      <circle cx="130" cy="124" r="106" fill={`url(#${uid}bi)`} />
      {/* Nebulae */}
      <motion.ellipse
        cx="108" cy="104" rx="54" ry="40"
        fill={`url(#${uid}nv)`} opacity="0.38"
        style={{ transformOrigin: '108px 104px' }}
        animate={swirling ? { rotate: [0, 360] } : {}}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      />
      <motion.ellipse
        cx="158" cy="148" rx="42" ry="30"
        fill={`url(#${uid}nc)`} opacity="0.24"
        style={{ transformOrigin: '158px 148px' }}
        animate={swirling ? { rotate: [360, 0] } : {}}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
      />
      <ellipse cx="130" cy="116" rx="32" ry="50" fill={`url(#${uid}nd)`} opacity="0.3" />
      {/* Orbital rings */}
      <ellipse cx="130" cy="124" rx="104" ry="28" stroke="rgba(196,160,85,0.16)" strokeWidth="0.9" fill="none" transform="rotate(-12 130 124)" strokeDasharray="5 9" />
      <ellipse cx="130" cy="124" rx="82" ry="18" stroke="rgba(124,92,191,0.13)" strokeWidth="0.7" fill="none" transform="rotate(22 130 124)" strokeDasharray="3 11" />
      {/* Interior stars */}
      <circle cx="96"  cy="92"  r="1.5" fill="rgba(240,212,138,0.9)" />
      <circle cx="164" cy="86"  r="1.1" fill="rgba(240,212,138,0.7)" />
      <circle cx="150" cy="152" r="1.7" fill="rgba(200,180,255,0.85)"/>
      <circle cx="110" cy="160" r="1.0" fill="rgba(200,180,255,0.6)" />
      <circle cx="174" cy="128" r="1.3" fill="rgba(240,212,138,0.65)"/>
      <circle cx="84"  cy="140" r="1.1" fill="rgba(200,180,255,0.7)" />
      <circle cx="136" cy="70"  r="1.2" fill="rgba(240,212,138,0.8)" />
      <circle cx="118" cy="176" r="0.9" fill="rgba(200,180,255,0.5)" />
      {/* Sheen */}
      <ellipse cx="98" cy="82" rx="36" ry="24" fill={`url(#${uid}sh)`} opacity="0.44" transform="rotate(-20 98 82)" />
      <ellipse cx="90" cy="76" rx="15" ry="9" fill="rgba(255,255,255,0.2)" transform="rotate(-20 90 76)" />
      {/* Rim */}
      <circle cx="130" cy="124" r="106" stroke={`url(#${uid}rim)`} strokeWidth="1.5" fill="none" />

      <defs>
        <radialGradient id={`${uid}bo`} cx="38%" cy="34%" r="68%">
          <stop offset="0%"   stopColor="#1e1040" />
          <stop offset="55%"  stopColor="#0d0820" />
          <stop offset="100%" stopColor="#030208" />
        </radialGradient>
        <radialGradient id={`${uid}bi`} cx="42%" cy="36%" r="72%">
          <stop offset="0%"   stopColor="rgba(80,50,160,0.0)" />
          <stop offset="50%"  stopColor="rgba(40,20,90,0.4)" />
          <stop offset="100%" stopColor="rgba(5,3,15,0.9)" />
        </radialGradient>
        <radialGradient id={`${uid}nv`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#7c5cbf" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id={`${uid}nc`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#8b2252" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id={`${uid}nd`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#3a1870" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id={`${uid}sh`} cx="35%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id={`${uid}rim`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="rgba(196,160,85,0.38)" />
          <stop offset="50%"  stopColor="rgba(200,180,255,0.22)" />
          <stop offset="100%" stopColor="rgba(91,63,160,0.32)" />
        </linearGradient>
        <linearGradient id={`${uid}sg`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#2a1a0e" />
          <stop offset="50%"  stopColor="#6b4c1e" />
          <stop offset="100%" stopColor="#2a1a0e" />
        </linearGradient>
        <linearGradient id={`${uid}sb`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#1e1208" />
          <stop offset="50%"  stopColor="#4a3212" />
          <stop offset="100%" stopColor="#1e1208" />
        </linearGradient>
        <linearGradient id={`${uid}st`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#2e1e0a" />
          <stop offset="50%"  stopColor="#8a6022" />
          <stop offset="100%" stopColor="#2e1e0a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─────────────────────────────────────────────
// FORM SCENE — crystal ball with form inside
// ─────────────────────────────────────────────
function CrystalFormScene({ onSubmit, loading, sucking }) {
  return (
    <div className={styles.formScene}>
      {/* Ball */}
      <motion.div
        className={styles.ballOuter}
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
      >
        <CrystalBallSvg id="form" className={styles.ballSvgFull} swirling />

        {/* Ambient glow rings */}
        <motion.div
          className={styles.ballGlowRing}
          animate={{ scale: [1, 1.22, 1], opacity: [0.18, 0.04, 0.18] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Form floats INSIDE the ball visually */}
        <motion.div
          className={styles.formInsideBall}
          animate={sucking
            ? { scale: 0.0, opacity: 0, y: 60, filter: 'blur(18px)' }
            : { scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }
          }
          transition={sucking
            ? { duration: 0.75, ease: [0.7, 0, 1, 0.5] }
            : { duration: 0.5, ease: 'easeOut' }
          }
        >
          <BirthForm onSubmit={onSubmit} loading={loading} />
        </motion.div>

        {/* Sucking particle burst when submitting */}
        {sucking && (
          <div className={styles.suckParticles} aria-hidden="true">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                className={styles.suckParticle}
                style={{
                  '--angle': `${i * 22.5}deg`,
                  '--dist': `${80 + Math.random() * 60}px`,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                transition={{ duration: 0.7, ease: [0.7, 0, 1, 0.5] }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Title above ball */}
      <motion.div
        className={styles.sceneTitle}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        <span className={styles.sceneTitleEye}>◉</span>
        <span>The Oracle</span>
        <span className={styles.sceneTitleEye}>◉</span>
      </motion.div>

      <motion.p
        className={styles.sceneSubtitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.6 }}
      >
        speak your name into the void
      </motion.p>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function HomePage() {
  // phases: 'preloader' | 'form' | 'sucking' | 'reading'
  const [phase, setPhase] = useState('preloader');
  const [reading, setReading]     = useState(null);
  const [birthData, setBirthData] = useState(null);

  useEffect(() => {
    const saved = getLastReading();
    if (saved?.reading && saved?.birthData) {
      setReading(saved.reading);
      setBirthData(saved.birthData);
      // Even with saved data, show the preloader first
    }
  }, []);

  const handlePreloaderDone = useCallback(() => {
    setPhase('form');
  }, []);

  function handleSubmit(data) {
    setPhase('sucking');
    setTimeout(() => {
      try {
        const result = castChart(data);
        setReading(result);
        setBirthData(data);
        saveReading(result, data);
        setPhase('reading');
      } catch (err) {
        console.error('Chart error:', err);
        setPhase('form');
      }
    }, 1100);
  }

  function handleBack() {
    setPhase('form');
    setReading(null);
    setBirthData(null);
  }

  return (
    <main className={styles.main}>
      <StarField />

      <AnimatePresence mode="wait">

        {phase === 'preloader' && (
          <motion.div key="preloader" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <ConstellationPreloader onDone={handlePreloaderDone} />
          </motion.div>
        )}

        {(phase === 'form' || phase === 'sucking') && (
          <motion.div
            key="form"
            className={styles.formPhase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.55 }}
          >
            <CrystalFormScene
              onSubmit={handleSubmit}
              loading={phase === 'sucking'}
              sucking={phase === 'sucking'}
            />
          </motion.div>
        )}

        {phase === 'reading' && (
          <motion.div
            key="reading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
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

'use client';

import { motion } from 'framer-motion';
import { ZODIAC_GLYPHS } from '@/glyphs/zodiac';
import { PLANET_GLYPHS } from '@/glyphs/planets';
import styles from './ChartWheel.module.css';

const SIZE = 400;
const CENTER = SIZE / 2;
const OUTER_R = 180;
const SIGN_R = 160;
const PLANET_R = 120;
const INNER_R = 100;

function deg2rad(deg) { return deg * Math.PI / 180; }
function polarToXY(cx, cy, r, angleDeg) {
  const rad = deg2rad(angleDeg - 90); // Start from top
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

export default function ChartWheel({ planets, houses, ascendant }) {
  const ascOffset = ascendant || 0;
  const signNames = Object.keys(ZODIAC_GLYPHS);

  // Zodiac sign labels around the outer ring
  const signLabels = signNames.map((name, i) => {
    const midAngle = (i * 30 + 15) - ascOffset;
    const pos = polarToXY(CENTER, CENTER, SIGN_R, midAngle);
    const glyph = ZODIAC_GLYPHS[name];
    return (
      <text
        key={name}
        x={pos.x}
        y={pos.y}
        className={`${styles.signLabel} ${styles[glyph.element]}`}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="16"
      >
        {glyph.symbol}
      </text>
    );
  });

  // Sign division lines
  const signLines = Array.from({ length: 12 }, (_, i) => {
    const angle = i * 30 - ascOffset;
    const p1 = polarToXY(CENTER, CENTER, INNER_R, angle);
    const p2 = polarToXY(CENTER, CENTER, OUTER_R, angle);
    return (
      <line
        key={`sign-line-${i}`}
        x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
        className={styles.signLine}
      />
    );
  });

  // House cusp lines (if houses are available)
  const houseLines = houses?.cusps?.map((cusp, i) => {
    const angle = cusp - ascOffset;
    const p1 = polarToXY(CENTER, CENTER, INNER_R - 20, angle);
    const p2 = polarToXY(CENTER, CENTER, INNER_R, angle);
    return (
      <line
        key={`house-line-${i}`}
        x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
        className={styles.houseLine}
      />
    );
  });

  // House numbers
  const houseNumbers = houses?.cusps?.map((cusp, i) => {
    const nextCusp = houses.cusps[(i + 1) % 12];
    let midAngle = cusp + ((nextCusp - cusp + 360) % 360) / 2;
    midAngle -= ascOffset;
    const pos = polarToXY(CENTER, CENTER, INNER_R - 35, midAngle);
    return (
      <text
        key={`house-num-${i}`}
        x={pos.x}
        y={pos.y}
        className={styles.houseNumber}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="10"
      >
        {i + 1}
      </text>
    );
  });

  // Planet positions
  const planetDots = planets ? Object.entries(planets).map(([name, data], idx) => {
    const angle = data.longitude - ascOffset;
    const spread = idx * 3; // Spread overlapping planets slightly
    const pos = polarToXY(CENTER, CENTER, PLANET_R + spread % 20 - 10, angle);
    const glyph = PLANET_GLYPHS[name];

    return (
      <motion.g
        key={name}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
      >
        <circle
          cx={pos.x}
          cy={pos.y}
          r="3"
          className={styles.planetDot}
        />
        <text
          x={pos.x}
          y={pos.y - 12}
          className={styles.planetGlyph}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="13"
        >
          {glyph?.symbol || '?'}
        </text>
      </motion.g>
    );
  }) : null;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={styles.svg}
        role="img"
        aria-label="Astrological natal chart wheel"
      >
        {/* Background circles */}
        <circle cx={CENTER} cy={CENTER} r={OUTER_R} className={styles.outerRing} />
        <circle cx={CENTER} cy={CENTER} r={INNER_R} className={styles.innerRing} />

        {/* Degree marks */}
        {Array.from({ length: 360 }, (_, i) => {
          if (i % 10 !== 0) return null;
          const angle = i - ascOffset;
          const tickLen = i % 30 === 0 ? 8 : 4;
          const p1 = polarToXY(CENTER, CENTER, OUTER_R - tickLen, angle);
          const p2 = polarToXY(CENTER, CENTER, OUTER_R, angle);
          return (
            <line
              key={`tick-${i}`}
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              className={styles.tickMark}
            />
          );
        })}

        {signLines}
        {signLabels}
        {houseLines}
        {houseNumbers}
        {planetDots}

        {/* Ascendant arrow */}
        {ascendant != null && (
          <g>
            <line
              x1={CENTER - OUTER_R - 10}
              y1={CENTER}
              x2={CENTER - INNER_R + 10}
              y2={CENTER}
              className={styles.ascLine}
            />
            <text
              x={CENTER - OUTER_R - 16}
              y={CENTER}
              className={styles.ascLabel}
              textAnchor="end"
              dominantBaseline="central"
              fontSize="11"
            >
              ASC
            </text>
          </g>
        )}
      </svg>
    </motion.div>
  );
}

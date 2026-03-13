'use client';

import { motion } from 'framer-motion';
import { ZODIAC_GLYPHS } from '@/glyphs/zodiac';
import { PLANET_GLYPHS } from '@/glyphs/planets';
import styles from './PlanetTable.module.css';

export default function PlanetTable({ planets }) {
  if (!planets || Object.keys(planets).length === 0) return null;

  return (
    <motion.div
      className={`oracle-card ${styles.container}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h3 className={`glow-text ${styles.title}`}>Planetary Positions</h3>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Planet</th>
              <th>Sign</th>
              <th>Longitude</th>
              <th>Retro</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(planets).map(([name, data], i) => {
              const planetGlyph = PLANET_GLYPHS[name];
              const signData = ZODIAC_GLYPHS[data.sign?.toLowerCase()];
              const deg = data.longitude?.toFixed(2);

              return (
                <motion.tr
                  key={name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <td className={styles.planetCell}>
                    <span className={styles.glyph}>{planetGlyph?.symbol}</span>
                    <span>{planetGlyph?.label || name}</span>
                  </td>
                  <td className={styles.signCell}>
                    <span className={styles[signData?.element]}>{signData?.symbol}</span>
                    <span>{data.sign}</span>
                  </td>
                  <td className={styles.degCell}>{deg}°</td>
                  <td className={styles.retroCell}>
                    {data.retrograde && <span className={styles.retroBadge}>℞</span>}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

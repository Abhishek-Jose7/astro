/**
 * Astrological aspects with standard orb tolerances.
 */
const ASPECT_TYPES = {
  conjunction: { angle: 0,   orb: 8, symbol: '☌', color: 'var(--aspect-conjunction)', label: 'Conjunction' },
  opposition:  { angle: 180, orb: 8, symbol: '☍', color: 'var(--aspect-opposition)',  label: 'Opposition' },
  trine:       { angle: 120, orb: 6, symbol: '△', color: 'var(--aspect-trine)',       label: 'Trine' },
  square:      { angle: 90,  orb: 6, symbol: '□', color: 'var(--aspect-square)',      label: 'Square' },
  sextile:     { angle: 60,  orb: 4, symbol: '⚹', color: 'var(--aspect-sextile)',    label: 'Sextile' },
};

/**
 * Calculate the shortest angular separation between two longitudes.
 */
function angularSeparation(lon1, lon2) {
  let diff = Math.abs(lon1 - lon2) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/**
 * Check if a given angular separation qualifies as a specific aspect.
 */
function identifyAspect(separation) {
  for (const [name, config] of Object.entries(ASPECT_TYPES)) {
    const orbDiff = Math.abs(separation - config.angle);
    if (orbDiff <= config.orb) {
      return {
        type: name,
        exactAngle: config.angle,
        actualOrb: parseFloat(orbDiff.toFixed(2)),
        symbol: config.symbol,
        color: config.color,
        label: config.label,
        quality: orbDiff < config.orb / 2 ? 'tight' : 'wide',
      };
    }
  }
  return null;
}

/**
 * Calculate all aspects between an array of planets.
 * @param {Object} planets - keyed by planet name, each with .longitude
 * @returns {Array<{ planet1, planet2, separation, ...aspect }>}
 */
export function calculateAspects(planets) {
  const aspects = [];
  const planetNames = Object.keys(planets);

  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      const name1 = planetNames[i];
      const name2 = planetNames[j];
      const lon1 = planets[name1].longitude;
      const lon2 = planets[name2].longitude;
      const separation = angularSeparation(lon1, lon2);
      const aspect = identifyAspect(separation);

      if (aspect) {
        aspects.push({
          planet1: name1,
          planet2: name2,
          separation: parseFloat(separation.toFixed(2)),
          ...aspect,
        });
      }
    }
  }

  return aspects;
}

export { ASPECT_TYPES };

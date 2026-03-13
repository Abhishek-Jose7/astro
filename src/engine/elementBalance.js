import { ZODIAC_GLYPHS } from '@/glyphs/zodiac';

const ELEMENT_SIGNS = {
  fire:  ['aries', 'leo', 'sagittarius'],
  earth: ['taurus', 'virgo', 'capricorn'],
  air:   ['gemini', 'libra', 'aquarius'],
  water: ['cancer', 'scorpio', 'pisces'],
};

const ELEMENT_DESCRIPTIONS = {
  fire:  'You burn with purpose — passionate, spontaneous, and fiercely alive. Fire-dominant souls lead with instinct and inspire through sheer force of will.',
  earth: 'You are grounded and deliberate — building, sustaining, and enduring. Earth-dominant souls create lasting foundations and find wisdom in patience.',
  air:   'You are an intellectual force — curious, communicative, and endlessly seeking connection through ideas. Air-dominant souls navigate life through the mind.',
  water: 'You feel everything deeply — intuitive, empathic, and profoundly connected to the invisible currents beneath the surface. Water-dominant souls navigate by emotion.',
};

/**
 * Compute elemental distribution from planet positions or sun sign.
 * @param {Object|null} planets - keyed by planet name, each with .sign property
 * @param {string|null} sunElement - optional element from sun sign when no planets
 * @returns {{ fire, earth, air, water, dominant, description, distribution }}
 */
export function calculateElementBalance(planets, sunElement = null) {
  // If no planets, use sun sign element
  if (!planets && sunElement) {
    const element = sunElement.toLowerCase();
    const counts = { fire: 0, earth: 0, air: 0, water: 0 };
    counts[element] = 1;
    
    const distribution = {};
    for (const [el, count] of Object.entries(counts)) {
      distribution[el] = {
        count,
        percentage: el === element ? 100 : 0,
        planets: el === element ? ['Sun'] : [],
      };
    }
    
    return {
      fire: counts.fire,
      earth: counts.earth,
      air: counts.air,
      water: counts.water,
      dominant: element,
      description: ELEMENT_DESCRIPTIONS[element],
      distribution,
    };
  }

  if (!planets) {
    return {
      fire: 0, earth: 0, air: 0, water: 0,
      dominant: 'fire',
      description: ELEMENT_DESCRIPTIONS.fire,
      distribution: {},
    };
  }

  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  const assignments = { fire: [], earth: [], air: [], water: [] };
  const totalPlanets = Object.keys(planets).length;

  for (const [name, planet] of Object.entries(planets)) {
    const sign = planet.sign?.toLowerCase();
    if (!sign) continue;

    for (const [element, signs] of Object.entries(ELEMENT_SIGNS)) {
      if (signs.includes(sign)) {
        counts[element]++;
        assignments[element].push(name);
        break;
      }
    }
  }

  // Find dominant element
  let dominant = 'fire';
  let maxCount = 0;
  for (const [element, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominant = element;
    }
  }

  // Calculate percentages
  const distribution = {};
  for (const [element, count] of Object.entries(counts)) {
    distribution[element] = {
      count,
      percentage: totalPlanets > 0 ? Math.round((count / totalPlanets) * 100) : 0,
      planets: assignments[element],
    };
  }

  return {
    ...counts,
    dominant,
    description: ELEMENT_DESCRIPTIONS[dominant],
    distribution,
    totalPlanets,
  };
}

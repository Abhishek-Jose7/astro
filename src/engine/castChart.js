/**
 * castChart.js — Fortune reading based on name and date of birth.
 * No astronomy required — pure numerology, name analysis, and cosmic wisdom.
 */

import { calculateLifePath, getLifePathMeaning } from './numerology';
import { calculateNameNumerology } from './nameNumerology';
import { calculateDemographics } from './demographic';
import { analyzeLetters } from './letterAnalysis';
import { calculateRomanticProfile } from './romantic';
import { calculatePersonalityCluster } from './personalityCluster';
import { calculateElementBalance } from './elementBalance';
import { drawTarotSpread } from './tarot';

// Sun sign data based on date
const ZODIAC_SIGNS = [
  { name: 'Capricorn', symbol: '♑', element: 'Earth', start: [1, 1], end: [1, 19] },
  { name: 'Aquarius', symbol: '♒', element: 'Air', start: [1, 20], end: [2, 18] },
  { name: 'Pisces', symbol: '♓', element: 'Water', start: [2, 19], end: [3, 20] },
  { name: 'Aries', symbol: '♈', element: 'Fire', start: [3, 21], end: [4, 19] },
  { name: 'Taurus', symbol: '♉', element: 'Earth', start: [4, 20], end: [5, 20] },
  { name: 'Gemini', symbol: '♊', element: 'Air', start: [5, 21], end: [6, 20] },
  { name: 'Cancer', symbol: '♋', element: 'Water', start: [6, 21], end: [7, 22] },
  { name: 'Leo', symbol: '♌', element: 'Fire', start: [7, 23], end: [8, 22] },
  { name: 'Virgo', symbol: '♍', element: 'Earth', start: [8, 23], end: [9, 22] },
  { name: 'Libra', symbol: '♎', element: 'Air', start: [9, 23], end: [10, 22] },
  { name: 'Scorpio', symbol: '♏', element: 'Water', start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', start: [11, 22], end: [12, 21] },
  { name: 'Capricorn', symbol: '♑', element: 'Earth', start: [12, 22], end: [12, 31] },
];

function getSunSign(month, day) {
  for (const sign of ZODIAC_SIGNS) {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    if ((month === sm && day >= sd) || (month === em && day <= ed)) {
      return sign;
    }
  }
  return ZODIAC_SIGNS[0]; // Capricorn fallback
}

// Fortune messages based on various combinations
const FORTUNE_VIBES = [
  "The cosmos whispers secrets meant only for your ears...",
  "Your energy radiates with untapped potential...",
  "The stars have aligned in your favor recently...",
  "A mysterious transformation awaits you...",
  "The universe has been preparing something special...",
];

/**
 * @param {{ name: string, date: string }} input
 * @returns {Object} Complete fortune reading
 */
export function castChart(input) {
  const { name, date } = input;

  // Parse date components
  const [year, month, day] = date.split('-').map(Number);

  // Get sun sign from date
  const sunSign = getSunSign(month, day);

  // Calculate element balance from sun sign
  const elementBalance = calculateElementBalance(null, sunSign.element);

  // Numerology
  const lifePathNumber = calculateLifePath(year, month, day);
  const numerology = {
    lifePathNumber,
    ...getLifePathMeaning(lifePathNumber),
  };

  // Name-based numerology (Destiny, Soul Urge, Personality, Birthday)
  const nameNumerology = calculateNameNumerology(name, day);

  // Demographic analysis (age, generation, gender probability, cultural origin)
  const demographics = calculateDemographics(name, year, month, day);

  // Letter/phonetic analysis
  const letterAnalysis = analyzeLetters(name);

  // Romantic profile (Sun sign + Life Path combination)
  const romantic = calculateRomanticProfile(month, day, lifePathNumber);

  // Personality cluster synthesis
  const personalityCluster = calculatePersonalityCluster(
    lifePathNumber,
    elementBalance,
    letterAnalysis,
    nameNumerology.destiny.number,
    year,
    month,
    day
  );

  // Generate fortune vibe
  const fortuneIndex = (lifePathNumber + day + month) % FORTUNE_VIBES.length;
  const fortuneMessage = FORTUNE_VIBES[fortuneIndex];

  // Lucky numbers based on numerology
  const luckyNumbers = [
    lifePathNumber,
    nameNumerology.destiny.number,
    nameNumerology.soulUrge.number,
    (lifePathNumber + day) % 9 || 9,
    (nameNumerology.personality.number + month) % 9 || 9,
  ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

  // Lucky colors based on element
  const elementColors = {
    Fire: ['Red', 'Orange', 'Gold'],
    Earth: ['Green', 'Brown', 'Terracotta'],
    Air: ['Sky Blue', 'White', 'Lavender'],
    Water: ['Deep Blue', 'Silver', 'Teal'],
  };
  const luckyColors = elementColors[sunSign.element] || ['Purple', 'Gold'];

  const tarot = drawTarotSpread({
    name,
    date,
    lifePathNumber,
    sunSign: sunSign.name,
  });

  return {
    mode: 'fortune',
    birthData: {
      name,
      date,
    },
    sunSign,
    elementBalance,
    numerology,
    nameNumerology,
    demographics,
    letterAnalysis,
    romantic,
    personalityCluster,
    tarot,
    fortune: {
      message: fortuneMessage,
      luckyNumbers,
      luckyColors,
      luckyDay: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][lifePathNumber % 7],
      powerHour: `${(lifePathNumber + 6) % 12 || 12}:00 ${lifePathNumber > 6 ? 'PM' : 'AM'}`,
    },
    generatedAt: new Date().toISOString(),
  };
}

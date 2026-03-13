/**
 * nameNumerology.js — Calculates numerology numbers from name.
 * Destiny Number, Soul Urge Number, Personality Number, Birthday Number.
 */

// Pythagorean numerology letter-to-number mapping
const LETTER_VALUES = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

/**
 * Reduce to single digit or master number (11, 22, 33).
 */
function reduceToSingle(num) {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = String(num).split('').reduce((sum, d) => sum + Number(d), 0);
  }
  return num;
}

/**
 * Get numeric value of a letter.
 */
function letterValue(letter) {
  const upper = letter.toUpperCase();
  return LETTER_VALUES[upper] || 0;
}

/**
 * Calculate Destiny Number (Expression Number) from full name.
 * Sum of all letters reduced to single digit/master.
 */
export function calculateDestinyNumber(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '');
  const sum = letters.split('').reduce((acc, letter) => acc + letterValue(letter), 0);
  return reduceToSingle(sum);
}

/**
 * Calculate Soul Urge Number (Heart's Desire) from vowels only.
 */
export function calculateSoulUrgeNumber(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '');
  const vowelSum = letters.split('').filter(l => VOWELS.has(l))
    .reduce((acc, letter) => acc + letterValue(letter), 0);
  return reduceToSingle(vowelSum);
}

/**
 * Calculate Personality Number from consonants only.
 */
export function calculatePersonalityNumber(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '');
  const consonantSum = letters.split('').filter(l => !VOWELS.has(l))
    .reduce((acc, letter) => acc + letterValue(letter), 0);
  return reduceToSingle(consonantSum);
}

/**
 * Calculate Birthday Number from day of birth.
 */
export function calculateBirthdayNumber(day) {
  return reduceToSingle(day);
}

// Meaning tables
const DESTINY_MEANINGS = {
  1:  { title: 'The Leader', traits: ['Independent', 'Ambitious', 'Pioneering'], description: 'You are destined to lead and create. Your talents lie in originality, initiative, and self-reliance.' },
  2:  { title: 'The Mediator', traits: ['Diplomatic', 'Cooperative', 'Sensitive'], description: 'Your destiny involves partnership and harmony. You excel in bringing people together.' },
  3:  { title: 'The Communicator', traits: ['Creative', 'Expressive', 'Artistic'], description: 'Expression and creativity define your path. You inspire through words, art, and ideas.' },
  4:  { title: 'The Organizer', traits: ['Practical', 'Disciplined', 'Reliable'], description: 'Building strong foundations is your calling. You create lasting structures and systems.' },
  5:  { title: 'The Freedom Seeker', traits: ['Adventurous', 'Versatile', 'Dynamic'], description: 'Change and freedom drive you. Your destiny involves exploration and embracing variety.' },
  6:  { title: 'The Caretaker', traits: ['Responsible', 'Nurturing', 'Harmonious'], description: 'Service to others defines your purpose. Home, family, and community are your domains.' },
  7:  { title: 'The Analyst', traits: ['Introspective', 'Intuitive', 'Wise'], description: 'Your destiny is to seek truth and understanding. You excel in research and spiritual pursuits.' },
  8:  { title: 'The Achiever', traits: ['Ambitious', 'Strategic', 'Authoritative'], description: 'Material success and power are your domain. You have natural business and leadership abilities.' },
  9:  { title: 'The Humanitarian', traits: ['Compassionate', 'Idealistic', 'Universal'], description: 'Serving humanity is your calling. You see the bigger picture and inspire global change.' },
  11: { title: 'The Intuitive', traits: ['Visionary', 'Inspiring', 'Enlightened'], description: 'A master number — you channel higher wisdom and inspire spiritual growth in others.' },
  22: { title: 'The Master Builder', traits: ['Visionary', 'Practical', 'Powerful'], description: 'A master number — you can turn dreams into reality on a grand scale.' },
  33: { title: 'The Master Teacher', traits: ['Selfless', 'Devoted', 'Healing'], description: 'A master number — you embody unconditional love and serve as a beacon for others.' },
};

const SOUL_URGE_MEANINGS = {
  1:  { title: 'Independence', desire: 'You deeply crave autonomy, originality, and the freedom to lead your own path.' },
  2:  { title: 'Partnership', desire: 'Your soul yearns for harmony, love, and meaningful connections with others.' },
  3:  { title: 'Expression', desire: 'You are driven by a deep need to create, communicate, and bring joy to others.' },
  4:  { title: 'Stability', desire: 'Security, order, and building something lasting are what your heart truly seeks.' },
  5:  { title: 'Freedom', desire: 'Adventure, variety, and sensory experiences fuel your inner fire.' },
  6:  { title: 'Love & Nurturing', desire: 'Your soul craves to love, protect, and create harmony in home and family.' },
  7:  { title: 'Knowledge', desire: 'Understanding life\'s mysteries and achieving spiritual wisdom drive you from within.' },
  8:  { title: 'Achievement', desire: 'Success, recognition, and material mastery are your inner motivations.' },
  9:  { title: 'Humanitarianism', desire: 'You yearn to make a difference and contribute to the greater good.' },
  11: { title: 'Spiritual Illumination', desire: 'Your soul seeks to inspire and enlighten through intuition and vision.' },
  22: { title: 'Mastery', desire: 'Building something of lasting significance drives your innermost desires.' },
  33: { title: 'Healing Service', desire: 'Selfless service and uplifting humanity are your deepest callings.' },
};

const PERSONALITY_MEANINGS = {
  1:  { title: 'Confident Leader', impression: 'You appear self-assured, independent, and capable of taking charge.' },
  2:  { title: 'Gentle Peacemaker', impression: 'Others see you as kind, diplomatic, and easy to approach.' },
  3:  { title: 'Charming Entertainer', impression: 'You come across as witty, creative, and socially engaging.' },
  4:  { title: 'Reliable Worker', impression: 'You appear practical, dependable, and truly grounded.' },
  5:  { title: 'Dynamic Adventurer', impression: 'Others perceive you as exciting, adaptable, and full of energy.' },
  6:  { title: 'Caring Protector', impression: 'You seem nurturing, responsible, and family-oriented.' },
  7:  { title: 'Mysterious Thinker', impression: 'You appear introspective, wise, and somewhat enigmatic.' },
  8:  { title: 'Powerful Executive', impression: 'Others see you as ambitious, authoritative, and successful.' },
  9:  { title: 'Wise Humanitarian', impression: 'You come across as compassionate, worldly, and selfless.' },
  11: { title: 'Inspired Visionary', impression: 'You appear intuitive, inspiring, and spiritually aware.' },
  22: { title: 'Masterful Builder', impression: 'Others see you as capable of achieving great things.' },
  33: { title: 'Loving Teacher', impression: 'You radiate warmth, wisdom, and unconditional acceptance.' },
};

const BIRTHDAY_MEANINGS = {
  1:  { title: 'The Initiator', gift: 'Natural leadership and pioneering spirit.' },
  2:  { title: 'The Peacekeeper', gift: 'Diplomacy and sensitivity in partnerships.' },
  3:  { title: 'The Artist', gift: 'Creative self-expression and communication.' },
  4:  { title: 'The Foundation', gift: 'Building practical, lasting structures.' },
  5:  { title: 'The Explorer', gift: 'Adaptability and love of freedom.' },
  6:  { title: 'The Healer', gift: 'Responsibility and nurturing others.' },
  7:  { title: 'The Philosopher', gift: 'Analytical thinking and spiritual insight.' },
  8:  { title: 'The Executive', gift: 'Business acumen and material mastery.' },
  9:  { title: 'The Global Citizen', gift: 'Compassion and humanitarian vision.' },
  11: { title: 'The Illuminator', gift: 'Intuition and spiritual leadership.' },
  22: { title: 'The Architect', gift: 'Vision to build on a grand scale.' },
  33: { title: 'The Master Healer', gift: 'Selfless service and cosmic compassion.' },
};

export function getDestinyMeaning(number) {
  return DESTINY_MEANINGS[number] || DESTINY_MEANINGS[9];
}

export function getSoulUrgeMeaning(number) {
  return SOUL_URGE_MEANINGS[number] || SOUL_URGE_MEANINGS[9];
}

export function getPersonalityMeaning(number) {
  return PERSONALITY_MEANINGS[number] || PERSONALITY_MEANINGS[9];
}

export function getBirthdayMeaning(number) {
  return BIRTHDAY_MEANINGS[number] || BIRTHDAY_MEANINGS[9];
}

/**
 * Calculate all name numerology for a person.
 */
export function calculateNameNumerology(name, day) {
  const destinyNumber = calculateDestinyNumber(name);
  const soulUrgeNumber = calculateSoulUrgeNumber(name);
  const personalityNumber = calculatePersonalityNumber(name);
  const birthdayNumber = calculateBirthdayNumber(day);

  return {
    destiny: {
      number: destinyNumber,
      ...getDestinyMeaning(destinyNumber),
    },
    soulUrge: {
      number: soulUrgeNumber,
      ...getSoulUrgeMeaning(soulUrgeNumber),
    },
    personality: {
      number: personalityNumber,
      ...getPersonalityMeaning(personalityNumber),
    },
    birthday: {
      number: birthdayNumber,
      ...getBirthdayMeaning(birthdayNumber),
    },
  };
}

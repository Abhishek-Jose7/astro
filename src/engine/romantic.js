/**
 * romantic.js — Romantic archetype analysis based on astrology and numerology.
 * Combines Sun sign, Life Path, and derived patterns.
 */

// Romantic traits by Sun sign
const SUN_SIGN_ROMANTIC = {
  Aries: {
    style: 'Passionate Initiator',
    traits: ['Bold', 'Direct', 'Enthusiastic'],
    loveLanguage: 'Physical Touch & Quality Time',
    attachment: 'Anxious-Secure',
    approach: 'You pursue love with confidence and enthusiasm. Waiting is not your strength.',
    needs: 'Excitement, adventure, and a partner who can keep up with your energy.',
    challenges: 'Impatience and a tendency to rush into relationships without reflection.',
  },
  Taurus: {
    style: 'Devoted Sensualist',
    traits: ['Loyal', 'Sensual', 'Patient'],
    loveLanguage: 'Physical Touch & Gifts',
    attachment: 'Secure',
    approach: 'You build love slowly and steadily, valuing stability and physical connection.',
    needs: 'Security, consistency, and tangible expressions of love.',
    challenges: 'Possessiveness and resistance to change in relationships.',
  },
  Gemini: {
    style: 'Curious Communicator',
    traits: ['Witty', 'Versatile', 'Intellectually Curious'],
    loveLanguage: 'Words of Affirmation & Quality Time',
    attachment: 'Anxious-Avoidant',
    approach: 'You connect through conversation and mental stimulation.',
    needs: 'Variety, intellectual connection, and freedom to explore.',
    challenges: 'Inconsistency and difficulty with deep emotional commitment.',
  },
  Cancer: {
    style: 'Nurturing Protector',
    traits: ['Caring', 'Intuitive', 'Emotional'],
    loveLanguage: 'Acts of Service & Quality Time',
    attachment: 'Anxious',
    approach: 'You create emotional safety and deeply bond with your partner.',
    needs: 'Emotional security, family connection, and nurturing reciprocity.',
    challenges: 'Moodiness and fear of rejection leading to protective walls.',
  },
  Leo: {
    style: 'Devoted Romantic',
    traits: ['Generous', 'Loyal', 'Dramatic'],
    loveLanguage: 'Words of Affirmation & Quality Time',
    attachment: 'Secure',
    approach: 'You love grandly and expect admiration and loyalty in return.',
    needs: 'Appreciation, attention, and a partner who celebrates you.',
    challenges: 'Need for validation and difficulty when not the center of attention.',
  },
  Virgo: {
    style: 'Thoughtful Helper',
    traits: ['Attentive', 'Practical', 'Devoted'],
    loveLanguage: 'Acts of Service',
    attachment: 'Avoidant-Secure',
    approach: 'You show love through practical support and careful attention to needs.',
    needs: 'Order, appreciation for your efforts, and intellectual respect.',
    challenges: 'Over-criticism and difficulty expressing emotions directly.',
  },
  Libra: {
    style: 'Romantic Harmonizer',
    traits: ['Charming', 'Diplomatic', 'Partnership-Oriented'],
    loveLanguage: 'Quality Time & Gifts',
    attachment: 'Anxious-Secure',
    approach: 'You seek balance and beauty in relationships, prioritizing harmony.',
    needs: 'Partnership, beauty, fairness, and constant connection.',
    challenges: 'Indecision and people-pleasing at the expense of authentic needs.',
  },
  Scorpio: {
    style: 'Intense Transformer',
    traits: ['Passionate', 'Deep', 'Magnetic'],
    loveLanguage: 'Physical Touch & Quality Time',
    attachment: 'Anxious',
    approach: 'You love with total intensity and seek profound soul connection.',
    needs: 'Depth, trust, loyalty, and emotional transformation.',
    challenges: 'Jealousy, possessiveness, and difficulty with vulnerability.',
  },
  Sagittarius: {
    style: 'Adventurous Free Spirit',
    traits: ['Optimistic', 'Adventurous', 'Philosophical'],
    loveLanguage: 'Quality Time & Words of Affirmation',
    attachment: 'Avoidant',
    approach: 'You seek a partner who shares your love of adventure and growth.',
    needs: 'Freedom, adventure, philosophical connection, and humor.',
    challenges: 'Commitment hesitancy and restlessness in routine.',
  },
  Capricorn: {
    style: 'Committed Builder',
    traits: ['Ambitious', 'Reliable', 'Traditional'],
    loveLanguage: 'Acts of Service & Quality Time',
    attachment: 'Avoidant-Secure',
    approach: 'You build relationships like you build everything—with long-term vision.',
    needs: 'Stability, shared goals, respect, and practical partnership.',
    challenges: 'Emotional reserve and prioritizing work over relationships.',
  },
  Aquarius: {
    style: 'Independent Visionary',
    traits: ['Progressive', 'Independent', 'Humanitarian'],
    loveLanguage: 'Quality Time & Words of Affirmation',
    attachment: 'Avoidant',
    approach: 'You seek a partner who respects your individuality and shares your ideals.',
    needs: 'Freedom, intellectual stimulation, and unconventional connection.',
    challenges: 'Emotional detachment and difficulty with traditional intimacy.',
  },
  Pisces: {
    style: 'Dreamy Romantic',
    traits: ['Compassionate', 'Intuitive', 'Imaginative'],
    loveLanguage: 'Quality Time & Words of Affirmation',
    attachment: 'Anxious',
    approach: 'You love with boundless compassion and seek soul-level connection.',
    needs: 'Emotional depth, creative connection, and spiritual resonance.',
    challenges: 'Idealization of partners and difficulty with boundaries.',
  },
};

// Life Path romantic influences
const LIFE_PATH_ROMANTIC = {
  1: { modifier: 'independence-seeking', influence: 'You need autonomy even within partnership.' },
  2: { modifier: 'harmony-seeking', influence: 'Partnership and emotional connection are vital to you.' },
  3: { modifier: 'expressive', influence: 'Communication and joy are central to your relationships.' },
  4: { modifier: 'stability-seeking', influence: 'You seek security and long-term commitment.' },
  5: { modifier: 'freedom-seeking', influence: 'You need variety and excitement in love.' },
  6: { modifier: 'nurturing', influence: 'Family and caretaking are central to your love expression.' },
  7: { modifier: 'depth-seeking', influence: 'You require intellectual and spiritual connection.' },
  8: { modifier: 'power-balancing', influence: 'Mutual respect and shared ambition drive your partnerships.' },
  9: { modifier: 'idealistic', influence: 'You seek love that transcends the ordinary.' },
  11: { modifier: 'intuitive', influence: 'You sense your partner\'s needs deeply.' },
  22: { modifier: 'visionary', influence: 'You seek a partner who supports your grand plans.' },
  33: { modifier: 'healing', influence: 'Your relationships often involve spiritual growth.' },
};

// Sign compatibility matrix (simplified)
const COMPATIBILITY = {
  Aries: { best: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'], challenging: ['Cancer', 'Capricorn'] },
  Taurus: { best: ['Virgo', 'Capricorn', 'Cancer', 'Pisces'], challenging: ['Leo', 'Aquarius'] },
  Gemini: { best: ['Libra', 'Aquarius', 'Aries', 'Leo'], challenging: ['Virgo', 'Pisces'] },
  Cancer: { best: ['Scorpio', 'Pisces', 'Taurus', 'Virgo'], challenging: ['Aries', 'Libra'] },
  Leo: { best: ['Aries', 'Sagittarius', 'Gemini', 'Libra'], challenging: ['Taurus', 'Scorpio'] },
  Virgo: { best: ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'], challenging: ['Gemini', 'Sagittarius'] },
  Libra: { best: ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'], challenging: ['Cancer', 'Capricorn'] },
  Scorpio: { best: ['Cancer', 'Pisces', 'Virgo', 'Capricorn'], challenging: ['Leo', 'Aquarius'] },
  Sagittarius: { best: ['Aries', 'Leo', 'Libra', 'Aquarius'], challenging: ['Virgo', 'Pisces'] },
  Capricorn: { best: ['Taurus', 'Virgo', 'Scorpio', 'Pisces'], challenging: ['Aries', 'Libra'] },
  Aquarius: { best: ['Gemini', 'Libra', 'Aries', 'Sagittarius'], challenging: ['Taurus', 'Scorpio'] },
  Pisces: { best: ['Cancer', 'Scorpio', 'Taurus', 'Capricorn'], challenging: ['Gemini', 'Sagittarius'] },
};

// Cusp modifiers (born on sign boundaries)
const CUSP_TRAITS = {
  'Aries-Taurus': 'Power and sensuality combine for magnetic romantic presence.',
  'Taurus-Gemini': 'Stability meets curiosity—you seek both security and stimulation.',
  'Gemini-Cancer': 'Mind and heart unite—you connect emotionally and intellectually.',
  'Cancer-Leo': 'Nurturing meets passion—you love dramatically and protectively.',
  'Leo-Virgo': 'Confidence meets precision—you bring excellence to relationships.',
  'Virgo-Libra': 'Analysis meets harmony—you seek perfect, balanced partnerships.',
  'Libra-Scorpio': 'Charm meets depth—your relationships are intense and beautiful.',
  'Scorpio-Sagittarius': 'Depth meets adventure—you seek transformative experiences.',
  'Sagittarius-Capricorn': 'Freedom meets responsibility—you balance adventure and commitment.',
  'Capricorn-Aquarius': 'Tradition meets innovation—you redefine relationships.',
  'Aquarius-Pisces': 'Vision meets compassion—you love humanity and individuals deeply.',
  'Pisces-Aries': 'Dreams meet action—you pursue love with romantic intensity.',
};

/**
 * Get sun sign from month/day.
 */
function getSunSign(month, day) {
  const dates = [
    [1, 20, 'Aquarius'], [2, 19, 'Pisces'], [3, 21, 'Aries'], [4, 20, 'Taurus'],
    [5, 21, 'Gemini'], [6, 21, 'Cancer'], [7, 23, 'Leo'], [8, 23, 'Virgo'],
    [9, 23, 'Libra'], [10, 23, 'Scorpio'], [11, 22, 'Sagittarius'], [12, 22, 'Capricorn'],
  ];
  
  for (let i = 0; i < dates.length; i++) {
    const [m, d, sign] = dates[i];
    if (month === m && day < d) {
      return dates[(i + 11) % 12][2];
    }
  }
  
  const idx = dates.findIndex(([m]) => m === month);
  return dates[idx >= 0 ? idx : 9][2];
}

/**
 * Check if on cusp (within 3 days of sign change).
 */
function getCuspInfo(month, day) {
  const cuspDates = [
    [1, 19, 21, 'Capricorn-Aquarius'],
    [2, 18, 20, 'Aquarius-Pisces'],
    [3, 19, 22, 'Pisces-Aries'],
    [4, 18, 21, 'Aries-Taurus'],
    [5, 19, 22, 'Taurus-Gemini'],
    [6, 19, 22, 'Gemini-Cancer'],
    [7, 21, 24, 'Cancer-Leo'],
    [8, 21, 24, 'Leo-Virgo'],
    [9, 21, 24, 'Virgo-Libra'],
    [10, 21, 24, 'Libra-Scorpio'],
    [11, 20, 23, 'Scorpio-Sagittarius'],
    [12, 20, 23, 'Sagittarius-Capricorn'],
  ];
  
  for (const [m, start, end, cusp] of cuspDates) {
    if (month === m && day >= start && day <= end) {
      return { isOnCusp: true, cusp, modifier: CUSP_TRAITS[cusp] };
    }
  }
  
  return { isOnCusp: false, cusp: null, modifier: null };
}

/**
 * Generate ideal partner description.
 */
function getIdealPartner(sunSign, lifePath) {
  const signData = SUN_SIGN_ROMANTIC[sunSign] || SUN_SIGN_ROMANTIC.Leo;
  const compat = COMPATIBILITY[sunSign] || COMPATIBILITY.Leo;
  const pathData = LIFE_PATH_ROMANTIC[lifePath] || LIFE_PATH_ROMANTIC[1];
  
  let description = `Your ideal partner is someone who `;
  
  if (signData.traits.includes('Passionate')) {
    description += 'matches your intensity and enthusiasm, ';
  } else if (signData.traits.includes('Loyal')) {
    description += 'values commitment and consistency, ';
  } else if (signData.traits.includes('Curious')) {
    description += 'stimulates your mind and shares your curiosity, ';
  }
  
  description += `while ${pathData.influence.toLowerCase()} `;
  description += `Compatible signs include ${compat.best.slice(0, 2).join(' and ')}.`;
  
  return description;
}

/**
 * Calculate romantic profile.
 */
export function calculateRomanticProfile(month, day, lifePath) {
  const sunSign = getSunSign(month, day);
  const signData = SUN_SIGN_ROMANTIC[sunSign] || SUN_SIGN_ROMANTIC.Leo;
  const pathData = LIFE_PATH_ROMANTIC[lifePath] || LIFE_PATH_ROMANTIC[1];
  const cuspInfo = getCuspInfo(month, day);
  const compat = COMPATIBILITY[sunSign] || COMPATIBILITY.Leo;
  
  return {
    sunSign,
    archetype: signData.style,
    traits: signData.traits,
    loveLanguage: signData.loveLanguage,
    attachmentStyle: signData.attachment,
    approachToLove: signData.approach,
    romanticNeeds: signData.needs,
    challenges: signData.challenges,
    lifePathInfluence: pathData,
    cusp: cuspInfo,
    compatibility: {
      bestMatches: compat.best,
      challengingMatches: compat.challenging,
    },
    idealPartner: getIdealPartner(sunSign, lifePath),
  };
}

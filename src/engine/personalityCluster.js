/**
 * personalityCluster.js — Synthesizes personality archetype from multiple data points.
 * Combines astrology, numerology, and letter analysis for comprehensive personality profile.
 */

// Archetype definitions based on element + life path combinations
const ARCHETYPES = {
  'Fire-1': { name: 'The Trailblazer', description: 'A bold pioneer who leads with passion and originality.' },
  'Fire-2': { name: 'The Inspiring Partner', description: 'A warm collaborator who ignites others through connection.' },
  'Fire-3': { name: 'The Creative Spark', description: 'A dynamic creator whose enthusiasm lights up every room.' },
  'Fire-4': { name: 'The Determined Builder', description: 'A passionate architect of enduring achievements.' },
  'Fire-5': { name: 'The Bold Adventurer', description: 'A fearless explorer driven by excitement and change.' },
  'Fire-6': { name: 'The Protective Champion', description: 'A warm guardian who fights for loved ones.' },
  'Fire-7': { name: 'The Spiritual Warrior', description: 'A seeker who pursues truth with intense focus.' },
  'Fire-8': { name: 'The Powerful Leader', description: 'A commanding presence who achieves through vision and will.' },
  'Fire-9': { name: 'The Passionate Humanitarian', description: 'A fiery idealist working for global change.' },
  
  'Earth-1': { name: 'The Practical Pioneer', description: 'An independent builder who creates tangible results.' },
  'Earth-2': { name: 'The Steady Partner', description: 'A reliable collaborator who builds lasting bonds.' },
  'Earth-3': { name: 'The Artistic Craftsman', description: 'A creator who brings beautiful ideas into physical form.' },
  'Earth-4': { name: 'The Master Builder', description: 'A disciplined architect of lasting structures.' },
  'Earth-5': { name: 'The Grounded Explorer', description: 'An adventurer who seeks practical wisdom through experience.' },
  'Earth-6': { name: 'The Devoted Caretaker', description: 'A nurturing presence who creates stability for others.' },
  'Earth-7': { name: 'The Wise Analyst', description: 'A deep thinker who uncovers practical truths.' },
  'Earth-8': { name: 'The Ambitious Executive', description: 'A strategic leader building empires with patience.' },
  'Earth-9': { name: 'The Practical Idealist', description: 'A humanitarian who creates real-world solutions.' },
  
  'Air-1': { name: 'The Innovative Thinker', description: 'An original mind who leads through ideas.' },
  'Air-2': { name: 'The Social Connector', description: 'A harmonizer who brings minds together.' },
  'Air-3': { name: 'The Brilliant Communicator', description: 'A captivating speaker who spreads joy through words.' },
  'Air-4': { name: 'The Systematic Planner', description: 'A logical architect of efficient systems.' },
  'Air-5': { name: 'The Intellectual Explorer', description: 'A curious mind seeking knowledge through diversity.' },
  'Air-6': { name: 'The Thoughtful Counselor', description: 'A wise advisor who nurtures through understanding.' },
  'Air-7': { name: 'The Analytical Philosopher', description: 'A profound thinker exploring life\'s mysteries.' },
  'Air-8': { name: 'The Strategic Visionary', description: 'A powerful mind building influential networks.' },
  'Air-9': { name: 'The Universal Thinker', description: 'A global mind working for collective evolution.' },
  
  'Water-1': { name: 'The Intuitive Leader', description: 'An emotionally intelligent pioneer.' },
  'Water-2': { name: 'The Empathic Partner', description: 'A deeply connected soul who feels others\' needs.' },
  'Water-3': { name: 'The Emotional Artist', description: 'A creative who channels feelings into expression.' },
  'Water-4': { name: 'The Protective Builder', description: 'An emotionally grounded creator of safe spaces.' },
  'Water-5': { name: 'The Emotional Explorer', description: 'A seeker navigating the depths of human experience.' },
  'Water-6': { name: 'The Nurturing Healer', description: 'A compassionate soul devoted to others\' wellbeing.' },
  'Water-7': { name: 'The Mystic Seeker', description: 'An intuitive explorer of spiritual depths.' },
  'Water-8': { name: 'The Transformative Power', description: 'An intense presence who creates deep change.' },
  'Water-9': { name: 'The Compassionate Visionary', description: 'A universal empath serving humanity\'s evolution.' },
};

// Master number archetypes
const MASTER_ARCHETYPES = {
  11: { name: 'The Illuminated One', description: 'A spiritual messenger channeling higher wisdom.' },
  22: { name: 'The Master Architect', description: 'A visionary builder of transformative systems.' },
  33: { name: 'The Master Healer', description: 'A selfless teacher embodying universal love.' },
};

// Cognitive styles
const COGNITIVE_STYLES = {
  analytical: {
    name: 'Analytical-Systematic',
    description: 'You process information through logic and structured analysis.',
    strengths: ['Problem decomposition', 'Pattern recognition', 'Systematic planning'],
  },
  intuitive: {
    name: 'Intuitive-Holistic',
    description: 'You grasp concepts through patterns and big-picture thinking.',
    strengths: ['Creative insight', 'Future visioning', 'Connecting disparate ideas'],
  },
  practical: {
    name: 'Practical-Kinesthetic',
    description: 'You learn best through hands-on experience and real-world application.',
    strengths: ['Implementation', 'Physical coordination', 'Concrete problem-solving'],
  },
  social: {
    name: 'Social-Collaborative',
    description: 'You process best through discussion and collaborative exploration.',
    strengths: ['Team dynamics', 'Communication', 'Emotional intelligence'],
  },
  reflective: {
    name: 'Reflective-Internal',
    description: 'You process deeply through internal contemplation and solitary thought.',
    strengths: ['Deep analysis', 'Self-awareness', 'Philosophical insight'],
  },
};

// Career clusters
const CAREER_CLUSTERS = {
  'leader': ['Executive roles', 'Entrepreneurship', 'Politics', 'Management'],
  'creator': ['Arts', 'Design', 'Writing', 'Music', 'Content Creation'],
  'analyst': ['Technology', 'Research', 'Finance', 'Data Science', 'Engineering'],
  'helper': ['Healthcare', 'Education', 'Counseling', 'Social Work', 'Non-profit'],
  'builder': ['Architecture', 'Construction', 'Software Development', 'Manufacturing'],
  'communicator': ['Marketing', 'PR', 'Sales', 'Media', 'Teaching'],
  'explorer': ['Travel', 'Journalism', 'Research', 'Adventure industries'],
  'strategist': ['Business', 'Law', 'Consulting', 'Investment', 'Operations'],
};

// Day of week meanings
const DAY_MEANINGS = {
  0: { day: 'Sunday', ruler: 'Sun', trait: 'Creative, confident, natural leader' },
  1: { day: 'Monday', ruler: 'Moon', trait: 'Intuitive, emotional, nurturing' },
  2: { day: 'Tuesday', ruler: 'Mars', trait: 'Energetic, competitive, action-oriented' },
  3: { day: 'Wednesday', ruler: 'Mercury', trait: 'Communicative, intellectual, versatile' },
  4: { day: 'Thursday', ruler: 'Jupiter', trait: 'Optimistic, expansive, philosophical' },
  5: { day: 'Friday', ruler: 'Venus', trait: 'Artistic, harmonious, relationship-focused' },
  6: { day: 'Saturday', ruler: 'Saturn', trait: 'Disciplined, responsible, hardworking' },
};

/**
 * Determine dominant element from planet positions.
 */
function getDominantElement(elementBalance) {
  if (!elementBalance) return 'Fire';
  
  const elements = ['Fire', 'Earth', 'Air', 'Water'];
  let dominant = 'Fire';
  let maxCount = 0;
  
  for (const elem of elements) {
    const count = elementBalance[elem.toLowerCase()] || 0;
    if (count > maxCount) {
      maxCount = count;
      dominant = elem;
    }
  }
  
  return dominant;
}

/**
 * Determine cognitive style based on element and letter analysis.
 */
function determineCognitiveStyle(element, letterAnalysis) {
  const softDominant = letterAnalysis?.letterCounts?.softConsonants > 
                       letterAnalysis?.letterCounts?.hardConsonants;
  const highVowelRatio = letterAnalysis?.letterCounts?.vowelRatio > 45;
  
  if (element === 'Water' || (element === 'Air' && softDominant)) {
    return highVowelRatio ? COGNITIVE_STYLES.intuitive : COGNITIVE_STYLES.reflective;
  }
  if (element === 'Earth') {
    return COGNITIVE_STYLES.practical;
  }
  if (element === 'Air') {
    return highVowelRatio ? COGNITIVE_STYLES.social : COGNITIVE_STYLES.analytical;
  }
  if (element === 'Fire') {
    return softDominant ? COGNITIVE_STYLES.intuitive : COGNITIVE_STYLES.analytical;
  }
  
  return COGNITIVE_STYLES.analytical;
}

/**
 * Determine career cluster.
 */
function determineCareerCluster(lifePath, element, destinyNumber) {
  // Combine life path and destiny for cluster determination
  const combined = (lifePath % 9) + (destinyNumber ? destinyNumber % 9 : 0);
  
  if ([1, 8].includes(lifePath) || element === 'Fire') {
    return { cluster: 'leader', careers: CAREER_CLUSTERS.leader };
  }
  if ([3, 6].includes(lifePath) || element === 'Water') {
    return lifePath === 3 
      ? { cluster: 'creator', careers: CAREER_CLUSTERS.creator }
      : { cluster: 'helper', careers: CAREER_CLUSTERS.helper };
  }
  if ([4, 7].includes(lifePath) || element === 'Earth') {
    return lifePath === 7
      ? { cluster: 'analyst', careers: CAREER_CLUSTERS.analyst }
      : { cluster: 'builder', careers: CAREER_CLUSTERS.builder };
  }
  if ([2, 5].includes(lifePath) || element === 'Air') {
    return lifePath === 5
      ? { cluster: 'explorer', careers: CAREER_CLUSTERS.explorer }
      : { cluster: 'communicator', careers: CAREER_CLUSTERS.communicator };
  }
  if ([9, 11, 22, 33].includes(lifePath)) {
    return { cluster: 'helper', careers: CAREER_CLUSTERS.helper };
  }
  
  return { cluster: 'strategist', careers: CAREER_CLUSTERS.strategist };
}

/**
 * Get birthday statistics.
 */
function getBirthdayStats(year, month, day) {
  const birthDate = new Date(year, month - 1, day);
  const dayOfWeek = birthDate.getDay();
  const dayInfo = DAY_MEANINGS[dayOfWeek];
  
  // Month frequency (some months have more births statistically)
  const commonMonths = [9, 10, 8, 7]; // Sep, Oct, Aug, Jul are most common
  const isCommonBirthMonth = commonMonths.includes(month);
  
  // Numerical patterns in date
  const dateSum = year + month + day;
  const isPrimeDay = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31].includes(day);
  
  return {
    dayOfWeek: dayInfo.day,
    planetaryRuler: dayInfo.ruler,
    dayTrait: dayInfo.trait,
    isCommonBirthMonth,
    isPrimeDay,
    dateSum,
    dateSumReduced: dateSum % 9 || 9,
  };
}

/**
 * Calculate complete personality cluster.
 */
export function calculatePersonalityCluster(
  lifePath,
  elementBalance,
  letterAnalysis,
  destinyNumber,
  year,
  month,
  day
) {
  const element = getDominantElement(elementBalance);
  const normalizedLifePath = [11, 22, 33].includes(lifePath) ? lifePath : (lifePath % 9 || 9);
  
  // Get archetype
  let archetype;
  if ([11, 22, 33].includes(lifePath)) {
    archetype = MASTER_ARCHETYPES[lifePath];
  } else {
    const key = `${element}-${normalizedLifePath}`;
    archetype = ARCHETYPES[key] || ARCHETYPES['Fire-1'];
  }
  
  // Get cognitive style
  const cognitiveStyle = determineCognitiveStyle(element, letterAnalysis);
  
  // Get career cluster
  const careerCluster = determineCareerCluster(lifePath, element, destinyNumber);
  
  // Get birthday stats
  const birthdayStats = getBirthdayStats(year, month, day);
  
  // Generate synthesis
  const synthesis = generateSynthesis(archetype, cognitiveStyle, careerCluster, element);
  
  return {
    archetype,
    dominantElement: element,
    cognitiveStyle,
    careerCluster,
    birthdayStats,
    synthesis,
  };
}

/**
 * Generate a synthesis paragraph combining all insights.
 */
function generateSynthesis(archetype, cognitiveStyle, careerCluster, element) {
  return `As "${archetype.name}", ${archetype.description.toLowerCase()} ` +
    `Your ${cognitiveStyle.name.toLowerCase()} cognitive style means ${cognitiveStyle.description.toLowerCase()} ` +
    `This ${element} influence combined with your natural talents suggests strong alignment with ` +
    `${careerCluster.careers.slice(0, 2).join(' and ')} fields.`;
}

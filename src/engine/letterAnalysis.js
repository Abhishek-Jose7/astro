/**
 * letterAnalysis.js — Analyzes letter structure and phonetic patterns in names.
 * Vowel/consonant ratios, hard/soft consonants, symmetry, phonetic rhythm.
 */

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);
const HARD_CONSONANTS = new Set(['B', 'D', 'G', 'K', 'P', 'T']);
const SOFT_CONSONANTS = new Set(['F', 'H', 'L', 'M', 'N', 'R', 'S', 'V', 'W', 'Y', 'Z']);

/**
 * Count vowels and consonants in a name.
 */
export function countLetterTypes(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '');
  let vowels = 0;
  let consonants = 0;
  let hardConsonants = 0;
  let softConsonants = 0;

  for (const letter of letters) {
    if (VOWELS.has(letter)) {
      vowels++;
    } else {
      consonants++;
      if (HARD_CONSONANTS.has(letter)) {
        hardConsonants++;
      } else if (SOFT_CONSONANTS.has(letter)) {
        softConsonants++;
      }
    }
  }

  const total = letters.length;
  const vowelRatio = total > 0 ? (vowels / total * 100).toFixed(1) : 0;

  return {
    total,
    vowels,
    consonants,
    hardConsonants,
    softConsonants,
    vowelRatio: parseFloat(vowelRatio),
    hardSoftRatio: softConsonants > 0 ? (hardConsonants / softConsonants).toFixed(2) : 'N/A',
  };
}

/**
 * Analyze letter frequency and uniqueness.
 */
export function analyzeLetterFrequency(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '');
  const frequency = {};
  
  for (const letter of letters) {
    frequency[letter] = (frequency[letter] || 0) + 1;
  }

  const uniqueLetters = Object.keys(frequency).length;
  const repeatedLetters = Object.entries(frequency)
    .filter(([, count]) => count > 1)
    .map(([letter, count]) => ({ letter, count }));

  const mostCommon = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([letter, count]) => ({ letter, count }));

  return {
    uniqueLetters,
    totalLetters: letters.length,
    uniquenessRatio: letters.length > 0 ? (uniqueLetters / letters.length * 100).toFixed(1) : 0,
    repeatedLetters,
    mostCommon,
  };
}

/**
 * Check for name symmetry and palindrome properties.
 */
export function analyzeSymmetry(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '');
  const reversed = letters.split('').reverse().join('');
  const isPalindrome = letters === reversed;
  
  // Calculate visual balance (first half vs second half letter distribution)
  const mid = Math.floor(letters.length / 2);
  const firstHalf = letters.slice(0, mid);
  const secondHalf = letters.slice(-mid);
  
  let matchingPositions = 0;
  for (let i = 0; i < mid; i++) {
    if (firstHalf[i] === secondHalf[mid - 1 - i]) {
      matchingPositions++;
    }
  }
  
  const symmetryScore = mid > 0 ? Math.round((matchingPositions / mid) * 100) : 0;

  return {
    isPalindrome,
    symmetryScore,
    nameLength: letters.length,
    isPowerOfTwo: letters.length > 0 && (letters.length & (letters.length - 1)) === 0,
  };
}

/**
 * Estimate syllable count using a heuristic approach.
 */
function estimateSyllables(word) {
  const lower = word.toLowerCase();
  if (lower.length <= 3) return 1;
  
  // Count vowel groups
  const vowelGroups = lower.match(/[aeiouy]+/g) || [];
  let syllables = vowelGroups.length;
  
  // Adjust for silent e
  if (lower.endsWith('e') && syllables > 1) {
    syllables--;
  }
  
  // Adjust for -le endings
  if (lower.match(/[^aeiouy]le$/)) {
    syllables++;
  }
  
  return Math.max(1, syllables);
}

/**
 * Analyze phonetic rhythm and flow.
 */
export function analyzePhoneticRhythm(name) {
  const parts = name.trim().split(/\s+/);
  const syllableCounts = parts.map(part => estimateSyllables(part));
  const totalSyllables = syllableCounts.reduce((a, b) => a + b, 0);
  
  // Determine rhythm pattern
  let rhythmPattern = 'balanced';
  if (syllableCounts.length >= 2) {
    const first = syllableCounts[0];
    const last = syllableCounts[syllableCounts.length - 1];
    
    if (first > last + 1) {
      rhythmPattern = 'front-heavy';
    } else if (last > first + 1) {
      rhythmPattern = 'back-heavy';
    } else if (syllableCounts.every(c => c === syllableCounts[0])) {
      rhythmPattern = 'uniform';
    }
  }

  // Analyze consonant flow
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '');
  let hardCount = 0;
  let softCount = 0;
  
  for (const letter of letters) {
    if (HARD_CONSONANTS.has(letter)) hardCount++;
    if (SOFT_CONSONANTS.has(letter)) softCount++;
  }
  
  let soundTexture = 'balanced';
  if (hardCount > softCount * 1.5) {
    soundTexture = 'sharp/percussive';
  } else if (softCount > hardCount * 1.5) {
    soundTexture = 'flowing/melodic';
  }

  return {
    parts: parts.length,
    syllableCounts,
    totalSyllables,
    rhythmPattern,
    soundTexture,
    memorabilityScore: calculateMemorabilityScore(name, totalSyllables),
  };
}

/**
 * Calculate a memorability score based on various factors.
 */
function calculateMemorabilityScore(name, syllables) {
  let score = 50;
  const length = name.replace(/\s/g, '').length;
  
  // Optimal length bonus (6-12 chars)
  if (length >= 6 && length <= 12) score += 15;
  else if (length < 6) score += 5;
  else score -= 5;
  
  // Syllable bonus (2-4 syllables optimal)
  if (syllables >= 2 && syllables <= 4) score += 15;
  else if (syllables > 6) score -= 10;
  
  // Alliteration bonus (same starting letters in parts)
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    const firstLetters = parts.map(p => p[0]?.toUpperCase());
    const hasAlliteration = firstLetters.some((l, i) => 
      firstLetters.slice(i + 1).includes(l)
    );
    if (hasAlliteration) score += 10;
  }
  
  // Rhyme pattern bonus
  if (parts.length >= 2) {
    const endings = parts.map(p => p.slice(-2).toLowerCase());
    const hasRhyme = endings.some((e, i) => 
      endings.slice(i + 1).includes(e)
    );
    if (hasRhyme) score += 10;
  }
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Interpret the letter analysis patterns.
 */
export function interpretPatterns(letterCounts, rhythm) {
  const interpretations = [];
  
  // Vowel ratio interpretation
  if (letterCounts.vowelRatio >= 40 && letterCounts.vowelRatio <= 45) {
    interpretations.push({
      aspect: 'Communication Style',
      value: 'Your name suggests balanced expressiveness and moderate introversion/extroversion.',
    });
  } else if (letterCounts.vowelRatio > 50) {
    interpretations.push({
      aspect: 'Communication Style',
      value: 'High vowel presence suggests open, expressive communication patterns.',
    });
  } else if (letterCounts.vowelRatio < 35) {
    interpretations.push({
      aspect: 'Communication Style',
      value: 'Lower vowel ratio suggests direct, concise communication tendencies.',
    });
  }
  
  // Hard/soft consonant interpretation
  if (letterCounts.softConsonants > letterCounts.hardConsonants) {
    interpretations.push({
      aspect: 'Expression Quality',
      value: 'Soft consonant dominance correlates with analytical, reflective expression.',
    });
  } else if (letterCounts.hardConsonants > letterCounts.softConsonants) {
    interpretations.push({
      aspect: 'Expression Quality',
      value: 'Hard consonant presence suggests direct, assertive expression patterns.',
    });
  }
  
  // Rhythm interpretation
  if (rhythm.rhythmPattern === 'front-heavy') {
    interpretations.push({
      aspect: 'Cognitive Pattern',
      value: 'Descending syllable pattern often correlates with broad-to-focused thinking style.',
    });
  } else if (rhythm.rhythmPattern === 'back-heavy') {
    interpretations.push({
      aspect: 'Cognitive Pattern',
      value: 'Rising syllable pattern suggests building momentum in thought processes.',
    });
  }
  
  // Memorability interpretation
  if (rhythm.memorabilityScore >= 75) {
    interpretations.push({
      aspect: 'Professional Impact',
      value: 'High memorability score suggests strong name recognition potential.',
    });
  }
  
  return interpretations;
}

/**
 * Perform complete letter analysis.
 */
export function analyzeLetters(name) {
  const letterCounts = countLetterTypes(name);
  const frequency = analyzeLetterFrequency(name);
  const symmetry = analyzeSymmetry(name);
  const rhythm = analyzePhoneticRhythm(name);
  const interpretations = interpretPatterns(letterCounts, rhythm);

  return {
    letterCounts,
    frequency,
    symmetry,
    rhythm,
    interpretations,
  };
}

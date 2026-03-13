/**
 * demographic.js — Demographic inference from name and DOB.
 * Age, generation, gender probability, cultural origin.
 * All inference is probabilistic, not deterministic.
 */

// Generation definitions by birth year
const GENERATIONS = [
  { name: 'Gen Alpha', start: 2013, end: 2030 },
  { name: 'Gen Z', start: 1997, end: 2012 },
  { name: 'Millennial', start: 1981, end: 1996 },
  { name: 'Gen X', start: 1965, end: 1980 },
  { name: 'Baby Boomer', start: 1946, end: 1964 },
  { name: 'Silent Generation', start: 1928, end: 1945 },
  { name: 'Greatest Generation', start: 1901, end: 1927 },
];

// Common names with gender probability (sample dataset)
const NAME_GENDER_MAP = {
  // Male names
  'james': { male: 0.99, region: 'Anglo' },
  'john': { male: 0.99, region: 'Anglo' },
  'michael': { male: 0.99, region: 'Anglo' },
  'david': { male: 0.99, region: 'Anglo' },
  'william': { male: 0.99, region: 'Anglo' },
  'robert': { male: 0.99, region: 'Anglo' },
  'joseph': { male: 0.99, region: 'Anglo' },
  'daniel': { male: 0.98, region: 'Anglo' },
  'matthew': { male: 0.99, region: 'Anglo' },
  'andrew': { male: 0.99, region: 'Anglo' },
  'abhishek': { male: 0.99, region: 'South Asian' },
  'raj': { male: 0.95, region: 'South Asian' },
  'arjun': { male: 0.99, region: 'South Asian' },
  'rahul': { male: 0.99, region: 'South Asian' },
  'amit': { male: 0.98, region: 'South Asian' },
  'jose': { male: 0.99, region: 'Latin' },
  'carlos': { male: 0.99, region: 'Latin' },
  'miguel': { male: 0.99, region: 'Latin' },
  'wei': { male: 0.60, region: 'East Asian' },
  'chen': { male: 0.50, region: 'East Asian' },
  'hiroshi': { male: 0.99, region: 'East Asian' },
  'kenji': { male: 0.99, region: 'East Asian' },
  'mohammed': { male: 0.99, region: 'Middle Eastern' },
  'ahmed': { male: 0.99, region: 'Middle Eastern' },
  'ali': { male: 0.95, region: 'Middle Eastern' },
  'alexander': { male: 0.99, region: 'Anglo' },
  'benjamin': { male: 0.99, region: 'Anglo' },
  'christopher': { male: 0.99, region: 'Anglo' },
  'ryan': { male: 0.97, region: 'Anglo' },
  'kevin': { male: 0.99, region: 'Anglo' },
  'brian': { male: 0.99, region: 'Anglo' },
  'ethan': { male: 0.99, region: 'Anglo' },
  'noah': { male: 0.99, region: 'Anglo' },
  'liam': { male: 0.99, region: 'Anglo' },
  // Female names
  'mary': { male: 0.01, region: 'Anglo' },
  'jennifer': { male: 0.01, region: 'Anglo' },
  'elizabeth': { male: 0.01, region: 'Anglo' },
  'sarah': { male: 0.01, region: 'Anglo' },
  'jessica': { male: 0.01, region: 'Anglo' },
  'emily': { male: 0.01, region: 'Anglo' },
  'emma': { male: 0.01, region: 'Anglo' },
  'olivia': { male: 0.01, region: 'Anglo' },
  'sophia': { male: 0.01, region: 'Anglo' },
  'priya': { male: 0.01, region: 'South Asian' },
  'anjali': { male: 0.01, region: 'South Asian' },
  'neha': { male: 0.01, region: 'South Asian' },
  'pooja': { male: 0.01, region: 'South Asian' },
  'maria': { male: 0.01, region: 'Latin' },
  'ana': { male: 0.02, region: 'Latin' },
  'fatima': { male: 0.01, region: 'Middle Eastern' },
  'aisha': { male: 0.01, region: 'Middle Eastern' },
  'yuki': { male: 0.40, region: 'East Asian' },
  'mei': { male: 0.10, region: 'East Asian' },
  'sakura': { male: 0.01, region: 'East Asian' },
  // Gender-neutral
  'alex': { male: 0.55, region: 'Anglo' },
  'jordan': { male: 0.55, region: 'Anglo' },
  'taylor': { male: 0.45, region: 'Anglo' },
  'casey': { male: 0.50, region: 'Anglo' },
  'avery': { male: 0.35, region: 'Anglo' },
};

// Surname patterns for regional inference
const SURNAME_PATTERNS = [
  { pattern: /^(kim|lee|park|choi|jung|kang|cho)$/i, region: 'East Asian (Korean)' },
  { pattern: /^(wang|li|zhang|liu|chen|yang|huang|wu|zhou)$/i, region: 'East Asian (Chinese)' },
  { pattern: /^(tanaka|yamamoto|nakamura|kobayashi|yoshida|saito|suzuki)$/i, region: 'East Asian (Japanese)' },
  { pattern: /^(kumar|sharma|singh|gupta|patel|reddy|rao|das|roy)$/i, region: 'South Asian (Indian)' },
  { pattern: /^(garcia|martinez|rodriguez|lopez|hernandez|gonzalez|perez)$/i, region: 'Latin (Hispanic)' },
  { pattern: /^(silva|santos|oliveira|souza|costa|ferreira|pereira)$/i, region: 'Latin (Portuguese)' },
  { pattern: /^(smith|johnson|williams|brown|jones|miller|davis|wilson)$/i, region: 'Anglo (American)' },
  { pattern: /^(ali|khan|ahmed|hassan|hussain|mohammad)$/i, region: 'Middle Eastern / South Asian (Islamic)' },
  { pattern: /^(o'|mc|mac)/i, region: 'Anglo (Celtic/Irish)' },
  { pattern: /^(van |de |von |le |la )/i, region: 'European' },
  { pattern: /(ovich|ovsky|enko|chuk)$/i, region: 'Eastern European (Slavic)' },
  { pattern: /(son|sen)$/i, region: 'Scandinavian' },
  { pattern: /(berg|stein|man|mann)$/i, region: 'Germanic / Jewish' },
];

/**
 * Calculate age from DOB.
 */
export function calculateAge(year, month, day) {
  const today = new Date();
  const birthDate = new Date(year, month - 1, day);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return Math.max(0, age);
}

/**
 * Get generation label from birth year.
 */
export function getGeneration(year) {
  for (const gen of GENERATIONS) {
    if (year >= gen.start && year <= gen.end) {
      return gen.name;
    }
  }
  return year < 1901 ? 'Pre-1900' : 'Future Generation';
}

/**
 * Get generation traits.
 */
export function getGenerationTraits(generation) {
  const traits = {
    'Gen Alpha': ['Digital native from birth', 'AI-integrated upbringing', 'Highly visual learners', 'Global connectivity'],
    'Gen Z': ['Extremely digital-native', 'Social media fluent', 'Pragmatic and entrepreneurial', 'Values authenticity'],
    'Millennial': ['Tech-savvy early adopters', 'Value experiences over things', 'Socially conscious', 'Collaborative mindset'],
    'Gen X': ['Independent and resourceful', 'Work-life balance pioneers', 'Adaptable to change', 'Skeptical of institutions'],
    'Baby Boomer': ['Strong work ethic', 'Goal-oriented', 'Competitive', 'Value loyalty'],
    'Silent Generation': ['Civic-minded', 'Conformist', 'Loyal', 'Fiscally conservative'],
    'Greatest Generation': ['Self-sacrificing', 'Patriotic', 'Thrifty', 'Strong sense of duty'],
  };
  return traits[generation] || ['Information not available'];
}

/**
 * Infer gender probability from first name.
 */
export function inferGenderProbability(firstName) {
  const normalized = firstName.toLowerCase().trim();
  const data = NAME_GENDER_MAP[normalized];
  
  if (data) {
    return {
      maleProbability: data.male,
      femaleProbability: 1 - data.male,
      confidence: 'high',
    };
  }
  
  // Heuristic: names ending in 'a' are often female
  if (normalized.endsWith('a') && !normalized.match(/(joshua|elijah|isaiah|nikita)$/)) {
    return { maleProbability: 0.25, femaleProbability: 0.75, confidence: 'low' };
  }
  
  // Names ending in consonants are often male
  if (normalized.match(/[bcdfghjklmnpqrstvwxz]$/)) {
    return { maleProbability: 0.65, femaleProbability: 0.35, confidence: 'low' };
  }
  
  return { maleProbability: 0.50, femaleProbability: 0.50, confidence: 'unknown' };
}

/**
 * Infer cultural/regional origin from name parts.
 */
export function inferRegionalOrigin(nameParts) {
  const origins = [];
  
  // Check first name
  const firstName = nameParts[0]?.toLowerCase();
  if (firstName && NAME_GENDER_MAP[firstName]) {
    origins.push(NAME_GENDER_MAP[firstName].region);
  }
  
  // Check surname patterns
  for (const part of nameParts) {
    for (const { pattern, region } of SURNAME_PATTERNS) {
      if (pattern.test(part)) {
        if (!origins.includes(region)) {
          origins.push(region);
        }
      }
    }
  }
  
  // If multiple origins found, could indicate multicultural background
  if (origins.length === 0) {
    return { origins: ['Unable to determine'], multicultural: false };
  }
  
  return {
    origins: [...new Set(origins)],
    multicultural: origins.length > 1,
  };
}

/**
 * Calculate all demographic inferences.
 */
export function calculateDemographics(name, year, month, day) {
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  
  const age = calculateAge(year, month, day);
  const generation = getGeneration(year);
  const generationTraits = getGenerationTraits(generation);
  const genderInference = inferGenderProbability(firstName);
  const regionalOrigin = inferRegionalOrigin(nameParts);
  
  return {
    age,
    generation,
    generationTraits,
    gender: genderInference,
    cultural: regionalOrigin,
    disclaimer: 'These are probabilistic inferences based on statistical patterns, not deterministic facts.',
  };
}

/**
 * Interpretation lookup tables.
 * Each planet-sign combo gets a tailored reading.
 */

export const SUN_SIGN_READINGS = {
  aries: {
    title: 'The Flame That Leads',
    reading: 'Your Sun in Aries bestows a warrior spirit — you are the first to charge, the first to inspire, the first to blaze a trail where none existed. You carry the energy of new beginnings, raw courage, and an irrepressible drive to assert your identity upon the world.',
  },
  taurus: {
    title: 'The Enduring Garden',
    reading: 'Your Sun in Taurus roots you in the sensual and the real. You are the one who builds things that last — relationships, homes, legacies. Your power lies in patience, in the slow accumulation of beauty and meaning.',
  },
  gemini: {
    title: 'The Quicksilver Mind',
    reading: 'Your Sun in Gemini grants you the gift of duality — you contain multitudes. Language is your element, curiosity your compass, and adaptability your superpower. You process the world at the speed of thought.',
  },
  cancer: {
    title: 'The Keeper of Tides',
    reading: 'Your Sun in Cancer connects you to the deepest emotional currents. You are guardian, nurturer, and the emotional memory of every room you enter. Your intuition is not a gift — it is a force of nature.',
  },
  leo: {
    title: 'The Radiant Sovereign',
    reading: 'Your Sun in Leo is a cosmic birthright of radiance. You were born to shine, to create, to lead with warmth and generosity. When you walk into a room, the light follows you — not because you demand it, but because you are it.',
  },
  virgo: {
    title: 'The Sacred Analyst',
    reading: 'Your Sun in Virgo gives you eyes that see what others miss. You find order in chaos, meaning in detail, and purpose in service. Your perfectionism is not a flaw — it is devotion expressed through craft.',
  },
  libra: {
    title: 'The Celestial Diplomat',
    reading: 'Your Sun in Libra seeks harmony as a fundamental law of existence. Beauty, justice, and partnership are not luxuries to you — they are necessities. You create balance wherever imbalance exists.',
  },
  scorpio: {
    title: 'The Phoenix Soul',
    reading: 'Your Sun in Scorpio gives you x-ray vision into the human condition. You are drawn to truth, no matter how uncomfortable, and you possess the rare power to transform pain into wisdom. Death and rebirth are your eternal theme.',
  },
  sagittarius: {
    title: 'The Cosmic Archer',
    reading: 'Your Sun in Sagittarius ignites an unquenchable thirst for meaning. You are philosopher, adventurer, and eternal student rolled into one. The horizon is not a boundary to you — it is an invitation.',
  },
  capricorn: {
    title: 'The Mountain Architect',
    reading: 'Your Sun in Capricorn endows you with the discipline of mountains and the ambition of empires. You understand that greatness is built slowly, with intention, and you are willing to do the work that others abandon.',
  },
  aquarius: {
    title: 'The Electric Visionary',
    reading: 'Your Sun in Aquarius wires you to the frequency of the future. You think in systems, dream in revolutions, and love humanity with the fierce detachment of one who sees far beyond the present moment.',
  },
  pisces: {
    title: 'The Dreaming Ocean',
    reading: 'Your Sun in Pisces dissolves the boundary between self and universe. You feel everything, absorb everything, and transform it into art, compassion, or spiritual insight. You are the mystic of the zodiac.',
  },
};

export const MOON_SIGN_READINGS = {
  aries: {
    title: 'Instinctive Fire',
    reading: 'Your emotional world is governed by impulse and immediacy. You feel things quickly, react boldly, and process emotions through action. Stillness is not your natural state — movement is.',
  },
  taurus: {
    title: 'Emotional Anchor',
    reading: 'You crave emotional stability and find security in the tangible — food, touch, comfort, routine. Your feelings run deep and steady, like underground rivers.',
  },
  gemini: {
    title: 'The Curious Heart',
    reading: 'You process emotions through conversation and analysis. Your inner world is lively, restless, and endlessly curious. You need mental stimulation as much as emotional connection.',
  },
  cancer: {
    title: 'The Deepest Well',
    reading: 'Moon in Cancer is at home — your emotional sensitivity is extraordinary. You absorb the moods of others, nurture instinctively, and form bonds that transcend time.',
  },
  leo: {
    title: 'The Warm Hearth',
    reading: 'You need to be seen, appreciated, and celebrated. Your emotions are dramatic, generous, and theatrical. Love, for you, is performance art in the best possible sense.',
  },
  virgo: {
    title: 'The Quiet Devotion',
    reading: 'You express love through service and worry through analysis. Your emotional life is orderly on the surface, deeply caring underneath. You heal by solving, fixing, and organizing.',
  },
  libra: {
    title: 'The Harmonized Heart',
    reading: 'You seek emotional equilibrium and find peace through partnership. Conflict disturbs you deeply. Beauty, aesthetics, and fairness are emotional necessities.',
  },
  scorpio: {
    title: 'The Unfathomable Depth',
    reading: 'Your emotions are volcanic — powerful, transformative, and not to be trifled with. You love with totality, fear betrayal intensely, and understand the darkness that others avoid.',
  },
  sagittarius: {
    title: 'The Wandering Spirit',
    reading: 'You process emotions through philosophy and adventure. You need freedom to feel safe and meaning to feel settled. Emotional restlessness drives you toward growth.',
  },
  capricorn: {
    title: 'The Stoic Heart',
    reading: 'You feel deeply but express cautiously. Emotional maturity came early for you. You protect your heart with walls built from responsibility and reserve.',
  },
  aquarius: {
    title: 'The Detached Observer',
    reading: 'You experience emotions as ideas and process feelings through logic. Intimacy can feel uncomfortable, but your capacity for humanitarian love is boundless.',
  },
  pisces: {
    title: 'The Boundless Empath',
    reading: 'Your emotional sponge absorbs everything. Dreams, intuitions, and psychic impressions flood your inner world. Boundaries are your greatest lesson.',
  },
};

export const RISING_SIGN_READINGS = {
  aries:       'You enter rooms like a spark — energetic, direct, and impossible to ignore.',
  taurus:      'Your presence is calming, grounded, and quietly magnetic. People feel safe around you.',
  gemini:      'You arrive with questions, wit, and a social fluidity that disarms everyone.',
  cancer:      'Your exterior is protective, nurturing, and softer than the world expects.',
  leo:         'You radiate confidence and warmth before you ever speak a word.',
  virgo:       'You appear composed, intelligent, and attentive to every detail in the room.',
  libra:       'Elegance precedes you. Your first impression is one of grace and beauty.',
  scorpio:     'You carry intensity in your gaze. People sense your power before understanding it.',
  sagittarius: 'Your energy is infectious — open, optimistic, and always slightly restless.',
  capricorn:   'You project authority and competence. People assume you are in charge.',
  aquarius:    'You seem slightly ahead of everyone else — unconventional, intellectual, and intriguing.',
  pisces:      'You drift into spaces like mist — ethereal, gentle, and quietly enchanting.',
};

export const PLANET_SIGN_BRIEF = {
  mercury: {
    aries: 'Quick-thinking, direct speech',
    taurus: 'Methodical thought, practical mind',
    gemini: 'Brilliant communicator, swift intellect',
    cancer: 'Intuitive thinker, emotional memory',
    leo: 'Creative expression, commanding speech',
    virgo: 'Analytical precision, detail-oriented',
    libra: 'Diplomatic words, balanced views',
    scorpio: 'Penetrating insight, strategic mind',
    sagittarius: 'Philosophical thinker, broad vision',
    capricorn: 'Structured thought, disciplined mind',
    aquarius: 'Original thinker, progressive ideas',
    pisces: 'Poetic mind, intuitive communication',
  },
  venus: {
    aries: 'Passionate love, bold attraction',
    taurus: 'Sensual devotion, material beauty',
    gemini: 'Flirtatious charm, intellectual love',
    cancer: 'Nurturing love, domestic beauty',
    leo: 'Grand romance, dramatic love',
    virgo: 'Devoted service, modest love',
    libra: 'Harmonious love, aesthetic beauty',
    scorpio: 'Intense passion, magnetic attraction',
    sagittarius: 'Adventurous love, free spirit',
    capricorn: 'Committed love, timeless elegance',
    aquarius: 'Unconventional love, intellectual bonds',
    pisces: 'Transcendent love, selfless devotion',
  },
  mars: {
    aries: 'Fierce warrior, unstoppable drive',
    taurus: 'Steady persistence, patient strength',
    gemini: 'Mental agility, versatile action',
    cancer: 'Protective force, emotional courage',
    leo: 'Creative ambition, proud action',
    virgo: 'Precise execution, methodical effort',
    libra: 'Strategic action, diplomatic assertion',
    scorpio: 'Relentless power, transformative force',
    sagittarius: 'Bold adventurer, righteous action',
    capricorn: 'Disciplined ambition, calculated moves',
    aquarius: 'Revolutionary action, group causes',
    pisces: 'Subtle force, compassionate action',
  },
};

/**
 * Get planet-sign interpretation.
 */
export function getInterpretation(planet, sign) {
  const p = planet?.toLowerCase();
  const s = sign?.toLowerCase();

  if (p === 'sun') return SUN_SIGN_READINGS[s] || null;
  if (p === 'moon') return MOON_SIGN_READINGS[s] || null;
  if (PLANET_SIGN_BRIEF[p]) {
    const brief = PLANET_SIGN_BRIEF[p][s];
    return brief ? { title: brief, reading: brief } : null;
  }
  return null;
}

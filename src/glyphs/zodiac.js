export const ZODIAC_SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

export const ZODIAC_GLYPHS = {
  aries:       { symbol: '♈', name: 'Aries',       element: 'fire',  quality: 'cardinal', ruler: 'Mars' },
  taurus:      { symbol: '♉', name: 'Taurus',      element: 'earth', quality: 'fixed',    ruler: 'Venus' },
  gemini:      { symbol: '♊', name: 'Gemini',      element: 'air',   quality: 'mutable',  ruler: 'Mercury' },
  cancer:      { symbol: '♋', name: 'Cancer',      element: 'water', quality: 'cardinal', ruler: 'Moon' },
  leo:         { symbol: '♌', name: 'Leo',         element: 'fire',  quality: 'fixed',    ruler: 'Sun' },
  virgo:       { symbol: '♍', name: 'Virgo',       element: 'earth', quality: 'mutable',  ruler: 'Mercury' },
  libra:       { symbol: '♎', name: 'Libra',       element: 'air',   quality: 'cardinal', ruler: 'Venus' },
  scorpio:     { symbol: '♏', name: 'Scorpio',     element: 'water', quality: 'fixed',    ruler: 'Pluto' },
  sagittarius: { symbol: '♐', name: 'Sagittarius', element: 'fire',  quality: 'mutable',  ruler: 'Jupiter' },
  capricorn:   { symbol: '♑', name: 'Capricorn',   element: 'earth', quality: 'cardinal', ruler: 'Saturn' },
  aquarius:    { symbol: '♒', name: 'Aquarius',    element: 'air',   quality: 'fixed',    ruler: 'Uranus' },
  pisces:      { symbol: '♓', name: 'Pisces',      element: 'water', quality: 'mutable',  ruler: 'Neptune' },
};

export const ELEMENT_COLORS = {
  fire:  'var(--element-fire)',
  earth: 'var(--element-earth)',
  air:   'var(--element-air)',
  water: 'var(--element-water)',
};

export function getZodiacGlyph(signName) {
  return ZODIAC_GLYPHS[signName?.toLowerCase()] || null;
}

export const PLANET_GLYPHS = {
  sun:     { symbol: '☉', name: 'Sun',     keyword: 'Identity' },
  moon:    { symbol: '☽', name: 'Moon',    keyword: 'Emotions' },
  mercury: { symbol: '☿', name: 'Mercury', keyword: 'Communication' },
  venus:   { symbol: '♀', name: 'Venus',   keyword: 'Love' },
  mars:    { symbol: '♂', name: 'Mars',    keyword: 'Drive' },
  jupiter: { symbol: '♃', name: 'Jupiter', keyword: 'Expansion' },
  saturn:  { symbol: '♄', name: 'Saturn',  keyword: 'Discipline' },
  uranus:  { symbol: '♅', name: 'Uranus',  keyword: 'Revolution' },
  neptune: { symbol: '♆', name: 'Neptune', keyword: 'Intuition' },
  pluto:   { symbol: '♇', name: 'Pluto',   keyword: 'Transformation' },
};

export const PLANET_LIST = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
];

export function getPlanetGlyph(planetName) {
  return PLANET_GLYPHS[planetName?.toLowerCase()] || null;
}

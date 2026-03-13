import { ZODIAC_SIGNS } from '@/glyphs/zodiac';

/**
 * Convert ecliptic longitude (0-360°) to zodiac sign + degree within sign.
 */
export function longitudeToZodiac(longitude) {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degree = normalized % 30;
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: Math.floor(degree),
    minute: Math.floor((degree % 1) * 60),
    longitude: normalized,
    signIndex,
  };
}

/**
 * Get the zodiac sign name from a longitude.
 */
export function getSignFromLongitude(longitude) {
  return longitudeToZodiac(longitude).sign;
}

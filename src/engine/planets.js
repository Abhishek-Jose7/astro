import * as Astronomy from 'astronomy-engine';
import { longitudeToZodiac } from './zodiac';

const PLANET_MAP = {
  sun:     Astronomy.Body.Sun,
  moon:    Astronomy.Body.Moon,
  mercury: Astronomy.Body.Mercury,
  venus:   Astronomy.Body.Venus,
  mars:    Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn:  Astronomy.Body.Saturn,
  uranus:  Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
  pluto:   Astronomy.Body.Pluto,
};

/**
 * Compute ecliptic longitude for a given planet at a given UTC Date.
 */
function getPlanetLongitude(body, date) {
  const astroDate = Astronomy.MakeTime(date);

  if (body === Astronomy.Body.Sun) {
    const eq = Astronomy.SunPosition(astroDate);
    return eq.elon;
  }

  const eq = Astronomy.EclipticGeoMoon(astroDate);
  if (body === Astronomy.Body.Moon) {
    return eq.lon;
  }

  // For all other planets, get ecliptic longitude via equatorial -> ecliptic
  const equ = Astronomy.Equator(body, astroDate, null, true, true);
  const ecl = Astronomy.Ecliptic(equ.vec);
  return ecl.elon;
}

/**
 * Calculate all planetary positions for a given UTC datetime.
 * Returns an object keyed by planet name.
 */
export function calculatePlanets(utcDate) {
  const results = {};

  for (const [name, body] of Object.entries(PLANET_MAP)) {
    const longitude = getPlanetLongitude(body, utcDate);
    const zodiac = longitudeToZodiac(longitude);
    results[name] = {
      name,
      longitude,
      ...zodiac,
    };
  }

  return results;
}

/**
 * Check if the Moon changes zodiac sign during a given day (UTC).
 * Used for minimal mode warnings.
 */
export function moonSignChangeDuringDay(year, month, day) {
  const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));

  const moonStart = getPlanetLongitude(Astronomy.Body.Moon, startOfDay);
  const moonEnd = getPlanetLongitude(Astronomy.Body.Moon, endOfDay);

  const signStart = Math.floor(moonStart / 30);
  const signEnd = Math.floor(moonEnd / 30);

  return signStart !== signEnd;
}

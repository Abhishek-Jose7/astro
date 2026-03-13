import * as Astronomy from 'astronomy-engine';

/**
 * Calculate the Local Sidereal Time (LST) in degrees.
 */
function calcLST(utcDate, longitudeDeg) {
  const astroTime = Astronomy.MakeTime(utcDate);
  const gst = Astronomy.SiderealTime(astroTime);  // Greenwich Sidereal Time in hours
  const lst = gst + longitudeDeg / 15.0;           // Convert longitude and add
  return ((lst % 24) + 24) % 24;                   // Normalize to 0-24 hours
}

/**
 * Calculate the Ascendant (rising sign) degree.
 */
function calcAscendant(lstHours, latitudeDeg) {
  const lstRad = (lstHours * 15) * Math.PI / 180; // LST in radians
  const latRad = latitudeDeg * Math.PI / 180;
  const obliquity = 23.4393 * Math.PI / 180;       // Earth's axial tilt

  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(obliquity) + Math.tan(latRad) * Math.sin(obliquity);
  let asc = Math.atan2(y, x) * 180 / Math.PI;
  asc = ((asc % 360) + 360) % 360;

  return asc;
}

/**
 * Calculate the Midheaven (MC) degree.
 */
function calcMidheaven(lstHours) {
  const lstRad = (lstHours * 15) * Math.PI / 180;
  const obliquity = 23.4393 * Math.PI / 180;

  let mc = Math.atan2(Math.sin(lstRad), Math.cos(lstRad) * Math.cos(obliquity));
  mc = mc * 180 / Math.PI;
  mc = ((mc % 360) + 360) % 360;

  // MC should be above the horizon — adjust if needed
  if (Math.cos(lstRad) < 0) {
    mc = (mc + 180) % 360;
  }

  return mc;
}

/**
 * Placidus house cusps via semi-arc interpolation.
 */
function calcPlacidus(lstHours, latitudeDeg) {
  const asc = calcAscendant(lstHours, latitudeDeg);
  const mc = calcMidheaven(lstHours);
  const ic = (mc + 180) % 360;
  const desc = (asc + 180) % 360;

  // Simplified Placidus: interpolate between MC, ASC, IC, DESC
  // Houses: 1=ASC, 10=MC, 7=DESC, 4=IC
  const cusps = new Array(12);
  cusps[0] = asc;       // 1st house
  cusps[9] = mc;        // 10th house
  cusps[6] = desc;      // 7th house
  cusps[3] = ic;        // 4th house

  // Interpolate intermediate cusps
  function interpolate(start, end, fraction) {
    let diff = end - start;
    if (diff < 0) diff += 360;
    return (start + diff * fraction) % 360;
  }

  // 10th -> 1st (houses 11, 12)
  cusps[10] = interpolate(mc, asc, 1/3);
  cusps[11] = interpolate(mc, asc, 2/3);

  // 1st -> 4th (houses 2, 3)
  cusps[1] = interpolate(asc, ic, 1/3);
  cusps[2] = interpolate(asc, ic, 2/3);

  // 4th -> 7th (houses 5, 6)
  cusps[4] = interpolate(ic, desc, 1/3);
  cusps[5] = interpolate(ic, desc, 2/3);

  // 7th -> 10th (houses 8, 9)
  cusps[7] = interpolate(desc, mc, 1/3);
  cusps[8] = interpolate(desc, mc, 2/3);

  return cusps;
}

/**
 * Whole Sign houses: each house is a complete 30° zodiac sign.
 * The 1st house is the entire sign containing the Ascendant.
 */
function calcWholeSigns(lstHours, latitudeDeg) {
  const asc = calcAscendant(lstHours, latitudeDeg);
  const firstSignStart = Math.floor(asc / 30) * 30;

  const cusps = new Array(12);
  for (let i = 0; i < 12; i++) {
    cusps[i] = (firstSignStart + i * 30) % 360;
  }
  return cusps;
}

/**
 * Equal houses: each house is exactly 30° starting from the Ascendant degree.
 */
function calcEqualHouses(lstHours, latitudeDeg) {
  const asc = calcAscendant(lstHours, latitudeDeg);

  const cusps = new Array(12);
  for (let i = 0; i < 12; i++) {
    cusps[i] = (asc + i * 30) % 360;
  }
  return cusps;
}

/**
 * Calculate house cusps given UTC date, latitude, longitude, and house system.
 * @param {Date} utcDate
 * @param {number} latitude - in degrees
 * @param {number} longitude - in degrees
 * @param {'placidus' | 'whole' | 'equal'} system
 * @returns {{ ascendant: number, midheaven: number, cusps: number[], system: string }}
 */
export function calculateHouses(utcDate, latitude, longitude, system = 'placidus') {
  const lstHours = calcLST(utcDate, longitude);
  const ascendant = calcAscendant(lstHours, latitude);
  const midheaven = calcMidheaven(lstHours);

  let cusps;
  switch (system) {
    case 'whole':
      cusps = calcWholeSigns(lstHours, latitude);
      break;
    case 'equal':
      cusps = calcEqualHouses(lstHours, latitude);
      break;
    case 'placidus':
    default:
      cusps = calcPlacidus(lstHours, latitude);
      break;
  }

  return {
    ascendant,
    midheaven,
    cusps,
    system,
  };
}

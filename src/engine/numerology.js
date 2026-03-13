/**
 * Calculate the Life Path Number from a date of birth.
 * Reduces date digits to a single digit (or master number 11, 22, 33).
 */
function reduceToSingle(num) {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = String(num).split('').reduce((sum, d) => sum + Number(d), 0);
  }
  return num;
}

export function calculateLifePath(year, month, day) {
  const reducedYear = reduceToSingle(year);
  const reducedMonth = reduceToSingle(month);
  const reducedDay = reduceToSingle(day);
  const lifePathNumber = reduceToSingle(reducedYear + reducedMonth + reducedDay);

  return lifePathNumber;
}

const LIFE_PATH_MEANINGS = {
  1:  { title: 'The Pioneer', description: 'You are a born leader, independent and innovative. Your path demands courage and originality.' },
  2:  { title: 'The Diplomat', description: 'You are the peacemaker, gifted with sensitivity and cooperation. Your path flows through partnerships.' },
  3:  { title: 'The Creator', description: 'You carry the spark of creative expression. Joy, artistry, and communication define your journey.' },
  4:  { title: 'The Builder', description: 'You are the architect of stability. Discipline, hard work, and loyalty are your cornerstones.' },
  5:  { title: 'The Adventurer', description: 'Freedom courses through you. Change, travel, and sensory experience fuel your path.' },
  6:  { title: 'The Nurturer', description: 'Love and responsibility define you. Home, family, and service to others light your way.' },
  7:  { title: 'The Seeker', description: 'You are drawn to the mysteries beneath the surface. Analysis, intuition, and spiritual depth guide you.' },
  8:  { title: 'The Powerhouse', description: 'Ambition and authority flow naturally to you. Material mastery and leadership are your domain.' },
  9:  { title: 'The Humanitarian', description: 'You carry wisdom beyond your years. Compassion, idealism, and universal love define your purpose.' },
  11: { title: 'The Illuminator', description: 'A master number — you channel intuition and spiritual insight. You are here to inspire and enlighten.' },
  22: { title: 'The Master Builder', description: 'A master number — you have the vision to manifest great works. Practicality meets transcendence.' },
  33: { title: 'The Master Teacher', description: 'A master number — you embody selfless service and cosmic compassion. The rarest and most evolved path.' },
};

export function getLifePathMeaning(number) {
  return LIFE_PATH_MEANINGS[number] || LIFE_PATH_MEANINGS[9];
}

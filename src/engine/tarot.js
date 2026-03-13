import { MAJOR_ARCANA, TAROT_POSITIONS } from '@/data/tarot';

function hashSeed(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOutcome(card, isReversed) {
  return isReversed
    ? { orientation: 'Reversed', ...card.reversed }
    : { orientation: 'Upright', ...card.upright };
}

function createTarotSummary(cards, lifePathNumber, sunSign) {
  const anchors = cards.map((entry) => `${entry.position.title}: ${entry.card.name}`).join(' | ');
  const dominant = cards.find((entry) => entry.orientation === 'Reversed')
    ? 'A transformation cycle is active. Move deliberately and trust intuitive timing.'
    : 'Momentum is with you. Keep choices aligned with your highest standards.';

  return `${anchors}. Life Path ${lifePathNumber} with ${sunSign} energy: ${dominant}`;
}

/**
 * Draw a deterministic 3-card tarot spread based on identity inputs.
 * @param {{name: string, date: string, lifePathNumber: number, sunSign: string}} input
 */
export function drawTarotSpread(input) {
  const { name, date, lifePathNumber, sunSign } = input;
  const today = new Date().toISOString().slice(0, 10);
  const rng = mulberry32(hashSeed(`${name}|${date}|${today}|${lifePathNumber}|${sunSign}`));

  const deck = [...MAJOR_ARCANA];

  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  const cards = TAROT_POSITIONS.map((position, index) => {
    const card = deck[index];
    const isReversed = rng() > 0.62;
    const outcome = pickOutcome(card, isReversed);

    return {
      position,
      card: {
        id: card.id,
        name: card.name,
        number: card.number,
        icon: card.icon,
        palette: card.palette,
      },
      orientation: outcome.orientation,
      keywords: outcome.keywords,
      message: outcome.message,
    };
  });

  return {
    system: 'Major Arcana',
    spread: 'Past-Present-Future',
    cards,
    summary: createTarotSummary(cards, lifePathNumber, sunSign),
  };
}
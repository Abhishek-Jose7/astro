/**
 * Encode birth data into URL search params for shareable links.
 */
export function encodeBirthParams({ date, time, cityName }) {
  const params = new URLSearchParams();
  if (date) params.set('d', date);
  if (time) params.set('t', time);
  if (cityName) params.set('c', cityName);
  return params.toString();
}

/**
 * Decode birth data from URL search params.
 * Returns null if required fields are missing.
 */
export function decodeBirthParams(searchString) {
  const params = new URLSearchParams(searchString);
  const date = params.get('d');
  const time = params.get('t');
  const cityName = params.get('c');

  if (!date || !cityName) return null;

  return { date, time: time || '', cityName };
}

/**
 * Generate a full shareable URL.
 */
export function generateShareURL(birthData) {
  const params = encodeBirthParams(birthData);
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return `${base}/reading?${params}`;
}

/**
 * Copy text to clipboard.
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return true;
  }
}

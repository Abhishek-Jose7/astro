const STORAGE_KEY = 'oracle_last_reading';

/**
 * Save reading data to localStorage along with birth data.
 */
export function saveReading(reading, birthData) {
  try {
    const payload = {
      reading,
      birthData,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage unavailable or full — silently fail
  }
}

/**
 * Load the last saved reading from localStorage.
 * Returns { reading, birthData } or null if nothing exists.
 */
export function getLastReading() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Clear the saved reading.
 */
export function clearReading() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently fail
  }
}

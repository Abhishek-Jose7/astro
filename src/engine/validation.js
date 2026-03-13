/**
 * Validate birth form inputs.
 * Returns an object with field-level errors (empty = valid).
 */
export function validateBirthInput({ name, date }) {
  const errors = {};

  // Name validation
  if (!name || !name.trim()) {
    errors.name = 'The spirits need your name to proceed!';
  } else if (name.trim().length < 2) {
    errors.name = 'Even nicknames need at least 2 letters, dear.';
  } else if (!/^[a-zA-Z\s\-\']+$/.test(name.trim())) {
    errors.name = 'Letters, spaces, and hyphens only — no mystical symbols allowed!';
  }

  // Date validation
  if (!date) {
    errors.date = 'When did you grace this earthly realm?';
  } else {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      errors.date = 'The stars cannot read this date format...';
    } else {
      const year = parsed.getFullYear();
      if (year < 1900 || year > 2030) {
        errors.date = 'Are you a time traveler? Please stay within 1900-2030.';
      }
    }
  }

  return errors;
}

/**
 * Check if errors object has any errors.
 */
export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

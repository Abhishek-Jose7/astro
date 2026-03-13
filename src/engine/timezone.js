import { DateTime } from 'luxon';

/**
 * Convert a local date/time + IANA timezone to a UTC Date object.
 * @param {number} year
 * @param {number} month - 1-12
 * @param {number} day
 * @param {number} hour - 0-23
 * @param {number} minute - 0-59
 * @param {string} timezone - IANA timezone string (e.g. 'Asia/Kolkata')
 * @returns {Date} UTC Date
 */
export function localToUTC(year, month, day, hour, minute, timezone) {
  const dt = DateTime.fromObject(
    { year, month, day, hour, minute, second: 0 },
    { zone: timezone }
  );

  if (!dt.isValid) {
    throw new Error(`Invalid date/timezone: ${dt.invalidReason}`);
  }

  return dt.toJSDate();
}

/**
 * Estimate noon UTC for minimal mode (no birth time).
 * Uses noon local time for the given timezone.
 */
export function localNoonUTC(year, month, day, timezone) {
  return localToUTC(year, month, day, 12, 0, timezone);
}

/**
 * Format a UTC date for display.
 */
export function formatUTCDate(utcDate) {
  const dt = DateTime.fromJSDate(utcDate, { zone: 'utc' });
  return dt.toFormat('yyyy-MM-dd HH:mm:ss') + ' UTC';
}

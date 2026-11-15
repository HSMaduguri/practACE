/**
 * Standardized Global Time & Duration Formatting Utility
 * 
 * Rules:
 * 1. Running / Counting Timers (Active):
 *    - Up to 60 mins (< 3600s): Shows minutes and seconds (e.g., "45m 20s", "0m 15s")
 *    - 60 mins and above (>= 3600s): Shows hours, minutes, and seconds (e.g., "1h 15m 30s")
 * 
 * 2. Static Durations (Logged / Target / Statistics):
 *    - Seconds are NEVER shown on static displays ("Seconds in everywhere shall only be shown if it is running or counting and not static")
 *    - Under 1 minute or zero: Shows "0m"
 *    - Up to 60 mins (< 60m): Shows only minutes (e.g., "45m")
 *    - 60 mins and above (>= 60m): Shows hours and minutes (e.g., "1h 25m", "2h")
 */

/**
 * Formats an actively running or counting time value in seconds.
 * Strictly shows [mins and seconds] for < 60m, and [hours, mins, and seconds] for >= 60m.
 */
export function formatRunningTime(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds <= 0) {
    return '0m 00s';
  }

  const secs = Math.floor(totalSeconds);

  if (secs < 3600) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    const sStr = s.toString().padStart(2, '0');
    return `${m}m ${sStr}s`;
  }

  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const mStr = m.toString().padStart(2, '0');
  const sStr = s.toString().padStart(2, '0');
  return `${h}h ${mStr}m ${sStr}s`;
}

/**
 * Formats a static duration (not running or counting).
 * Strictly omits seconds everywhere:
 * - < 1 min or zero -> "0m"
 * - < 60 mins -> `${m}m`
 * - >= 60 mins -> `${h}h ${m}m` (or `${h}h` if m === 0)
 */
export function formatStaticDuration(value: number, unit: 'minutes' | 'seconds' = 'minutes'): string {
  if (isNaN(value) || value <= 0) {
    return '0m';
  }

  const totalMinutes = unit === 'seconds' ? Math.floor(value / 60) : Math.round(value);

  if (totalMinutes <= 0) {
    return '0m';
  }

  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }

  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Helper to format minutes directly as static duration.
 * Shorthand for formatStaticDuration(minutes, 'minutes').
 */
export function formatMinutes(minutes: number): string {
  return formatStaticDuration(minutes, 'minutes');
}

/**
 * Helper to format seconds directly as static duration (without seconds).
 * Shorthand for formatStaticDuration(seconds, 'seconds').
 */
export function formatStaticSeconds(seconds: number): string {
  return formatStaticDuration(seconds, 'seconds');
}

/**
 * Standardized formatter for time-based components that support a dynamic `isRunning` flag.
 */
export function formatStandardTime(totalSeconds: number, isRunning: boolean = false): string {
  if (isRunning) {
    return formatRunningTime(totalSeconds);
  }
  return formatStaticSeconds(totalSeconds);
}

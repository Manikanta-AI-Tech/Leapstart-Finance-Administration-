/**
 * Receipt number generator.
 * Format: LS-YYYY-NNNNNN (e.g., LS-2026-000001)
 *
 * For the mock implementation, uses an in-memory counter keyed by year.
 * In production, this will query the database for the last receipt number
 * in the current year and increment.
 */

// In-memory counter keyed by year string (e.g., "2026" → 42)
const yearCounters = new Map<string, number>();

/**
 * Resets the counter for a specific year. Useful for testing.
 */
export function resetReceiptCounter(year?: string): void {
  if (year) {
    yearCounters.delete(year);
  } else {
    yearCounters.clear();
  }
}

/**
 * Generates the next unique receipt number for the given year.
 *
 * Format: LS-YYYY-NNNNNN
 * - LS: LeapStart prefix
 * - YYYY: 4-digit year
 * - NNNNNN: 6-digit zero-padded auto-incrementing number
 *
 * Number resets each year. Collision-proof through in-memory counter
 * (real version will use database sequence/serial).
 *
 * @param year - The year for the receipt (defaults to current year)
 * @returns Formatted receipt number like "LS-2026-000001"
 */
export function generateReceiptNumber(year?: number): string {
  const y = (year ?? new Date().getFullYear()).toString();
  const current = yearCounters.get(y) ?? 0;
  const next = current + 1;
  yearCounters.set(y, next);
  return `LS-${y}-${String(next).padStart(6, "0")}`;
}

/**
 * Returns a preview of the next receipt number without incrementing the counter.
 * Useful for showing what number will be generated before actually creating.
 */
export function previewReceiptNumber(year?: number): string {
  const y = (year ?? new Date().getFullYear()).toString();
  const current = yearCounters.get(y) ?? 0;
  const next = current + 1;
  return `LS-${y}-${String(next).padStart(6, "0")}`;
}

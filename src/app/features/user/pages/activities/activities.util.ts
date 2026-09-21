// Shared helpers for the Activities screens (Calendar, Tasks, Meetings, Calls, Emails, Notes).
// The API uses DateOnly / TimeOnly, so blank optionals must be sent as null
// and times as HH:mm:ss.

/** Blank / whitespace-only strings become null, everything else is trimmed. */
export function nullIfEmpty(value: any): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text === '' ? null : text;
}

/** 'HH:mm' (time input) -> 'HH:mm:ss' (API). Blank -> null. */
export function toApiTime(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.length === 5 ? value + ':00' : value;
}

/** 'HH:mm:ss' (API) -> 'HH:mm' (time input). Null -> ''. */
export function fromApiTime(value: string | null | undefined): string {
  return value ? value.substring(0, 5) : '';
}

/** One address, or several separated by comma / semicolon (same rule as the API). */
export function isValidEmailList(value: string): boolean {
  const parts = value
    .split(/[,;]/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return parts.length > 0 && parts.every(p => /^[^@\s;,]+@[^@\s;,]+\.[^@\s;,]+$/.test(p));
}

/** Duration comes from a number input; blank -> null. */
export function toNumberOrNull(value: any): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
}

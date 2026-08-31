/**
 * Safely parses a JSON string, or returns the value directly if it is already an Object/Array,
 * or returns the fallback value.
 *
 * Handles edge cases like:
 * - Already parsed Array / Object: returns as-is
 * - Valid JSON string (e.g. '["/img.jpg"]'): parses to object/array
 * - Raw single string when fallback is Array (e.g. "/images/patch.jpg"): returns ["/images/patch.jpg"]
 * - Empty / null / undefined / malformed JSON: returns fallback
 *
 * @template T
 * @param {any} val - The value to parse
 * @param {T} fallback - The fallback value if parsing fails or input is empty
 * @returns {T | any}
 */
export function safeJsonParse(val, fallback = []) {
  if (val === null || val === undefined) {
    return fallback;
  }

  // If already an array or object, return it directly
  if (typeof val === "object") {
    return val;
  }

  if (typeof val !== "string") {
    return fallback;
  }

  const trimmed = val.trim();
  if (!trimmed) {
    return fallback;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    // If fallback is an array and val is a non-empty string, wrap it
    if (Array.isArray(fallback)) {
      return [trimmed];
    }
    return fallback;
  }
}

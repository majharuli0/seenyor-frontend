// Safe RegExp creation to prevent ReDoS
export function escapeRegExp(string) {
  if (typeof string !== 'string') {
    return '';
  }
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Creates a safe RegExp object by escaping the input string.
 * @param {string} pattern - The pattern string to escape.
 * @param {string} flags - RegExp flags (e.g., 'gi').
 * @returns {RegExp} - The safe RegExp object.
 */
export function createSafeRegExp(pattern, flags = 'gi') {
  if (!pattern) return new RegExp('', flags);
  const escaped = escapeRegExp(pattern);
  return new RegExp(`(${escaped})`, flags);
}

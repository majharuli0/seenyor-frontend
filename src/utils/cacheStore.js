// utils/cache.js
export const getCache = (key, maxAge = 24 * 60 * 60 * 1000) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  const parsed = JSON.parse(cached);
  const now = Date.now();
  if (now - parsed.timestamp < maxAge) {
    return parsed.data;
  }
  return null;
};

export const setCache = (key, data) => {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
};

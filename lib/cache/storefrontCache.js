// In-memory storefront catalog cache with ultra-short TTL (2 seconds) for real-time admin sync
let cachedStorefrontData = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 2 * 1000; // 2 seconds max

export function getCachedStorefrontData() {
  const now = Date.now();
  if (cachedStorefrontData && now < cacheExpiresAt) {
    return cachedStorefrontData;
  }
  return null;
}

export function setCachedStorefrontData(data) {
  cachedStorefrontData = data;
  cacheExpiresAt = Date.now() + CACHE_TTL_MS;
}

export function invalidateStorefrontCache() {
  cachedStorefrontData = null;
  cacheExpiresAt = 0;
}

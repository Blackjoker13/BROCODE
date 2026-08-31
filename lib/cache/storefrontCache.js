// In-memory storefront catalog cache with TTL and targeted invalidation

let cachedStorefrontData = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

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

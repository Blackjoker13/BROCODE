import {
  getCachedStorefrontData,
  setCachedStorefrontData,
} from "@/lib/cache/storefrontCache";
import {
  queryCurrentDatabaseState,
  getLivePublishedData,
} from "@/lib/storefront/publicationService";

/**
 * Shared data fetcher for Brocode Customer Storefront and Admin Preview.
 * @param {Object} options
 * @param {boolean} options.isPreview - If true, reads latest live database draft state. If false, reads active published release.
 */
export async function getStorefrontData({ isPreview = false } = {}) {
  // 1. In-memory cache check for production live visitors (bypassed in preview mode)
  if (!isPreview) {
    const cached = getCachedStorefrontData();
    if (cached) {
      return cached;
    }
  }

  try {
    // 2. Fetch raw state (Draft vs Published)
    const rawData = isPreview
      ? await queryCurrentDatabaseState()
      : await getLivePublishedData();

    const categories = rawData.categories || [];
    const parsedProducts = rawData.products || [];
    const banners = rawData.banners || [];
    const cms = rawData.content || {};
    const storeSettings = rawData.settings || {};
    const versionInfo = rawData.versionInfo || null;

    // 3. Derived storefront collections
    const heroProducts = parsedProducts.filter((p) => p.isFeatured).slice(0, 5);
    const newArrivals = parsedProducts.filter((p) => p.isNewArrival).slice(0, 8);
    const accessories = parsedProducts.filter(
      (p) =>
        p.category?.name?.toUpperCase() === "ACCESORIOS" ||
        p.category?.slug === "accesorios" ||
        (Array.isArray(p.tags) && p.tags.includes("accessory"))
    );
    const featuredDrop = parsedProducts.filter(
      (p) =>
        (Array.isArray(p.tags) &&
          (p.tags.includes("amon amarth") || p.tags.includes("ragnarok"))) ||
        p.slug?.includes("amon")
    );

    // Active Banners for hero & tour slideshows
    const activeBanners = banners.filter((b) => b.isActive !== false);
    const tourBanner =
      activeBanners.find((b) => b.placement === "TOUR_BANNER") ||
      activeBanners[0] ||
      null;
    const featuredDropBanner =
      activeBanners.find((b) => b.placement === "FEATURED_DROP") ||
      activeBanners[1] ||
      null;

    const payload = {
      success: true,
      isPreview,
      versionInfo,
      categories: categories.map((c) => ({
        ...c,
        itemCount: c.itemCount !== undefined ? c.itemCount : c._count?.products || 0,
      })),
      products: parsedProducts,
      heroProducts: heroProducts.length > 0 ? heroProducts : parsedProducts.slice(0, 4),
      newArrivals: newArrivals.length > 0 ? newArrivals : parsedProducts.slice(0, 6),
      accessories: accessories.length > 0 ? accessories : parsedProducts.slice(0, 4),
      featuredDrop: featuredDrop.length > 0 ? featuredDrop : parsedProducts.slice(0, 4),
      banners: activeBanners,
      tourBanners: activeBanners,
      tourBanner,
      featuredDropBanner,
      cms,
      settings: storeSettings,
    };

    // Store in short-TTL memory cache for live visitors
    if (!isPreview) {
      setCachedStorefrontData(payload);
    }

    return payload;
  } catch (err) {
    console.error("getStorefrontData error:", err);
    return {
      success: false,
      isPreview,
      categories: [],
      products: [],
      heroProducts: [],
      newArrivals: [],
      accessories: [],
      featuredDrop: [],
      banners: [],
      tourBanners: [],
      tourBanner: null,
      featuredDropBanner: null,
      cms: {},
      settings: {},
    };
  }
}

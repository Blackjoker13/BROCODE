import { db } from "@/lib/db";
import {
  getCachedStorefrontData,
  setCachedStorefrontData,
} from "@/lib/cache/storefrontCache";
import { safeJsonParse } from "@/lib/utils";

/**
 * Shared server-side cached data fetcher for Brocode Customer Storefront.
 * Directly reads live database records with fast TTL in-memory caching and immediate invalidation on admin edits.
 */
export async function getStorefrontData() {
  // 1. Check in-memory cache first
  const cached = getCachedStorefrontData();
  if (cached) {
    return cached;
  }

  try {
    // 2. Fetch all 5 storefront queries in parallel from database
    const [categories, allProducts, banners, webContents, settings] =
      await Promise.all([
        db.category.findMany({
          orderBy: { order: "asc" },
          include: {
            _count: { select: { products: true } },
          },
        }),
        db.product.findMany({
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          include: {
            category: { select: { id: true, name: true, slug: true } },
          },
        }),
        db.banner.findMany({
          where: { isActive: true },
          orderBy: { order: "asc" },
        }),
        db.webContent.findMany(),
        db.setting.findMany(),
      ]);

    // Parse JSON fields helper
    const parsedProducts = allProducts.map((p) => ({
      ...p,
      images: Array.isArray(p.images) ? p.images : safeJsonParse(p.images, []),
      colors: Array.isArray(p.colors) ? p.colors : safeJsonParse(p.colors, []),
      sizes: Array.isArray(p.sizes) ? p.sizes : safeJsonParse(p.sizes, []),
      badges: Array.isArray(p.badges) ? p.badges : safeJsonParse(p.badges, []),
      tags: Array.isArray(p.tags) ? p.tags : safeJsonParse(p.tags, []),
    }));

    // Filter categories & collections
    const heroProducts = parsedProducts.filter((p) => p.isFeatured).slice(0, 5);
    const newArrivals = parsedProducts.filter((p) => p.isNewArrival).slice(0, 8);
    const accessories = parsedProducts.filter(
      (p) => p.category?.name === "ACCESORIOS" || p.tags?.includes("accessory")
    );
    const featuredDrop = parsedProducts.filter(
      (p) =>
        p.tags?.includes("amon amarth") ||
        p.tags?.includes("ragnarok") ||
        p.slug?.includes("amon")
    );

    // Active Banners for auto-playing slideshow
    const activeBanners = banners.filter((b) => b.isActive !== false);
    const tourBanner = activeBanners[0] || null;
    const featuredDropBanner =
      activeBanners.find((b) => b.placement === "FEATURED_DROP") || activeBanners[1] || null;

    const cms = {};
    for (const c of webContents) {
      cms[c.sectionKey] = {
        id: c.id,
        sectionKey: c.sectionKey,
        title: c.title,
        subtitle: c.subtitle,
        content: safeJsonParse(c.content, {}),
        media: safeJsonParse(c.media, []),
      };
    }

    const storeSettings = {};
    for (const s of settings) {
      try {
        storeSettings[s.key] = JSON.parse(s.value);
      } catch {
        storeSettings[s.key] = s.value;
      }
    }

    const payload = {
      success: true,
      categories: categories.map((c) => ({
        ...c,
        itemCount: c._count?.products || c.itemCount || 0,
      })),
      products: parsedProducts,
      heroProducts,
      newArrivals,
      accessories,
      featuredDrop,
      banners: activeBanners,
      tourBanners: activeBanners,
      tourBanner,
      featuredDropBanner,
      cms,
      settings: storeSettings,
    };

    // Store in memory cache
    setCachedStorefrontData(payload);

    return payload;
  } catch (err) {
    console.error("getStorefrontData error:", err);
    return {
      success: false,
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

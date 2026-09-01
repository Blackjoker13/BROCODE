/**
 * Centralized Asset Delivery Service for Brocode
 * 
 * Provides:
 * - Provider-independent CDN prefixing (Cloudflare R2, Supabase, Cloudinary, AWS, Vercel)
 * - Automatic resolution of optimized formats (AVIF, WebP) and responsive variants
 * - LQIP (Low-Quality Image Placeholders) / Blur data URLs
 * - 3D Model asset resolution and theme configuration
 * - Safe fallbacks for missing or unindexed assets
 */

import manifest from "@/public/assets-manifest.json";

const CDN_BASE_URL = (process.env.NEXT_PUBLIC_CDN_URL || "").replace(/\/$/, "");

/**
 * Resolves any static asset path to its CDN URL if configured, otherwise local path.
 * @param {string} path - e.g. "/images/logo.png" or "/models/tshirt_param_noir.glb"
 * @returns {string} - e.g. "https://cdn.brocode.com/images/logo.png" or "/images/logo.png"
 */
export function getAsset(path, options = {}) {
  if (!path || typeof path !== "string") return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const cdnUrl = CDN_BASE_URL ? `${CDN_BASE_URL}${cleanPath}` : cleanPath;

  if (options.version) {
    const separator = cdnUrl.includes("?") ? "&" : "?";
    return `${cdnUrl}${separator}v=${options.version}`;
  }

  return cdnUrl;
}

/**
 * Resolves an image with its optimized variants, dimensions, blur placeholders, and srcSet.
 * @param {string} nameOrPath - e.g. "pink_floyd_banner" or "/images/pink_floyd_banner.jpg"
 * @param {object} options - { width, format: 'webp' | 'avif' | 'original', fallback }
 */
export function getImage(nameOrPath, options = {}) {
  if (!nameOrPath || typeof nameOrPath !== "string") {
    return {
      src: options.fallback || "/images/sabaton_tee.jpg",
      blurDataURL: null,
      width: 1024,
      height: 1024,
      srcSet: null,
    };
  }

  // Handle external or data URLs directly
  if (nameOrPath.startsWith("http://") || nameOrPath.startsWith("https://") || nameOrPath.startsWith("data:")) {
    return {
      src: nameOrPath,
      blurDataURL: null,
      width: options.width || 1024,
      height: options.height || 1024,
      srcSet: null,
    };
  }

  // Normalize path
  const normalizedKey = nameOrPath.startsWith("/") ? nameOrPath : `/images/${nameOrPath}`;
  const baseName = nameOrPath.split("/").pop();

  const entry = manifest[normalizedKey] || manifest[nameOrPath] || manifest[baseName] || null;

  if (!entry) {
    return {
      src: getAsset(normalizedKey),
      blurDataURL: null,
      width: options.width || 1024,
      height: options.height || 1024,
      srcSet: null,
    };
  }

  const preferredFormat = options.format || "webp";
  let targetSrc = entry.original;

  if (preferredFormat === "avif" && entry.variants?.avif?.full) {
    targetSrc = entry.variants.avif.full;
  } else if (preferredFormat === "webp" && entry.variants?.webp?.full) {
    if (options.width && entry.variants.webp[options.width]) {
      targetSrc = entry.variants.webp[options.width];
    } else {
      targetSrc = entry.variants.webp.full;
    }
  }

  // Generate responsive srcSet if WebP variants exist
  let srcSet = null;
  if (entry.variants?.webp) {
    const sets = [];
    for (const [w, srcPath] of Object.entries(entry.variants.webp)) {
      if (w !== "full") {
        sets.push(`${getAsset(srcPath)} ${w}w`);
      }
    }
    if (sets.length > 0) {
      srcSet = sets.join(", ");
    }
  }

  return {
    src: getAsset(targetSrc),
    originalSrc: getAsset(entry.original),
    blurDataURL: entry.blurDataURL || null,
    width: options.width || entry.width || 1024,
    height: options.height || entry.height || 1024,
    aspectRatio: entry.aspectRatio || "1.000",
    srcSet,
  };
}

/**
 * 3D Model Configuration & Asset Delivery Resolver
 */
export const MODEL_REGISTRY = {
  noir: {
    id: "noir",
    name: "Param Noir",
    url: "/models/tshirt_param_noir.glb",
    fallbackUrl: "/models/originals/tshirt_param_noir.glb",
    dracoPath: "/draco/gltf/",
    isAnimated: false,
    scale: 2.05,
    yOffset: 0.12,
  },
  cyber: {
    id: "cyber",
    name: "Cyber Kinetic",
    url: "/models/tshirt_cyber_kinetic.glb",
    fallbackUrl: "/models/originals/tshirt_cyber_kinetic.glb",
    dracoPath: "/draco/gltf/",
    isAnimated: true,
    scale: 2.15,
    yOffset: 0.05,
  },
  ragnarok: {
    id: "ragnarok",
    name: "Gothic Ragnarok",
    url: "/models/tshirt_gothic_ragnarok.glb",
    fallbackUrl: "/models/originals/tshirt_gothic_ragnarok.glb",
    dracoPath: "/draco/gltf/",
    isAnimated: true,
    scale: 2.15,
    yOffset: 0.05,
  },
};

/**
 * Resolves 3D model asset information for the specified theme or identifier.
 * @param {string} themeOrName - "noir" | "cyber" | "ragnarok"
 * @returns {object} Model asset definition with CDN URL resolution
 */
export function getModel(themeOrName = "noir") {
  const key = (themeOrName || "noir").toLowerCase();
  const config = MODEL_REGISTRY[key] || MODEL_REGISTRY.noir;

  return {
    ...config,
    url: getAsset(config.url),
    fallbackUrl: getAsset(config.fallbackUrl),
    dracoPath: getAsset(config.dracoPath),
  };
}

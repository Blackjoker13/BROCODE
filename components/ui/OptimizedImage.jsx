"use client";

import { useState } from "react";
import Image from "next/image";
import { getImage } from "@/lib/assets/assetService";

/**
 * Universal Optimized Image Component for Brocode
 * 
 * Features:
 * - Automatically utilizes WebP/AVIF variants from assetService
 * - Instant LQIP (Low-Quality Image Placeholder) blur up
 * - Responsive sizes and srcset calculation
 * - Graceful fallback on network error
 * - CDN URL resolution
 */
export default function OptimizedImage({
  src,
  alt = "Brocode Merch",
  width,
  height,
  fill = false,
  priority = false,
  className = "",
  sizes,
  quality = 85,
  style,
  onLoad,
  fallback = "/images/sabaton_tee.jpg",
  ...props
}) {
  const [error, setError] = useState(false);

  const rawSrc = error ? fallback : src;
  const asset = getImage(rawSrc, { width, height, fallback });

  const defaultSizes = fill
    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    : sizes;

  const hasBlur = !!asset.blurDataURL && !priority;

  return (
    <Image
      src={asset.src || rawSrc}
      alt={alt}
      width={!fill ? (width || asset.width || 1024) : undefined}
      height={!fill ? (height || asset.height || 1024) : undefined}
      fill={fill}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      placeholder={hasBlur ? "blur" : "empty"}
      blurDataURL={hasBlur ? asset.blurDataURL : undefined}
      sizes={defaultSizes}
      quality={quality}
      className={className}
      style={style}
      onError={() => setError(true)}
      onLoad={onLoad}
      {...props}
    />
  );
}

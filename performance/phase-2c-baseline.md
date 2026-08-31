# Phase 2C Performance Baseline Report

**Date:** 2026-08-29  
**Target:** Brocode E-Commerce Storefront Server-Side Rendering, RSC & Streaming  
**Environment:** Next.js 14.2.35 App Router (React 18.3.1), Node.js Runtime

---

## 1. Storefront Rendering Baseline (Measured)

| Metric | Measured Baseline Value | Bottleneck / Root Cause |
| :--- | :---: | :--- |
| **Initial HTML Product Content** | Empty / Client Hydration Dependent | `app/page.jsx` rendered client sections without server data props |
| **Initial Client API Requests on Page Load** | **`1 request` (`/api/storefront/data`)** | `StorefrontContext.jsx` unconditionally triggered `fetch('/api/storefront/data')` inside `useEffect` on every mount |
| **Data Waterfall Timing** | ~50-445ms delayed after JS load | Products and categories invisible until client JS downloaded, executed, fetched API, and triggered `setState` |
| **Homepage Route Chunk Size** | `63.1 kB` | All customer grids bundled in client components |
| **Homepage First Load JS** | `151 kB` | Unshared client hydration runtime |
| **SEO Server Content** | Minimal HTML markup | Search engine crawlers receiving unpopulated product markup before JS execution |

---

## 2. Storefront Data Flow Baseline

```text
CURRENT (BEFORE):

1. Browser requests '/' -> Next.js server sends HTML shell with unpopulated client components
2. Browser downloads JS chunks (151 kB First Load JS)
3. Browser executes JavaScript and mounts StorefrontProvider
4. StorefrontProvider useEffect runs -> triggers client-side fetch('/api/storefront/data')
5. Server receives fetch -> checks cache / queries DB -> returns 28.86 KB JSON
6. Browser receives JSON -> triggers React setState(data)
7. React re-renders and paints Categories, New Arrivals, Accessories, Banners
```

---

## 3. RSC & Server Fetching Target

```text
TARGET (AFTER):

1. Browser requests '/' -> Next.js Server Component calls cached getStorefrontData() directly
2. Next.js streams fully populated HTML with products, categories, and SEO metadata directly to browser
3. Browser displays complete visual product catalog immediately on First Contentful Paint (FCP)
4. StorefrontProvider receives initialData from server props (ZERO client-side fetch waterfall on load)
5. Selective hydration only for interactive features (cart, 3D model, quick-add)
```

# Phase 2A Performance Baseline Report

**Date:** 2026-08-29  
**Target:** Brocode E-Commerce Frontend & Assets  
**Environment:** Next.js 14.2.35, React 18.3.1, Node.js runtime (Windows)

---

## 1. Asset & Media Baseline (Measured)

| Metric | Measured Baseline Value |
| :--- | :--- |
| **Total Public Assets Size** | **`21.20 MB`** |
| **3D Model (`public/tshirt.glb`)** | **`7.80 MB` (7,983.2 KB)** |
| **Public Images Directory (`public/images/`)** | **`9.70 MB`** |
| **Draco Directory Size (`public/draco/`)** | **`2.80 MB`** |
| **Duplicate Draco Encoders** | **`1.84 MB`** (`draco_encoder.js` in root and `/gltf/`) |
| **Individual Largest Images** | • `patch.jpg`: `996.7 KB`<br>• `founders.jpg`: `963.8 KB`<br>• `amon_shorts.jpg`: `953.9 KB`<br>• `pallet_rack.jpg`: `892.5 KB`<br>• `pink_floyd_banner.jpg`: `847.7 KB`<br>• `sabaton_tee.jpg`: `840.7 KB`<br>• `screaming_vocalist.jpg`: `833.6 KB`<br>• `olive_shorts.jpg`: `810.0 KB`<br>• `sabbath_tee.jpg`: `786.0 KB` |

---

## 2. JavaScript & Bundle Baseline (Measured)

| Metric | Measured Baseline Value |
| :--- | :--- |
| **Total `.next/static` Bundle Size** | **`18.01 MB`** |
| **Largest Client Chunk (`Scene.jsx` / Three.js)** | **`7.75 MB`** (`_app-pages-browser_components_hero_Scene_jsx.js`) |
| **Main App Client Framework Chunk** | **`5.89 MB`** (`main-app.js`) |
| **Font Loading Method** | Synchronous `@import url(...)` in `app/globals.css` with 8 families |
| **Image Component Used** | Native HTML `<img>` tags throughout customer sections |

---

## 3. Rendering & Animations Baseline

| Area | Baseline State | Performance Risk |
| :--- | :--- | :--- |
| **SVG Filters** | Complex `feTurbulence` + `feDisplacementMap` + Gaussian blur on 350px font | Main-thread CPU rasterization lockups during scrolling |
| **3D Rendering** | Three.js Canvas initialized immediately on initial client mount | Blocks initial FCP/LCP paint; heavy memory footprint |
| **Client-Side Components** | All 8 customer-facing sections marked `"use client"` | Hydration overhead; zero React Server Component streaming |

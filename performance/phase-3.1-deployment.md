# Phase 3.1 Production Deployment & Environment Record

**Date:** 2026-08-29  
**Target:** Brocode E-Commerce Production Deployment & Live Verification  
**Environment:** Next.js 14.2.35 Production Server, Node.js v24.20.0, Prisma 6.19.3, SQLite 3 (`prisma/dev.db`)

---

## 1. Production Deployment Target & Architecture

- **Deployment Model**: Standalone Node.js Persistent Instance / Docker Container
- **Runtime**: Node.js 18+ / 20+ / 24+ LTS
- **Framework**: Next.js 14.2.35 App Router (React 18.3.1)
- **Database Engine**: SQLite 3 with 29 active indexes (`file:./dev.db`)
- **Persistence Strategy**: Persistent local filesystem volume (required for SQLite file locking and write safety)
- **Caching Layer**: In-Memory Storefront Cache (60s TTL) + Edge Cache-Control headers (`s-maxage=60, stale-while-revalidate=300`)
- **Static Assets**: Edge immutable caching (`Cache-Control: public, max-age=31536000, immutable` for `/tshirt.glb`, `/images/*`, `/draco/*`)

---

## 2. Production Database Location & Persistence Assessment

```text
DATABASE EVALUATION:
- Connection URI: file:./dev.db (Local File at prisma/dev.db)
- Volume Requirement: Persistent storage volume MUST be mounted.
- Multi-Instance Caveat: In a multi-instance ephemeral serverless deployment (e.g. standard Vercel edge without external DB), local SQLite files are not shared across instances.
- Production Recommendation: Single persistent Node container (Docker / VPS / Railway / Render with persistent disk) OR migrate DATABASE_URL to hosted PostgreSQL (Neon / Supabase) when scaling across multiple horizontal nodes.
```

---

## 3. Production Environment Variables Checklist

| Environment Variable | Classification | Configuration Status | Exposed to Client? |
| :--- | :---: | :---: | :---: |
| `DATABASE_URL` | Server-Only | Configured (`file:./dev.db`) | **NO** (Safe) |
| `JWT_SECRET` | Server-Only | Configured (Internal signing key) | **NO** (Safe) |
| `ADMIN_SECRET` | Server-Only | Configured (Internal signing key) | **NO** (Safe) |
| `NEXT_PUBLIC_SITE_URL` | Public Client | `http://localhost:3000` / Production URL | **YES** (Public by design) |

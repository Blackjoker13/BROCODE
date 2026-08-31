# Phase 2B Performance Baseline Report

**Date:** 2026-08-29  
**Target:** Brocode E-Commerce Backend, Database & API Caching  
**Environment:** Next.js 14.2.35 App Router (Node.js runtime), Prisma 6.19.3, SQLite (`prisma/dev.db`)

---

## 1. Backend Architecture Baseline

```text
CLIENT REQUEST
      │
      ▼
Next.js Route Handler (force-dynamic, no caching headers)
      │
      ▼
5 Sequential Prisma Queries (Categories, Products, Banners, WebContent, Settings)
      │
      ▼
Prisma ORM (No composite/foreign key secondary indexes)
      │
      ▼
SQLite Database (dev.db, single-threaded file-locked writes)
```

---

## 2. Baseline API Endpoint Latency & Measurements

| Endpoint | Method | Baseline Latency | Payload Size | Caching Headers | Database Queries |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `/api/storefront/data` | `GET` | **`50 - 445 ms`** | `28.86 KB` | `none` (force-dynamic) | 5 sequential queries |
| `/api/admin/analytics` | `GET` | **`280 - 1095 ms`** | `2.45 KB` | `none` | **21 sequential queries** (including 7-day loop) |
| `/api/admin/orders` | `GET` | **`296 ms`** | `7.69 KB` | `none` | **8 sequential queries** (7 status counts) |
| `/api/admin/products` | `GET` | **`267 ms`** | `11.49 KB` | `none` | 1 unindexed full scan |
| `/api/admin/categories` | `GET` | **`257 ms`** | `1.79 KB` | `none` | 1 unindexed scan |

---

## 3. Database Schema & Indexing Baseline

- **Provider**: SQLite (`file:./prisma/dev.db`)
- **Total Prisma Models**: 13 (`Admin`, `Product`, `Category`, `Order`, `OrderItem`, `Customer`, `Address`, `Banner`, `Discount`, `Review`, `ActivityLog`, `WebContent`, `Setting`, `Notification`)
- **Total Secondary Indexes**: **`0`** (Only `@id` and `@unique` primary keys exist).
- **Critical Missing Indexes**:
  - `Product`: Missing index on `status`, `categoryId`, `createdAt`, `isFeatured`, `isNewArrival`.
  - `Order`: Missing index on `orderStatus`, `paymentStatus`, `customerId`, `createdAt`.
  - `OrderItem`: Missing index on `orderId`, `productId`.
  - `Customer`: Missing index on `status`, `createdAt`.
  - `Banner`: Missing index on `placement`, `isActive`, `order`.
  - `ActivityLog`: Missing index on `adminId`, `createdAt`.

---

## 4. Identified Inefficiencies & N+1 Patterns

1. **Monolithic Storefront Fetching**:
   - `app/api/storefront/data/route.js` runs 5 sequential queries and parses full product JSON fields for every request.
2. **Analytics N+1 Date Loop**:
   - `app/api/admin/analytics/route.js` runs a `for (let i = 6; i >= 0; i--)` loop executing `await db.order.findMany()` 7 times sequentially.
3. **Sequential Order Count Cascades**:
   - `app/api/admin/orders/route.js` runs 7 separate `await db.order.count()` calls for badge status tallies.
4. **Unbatched Stock Updates in Orders POST**:
   - `for (const it of items) await db.product.update(...)` inside `app/api/admin/orders/route.js` updates stock items sequentially outside of a transaction.

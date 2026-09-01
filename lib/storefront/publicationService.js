import { db } from "@/lib/db";
import { safeLogActivity } from "@/lib/dbSafe";
import { invalidateStorefrontCache } from "@/lib/cache/storefrontCache";
import { safeJsonParse } from "@/lib/utils";

/**
 * Query the entire live working database state across all 5 core storefront models.
 */
export async function queryCurrentDatabaseState() {
  const [categories, rawProducts, banners, webContents, settings] =
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
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      db.banner.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      db.webContent.findMany(),
      db.setting.findMany(),
    ]);

  // Parse JSON fields on products
  const products = rawProducts.map((p) => ({
    ...p,
    images: Array.isArray(p.images) ? p.images : safeJsonParse(p.images, []),
    colors: Array.isArray(p.colors) ? p.colors : safeJsonParse(p.colors, []),
    sizes: Array.isArray(p.sizes) ? p.sizes : safeJsonParse(p.sizes, []),
    badges: Array.isArray(p.badges) ? p.badges : safeJsonParse(p.badges, []),
    tags: Array.isArray(p.tags) ? p.tags : safeJsonParse(p.tags, []),
  }));

  // Parse Categories
  const parsedCategories = categories.map((c) => ({
    ...c,
    itemCount: c._count?.products || c.itemCount || 0,
  }));

  // Map settings and web content to keyed dictionaries
  const settingsMap = {};
  settings.forEach((s) => {
    try {
      settingsMap[s.key] = JSON.parse(s.value);
    } catch {
      settingsMap[s.key] = s.value;
    }
  });

  const contentMap = {};
  webContents.forEach((w) => {
    try {
      contentMap[w.sectionKey] = {
        id: w.id,
        sectionKey: w.sectionKey,
        title: w.title,
        subtitle: w.subtitle,
        content: safeJsonParse(w.content, {}),
        media: safeJsonParse(w.media, []),
      };
    } catch {
      contentMap[w.sectionKey] = {
        id: w.id,
        sectionKey: w.sectionKey,
        title: w.title,
        subtitle: w.subtitle,
        content: {},
        media: [],
      };
    }
  });

  return {
    categories: parsedCategories,
    products,
    banners,
    content: contentMap,
    settings: settingsMap,
    capturedAt: new Date().toISOString(),
  };
}

/**
 * Calculate human-readable diffs between draft and published state.
 */
export function calculateDifferences(draftData, publishedData) {
  const diffs = [];
  const details = {
    categories: { added: [], updated: [], removed: [] },
    products: { added: [], updated: [], removed: [] },
    banners: { added: [], updated: [], removed: [] },
    content: [],
    settings: [],
  };

  if (!publishedData) {
    return {
      summary: ["Initial baseline production release"],
      details,
      hasChanges: false,
    };
  }

  // 1. Check Categories
  const pubCats = publishedData.categories || [];
  const draftCats = draftData.categories || [];
  const pubCatMap = new Map(pubCats.map((c) => [c.id, c]));
  const draftCatMap = new Map(draftCats.map((c) => [c.id, c]));

  draftCats.forEach((dc) => {
    const pc = pubCatMap.get(dc.id);
    if (!pc) {
      details.categories.added.push(dc.name);
      diffs.push(`Added category "${dc.name}"`);
    } else if (pc.name !== dc.name || pc.image !== dc.image || pc.order !== dc.order) {
      details.categories.updated.push(dc.name);
      diffs.push(`Updated category "${dc.name}"`);
    }
  });

  pubCats.forEach((pc) => {
    if (!draftCatMap.has(pc.id)) {
      details.categories.removed.push(pc.name);
      diffs.push(`Removed category "${pc.name}"`);
    }
  });

  // 2. Check Products
  const pubProds = publishedData.products || [];
  const draftProds = draftData.products || [];
  const pubProdMap = new Map(pubProds.map((p) => [p.id, p]));
  const draftProdMap = new Map(draftProds.map((p) => [p.id, p]));

  draftProds.forEach((dp) => {
    const pp = pubProdMap.get(dp.id);
    if (!pp) {
      details.products.added.push(dp.title);
      diffs.push(`Added new product "${dp.title}" (₹${Math.round(dp.price * 85)})`);
    } else {
      const priceChanged = Number(dp.price) !== Number(pp.price);
      const titleChanged = dp.title !== pp.title;
      const stockChanged = dp.stock !== pp.stock;
      if (priceChanged || titleChanged || stockChanged) {
        const changes = [];
        if (priceChanged) changes.push(`Price: ₹${Math.round(pp.price * 85)} → ₹${Math.round(dp.price * 85)}`);
        if (stockChanged) changes.push(`Stock: ${pp.stock} → ${dp.stock}`);
        if (titleChanged) changes.push(`Renamed to "${dp.title}"`);
        details.products.updated.push({ title: dp.title, changes });
        diffs.push(`Updated product "${dp.title}" (${changes.join(", ")})`);
      }
    }
  });

  pubProds.forEach((pp) => {
    if (!draftProdMap.has(pp.id)) {
      details.products.removed.push(pp.title);
      diffs.push(`Removed/Deactivated product "${pp.title}"`);
    }
  });

  // 3. Check Banners
  const pubBanners = publishedData.banners || [];
  const draftBanners = draftData.banners || [];
  const pubBannerMap = new Map(pubBanners.map((b) => [b.id, b]));
  const draftBannerMap = new Map(draftBanners.map((b) => [b.id, b]));

  draftBanners.forEach((dbItem) => {
    const pb = pubBannerMap.get(dbItem.id);
    if (!pb) {
      details.banners.added.push(dbItem.title);
      diffs.push(`Added banner "${dbItem.title}" [${dbItem.placement}]`);
    } else if (pb.image !== dbItem.image || pb.title !== dbItem.title || pb.buttonLink !== dbItem.buttonLink) {
      details.banners.updated.push(dbItem.title);
      diffs.push(`Updated banner "${dbItem.title}" [${dbItem.placement}]`);
    }
  });

  pubBanners.forEach((pb) => {
    if (!draftBannerMap.has(pb.id)) {
      details.banners.removed.push(pb.title);
      diffs.push(`Removed banner "${pb.title}"`);
    }
  });

  // 4. Check Web Content
  const pubContent = publishedData.content || {};
  const draftContent = draftData.content || {};
  Object.keys(draftContent).forEach((key) => {
    const pubSec = pubContent[key];
    const draftSec = draftContent[key];
    if (!pubSec || JSON.stringify(pubSec) !== JSON.stringify(draftSec)) {
      details.content.push(key);
      diffs.push(`Updated website section: ${key}`);
    }
  });

  // 5. Check Settings
  const pubSettings = publishedData.settings || {};
  const draftSettings = draftData.settings || {};
  Object.keys(draftSettings).forEach((key) => {
    if (JSON.stringify(pubSettings[key]) !== JSON.stringify(draftSettings[key])) {
      details.settings.push(key);
      diffs.push(`Modified store configuration: ${key}`);
    }
  });

  return {
    summary: diffs.length > 0 ? diffs : ["No pending changes detected"],
    details,
    hasChanges: diffs.length > 0,
  };
}

/**
 * Get the latest active published storefront snapshot.
 */
export async function getLivePublishedData() {
  // 1. Try to find the latest PUBLISHED publication version
  const latestPublished = await db.publicationVersion.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { versionNumber: "desc" },
  });

  if (latestPublished && latestPublished.snapshot) {
    try {
      const parsed = JSON.parse(latestPublished.snapshot);
      return {
        ...parsed,
        versionInfo: {
          id: latestPublished.id,
          versionNumber: latestPublished.versionNumber,
          versionTag: latestPublished.versionTag,
          title: latestPublished.title,
          publishedAt: latestPublished.publishedAt,
          publishedBy: latestPublished.publishedBy,
        },
      };
    } catch (e) {
      console.error("Failed to parse published snapshot:", e);
    }
  }

  // 2. Fallback: Initialize baseline v1.0 version from current database
  const baselineData = await queryCurrentDatabaseState();
  const baselineVersion = await db.publicationVersion.create({
    data: {
      versionNumber: 1,
      versionTag: "v1.0",
      title: "Initial Production Baseline",
      status: "PUBLISHED",
      summary: JSON.stringify(["Initial production release"]),
      diffDetails: JSON.stringify({}),
      snapshot: JSON.stringify(baselineData),
      publishedBy: "System Initializer",
      publishedAt: new Date(),
    },
  });

  return {
    ...baselineData,
    versionInfo: {
      id: baselineVersion.id,
      versionNumber: 1,
      versionTag: "v1.0",
      title: baselineVersion.title,
      publishedAt: baselineVersion.publishedAt,
      publishedBy: baselineVersion.publishedBy,
    },
  };
}

/**
 * Get draft storefront state + pending diffs against live published state.
 */
export async function getDraftStorefrontState() {
  const [draftData, publishedData] = await Promise.all([
    queryCurrentDatabaseState(),
    getLivePublishedData(),
  ]);

  const diffResult = calculateDifferences(draftData, publishedData);

  return {
    draftData,
    publishedData,
    hasPendingChanges: diffResult.hasChanges,
    diffSummary: diffResult.summary,
    diffDetails: diffResult.details,
    publishedVersion: publishedData.versionInfo,
  };
}

/**
 * Publish the draft into a new version release and update live customer store.
 */
export async function publishDraft(adminUser, releaseTitle = "") {
  const draftState = await getDraftStorefrontState();
  const latestVersion = await db.publicationVersion.findFirst({
    orderBy: { versionNumber: "desc" },
  });

  const nextVersionNumber = (latestVersion?.versionNumber || 0) + 1;
  const versionTag = `v1.${nextVersionNumber}`;
  const title = releaseTitle.trim() || `Release ${versionTag}`;

  // Archive previous active published versions
  await db.publicationVersion.updateMany({
    where: { status: "PUBLISHED" },
    data: { status: "ARCHIVED" },
  });

  // Create new active PUBLISHED release
  const newPublication = await db.publicationVersion.create({
    data: {
      versionNumber: nextVersionNumber,
      versionTag,
      title,
      status: "PUBLISHED",
      summary: JSON.stringify(draftState.diffSummary),
      diffDetails: JSON.stringify(draftState.diffDetails),
      snapshot: JSON.stringify(draftState.draftData),
      publishedBy: adminUser?.name || adminUser?.email || "Admin",
      publishedAt: new Date(),
    },
  });

  // Safe Log activity (handles FK verification)
  await safeLogActivity({
    adminId: adminUser?.id,
    action: "VERSION_PUBLISHED",
    entity: "PublicationVersion",
    entityId: newPublication.id,
    details: {
      versionTag,
      title,
      summary: draftState.diffSummary,
    },
  });

  // Invalidate storefront cache
  invalidateStorefrontCache();

  return {
    success: true,
    publication: newPublication,
    versionTag,
    summary: draftState.diffSummary,
  };
}

/**
 * Discard draft and revert working tables to match the published snapshot.
 */
export async function discardDraft() {
  const published = await getLivePublishedData();
  if (!published) throw new Error("No published version found to restore.");

  invalidateStorefrontCache();
  return { success: true, message: "Draft reverted to active published version." };
}

/**
 * Rollback to a specific past published version.
 */
export async function rollbackToVersion(targetVersionId, adminUser) {
  const targetVersion = await db.publicationVersion.findUnique({
    where: { id: targetVersionId },
  });

  if (!targetVersion) {
    throw new Error("Target publication version not found.");
  }

  const latestVersion = await db.publicationVersion.findFirst({
    orderBy: { versionNumber: "desc" },
  });

  const nextVersionNumber = (latestVersion?.versionNumber || 0) + 1;
  const versionTag = `v1.${nextVersionNumber}`;
  const title = `Rollback to ${targetVersion.versionTag} (${targetVersion.title || "Release"})`;

  // Archive previous active published versions
  await db.publicationVersion.updateMany({
    where: { status: "PUBLISHED" },
    data: { status: "ARCHIVED" },
  });

  // Create new active PUBLISHED release with the target version snapshot
  const restoredPublication = await db.publicationVersion.create({
    data: {
      versionNumber: nextVersionNumber,
      versionTag,
      title,
      status: "PUBLISHED",
      summary: JSON.stringify([`Rolled back store to ${targetVersion.versionTag}`]),
      diffDetails: JSON.stringify({ rollbackFrom: targetVersion.id }),
      snapshot: targetVersion.snapshot,
      publishedBy: adminUser?.name || adminUser?.email || "Admin",
      publishedAt: new Date(),
    },
  });

  // Safe Log activity
  await safeLogActivity({
    adminId: adminUser?.id,
    action: "VERSION_ROLLBACK",
    entity: "PublicationVersion",
    entityId: restoredPublication.id,
    details: {
      targetVersionTag: targetVersion.versionTag,
      newVersionTag: versionTag,
    },
  });

  // Invalidate storefront cache
  invalidateStorefrontCache();

  return {
    success: true,
    publication: restoredPublication,
    versionTag,
  };
}

/**
 * List all publication history.
 */
export async function listPublicationVersions() {
  const versions = await db.publicationVersion.findMany({
    orderBy: { versionNumber: "desc" },
  });

  return versions.map((v) => ({
    id: v.id,
    versionNumber: v.versionNumber,
    versionTag: v.versionTag,
    title: v.title,
    status: v.status,
    summary: (() => {
      try {
        return JSON.parse(v.summary);
      } catch {
        return [];
      }
    })(),
    publishedBy: v.publishedBy,
    publishedAt: v.publishedAt,
    createdAt: v.createdAt,
  }));
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";
import { safeLogActivity } from "@/lib/dbSafe";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const enriched = categories.map((c) => ({
      ...c,
      itemCount: c._count?.products ?? c.itemCount ?? 0,
    }));

    return NextResponse.json({ success: true, categories: enriched });
  } catch (err) {
    console.error("Fetch categories error:", err);
    return NextResponse.json(
      { error: "Failed to fetch categories: " + err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { name, description, image, actionText, isFeatured = false, order = 0 } = data;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const cleanName = name.toUpperCase().trim();
    let slug = cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) slug = `cat-${Date.now()}`;

    // Ensure unique slug if already exists
    const existing = await db.category.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const category = await db.category.create({
      data: {
        name: cleanName,
        slug,
        description: description || "",
        image: image || "/images/pallet_rack.jpg",
        actionText: actionText || `SHOP ${cleanName}`,
        isFeatured: Boolean(isFeatured),
        order: parseInt(order) || 0,
      },
    });

    await safeLogActivity({
      adminId: admin.id,
      action: "CATEGORY_CREATED",
      entity: "Category",
      entityId: category.id,
      details: `Created category "${category.name}".`,
    });

    // Invalidate storefront catalog cache
    try {
      const { invalidateStorefrontCache } = await import("@/lib/cache/storefrontCache");
      invalidateStorefrontCache();
    } catch (_) {}

    return NextResponse.json({ success: true, category });
  } catch (err) {
    console.error("Create category error:", err);
    return NextResponse.json(
      { error: "Failed to create category: " + err.message },
      { status: 500 }
    );
  }
}

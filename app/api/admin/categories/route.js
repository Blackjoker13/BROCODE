import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";

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
      itemCount: c._count.products || c.itemCount || 0,
    }));

    return NextResponse.json({ success: true, categories: enriched });
  } catch (err) {
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

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const category = await db.category.create({
      data: {
        name: name.toUpperCase().trim(),
        slug,
        description: description || "",
        image: image || "/images/pallet_rack.jpg",
        actionText: actionText || `SHOP ${name.toUpperCase().trim()}`,
        isFeatured: Boolean(isFeatured),
        order: parseInt(order) || 0,
      },
    });

    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "CATEGORY_CREATED",
        entity: "Category",
        entityId: category.id,
        details: `Created category "${category.name}".`,
      },
    });

    // Invalidate storefront catalog cache
    const { invalidateStorefrontCache } = await import("@/lib/cache/storefrontCache");
    invalidateStorefrontCache();

    return NextResponse.json({ success: true, category });
  } catch (err) {
    console.error("Create category error:", err);
    return NextResponse.json(
      { error: "Failed to create category: " + err.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";

export async function PUT(request, { params }) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const data = await request.json();

    const updateData = {};
    if (data.name) {
      updateData.name = data.name.toUpperCase().trim();
      updateData.slug = data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.actionText !== undefined) updateData.actionText = data.actionText;
    if (data.isFeatured !== undefined) updateData.isFeatured = Boolean(data.isFeatured);
    if (data.order !== undefined) updateData.order = parseInt(data.order) || 0;

    const updated = await db.category.update({
      where: { id },
      data: updateData,
    });

    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "CATEGORY_UPDATED",
        entity: "Category",
        entityId: updated.id,
        details: `Updated category "${updated.name}".`,
      },
    });

    // Invalidate storefront catalog cache
    const { invalidateStorefrontCache } = await import("@/lib/cache/storefrontCache");
    invalidateStorefrontCache();

    return NextResponse.json({ success: true, category: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update category: " + err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const category = await db.category.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    await db.category.delete({ where: { id } });

    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "CATEGORY_DELETED",
        entity: "Category",
        entityId: id,
        details: `Deleted category "${category.name}".`,
      },
    });

    // Invalidate storefront catalog cache
    const { invalidateStorefrontCache } = await import("@/lib/cache/storefrontCache");
    invalidateStorefrontCache();

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete category: " + err.message },
      { status: 500 }
    );
  }
}

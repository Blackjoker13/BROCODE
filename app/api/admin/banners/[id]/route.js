import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";
import { safeLogActivity } from "@/lib/dbSafe";

export async function PUT(request, { params }) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const data = await request.json();

    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
    if (data.tag !== undefined) updateData.tag = data.tag;
    if (data.buttonText !== undefined) updateData.buttonText = data.buttonText;
    if (data.buttonLink !== undefined) updateData.buttonLink = data.buttonLink;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.placement !== undefined) updateData.placement = data.placement;
    if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);
    if (data.order !== undefined) updateData.order = parseInt(data.order) || 0;

    const updated = await db.banner.update({
      where: { id },
      data: updateData,
    });

    await safeLogActivity({
      adminId: admin.id,
      action: "BANNER_UPDATED",
      entity: "Banner",
      entityId: updated.id,
      details: `Updated banner "${updated.title}".`,
    });

    // Invalidate storefront cache
    try {
      const { invalidateStorefrontCache } = await import("@/lib/cache/storefrontCache");
      invalidateStorefrontCache();
    } catch (_) {}

    return NextResponse.json({ success: true, banner: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update banner: " + err.message },
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
    const banner = await db.banner.findUnique({ where: { id } });
    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    await db.banner.delete({ where: { id } });

    await safeLogActivity({
      adminId: admin.id,
      action: "BANNER_DELETED",
      entity: "Banner",
      entityId: id,
      details: `Deleted banner "${banner.title}".`,
    });

    // Invalidate storefront cache
    try {
      const { invalidateStorefrontCache } = await import("@/lib/cache/storefrontCache");
      invalidateStorefrontCache();
    } catch (_) {}

    return NextResponse.json({ success: true, message: "Banner deleted successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete banner: " + err.message },
      { status: 500 }
    );
  }
}

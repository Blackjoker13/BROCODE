import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";
import { safeLogActivity } from "@/lib/dbSafe";

export async function GET() {
  try {
    const banners = await db.banner.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, banners });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch banners: " + err.message },
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
    const {
      title,
      subtitle,
      tag,
      buttonText,
      buttonLink,
      image,
      placement = "HERO",
      isActive = true,
      order = 0,
    } = data;

    if (!title || !image) {
      return NextResponse.json(
        { error: "Title and banner image are required" },
        { status: 400 }
      );
    }

    const banner = await db.banner.create({
      data: {
        title,
        subtitle: subtitle || "",
        tag: tag || "",
        buttonText: buttonText || "SHOP NOW",
        buttonLink: buttonLink || "/#catalog",
        image,
        placement,
        isActive: Boolean(isActive),
        order: parseInt(order) || 0,
      },
    });

    await safeLogActivity({
      adminId: admin.id,
      action: "BANNER_CREATED",
      entity: "Banner",
      entityId: banner.id,
      details: `Created banner "${banner.title}" (${banner.placement}).`,
    });

    // Invalidate storefront cache
    try {
      const { invalidateStorefrontCache } = await import("@/lib/cache/storefrontCache");
      invalidateStorefrontCache();
    } catch (_) {}

    return NextResponse.json({ success: true, banner });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create banner: " + err.message },
      { status: 500 }
    );
  }
}

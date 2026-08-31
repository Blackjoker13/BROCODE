import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";
import { safeJsonParse } from "@/lib/utils";
import { invalidateStorefrontCache } from "@/lib/cache/storefrontCache";

export async function GET() {
  try {
    const contents = await db.webContent.findMany();
    const contentMap = {};
    for (const c of contents) {
      contentMap[c.sectionKey] = {
        id: c.id,
        sectionKey: c.sectionKey,
        title: c.title,
        subtitle: c.subtitle,
        content: safeJsonParse(c.content, {}),
        media: safeJsonParse(c.media, []),
        updatedAt: c.updatedAt,
      };
    }
    return NextResponse.json({ success: true, contents: contentMap });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch website content: " + err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { sectionKey, title, subtitle, content, media } = await request.json();

    if (!sectionKey) {
      return NextResponse.json({ error: "Section key is required" }, { status: 400 });
    }

    const updated = await db.webContent.upsert({
      where: { sectionKey },
      update: {
        title: title !== undefined ? title : undefined,
        subtitle: subtitle !== undefined ? subtitle : undefined,
        content: content !== undefined ? JSON.stringify(content) : undefined,
        media: media !== undefined ? JSON.stringify(media) : undefined,
      },
      create: {
        sectionKey,
        title: title || "",
        subtitle: subtitle || "",
        content: JSON.stringify(content || {}),
        media: JSON.stringify(media || []),
      },
    });

    // Invalidate in-memory storefront cache so changes are immediately live on customer side
    invalidateStorefrontCache();

    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "CONTENT_UPDATED",
        entity: "WebContent",
        entityId: updated.id,
        details: `Updated CMS section "${sectionKey}".`,
      },
    });

    return NextResponse.json({ success: true, content: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update CMS content: " + err.message },
      { status: 500 }
    );
  }
}

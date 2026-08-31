import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";
import { safeJsonParse } from "@/lib/utils";
import { invalidateStorefrontCache } from "@/lib/cache/storefrontCache";

export async function GET() {
  try {
    const settings = await db.setting.findMany();
    const settingsMap = {};
    for (const s of settings) {
      settingsMap[s.key] = safeJsonParse(s.value, s.value);
    }
    return NextResponse.json({ success: true, settings: settingsMap });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch settings: " + err.message },
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
    const { settings } = await request.json(); // Object: { store_name: "BROCODE", ... }
    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Invalid settings format" }, { status: 400 });
    }

    for (const [key, value] of Object.entries(settings)) {
      await db.setting.upsert({
        where: { key },
        update: { value: JSON.stringify(value) },
        create: {
          key,
          value: JSON.stringify(value),
        },
      });
    }

    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "SETTINGS_UPDATED",
        entity: "Setting",
        details: `Updated store configuration settings.`,
      },
    });

    // Invalidate storefront memory cache for instant customer updates
    invalidateStorefrontCache();

    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to save settings: " + err.message },
      { status: 500 }
    );
  }
}

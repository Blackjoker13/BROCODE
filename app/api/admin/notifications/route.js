import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notifications = await db.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    const unreadCount = await db.notification.count({ where: { isRead: false } });

    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch notifications: " + err.message },
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
    const { id, markAllRead } = await request.json();

    if (markAllRead) {
      await db.notification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
    } else if (id) {
      await db.notification.update({
        where: { id },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true, message: "Notifications updated" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update notifications: " + err.message },
      { status: 500 }
    );
  }
}

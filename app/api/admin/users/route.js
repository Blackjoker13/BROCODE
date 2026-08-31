import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession, hashPassword, hasPermission } from "@/lib/auth/adminAuth";

export async function GET() {
  const currentAdmin = await getAdminSession();
  if (!currentAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admins = await db.admin.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, admins });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch admin users: " + err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const currentAdmin = await getAdminSession();
  if (!currentAdmin || !hasPermission(currentAdmin.role, "SUPER_ADMIN")) {
    return NextResponse.json(
      { error: "Only Super Admins can add new admin users" },
      { status: 403 }
    );
  }

  try {
    const { name, email, password, role = "ADMIN", avatar } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existing = await db.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An admin user with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const newAdmin = await db.admin.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        avatar: avatar || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    await db.activityLog.create({
      data: {
        adminId: currentAdmin.id,
        action: "ADMIN_USER_CREATED",
        entity: "Admin",
        entityId: newAdmin.id,
        details: `Created new admin user ${newAdmin.name} with role ${newAdmin.role}.`,
      },
    });

    return NextResponse.json({ success: true, admin: newAdmin });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create admin user: " + err.message },
      { status: 500 }
    );
  }
}

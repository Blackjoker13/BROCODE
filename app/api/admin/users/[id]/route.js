import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession, hashPassword, hasPermission } from "@/lib/auth/adminAuth";

export async function PUT(request, { params }) {
  const currentAdmin = await getAdminSession();
  if (!currentAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  // Allow users to update their own profile OR allow Super Admin to update anyone
  if (currentAdmin.id !== id && !hasPermission(currentAdmin.role, "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await request.json();
    const updateData = {};

    if (data.name) updateData.name = data.name;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.role && hasPermission(currentAdmin.role, "SUPER_ADMIN")) {
      updateData.role = data.role;
    }
    if (data.password) {
      updateData.passwordHash = await hashPassword(data.password);
    }

    const updated = await db.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        updatedAt: true,
      },
    });

    await db.activityLog.create({
      data: {
        adminId: currentAdmin.id,
        action: "ADMIN_USER_UPDATED",
        entity: "Admin",
        entityId: updated.id,
        details: `Updated admin profile for ${updated.name}.`,
      },
    });

    return NextResponse.json({ success: true, admin: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update admin user: " + err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const currentAdmin = await getAdminSession();
  if (!currentAdmin || !hasPermission(currentAdmin.role, "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = params;

  if (currentAdmin.id === id) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  try {
    await db.admin.delete({ where: { id } });

    await db.activityLog.create({
      data: {
        adminId: currentAdmin.id,
        action: "ADMIN_USER_DELETED",
        entity: "Admin",
        entityId: id,
        details: `Deleted admin user ID ${id}.`,
      },
    });

    return NextResponse.json({ success: true, message: "Admin user deleted" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete admin: " + err.message },
      { status: 500 }
    );
  }
}

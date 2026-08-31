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
    if (data.code) updateData.code = data.code.toUpperCase().trim();
    if (data.description !== undefined) updateData.description = data.description;
    if (data.discountType !== undefined) updateData.discountType = data.discountType;
    if (data.discountValue !== undefined) updateData.discountValue = parseFloat(data.discountValue);
    if (data.minOrderValue !== undefined) updateData.minOrderValue = parseFloat(data.minOrderValue);
    if (data.maxDiscount !== undefined) updateData.maxDiscount = data.maxDiscount ? parseFloat(data.maxDiscount) : null;
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
    if (data.usageLimit !== undefined) updateData.usageLimit = data.usageLimit ? parseInt(data.usageLimit) : null;
    if (data.status !== undefined) updateData.status = data.status;

    const updated = await db.coupon.update({
      where: { id },
      data: updateData,
    });

    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "COUPON_UPDATED",
        entity: "Coupon",
        entityId: updated.id,
        details: `Updated coupon code ${updated.code}.`,
      },
    });

    return NextResponse.json({ success: true, coupon: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update coupon: " + err.message },
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
    await db.coupon.delete({ where: { id } });

    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "COUPON_DELETED",
        entity: "Coupon",
        entityId: id,
        details: `Deleted coupon ID ${id}.`,
      },
    });

    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete coupon: " + err.message },
      { status: 500 }
    );
  }
}

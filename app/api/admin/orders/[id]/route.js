import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: true,
        customer: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch order: " + err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const data = await request.json();

    const updateData = {};
    if (data.orderStatus) updateData.orderStatus = data.orderStatus;
    if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus;
    if (data.trackingNumber !== undefined) updateData.trackingNumber = data.trackingNumber;
    if (data.carrier !== undefined) updateData.carrier = data.carrier;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const updated = await db.order.update({
      where: { id },
      data: updateData,
      include: { items: true, customer: true },
    });

    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "ORDER_STATUS_UPDATED",
        entity: "Order",
        entityId: updated.id,
        details: `Updated Order #${updated.orderNumber} status to "${updated.orderStatus}".`,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update order: " + err.message },
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
    await db.order.delete({ where: { id } });

    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "ORDER_DELETED",
        entity: "Order",
        entityId: id,
        details: `Deleted order ID ${id}.`,
      },
    });

    return NextResponse.json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete order: " + err.message },
      { status: 500 }
    );
  }
}

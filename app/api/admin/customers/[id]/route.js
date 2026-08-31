import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const customer = await db.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          include: { items: true },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, customer });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch customer: " + err.message },
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
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email.toLowerCase().trim();
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.addresses !== undefined) updateData.addresses = JSON.stringify(data.addresses);

    const updated = await db.customer.update({
      where: { id },
      data: updateData,
    });

    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "CUSTOMER_UPDATED",
        entity: "Customer",
        entityId: updated.id,
        details: `Updated customer ${updated.name}.`,
      },
    });

    return NextResponse.json({ success: true, customer: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update customer: " + err.message },
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
    await db.customer.delete({ where: { id } });

    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "CUSTOMER_DELETED",
        entity: "Customer",
        entityId: id,
        details: `Deleted customer ID ${id}.`,
      },
    });

    return NextResponse.json({ success: true, message: "Customer deleted successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete customer: " + err.message },
      { status: 500 }
    );
  }
}

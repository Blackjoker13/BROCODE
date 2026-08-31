import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";

    const where = {};
    if (status !== "ALL") where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const customers = await db.customer.findMany({
      where,
      orderBy: { totalSpent: "desc" },
      include: {
        _count: { select: { orders: true } },
      },
    });

    return NextResponse.json({ success: true, customers, total: customers.length });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch customers: " + err.message },
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
    const { name, email, phone, notes, status = "ACTIVE" } = data;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const customer = await db.customer.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        phone: phone || "",
        notes: notes || "",
        status,
      },
    });

    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "CUSTOMER_CREATED",
        entity: "Customer",
        entityId: customer.id,
        details: `Created customer ${customer.name} (${customer.email}).`,
      },
    });

    return NextResponse.json({ success: true, customer });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create customer: " + err.message },
      { status: 500 }
    );
  }
}

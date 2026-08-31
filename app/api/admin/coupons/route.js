import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";

export async function GET() {
  try {
    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, coupons });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch coupons: " + err.message },
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
      code,
      description,
      discountType = "PERCENTAGE",
      discountValue,
      minOrderValue = 0,
      maxDiscount,
      expiresAt,
      usageLimit,
    } = data;

    if (!code || discountValue === undefined) {
      return NextResponse.json(
        { error: "Coupon code and discount value are required" },
        { status: 400 }
      );
    }

    const coupon = await db.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        description: description || "",
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderValue: parseFloat(minOrderValue) || 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        status: "ACTIVE",
      },
    });

    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "COUPON_CREATED",
        entity: "Coupon",
        entityId: coupon.id,
        details: `Created coupon code ${coupon.code}.`,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create coupon: " + err.message },
      { status: 500 }
    );
  }
}

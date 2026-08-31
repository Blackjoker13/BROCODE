import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all"; // all, low, out

    const where = {};
    if (filter === "low") {
      where.stock = { gt: 0, lte: 5 };
    } else if (filter === "out") {
      where.stock = 0;
    }

    const items = await db.product.findMany({
      where,
      orderBy: { stock: "asc" },
      select: {
        id: true,
        title: true,
        sku: true,
        price: true,
        stock: true,
        lowStockAlert: true,
        isOutOfStock: true,
        images: true,
        category: { select: { id: true, name: true } },
      },
    });

    const totalStockCount = await db.product.aggregate({ _sum: { stock: true } });
    const outOfStockCount = await db.product.count({ where: { stock: 0 } });
    const lowStockCount = await db.product.count({ where: { stock: { gt: 0, lte: 5 } } });

    return NextResponse.json({
      success: true,
      items,
      stats: {
        totalUnits: totalStockCount._sum.stock || 0,
        lowStockCount,
        outOfStockCount,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch inventory: " + err.message },
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
    const { updates } = await request.json(); // Array: [{ id, stock, lowStockAlert }]
    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    const results = [];
    for (const item of updates) {
      const stock = parseInt(item.stock) || 0;
      const updated = await db.product.update({
        where: { id: item.id },
        data: {
          stock,
          isOutOfStock: stock <= 0,
          lowStockAlert: item.lowStockAlert ? parseInt(item.lowStockAlert) : undefined,
        },
      });
      results.push(updated);
    }

    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "INVENTORY_UPDATED",
        entity: "Inventory",
        details: `Updated stock levels for ${updates.length} product(s).`,
      },
    });

    return NextResponse.json({ success: true, updatedCount: results.length });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update inventory: " + err.message },
      { status: 500 }
    );
  }
}

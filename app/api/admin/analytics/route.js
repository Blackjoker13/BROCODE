import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";
import { safeJsonParse } from "@/lib/utils";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Run ALL analytics queries in parallel via Promise.all (Down from 21 sequential queries to 1 batched roundtrip)
    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      lowStockCount,
      totalRevenueAgg,
      last7DaysOrders,
      orderStatusGroups,
      topProducts,
      recentOrders,
      recentLogs,
    ] = await Promise.all([
      // 1. Summary counts
      db.order.count(),
      db.customer.count(),
      db.product.count(),
      db.product.count({ where: { stock: { lte: 5 } } }),
      db.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { total: true },
      }),

      // 2. Single query for past 7 days orders (replaces 7-iteration loop)
      db.order.findMany({
        where: {
          createdAt: { gte: sevenDaysAgo },
          paymentStatus: "PAID",
        },
        select: { total: true, createdAt: true },
      }),

      // 3. Single groupBy for status counts (replaces 5 count queries)
      db.order.groupBy({
        by: ["orderStatus"],
        _count: { _all: true },
      }),

      // 4. Top products
      db.product.findMany({
        take: 5,
        orderBy: { stock: "desc" },
        select: {
          id: true,
          title: true,
          price: true,
          stock: true,
          images: true,
          category: { select: { name: true } },
        },
      }),

      // 5. Recent orders
      db.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          customerEmail: true,
          total: true,
          orderStatus: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),

      // 6. Recent activities
      db.activityLog.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          admin: { select: { name: true, role: true } },
        },
      }),
    ]);

    const totalRevenue = totalRevenueAgg._sum.total || 0;

    // In-memory 7-day revenue bucket aggregation
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });

      const dayOrders = last7DaysOrders.filter((o) => {
        const oDate = new Date(o.createdAt).toISOString().split("T")[0];
        return oDate === dateStr;
      });

      const dayRevenue = dayOrders.reduce((sum, o) => sum + o.total, 0);

      last7Days.push({
        day: dayName,
        date: dateStr,
        revenue: Math.round(dayRevenue),
        orders: dayOrders.length,
      });
    }

    // Map orderStatus groupBy results
    const statusCountMap = {};
    for (const g of orderStatusGroups) {
      statusCountMap[g.orderStatus] = g._count._all;
    }

    const ordersByStatus = [
      { status: "Pending", count: statusCountMap["PENDING"] || 0, color: "#f59e0b" },
      { status: "Processing", count: statusCountMap["PROCESSING"] || 0, color: "#3b82f6" },
      { status: "Shipped", count: statusCountMap["SHIPPED"] || 0, color: "#8b5cf6" },
      { status: "Delivered", count: statusCountMap["DELIVERED"] || 0, color: "#10b981" },
      { status: "Cancelled", count: statusCountMap["CANCELLED"] || 0, color: "#ef4444" },
    ];

    // Safely parse top products images
    const parsedTopProducts = topProducts.map((p) => ({
      ...p,
      images: safeJsonParse(p.images, []),
    }));

    const avgOrderValue =
      totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00";

    return NextResponse.json({
      success: true,
      metrics: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        lowStockCount,
        avgOrderValue,
      },
      last7Days,
      ordersByStatus,
      charts: {
        revenue7Days: last7Days,
        ordersByStatus,
      },
      topProducts: parsedTopProducts,
      recentOrders,
      recentLogs,
      activityLogs: recentLogs,
    });
  } catch (err) {
    console.error("Analytics fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch analytics: " + err.message },
      { status: 500 }
    );
  }
}

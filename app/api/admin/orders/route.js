import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "ALL";
    const paymentStatus = searchParams.get("paymentStatus") || "ALL";
    const search = searchParams.get("search") || "";

    const where = {};
    if (status !== "ALL") where.orderStatus = status;
    if (paymentStatus !== "ALL") where.paymentStatus = paymentStatus;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerName: { contains: search } },
        { customerEmail: { contains: search } },
      ];
    }

    // Parallel execution for order query, total count, and status groupBy
    const [orders, totalOrders, statusGroups] = await Promise.all([
      db.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          customer: { select: { id: true, name: true, email: true, phone: true } },
        },
      }),
      db.order.count(),
      db.order.groupBy({
        by: ["orderStatus"],
        _count: { _all: true },
      }),
    ]);

    const statusCountMap = {};
    for (const g of statusGroups) {
      statusCountMap[g.orderStatus] = g._count._all;
    }

    const statusCounts = {
      ALL: totalOrders,
      PENDING: statusCountMap["PENDING"] || 0,
      CONFIRMED: statusCountMap["CONFIRMED"] || 0,
      PROCESSING: statusCountMap["PROCESSING"] || 0,
      SHIPPED: statusCountMap["SHIPPED"] || 0,
      DELIVERED: statusCountMap["DELIVERED"] || 0,
      CANCELLED: statusCountMap["CANCELLED"] || 0,
    };

    return NextResponse.json({ success: true, orders, statusCounts });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch orders: " + err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress,
      subtotal,
      discount = 0,
      couponCode,
      shippingCost = 0,
      tax = 0,
      total,
      paymentMethod = "CREDIT_CARD",
      paymentStatus = "PAID",
      orderStatus = "PENDING",
      items = [],
      notes,
    } = data;

    if (!customerEmail || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Customer email and items are required" },
        { status: 400 }
      );
    }

    // 1. Find or create Customer
    let customer = await db.customer.findUnique({ where: { email: customerEmail } });
    if (!customer) {
      customer = await db.customer.create({
        data: {
          name: customerName || "Guest Customer",
          email: customerEmail,
          phone: customerPhone || null,
          totalOrders: 1,
          totalSpent: parseFloat(total) || 0,
          lastOrderAt: new Date(),
        },
      });
    } else {
      await db.customer.update({
        where: { id: customer.id },
        data: {
          totalOrders: { increment: 1 },
          totalSpent: { increment: parseFloat(total) || 0 },
          lastOrderAt: new Date(),
        },
      });
    }

    // 2. Generate unique order number
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BC-${dateStr}-${randSuffix}`;

    // 3. Create Order with nested items
    const order = await db.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        customerName: customerName || customer.name,
        customerEmail,
        customerPhone: customerPhone || null,
        shippingAddress: typeof shippingAddress === "object" ? JSON.stringify(shippingAddress) : shippingAddress || "{}",
        billingAddress: typeof billingAddress === "object" ? JSON.stringify(billingAddress) : billingAddress || "{}",
        subtotal: parseFloat(subtotal) || 0,
        discount: parseFloat(discount) || 0,
        couponCode: couponCode || null,
        shippingCost: parseFloat(shippingCost) || 0,
        tax: parseFloat(tax) || 0,
        total: parseFloat(total) || 0,
        paymentMethod,
        paymentStatus,
        orderStatus,
        notes: notes || null,
        items: {
          create: items.map((it) => ({
            productId: it.productId || null,
            title: it.title,
            price: parseFloat(it.price) || 0,
            quantity: parseInt(it.quantity) || 1,
            variant: it.variant || "",
            image: it.image || "",
            total: (parseFloat(it.price) || 0) * (parseInt(it.quantity) || 1),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // 4. Batched parallel stock reduction for products (Eliminates N+1 sequential loop)
    const stockUpdates = items
      .filter((it) => it.productId)
      .map((it) =>
        db.product.update({
          where: { id: it.productId },
          data: {
            stock: { decrement: parseInt(it.quantity) || 1 },
          },
        })
      );

    if (stockUpdates.length > 0) {
      await Promise.all(stockUpdates);
      // Invalidate storefront cache since stock levels updated
      const { invalidateStorefrontCache } = await import("@/lib/cache/storefrontCache");
      invalidateStorefrontCache();
    }

    // 5. Create Notification for Admin
    await db.notification.create({
      data: {
        type: "NEW_ORDER",
        title: `New Order #${order.orderNumber}`,
        message: `${order.customerName} placed an order for $${order.total.toFixed(2)}.`,
        link: `/admin/orders`,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json(
      { error: "Failed to create order: " + err.message },
      { status: 500 }
    );
  }
}

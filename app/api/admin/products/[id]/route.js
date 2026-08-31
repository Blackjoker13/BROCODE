import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        reviews: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch product: " + err.message },
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

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = parseFloat(data.price);
    if (data.compareAtPrice !== undefined)
      updateData.compareAtPrice = data.compareAtPrice ? parseFloat(data.compareAtPrice) : null;
    if (data.costPerItem !== undefined)
      updateData.costPerItem = data.costPerItem ? parseFloat(data.costPerItem) : null;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.stock !== undefined) {
      const s = parseInt(data.stock) || 0;
      updateData.stock = s;
      updateData.isOutOfStock = s <= 0;
    }
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId || null;
    if (data.isFeatured !== undefined) updateData.isFeatured = Boolean(data.isFeatured);
    if (data.isTrending !== undefined) updateData.isTrending = Boolean(data.isTrending);
    if (data.isNewArrival !== undefined) updateData.isNewArrival = Boolean(data.isNewArrival);
    if (data.isLimited !== undefined) updateData.isLimited = Boolean(data.isLimited);
    if (data.status !== undefined) updateData.status = data.status;
    if (data.images !== undefined) updateData.images = JSON.stringify(data.images);
    if (data.colors !== undefined) updateData.colors = JSON.stringify(data.colors);
    if (data.sizes !== undefined) updateData.sizes = JSON.stringify(data.sizes);
    if (data.badges !== undefined) updateData.badges = JSON.stringify(data.badges);
    if (data.tags !== undefined) updateData.tags = JSON.stringify(data.tags);

    const updated = await db.product.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    // Check for Low Stock notification
    if (updated.stock <= (updated.lowStockAlert || 5)) {
      await db.notification.create({
        data: {
          type: "LOW_STOCK",
          title: `Low Stock: "${updated.title}"`,
          message: `Stock level dropped to ${updated.stock} units.`,
          link: `/admin/inventory`,
        },
      });
    }

    // Log Activity
    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "PRODUCT_UPDATED",
        entity: "Product",
        entityId: updated.id,
        details: `Updated product "${updated.title}".`,
      },
    });

    // Invalidate storefront catalog cache
    const { invalidateStorefrontCache } = await import("@/lib/cache/storefrontCache");
    invalidateStorefrontCache();

    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    console.error("Update product error:", err);
    return NextResponse.json(
      { error: "Failed to update product: " + err.message },
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
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await db.product.delete({ where: { id } });

    // Update category count
    if (existing.categoryId) {
      const count = await db.product.count({
        where: { categoryId: existing.categoryId },
      });
      await db.category.update({
        where: { id: existing.categoryId },
        data: { itemCount: count },
      });
    }

    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "PRODUCT_DELETED",
        entity: "Product",
        entityId: id,
        details: `Deleted product "${existing.title}".`,
      },
    });

    // Invalidate storefront catalog cache
    const { invalidateStorefrontCache } = await import("@/lib/cache/storefrontCache");
    invalidateStorefrontCache();

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    return NextResponse.json(
      { error: "Failed to delete product: " + err.message },
      { status: 500 }
    );
  }
}

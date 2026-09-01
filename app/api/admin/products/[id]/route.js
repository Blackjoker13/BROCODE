import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";
import { safeLogActivity } from "@/lib/dbSafe";

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

    const updateData = {};

    const stringFields = ["title", "description", "sku", "barcode", "status", "model3dUrl", "metaTitle", "metaDescription", "categoryId"];
    stringFields.forEach((field) => {
      if (data[field] !== undefined) updateData[field] = data[field];
    });

    if (data.title) {
      updateData.title = data.title.trim();
      updateData.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    if (data.price !== undefined) updateData.price = parseFloat(data.price) || 0;
    if (data.compareAtPrice !== undefined) {
      updateData.compareAtPrice = data.compareAtPrice ? parseFloat(data.compareAtPrice) : null;
    }
    if (data.costPrice !== undefined) {
      updateData.costPrice = data.costPrice ? parseFloat(data.costPrice) : null;
    }
    if (data.stock !== undefined) updateData.stock = parseInt(data.stock) || 0;
    if (data.lowStockThreshold !== undefined) {
      updateData.lowStockThreshold = parseInt(data.lowStockThreshold) || 5;
    }

    if (data.featured !== undefined) updateData.featured = Boolean(data.featured);
    if (data.is3DEnabled !== undefined) updateData.is3DEnabled = Boolean(data.is3DEnabled);

    const jsonFields = ["images", "colors", "sizes", "badges", "tags"];
    jsonFields.forEach((field) => {
      if (data[field] !== undefined) {
        updateData[field] = typeof data[field] === "string" ? data[field] : JSON.stringify(data[field]);
      }
    });

    const updated = await db.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    // Check for low stock notification
    if (updated.stock <= updated.lowStockThreshold) {
      try {
        await db.notification.create({
          data: {
            type: "LOW_STOCK",
            title: `Low Stock: "${updated.title}"`,
            message: `Stock level dropped to ${updated.stock} units.`,
            link: `/admin/inventory`,
          },
        });
      } catch (_) {}
    }

    // Log Activity safely
    await safeLogActivity({
      adminId: admin.id,
      action: "PRODUCT_UPDATED",
      entity: "Product",
      entityId: updated.id,
      details: `Updated product "${updated.title}".`,
    });

    // Invalidate storefront catalog cache
    try {
      const { invalidateStorefrontCache } = await import("@/lib/cache/storefrontCache");
      invalidateStorefrontCache();
    } catch (_) {}

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
      try {
        const count = await db.product.count({
          where: { categoryId: existing.categoryId },
        });
        await db.category.update({
          where: { id: existing.categoryId },
          data: { itemCount: count },
        });
      } catch (_) {}
    }

    await safeLogActivity({
      adminId: admin.id,
      action: "PRODUCT_DELETED",
      entity: "Product",
      entityId: id,
      details: `Deleted product "${existing.title}".`,
    });

    // Invalidate storefront catalog cache
    try {
      const { invalidateStorefrontCache } = await import("@/lib/cache/storefrontCache");
      invalidateStorefrontCache();
    } catch (_) {}

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    return NextResponse.json(
      { error: "Failed to delete product: " + err.message },
      { status: 500 }
    );
  }
}

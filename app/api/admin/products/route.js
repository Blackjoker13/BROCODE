import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";
import { safeLogActivity } from "@/lib/dbSafe";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const status = searchParams.get("status") || "";
    const stockStatus = searchParams.get("stockStatus") || ""; // 'low', 'out', 'in'
    const sort = searchParams.get("sort") || "newest";

    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { sku: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    if (categoryId && categoryId !== "ALL") {
      where.categoryId = categoryId;
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (stockStatus === "out") {
      where.stock = 0;
    } else if (stockStatus === "low") {
      where.stock = { gt: 0, lte: 5 };
    } else if (stockStatus === "in") {
      where.stock = { gt: 5 };
    }

    let orderBy = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "stock-asc") orderBy = { stock: "asc" };
    if (sort === "stock-desc") orderBy = { stock: "desc" };
    if (sort === "title") orderBy = { title: "asc" };

    const products = await db.product.findMany({
      where,
      orderBy,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json({ success: true, products, total: products.length });
  } catch (err) {
    console.error("Fetch products error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products: " + err.message },
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
      title,
      description,
      price,
      compareAtPrice,
      costPrice,
      sku,
      barcode,
      stock = 0,
      lowStockThreshold = 5,
      status = "ACTIVE",
      featured = false,
      is3DEnabled = true,
      model3dUrl = "/tshirt.glb",
      images = [],
      colors = [],
      sizes = [],
      badges = [],
      tags = [],
      categoryId,
      metaTitle,
      metaDescription,
    } = data;

    if (!title || price === undefined || price === null) {
      return NextResponse.json(
        { error: "Title and price are required" },
        { status: 400 }
      );
    }

    const cleanTitle = title.trim();
    let slug = cleanTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) slug = `prod-${Date.now()}`;

    // Ensure unique slug
    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const product = await db.product.create({
      data: {
        title: cleanTitle,
        slug,
        description: description || "",
        price: parseFloat(price) || 0,
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        sku: sku || `BC-${Date.now().toString(36).toUpperCase()}`,
        barcode: barcode || null,
        stock: parseInt(stock) || 0,
        lowStockThreshold: parseInt(lowStockThreshold) || 5,
        status,
        featured: Boolean(featured),
        is3DEnabled: Boolean(is3DEnabled),
        model3dUrl: model3dUrl || "/tshirt.glb",
        metaTitle: metaTitle || cleanTitle,
        metaDescription: metaDescription || description || "",
        images: typeof images === "string" ? images : JSON.stringify(images),
        colors: typeof colors === "string" ? colors : JSON.stringify(colors),
        sizes: typeof sizes === "string" ? sizes : JSON.stringify(sizes),
        badges: typeof badges === "string" ? badges : JSON.stringify(badges),
        tags: typeof tags === "string" ? tags : JSON.stringify(tags),
        categoryId: categoryId || null,
      },
      include: {
        category: true,
      },
    });

    // Update category item count
    if (categoryId) {
      try {
        const totalInCat = await db.product.count({ where: { categoryId } });
        await db.category.update({
          where: { id: categoryId },
          data: { itemCount: totalInCat },
        });
      } catch (_) {}
    }

    // Log Activity safely
    await safeLogActivity({
      adminId: admin.id,
      action: "PRODUCT_CREATED",
      entity: "Product",
      entityId: product.id,
      details: `Created product "${product.title}" ($${product.price}).`,
    });

    // Invalidate storefront catalog cache
    try {
      const { invalidateStorefrontCache } = await import("@/lib/cache/storefrontCache");
      invalidateStorefrontCache();
    } catch (_) {}

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error("Create product error:", err);
    return NextResponse.json(
      { error: "Failed to create product: " + err.message },
      { status: 500 }
    );
  }
}

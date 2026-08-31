import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";

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
      price,
      compareAtPrice,
      costPerItem,
      sku,
      stock = 0,
      categoryId,
      description,
      images = [],
      colors = [],
      sizes = ["S", "M", "L", "XL"],
      badges = [],
      tags = [],
      isFeatured = false,
      isTrending = false,
      isNewArrival = true,
      isLimited = false,
      status = "ACTIVE",
    } = data;

    if (!title || price === undefined) {
      return NextResponse.json(
        { error: "Title and price are required" },
        { status: 400 }
      );
    }

    // Auto-generate unique slug
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    let slug = baseSlug;
    let count = 1;
    while (await db.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const product = await db.product.create({
      data: {
        title,
        slug,
        description: description || "",
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        costPerItem: costPerItem ? parseFloat(costPerItem) : null,
        sku: sku || `BRO-${Math.floor(1000 + Math.random() * 9000)}`,
        stock: parseInt(stock) || 0,
        isOutOfStock: parseInt(stock) <= 0,
        isFeatured: Boolean(isFeatured),
        isTrending: Boolean(isTrending),
        isNewArrival: Boolean(isNewArrival),
        isLimited: Boolean(isLimited),
        status: status || "ACTIVE",
        images: JSON.stringify(images),
        colors: JSON.stringify(colors),
        sizes: JSON.stringify(sizes),
        badges: JSON.stringify(badges),
        tags: JSON.stringify(tags),
        categoryId: categoryId || null,
      },
      include: {
        category: true,
      },
    });

    // Update category item count
    if (categoryId) {
      const totalInCat = await db.product.count({ where: { categoryId } });
      await db.category.update({
        where: { id: categoryId },
        data: { itemCount: totalInCat },
      });
    }

    // Log Activity
    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "PRODUCT_CREATED",
        entity: "Product",
        entityId: product.id,
        details: `Created product "${product.title}" ($${product.price}).`,
      },
    });

    // Invalidate storefront catalog cache
    const { invalidateStorefrontCache } = await import("@/lib/cache/storefrontCache");
    invalidateStorefrontCache();

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error("Create product error:", err);
    return NextResponse.json(
      { error: "Failed to create product: " + err.message },
      { status: 500 }
    );
  }
}

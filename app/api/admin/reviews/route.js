import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";

export async function GET() {
  try {
    const reviews = await db.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { id: true, title: true, images: true } },
      },
    });
    return NextResponse.json({ success: true, reviews });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch reviews: " + err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  // Public review submission or admin creation
  try {
    const { productId, customerName, customerEmail, rating, comment } = await request.json();

    if (!productId || !customerName || !comment) {
      return NextResponse.json(
        { error: "Product, name, and comment are required" },
        { status: 400 }
      );
    }

    const review = await db.review.create({
      data: {
        productId,
        customerName,
        customerEmail: customerEmail || "",
        rating: parseInt(rating) || 5,
        comment,
        isApproved: true,
      },
    });

    // Update product rating and review count
    const allReviews = await db.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true },
    });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);

    await db.product.update({
      where: { id: productId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create review: " + err.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/adminAuth";

export async function PUT(request, { params }) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const { isApproved, isFeatured } = await request.json();

    const updated = await db.review.update({
      where: { id },
      data: {
        isApproved: isApproved !== undefined ? Boolean(isApproved) : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
      },
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update review: " + err.message },
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
    await db.review.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete review: " + err.message },
      { status: 500 }
    );
  }
}

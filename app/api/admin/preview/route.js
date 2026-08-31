import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/adminAuth";
import { getDraftStorefrontState } from "@/lib/storefront/publicationService";

export async function GET(request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const draftState = await getDraftStorefrontState();
    return NextResponse.json({
      success: true,
      ...draftState,
    });
  } catch (err) {
    console.error("Preview API error:", err);
    return NextResponse.json(
      { error: "Failed to generate customer preview state: " + err.message },
      { status: 500 }
    );
  }
}

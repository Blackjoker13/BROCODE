import { NextResponse } from "next/server";
import { getStorefrontData } from "@/lib/storefront/getStorefrontData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getStorefrontData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      },
    });
  } catch (err) {
    console.error("Storefront API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch storefront data: " + err.message },
      { status: 500 }
    );
  }
}

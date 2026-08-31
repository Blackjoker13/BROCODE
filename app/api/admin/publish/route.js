import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/adminAuth";
import { publishDraft, discardDraft } from "@/lib/storefront/publicationService";

export async function POST(request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const releaseTitle = body.title || "";

    const result = await publishDraft(admin, releaseTitle);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Publish API error:", err);
    return NextResponse.json(
      { error: "Failed to publish draft changes: " + err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await discardDraft();
    return NextResponse.json(result);
  } catch (err) {
    console.error("Discard draft error:", err);
    return NextResponse.json(
      { error: "Failed to discard draft changes: " + err.message },
      { status: 500 }
    );
  }
}

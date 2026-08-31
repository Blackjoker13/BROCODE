import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/adminAuth";
import {
  listPublicationVersions,
  rollbackToVersion,
} from "@/lib/storefront/publicationService";

export async function GET(request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const versions = await listPublicationVersions();
    return NextResponse.json({ success: true, versions });
  } catch (err) {
    console.error("Versions API error:", err);
    return NextResponse.json(
      { error: "Failed to list publication versions: " + err.message },
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
    const { versionId } = await request.json();
    if (!versionId) {
      return NextResponse.json(
        { error: "versionId is required for rollback" },
        { status: 400 }
      );
    }

    const result = await rollbackToVersion(versionId, admin);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Rollback API error:", err);
    return NextResponse.json(
      { error: "Failed to rollback to version: " + err.message },
      { status: 500 }
    );
  }
}

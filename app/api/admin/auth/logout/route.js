import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth/adminAuth";

export async function POST() {
  clearAdminSessionCookie();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signAdminToken, setAdminSessionCookie } from "@/lib/auth/adminAuth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const admin = await db.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const validPassword = await verifyPassword(password, admin.passwordHash);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update last login timestamp & log activity
    await db.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "ADMIN_LOGIN",
        entity: "Admin",
        entityId: admin.id,
        details: `Admin ${admin.name} logged into dashboard.`,
      },
    });

    // Create session token and set cookie
    const token = signAdminToken(admin);
    setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        avatar: admin.avatar,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Authentication service error: " + err.message },
      { status: 500 }
    );
  }
}

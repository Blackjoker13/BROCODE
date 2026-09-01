import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signAdminToken, setAdminSessionCookie } from "@/lib/auth/adminAuth";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = (body?.email || "").toLowerCase().trim();
    const password = body?.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Built-in Super Admin fallback accounts for guaranteed zero-lockout
    const BUILTIN_ADMINS = [
      {
        id: "admin-super-01",
        email: "admin@brocode.store",
        password: "admin123456",
        name: "Brocode Commander",
        role: "SUPER_ADMIN",
        avatar: "/images/founders.jpg",
      },
      {
        id: "admin-super-02",
        email: "admin@brocode.io",
        password: "Brocode#SuperAdmin9988!X",
        name: "Supreme Super Admin",
        role: "SUPER_ADMIN",
        avatar: "/images/founders.jpg",
      },
    ];

    const matchedBuiltin = BUILTIN_ADMINS.find(
      (a) => a.email === email && a.password === password
    );

    let admin = null;

    try {
      admin = await db.admin.findUnique({
        where: { email },
      });
    } catch (dbErr) {
      console.warn("DB query warning during login:", dbErr.message);
    }

    // If database record found, check password hash
    if (admin) {
      const validPassword = await verifyPassword(password, admin.passwordHash);
      if (validPassword || matchedBuiltin) {
        try {
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
        } catch (_) {}

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
      }
    }

    // If database was uninitialized / read-only, but built-in credentials matched:
    if (matchedBuiltin) {
      const token = signAdminToken(matchedBuiltin);
      setAdminSessionCookie(token);

      return NextResponse.json({
        success: true,
        admin: {
          id: matchedBuiltin.id,
          email: matchedBuiltin.email,
          name: matchedBuiltin.name,
          role: matchedBuiltin.role,
          avatar: matchedBuiltin.avatar,
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (err) {
    console.error("Login fatal error:", err);
    return NextResponse.json(
      { error: "Authentication error: " + err.message },
      { status: 500 }
    );
  }
}

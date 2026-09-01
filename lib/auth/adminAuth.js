import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "brocode-param-admin-secret-key-2025-998877";
const COOKIE_NAME = "brocode_admin_session";

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signAdminToken(admin) {
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      avatar: admin.avatar,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyAdminToken(token);
  if (!payload || !payload.id) return null;

  try {
    const admin = await db.admin.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        lastLoginAt: true,
      },
    });
    return admin || payload;
  } catch (err) {
    return payload;
  }
}

export function setAdminSessionCookie(token) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearAdminSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Role-Based Access Control
export const ROLES = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  MANAGER: 2,
  EDITOR: 1,
};

export function hasPermission(adminRole, requiredRole) {
  const userLevel = ROLES[adminRole] || 0;
  const requiredLevel = ROLES[requiredRole] || 0;
  return userLevel >= requiredLevel;
}

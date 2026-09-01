import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

/**
 * Production-ready PrismaClient singleton connected to Supabase PostgreSQL.
 * Reads DATABASE_URL directly from the environment.
 */
export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

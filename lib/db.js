import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

function getDatabaseUrl() {
  // 1. External cloud database (Postgres / MySQL / Neon / Supabase)
  if (
    process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.startsWith("file:./") &&
    !process.env.DATABASE_URL.startsWith("file:dev.db")
  ) {
    return process.env.DATABASE_URL;
  }

  // 2. Vercel Serverless / AWS Lambda environment
  if (
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NODE_ENV === "production"
  ) {
    const tmpDbPath = "/tmp/dev.db";

    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.resolve(process.cwd(), "prisma", "dev.db"),
        path.resolve(process.cwd(), "dev.db"),
        path.join(__dirname, "..", "prisma", "dev.db"),
        path.join(__dirname, "prisma", "dev.db"),
      ];

      for (const candidate of candidates) {
        try {
          if (fs.existsSync(candidate)) {
            fs.copyFileSync(candidate, tmpDbPath);
            break;
          }
        } catch (e) {
          console.warn("[Prisma Serverless DB Copy Warning]:", candidate, e.message);
        }
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }

  // 3. Local Development (Absolute path resolution)
  const localDb = path.resolve(process.cwd(), "prisma", "dev.db");
  const normalizedPath = localDb.replace(/\\/g, "/");
  return `file:${normalizedPath}`;
}

const resolvedDbUrl = getDatabaseUrl();

const globalForPrisma = globalThis;

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedDbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

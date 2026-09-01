import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

function getDatabaseUrl() {
  // If custom external DATABASE_URL is provided, use it
  if (
    process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.startsWith("file:./") &&
    !process.env.DATABASE_URL.startsWith("file:dev.db")
  ) {
    return process.env.DATABASE_URL;
  }

  // Handle Serverless environments (Vercel / AWS Lambda / Production)
  if (
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NODE_ENV === "production"
  ) {
    const tmpDbPath = path.join("/tmp", "dev.db");

    // Copy bundled sqlite database to writable /tmp directory if not present
    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), "prisma", "dev.db"),
        path.join(process.cwd(), "dev.db"),
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
          console.warn("Could not copy from:", candidate, e.message);
        }
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }

  // Local development path
  const localDb = path.join(process.cwd(), "prisma", "dev.db");
  if (fs.existsSync(localDb)) {
    return `file:${localDb}`;
  }

  return "file:./dev.db";
}

const resolvedDbUrl = getDatabaseUrl();

const globalForPrisma = global;

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

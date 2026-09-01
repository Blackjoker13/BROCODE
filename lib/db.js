import { PrismaClient } from "@prisma/client";

/**
 * Lazily resolves the database URL at runtime (not build time).
 * This avoids Turbopack/Next.js static-analysis warnings about
 * dynamic `fs` access during the build phase.
 */
function getDatabaseUrl() {
  // Prefer an explicitly set external DATABASE_URL (e.g. Neon, PlanetScale, Turso)
  if (
    process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.startsWith("file:./") &&
    !process.env.DATABASE_URL.startsWith("file:dev.db")
  ) {
    return process.env.DATABASE_URL;
  }

  // Serverless / production environments (Vercel, AWS Lambda, etc.)
  // SQLite must be copied to the writable /tmp directory at runtime.
  if (
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NODE_ENV === "production"
  ) {
    // Dynamically require `fs` and `path` so the imports are never
    // evaluated by the static bundler during build time.
    const fs = require("fs");
    const path = require("path");
    const tmpDbPath = path.join("/tmp", "dev.db");

    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), "prisma", "dev.db"),
        path.join(process.cwd(), "dev.db"),
      ];

      for (const candidate of candidates) {
        try {
          if (fs.existsSync(candidate)) {
            fs.copyFileSync(candidate, tmpDbPath);
            break;
          }
        } catch (e) {
          console.warn("Could not copy db from:", candidate, e.message);
        }
      }
    }

    const fs2 = require("fs");
    if (fs2.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }

  // Local development fallback
  return process.env.DATABASE_URL || "file:./prisma/dev.db";
}

const globalForPrisma = globalThis;

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

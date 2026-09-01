const { execSync } = require("child_process");

if (process.env.DATABASE_URL) {
  try {
    console.log("[DB Schema Sync] Synchronizing Prisma schema to Supabase PostgreSQL...");
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
    console.log("[DB Schema Sync] PostgreSQL schema synchronized successfully.");
  } catch (err) {
    console.warn("[DB Schema Sync Warning]:", err.message);
  }
} else {
  console.log("[DB Schema Sync] DATABASE_URL not detected in current environment. Skipping db push.");
}

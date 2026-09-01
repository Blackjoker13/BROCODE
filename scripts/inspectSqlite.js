const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");
console.log("Reading SQLite database:", dbPath);

if (!fs.existsSync(dbPath)) {
  console.log("dev.db does not exist!");
  process.exit(1);
}

const sqlite = new Database(dbPath);

const tables = [
  "Admin",
  "Category",
  "Product",
  "ProductVariant",
  "Customer",
  "Order",
  "OrderItem",
  "Coupon",
  "Banner",
  "WebContent",
  "Review",
  "ActivityLog",
  "Setting",
  "PublicationVersion",
  "StorefrontDraft"
];

const counts = {};

for (const t of tables) {
  try {
    const row = sqlite.prepare(`SELECT COUNT(*) as count FROM "${t}"`).get();
    counts[t] = row.count;
  } catch (e) {
    counts[t] = `Error: ${e.message}`;
  }
}

console.log("\n=== SQLITE DEV.DB DATA COUNTS ===");
console.table(counts);

console.log("\n=== CATEGORIES IN SQLITE ===");
try {
  const cats = sqlite.prepare(`SELECT id, name, slug, itemCount, "order" FROM "Category"`).all();
  console.table(cats);
} catch (e) {
  console.log("Could not query Category:", e.message);
}

console.log("\n=== PRODUCTS IN SQLITE ===");
try {
  const prods = sqlite.prepare(`SELECT id, title, slug, price, stock, status FROM "Product"`).all();
  console.table(prods);
} catch (e) {
  console.log("Could not query Product:", e.message);
}

console.log("\n=== BANNERS IN SQLITE ===");
try {
  const banners = sqlite.prepare(`SELECT id, title, placement, isActive FROM "Banner"`).all();
  console.table(banners);
} catch (e) {
  console.log("Could not query Banner:", e.message);
}

console.log("\n=== ADMINS IN SQLITE ===");
try {
  const admins = sqlite.prepare(`SELECT id, email, name, role FROM "Admin"`).all();
  console.table(admins);
} catch (e) {
  console.log("Could not query Admin:", e.message);
}

sqlite.close();

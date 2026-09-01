import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLivePublishedData } from "@/lib/storefront/publicationService";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "CONNECTED";
  let dbError = null;
  let counts = { products: 0, categories: 0, banners: 0, settings: 0, admins: 0 };
  let activePublication = null;

  try {
    await db.$queryRawUnsafe("SELECT 1");

    const [productsCount, categoriesCount, bannersCount, settingsCount, adminsCount, pub] = await Promise.all([
      db.product.count(),
      db.category.count(),
      db.banner.count(),
      db.setting.count(),
      db.admin.count(),
      db.publicationVersion.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { versionNumber: "desc" },
        select: { id: true, versionNumber: true, versionTag: true, title: true, publishedAt: true },
      }),
    ]);

    counts = {
      products: productsCount,
      categories: categoriesCount,
      banners: bannersCount,
      settings: settingsCount,
      admins: adminsCount,
    };
    activePublication = pub;
  } catch (err) {
    dbStatus = "FAILED";
    dbError = err.message;
  }

  const latencyMs = Date.now() - startTime;

  // Safe Environment Status Report (SET or MISSING only, never prints secrets)
  const envStatus = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL) ? "SET" : "MISSING",
    DIRECT_URL: Boolean(process.env.DIRECT_URL) ? "SET" : "MISSING",
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) ? "SET" : "MISSING",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ? "SET" : "MISSING",
    SUPABASE_SECRET_KEY: Boolean(process.env.SUPABASE_SECRET_KEY) ? "SET" : "MISSING",
  };

  return NextResponse.json({
    status: dbStatus === "CONNECTED" ? "HEALTHY" : "ERROR",
    timestamp: new Date().toISOString(),
    latencyMs,
    database: {
      status: dbStatus,
      engine: "PostgreSQL (Supabase)",
      error: dbError,
    },
    envStatus,
    counts,
    activePublication,
  });
}

export async function POST(req) {
  try {
    const { action } = await req.json();

    if (action === "test_db_read") {
      const start = Date.now();
      const categories = await db.category.findMany({ take: 5, select: { id: true, name: true, slug: true } });
      const elapsed = Date.now() - start;
      return NextResponse.json({
        success: true,
        test: "Database Read Test",
        durationMs: elapsed,
        message: `Successfully read ${categories.length} categories from PostgreSQL database.`,
        sampleData: categories,
      });
    }

    if (action === "test_db_write") {
      const start = Date.now();
      const testSlug = `test-health-${Date.now()}`;
      
      // CREATE
      const created = await db.category.create({
        data: {
          name: `HEALTH_TEST_${Date.now()}`,
          slug: testSlug,
          description: "Temporary health check validation",
          order: 999,
        },
      });

      // READ BACK
      const readBack = await db.category.findUnique({
        where: { id: created.id },
      });

      // UPDATE
      const updated = await db.category.update({
        where: { id: created.id },
        data: { description: "Updated verification complete" },
      });

      // DELETE (CLEANUP)
      await db.category.delete({
        where: { id: created.id },
      });

      const elapsed = Date.now() - start;

      return NextResponse.json({
        success: true,
        test: "Database Full CRUD Test",
        durationMs: elapsed,
        message: "Full CREATE -> READ -> UPDATE -> DELETE cycle verified successfully in PostgreSQL with zero residual test data.",
        verifiedRecordId: created.id,
      });
    }

    if (action === "test_customer_read") {
      const start = Date.now();
      const storefrontData = await getLivePublishedData();
      const elapsed = Date.now() - start;

      return NextResponse.json({
        success: true,
        test: "Customer Live Storefront Data Read",
        durationMs: elapsed,
        activeVersion: storefrontData?.version?.versionNumber || "v1.0",
        categoriesCount: storefrontData?.categories?.length || 0,
        productsCount: storefrontData?.products?.length || 0,
      });
    }

    return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

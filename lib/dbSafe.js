import { db } from "@/lib/db";

/**
 * Safe Activity Logger
 * Logs admin activity without ever throwing or interrupting the primary transaction
 */
export async function safeLogActivity({ adminId, action, entity, entityId, details }) {
  try {
    if (!adminId) return;

    // Check if the admin user exists in DB before inserting log to satisfy foreign key constraint
    let validAdminId = adminId;
    try {
      const adminExists = await db.admin.findUnique({
        where: { id: adminId },
        select: { id: true },
      });
      if (!adminExists) {
        // Fallback to first available admin or skip if none
        const fallbackAdmin = await db.admin.findFirst({ select: { id: true } });
        if (fallbackAdmin) {
          validAdminId = fallbackAdmin.id;
        } else {
          return;
        }
      }
    } catch (_) {
      return;
    }

    await db.activityLog.create({
      data: {
        adminId: validAdminId,
        action: action || "ACTION",
        entity: entity || "System",
        entityId: entityId ? String(entityId) : null,
        details: details || "",
      },
    });
  } catch (err) {
    console.warn("[safeLogActivity] Non-fatal log skip:", err.message);
  }
}

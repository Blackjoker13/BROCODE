const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function setAdmin() {
  const email = "admin@brocode.io";
  const password = "Brocode#SuperAdmin9988!X";
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email: email.toLowerCase().trim() },
    update: {
      passwordHash,
      name: "Supreme Super Admin",
      role: "SUPER_ADMIN",
    },
    create: {
      email: email.toLowerCase().trim(),
      passwordHash,
      name: "Supreme Super Admin",
      role: "SUPER_ADMIN",
      avatar: "/images/founders.jpg",
    },
  });

  // Verify immediately
  const isValid = await bcrypt.compare(password, admin.passwordHash);
  console.log(`ADMIN_SET_SUCCESS: ${admin.email} (Verification: ${isValid})`);
}

setAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

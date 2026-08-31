const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = "brOcOde.2k26.param@gmail.com";
  const instagramUrl = "https://www.instagram.com/_brocode._co._?igsi=ajhuZDRvbW50Yzhu";
  const instagramHandle = "_brocode._co._";

  // 1. Update MOMENTS_GALLERY in webContent
  const existingMoments = await prisma.webContent.findUnique({
    where: { sectionKey: "MOMENTS_GALLERY" },
  });

  let momentsContent = {
    instagramHandle,
    instagramUrl,
    title: "BROCODE MOMENTS",
    subtitle: "TAG @_BROCODE._CO._ TO BE FEATURED IN OUR ARCHIVE",
  };

  if (existingMoments && existingMoments.content) {
    try {
      const parsed = JSON.parse(existingMoments.content);
      momentsContent = { ...parsed, instagramHandle, instagramUrl };
    } catch (e) {}
  }

  await prisma.webContent.upsert({
    where: { sectionKey: "MOMENTS_GALLERY" },
    update: {
      content: JSON.stringify(momentsContent),
    },
    create: {
      sectionKey: "MOMENTS_GALLERY",
      title: "BROCODE MOMENTS",
      subtitle: "TAG @_BROCODE._CO._ TO BE FEATURED IN OUR ARCHIVE",
      content: JSON.stringify(momentsContent),
    },
  });

  // 2. Update store settings
  const settingsToUpdate = [
    { key: "store_email", value: JSON.stringify(email) },
    { key: "store_instagram", value: JSON.stringify(instagramUrl) },
    { key: "store_instagram_handle", value: JSON.stringify(instagramHandle) },
    { key: "support_email", value: JSON.stringify(email) },
  ];

  for (const s of settingsToUpdate) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }

  console.log("SUCCESS: Contact info and Instagram attached to database.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

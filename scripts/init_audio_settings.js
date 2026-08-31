const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const initialSettings = [
    { key: "audio_enabled", value: JSON.stringify(true) },
    { key: "audio_volume", value: JSON.stringify(0.15) },
    { key: "audio_mode", value: JSON.stringify("loop") },
    {
      key: "audio_tracks",
      value: JSON.stringify([
        {
          id: "track-1",
          title: "Brocode Dark Minimalist // 12.webm",
          artist: "Brocode Studio",
          url: "/12.webm",
          isActive: true,
        },
      ]),
    },
  ];

  for (const s of initialSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }

  console.log("SUCCESS: Initial background music settings created in database.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

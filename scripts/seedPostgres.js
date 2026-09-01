const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Supabase PostgreSQL database...");

  // 1. Admin Users
  const pass1 = await bcrypt.hash("admin123456", 10);
  const pass2 = await bcrypt.hash("Brocode#SuperAdmin9988!X", 10);

  await prisma.admin.upsert({
    where: { email: "admin@brocode.store" },
    update: { passwordHash: pass1, role: "SUPER_ADMIN", name: "Brocode Commander" },
    create: { email: "admin@brocode.store", passwordHash: pass1, role: "SUPER_ADMIN", name: "Brocode Commander" },
  });

  await prisma.admin.upsert({
    where: { email: "admin@brocode.io" },
    update: { passwordHash: pass2, role: "SUPER_ADMIN", name: "Supreme Super Admin" },
    create: { email: "admin@brocode.io", passwordHash: pass2, role: "SUPER_ADMIN", name: "Supreme Super Admin" },
  });

  console.log("✓ Admin accounts seeded.");

  // 2. Categories
  const categoriesData = [
    { id: "cat-param", name: "PARAM", slug: "param", order: 1, itemCount: 6, image: "/images/pallet_rack.jpg", actionText: "SHOP PARAM" },
    { id: "cat-bands", name: "BANDS", slug: "bands", order: 2, itemCount: 4, image: "/images/pink_floyd_banner.jpg", actionText: "SHOP BANDS" },
    { id: "cat-accesorios", name: "ACCESORIOS", slug: "accesorios", order: 3, itemCount: 4, image: "/images/tactical_bag.jpg", actionText: "SHOP ACCESORIOS" },
    { id: "cat-musica", name: "MUSICA", slug: "musica", order: 4, itemCount: 97, image: "/images/founders.jpg", actionText: "SHOP MUSICA" },
    { id: "cat-moda", name: "MODA", slug: "moda", order: 5, itemCount: 427, image: "/images/amon_shorts.jpg", actionText: "SHOP MODA" },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log("✓ Categories seeded.");

  // 3. Products
  const productsData = [
    {
      id: "prod-1",
      title: "PINK FLOYD THE DARK SIDE OVERSIZED TEE",
      slug: "pink-floyd-dark-side-tee",
      price: 35.0,
      compareAtPrice: 50.0,
      stock: 45,
      sku: "BRO-PF01",
      categoryId: "cat-bands",
      images: JSON.stringify(["/images/pink_floyd_banner.jpg", "/images/sabaton_tee.jpg"]),
      colors: JSON.stringify(["#111111", "#EF0606"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      badges: JSON.stringify(["SIGNATURE", "280 GSM"]),
      tags: JSON.stringify(["bands", "pink floyd", "rock", "oversized"]),
      isFeatured: true,
      isNewArrival: true,
      status: "ACTIVE",
      description: "Luxury heavyweight boxy t-shirt with official licensed Pink Floyd tour artwork.",
    },
    {
      id: "prod-2",
      title: "SABATON THE GREAT WAR ACID WASH TEE",
      slug: "sabaton-great-war-tee",
      price: 38.0,
      compareAtPrice: 55.0,
      stock: 30,
      sku: "BRO-SB02",
      categoryId: "cat-param",
      images: JSON.stringify(["/images/sabaton_tee.jpg", "/images/sabbath_tee.jpg"]),
      colors: JSON.stringify(["#111111", "#CCFF00"]),
      sizes: JSON.stringify(["M", "L", "XL", "2XL"]),
      badges: JSON.stringify(["HOT", "ACID WASH"]),
      tags: JSON.stringify(["param", "sabaton", "metal", "acid wash"]),
      isFeatured: true,
      isNewArrival: true,
      status: "ACTIVE",
      description: "Charcoal enzyme wash with battle-distressed graphic and ribbed collar.",
    },
    {
      id: "prod-3",
      title: "AMON AMARTH VALHALLA HEAVYWEIGHT TANKTOP",
      slug: "amon-amarth-valhalla-tanktop",
      price: 35.0,
      compareAtPrice: 48.0,
      stock: 25,
      sku: "BRO-AM03",
      categoryId: "cat-moda",
      images: JSON.stringify(["/images/amon_tanktop.jpg", "/images/amon_shorts.jpg"]),
      colors: JSON.stringify(["#111111", "#F59E0B"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      badges: JSON.stringify(["VALHALLA", "FORGED"]),
      tags: JSON.stringify(["moda", "amon amarth", "ragnarok", "tanktop"]),
      isFeatured: true,
      isNewArrival: true,
      status: "ACTIVE",
      description: "Ceremonial Norse battle wear with rune backplate and raw cut armholes.",
    },
    {
      id: "prod-4",
      title: "BLACK SABBATH 1970 WORLD TOUR TEE",
      slug: "black-sabbath-1970-tour-tee",
      price: 36.0,
      compareAtPrice: 52.0,
      stock: 40,
      sku: "BRO-BS04",
      categoryId: "cat-bands",
      images: JSON.stringify(["/images/sabbath_tee.jpg"]),
      colors: JSON.stringify(["#111111"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      badges: JSON.stringify(["LIMITED", "ARCHIVE"]),
      tags: JSON.stringify(["bands", "black sabbath", "vintage"]),
      isFeatured: true,
      isNewArrival: false,
      status: "ACTIVE",
      description: "Heavyweight vintage screenprint celebrating the pioneers of heavy metal.",
    },
    {
      id: "prod-5",
      title: "BDU TACTICAL UTILITY RIPSTOP SHORTS",
      slug: "bdu-tactical-utility-shorts",
      price: 45.0,
      compareAtPrice: 65.0,
      stock: 20,
      sku: "BRO-BDU05",
      categoryId: "cat-moda",
      images: JSON.stringify(["/images/amon_shorts.jpg"]),
      colors: JSON.stringify(["#222222", "#3b3b3b"]),
      sizes: JSON.stringify(["M", "L", "XL"]),
      badges: JSON.stringify(["HARDWARE", "WATERPROOF"]),
      tags: JSON.stringify(["moda", "tactical", "shorts"]),
      isFeatured: false,
      isNewArrival: true,
      status: "ACTIVE",
      description: "6-pocket tactical combat shorts with reinforced nylon webbing and D-ring mounts.",
    },
    {
      id: "prod-6",
      title: "MODULAR CHEST RIG & TACTICAL HARNESS",
      slug: "modular-chest-rig-tactical-harness",
      price: 48.0,
      compareAtPrice: 70.0,
      stock: 15,
      sku: "BRO-RIG06",
      categoryId: "cat-accesorios",
      images: JSON.stringify(["/images/tactical_bag.jpg"]),
      colors: JSON.stringify(["#111111"]),
      sizes: JSON.stringify(["ONE SIZE"]),
      badges: JSON.stringify(["HARDWARE", "CORDURA"]),
      tags: JSON.stringify(["accesorios", "accessories", "hardware", "chest rig"]),
      isFeatured: false,
      isNewArrival: true,
      status: "ACTIVE",
      description: "Mil-spec laser-cut modular harness with detachable pouch system.",
    },
    {
      id: "prod-7",
      title: "BROCODE STUDIO PALLET MERCH RACK",
      slug: "brocode-studio-pallet-rack",
      price: 42.0,
      compareAtPrice: 60.0,
      stock: 50,
      sku: "BRO-ST07",
      categoryId: "cat-param",
      images: JSON.stringify(["/images/pallet_rack.jpg"]),
      colors: JSON.stringify(["#111111", "#EF0606"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      badges: JSON.stringify(["STUDIO", "RAW"]),
      tags: JSON.stringify(["param", "studio", "merch"]),
      isFeatured: false,
      isNewArrival: false,
      status: "ACTIVE",
      description: "Heavyweight studio apparel curated from our flagship Copenhagen workshop.",
    },
    {
      id: "prod-8",
      title: "VALHALLA FOUNDERS SIGNATURE HOODIE",
      slug: "valhalla-founders-hoodie",
      price: 68.0,
      compareAtPrice: 95.0,
      stock: 35,
      sku: "BRO-HD08",
      categoryId: "cat-musica",
      images: JSON.stringify(["/images/founders.jpg"]),
      colors: JSON.stringify(["#111111"]),
      sizes: JSON.stringify(["M", "L", "XL", "2XL"]),
      badges: JSON.stringify(["SIGNATURE", "450 GSM"]),
      tags: JSON.stringify(["musica", "music", "gothic", "hoodie"]),
      isFeatured: false,
      isNewArrival: true,
      status: "ACTIVE",
      description: "Heavyweight double-fleece hoodie with embroidered gothic typography.",
    },
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
  }
  console.log("✓ Products seeded.");

  // 4. Banners
  const bannersData = [
    {
      id: "banner-1",
      title: "PINK FLOYD WORLD TOUR",
      subtitle: "AUTHENTIC LICENSED BAND MERCHANDISE // LIMITED COLLECTOR RUN",
      tag: "[ COLLECTION ]",
      buttonText: "EXPLORE COLLECTION →",
      buttonLink: "/catalog?category=bands",
      image: "/images/pink_floyd_banner.jpg",
      placement: "TOUR_BANNER",
      isActive: true,
      order: 1,
    },
    {
      id: "banner-2",
      title: "AMON AMARTH HEAVY APPAREL",
      subtitle: "VALHALLA CEREMONIAL ARMOR // HIGH DENSITY COMBED COTTON",
      tag: "[ FEATURED DROP ]",
      buttonText: "CLAIM RELIC →",
      buttonLink: "/catalog?category=moda",
      image: "/images/amon_banner.jpg",
      placement: "FEATURED_DROP",
      isActive: true,
      order: 2,
    },
  ];

  for (const b of bannersData) {
    await prisma.banner.upsert({
      where: { id: b.id },
      update: b,
      create: b,
    });
  }
  console.log("✓ Banners seeded.");

  // 5. WebContent
  const contentsData = [
    {
      sectionKey: "ABOUT_US",
      title: "THIS IS BROCODE",
      subtitle: "LOUD, PROUD, UNTAMED",
      content: JSON.stringify({
        tagline: "[ ABOUT US ]",
        titleLine1: "THIS IS BROCODE",
        titleLine2: "LOUD, PROUD, UNTAMED",
        body: "BROCODE was born in underground European moshpits and dark techno basements. We create luxury heavyweight streetwear built for those who refuse to blend in.",
        rackImage: "/images/pallet_rack.jpg",
        rackLabel: "STUDIO RACK // 001",
        foundersImage: "/images/founders.jpg",
        foundersLabel: "BROCODE CREATORS",
      }),
      media: JSON.stringify(["/images/pallet_rack.jpg", "/images/founders.jpg"]),
    },
    {
      sectionKey: "MOMENTS_GALLERY",
      title: "BROCODE MOMENTS",
      subtitle: "[ FOLLOW US ]",
      content: JSON.stringify({
        title: "BROCODE MOMENTS",
        tagline: "[ FOLLOW US ]",
        subtitle: "TAG @_BROCODE._CO._ TO BE FEATURED IN OUR ARCHIVE",
        instagramHandle: "_brocode._co._",
        instagramUrl: "https://www.instagram.com/_brocode._co._?igsi=ajhuZDRvbW50Yzhu",
        email: "brOcOde.2k26.param@gmail.com",
      }),
      media: JSON.stringify([
        "/images/pallet_rack.jpg",
        "/images/pink_floyd_banner.jpg",
        "/images/patch.jpg",
        "/images/cap.jpg",
        "/images/founders.jpg",
        "/images/screaming_vocalist.jpg",
        "/images/amon_shorts.jpg",
        "/images/sabaton_tee.jpg",
      ]),
    },
  ];

  for (const c of contentsData) {
    await prisma.webContent.upsert({
      where: { sectionKey: c.sectionKey },
      update: c,
      create: c,
    });
  }
  console.log("✓ Web Content seeded.");

  // 6. Settings
  const settingsData = [
    { key: "store_name", value: JSON.stringify("BROCODE") },
    { key: "store_title", value: JSON.stringify("BROCODE — Param Collection // Merch That Hits Different") },
    { key: "store_tagline", value: JSON.stringify("Luxury oversized streetwear. Brocode Param Collection live now.") },
    { key: "store_email", value: JSON.stringify("brOcOde.2k26.param@gmail.com") },
    { key: "currency_code", value: JSON.stringify("INR") },
    { key: "currency_symbol", value: JSON.stringify("₹") },
    {
      key: "audio_tracks",
      value: JSON.stringify([
        {
          id: "track-1",
          title: "Brocode Dark Minimalist Anthem",
          artist: "Brocode Studio // 12.webm",
          url: "/12.webm",
          isActive: true,
        },
      ]),
    },
    { key: "audio_enabled", value: JSON.stringify(true) },
    { key: "audio_volume", value: JSON.stringify(0.15) },
  ];

  for (const s of settingsData) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log("✓ Settings seeded.");

  console.log("🎉 ALL SEEDING COMPLETED SUCCESSFULLY!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Brocode database seed...");

  // 1. Clean existing records
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.webContent.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.admin.deleteMany();

  // 2. Super Admin
  const passwordHash = await bcrypt.hash("admin123456", 10);
  const superAdmin = await prisma.admin.create({
    data: {
      email: "admin@brocode.store",
      passwordHash,
      name: "Brocode Commander",
      role: "SUPER_ADMIN",
      avatar: "/images/founders.jpg",
    },
  });
  console.log(`✅ Admin created: ${superAdmin.email} / admin123456`);

  // 3. Categories
  const categories = [
    {
      name: "ROPA",
      slug: "ropa",
      description: "Heavyweight tees, drop-shoulder hoodies, and tactical bottoms.",
      image: "/images/pallet_rack.jpg",
      itemCount: 1087,
      order: 1,
    },
    {
      name: "BANDS",
      slug: "bands",
      description: "Official licensed heavy metal, rock, and punk band apparel.",
      image: "/images/pink_floyd_banner.jpg",
      itemCount: 757,
      actionText: "SHOP BANDS",
      isFeatured: true,
      order: 2,
    },
    {
      name: "ACCESORIOS",
      slug: "accesorios",
      description: "Tactical harness bags, woven album patches, and caps.",
      image: "/images/tactical_bag.jpg",
      itemCount: 347,
      order: 3,
    },
    {
      name: "MUSICA",
      slug: "musica",
      description: "Limited vinyl pressings, cassette tapes, and boxsets.",
      image: "/images/founders.jpg",
      itemCount: 97,
      order: 4,
    },
    {
      name: "MODA",
      slug: "moda",
      description: "Contemporary darkwear streetwear and distressed collections.",
      image: "/images/amon_shorts.jpg",
      itemCount: 427,
      order: 5,
    },
  ];

  const catMap = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    catMap[cat.name] = created.id;
  }
  console.log(`✅ ${categories.length} Categories seeded.`);

  // 4. Products
  const products = [
    // 3D Hero Series
    {
      title: "BROCODE OVERSIZED T-SHIRT",
      slug: "brocode-oversized-t-shirt",
      description: "Vintage washed heavyweight combed cotton featuring signature Brocode Param lion crest.",
      price: 35.0,
      compareAtPrice: 45.0,
      costPerItem: 14.0,
      sku: "BRO-TEE-001",
      stock: 45,
      isFeatured: true,
      isNewArrival: true,
      isLimited: false,
      badges: JSON.stringify(["PARAM", "NEW"]),
      colors: JSON.stringify(["#111111", "#dc2626", "#e5a823"]),
      sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      images: JSON.stringify(["/images/sabaton_tee.jpg"]),
      tags: JSON.stringify(["oversized", "param", "tshirt", "lion", "heavyweight"]),
      categoryId: catMap["ROPA"],
    },
    {
      title: "PARAM ARCHIVE SLEEVE TEE",
      slug: "param-archive-sleeve-tee",
      description: "Extended drop-shoulder silhouette featuring gothic typography on lateral sleeve ribbing.",
      price: 42.0,
      compareAtPrice: 55.0,
      costPerItem: 16.0,
      sku: "BRO-TEE-002",
      stock: 28,
      isFeatured: true,
      isTrending: true,
      badges: JSON.stringify(["LIMITED"]),
      colors: JSON.stringify(["#111111", "#6b7280"]),
      sizes: JSON.stringify(["M", "L", "XL"]),
      images: JSON.stringify(["/images/sabbath_tee.jpg"]),
      tags: JSON.stringify(["archive", "sleeve", "gothic"]),
      categoryId: catMap["ROPA"],
    },
    {
      title: "BROCODE ACID WASH HEAVYWEIGHT",
      slug: "brocode-acid-wash-heavyweight",
      description: "Signature boxy cut in charcoal enzyme wash with reinforced collar and sleeve accents.",
      price: 35.0,
      compareAtPrice: 48.0,
      costPerItem: 13.0,
      sku: "BRO-TEE-003",
      stock: 60,
      isFeatured: true,
      badges: JSON.stringify(["HOT"]),
      colors: JSON.stringify(["#1e1e1e", "#374151"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      images: JSON.stringify(["/images/sabaton_tee.jpg"]),
      tags: JSON.stringify(["acid wash", "heavyweight", "charcoal"]),
      categoryId: catMap["ROPA"],
    },
    // New Arrivals
    {
      title: '"TEMPLARS" T-SHIRT BLACK BY SABATON',
      slug: "templars-tshirt-sabaton",
      description: "Official licensed Sabaton heavyweight graphic band tee with Crusader Templar artwork.",
      price: 38.0,
      compareAtPrice: 50.0,
      costPerItem: 15.0,
      sku: "SAB-TMP-01",
      stock: 18,
      isNewArrival: true,
      isLimited: true,
      badges: JSON.stringify(["NEW", "LIMITED"]),
      colors: JSON.stringify(["#dc2626", "#2563eb", "#111111", "#ec4899"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      images: JSON.stringify(["/images/sabaton_tee.jpg"]),
      tags: JSON.stringify(["sabaton", "metal", "templar", "band tee"]),
      categoryId: catMap["BANDS"],
    },
    {
      title: "BLACK SABBATH T-SHIRT WORLD TOUR",
      slug: "black-sabbath-tshirt-world-tour",
      description: "Vintage tour edition 1978 Never Say Die Black Sabbath distressed band tee.",
      price: 36.0,
      compareAtPrice: 48.0,
      costPerItem: 14.0,
      sku: "SAB-BST-02",
      stock: 24,
      isNewArrival: true,
      isLimited: true,
      badges: JSON.stringify(["NEW", "LIMITED"]),
      colors: JSON.stringify(["#06b6d4", "#dc2626", "#111111", "#d946ef"]),
      sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      images: JSON.stringify(["/images/sabbath_tee.jpg"]),
      tags: JSON.stringify(["black sabbath", "world tour", "vintage"]),
      categoryId: catMap["BANDS"],
    },
    {
      title: 'BDU RIPSTOP SHORT" SHORTS',
      slug: "bdu-ripstop-shorts-olive",
      description: "Heavy duty military grade tactical cargo shorts with multi-pocket system and metal D-rings.",
      price: 45.0,
      compareAtPrice: 60.0,
      costPerItem: 18.0,
      sku: "SHO-BDU-03",
      stock: 14,
      isNewArrival: true,
      isLimited: true,
      badges: JSON.stringify(["NEW", "LIMITED"]),
      colors: JSON.stringify(["#4b5320", "#111111", "#6b7280"]),
      sizes: JSON.stringify(["30", "32", "34", "36"]),
      images: JSON.stringify(["/images/olive_shorts.jpg"]),
      tags: JSON.stringify(["cargo", "shorts", "ripstop", "tactical"]),
      categoryId: catMap["ROPA"],
    },
    {
      title: "PINK FLOYD T-SHIRT WORLD TOUR",
      slug: "pink-floyd-tshirt-world-tour",
      description: "Dark Side of the Moon prism retro psychedelic graphic washed tee.",
      price: 35.0,
      compareAtPrice: 45.0,
      costPerItem: 13.0,
      sku: "PF-WLD-04",
      stock: 30,
      isNewArrival: true,
      isLimited: true,
      badges: JSON.stringify(["NEW", "LIMITED"]),
      colors: JSON.stringify(["#06b6d4", "#dc2626", "#111111", "#ec4899"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      images: JSON.stringify(["/images/amon_tanktop.jpg"]),
      tags: JSON.stringify(["pink floyd", "tour", "rock"]),
      categoryId: catMap["BANDS"],
    },
    // Accessories
    {
      title: "CAP BLACK BY RAMMSTEIN",
      slug: "cap-black-by-rammstein",
      description: "Distressed washed cotton baseball cap with embroidered heavy industrial crest.",
      price: 35.0,
      compareAtPrice: 45.0,
      costPerItem: 11.0,
      sku: "ACC-CAP-01",
      stock: 40,
      isFeatured: true,
      badges: JSON.stringify(["NEW"]),
      colors: JSON.stringify(["#111111"]),
      sizes: JSON.stringify(["ONE SIZE"]),
      images: JSON.stringify(["/images/cap.jpg"]),
      tags: JSON.stringify(["cap", "hat", "rammstein", "black"]),
      categoryId: catMap["ACCESORIOS"],
    },
    {
      title: 'MASTER OF PUPPETS" PATCH MULTICOLOUR',
      slug: "master-of-puppets-patch",
      description: "High-density woven jacket patch with heavy merrowed border.",
      price: 14.0,
      compareAtPrice: 18.0,
      costPerItem: 3.5,
      sku: "ACC-PAT-02",
      stock: 150,
      badges: JSON.stringify(["NEW"]),
      colors: JSON.stringify(["#111111"]),
      sizes: JSON.stringify(["10x10 cm"]),
      images: JSON.stringify(["/images/patch.jpg"]),
      tags: JSON.stringify(["patch", "metallica", "jacket"]),
      categoryId: catMap["ACCESORIOS"],
    },
    {
      title: '"BELT BAG" BUM BAG BLACK BY GOTHICANA',
      slug: "belt-bag-bum-bag-black",
      description: "Tactical chest harness bag with waterproof cordura nylon, molle webbing, and quick-release buckles.",
      price: 49.0,
      compareAtPrice: 65.0,
      costPerItem: 19.0,
      sku: "ACC-BAG-03",
      stock: 0,
      isOutOfStock: true,
      badges: JSON.stringify(["SOLD OUT", "LIMITED"]),
      colors: JSON.stringify(["#111111"]),
      sizes: JSON.stringify(["ONE SIZE"]),
      images: JSON.stringify(["/images/tactical_bag.jpg"]),
      tags: JSON.stringify(["harness", "bag", "tactical", "cordura"]),
      categoryId: catMap["ACCESORIOS"],
    },
    {
      title: '"COLE" BELT BLACK BY GOTHICANA',
      slug: "cole-belt-black",
      description: "Heavy duty military webbed belt with laser engraved alloy quick release buckle.",
      price: 28.0,
      compareAtPrice: 38.0,
      costPerItem: 8.0,
      sku: "ACC-BLT-04",
      stock: 35,
      badges: JSON.stringify(["NEW"]),
      colors: JSON.stringify(["#111111", "#4b5320"]),
      sizes: JSON.stringify(["110cm", "125cm"]),
      images: JSON.stringify(["/images/tactical_bag.jpg"]),
      tags: JSON.stringify(["belt", "tactical", "gothicana"]),
      categoryId: catMap["ACCESORIOS"],
    },
    // Amon Amarth Ragnarok Featured Drop
    {
      title: '"RAGNAROK" TANKTOP BLACK',
      slug: "ragnarok-tanktop-black",
      description: "Raw cut armholes with Viking skull and Nordic rune artwork on washed combed cotton.",
      price: 32.0,
      compareAtPrice: 42.0,
      costPerItem: 10.0,
      sku: "AMON-TNK-01",
      stock: 22,
      isFeatured: true,
      isLimited: true,
      badges: JSON.stringify(["NEW", "LIMITED"]),
      colors: JSON.stringify(["#111111", "#dc2626", "#06b6d4"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      images: JSON.stringify(["/images/amon_tanktop.jpg"]),
      tags: JSON.stringify(["amon amarth", "ragnarok", "tanktop", "viking"]),
      categoryId: catMap["BANDS"],
    },
    {
      title: '"AMON AMARTH" SHORTS GREY',
      slug: "amon-amarth-shorts-grey",
      description: "Grey heavy fleece cargo shorts with embroidered Amon Amarth hammer logo.",
      price: 44.0,
      compareAtPrice: 58.0,
      costPerItem: 16.0,
      sku: "AMON-SHO-02",
      stock: 19,
      isFeatured: true,
      isLimited: true,
      badges: JSON.stringify(["NEW", "LIMITED"]),
      colors: JSON.stringify(["#6b7280", "#2563eb", "#111111"]),
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      images: JSON.stringify(["/images/amon_shorts.jpg"]),
      tags: JSON.stringify(["amon amarth", "shorts", "grey", "fleece"]),
      categoryId: catMap["ROPA"],
    },
  ];

  for (const prod of products) {
    await prisma.product.create({ data: prod });
  }
  console.log(`✅ ${products.length} Products seeded with inventory and variants.`);

  // 5. Banners & Homepage CMS
  const banners = [
    {
      title: "PINK FLOYD WORLD TOUR",
      subtitle: "PINK FLOYD COLLECTION TOUR",
      tag: "[ COLLECTION ]",
      buttonText: "EXPLORE COLLECTION",
      buttonLink: "/#catalog",
      image: "/images/pink_floyd_banner.jpg",
      placement: "TOUR_BANNER",
      order: 1,
    },
    {
      title: "AMON AMARTH RAGNAROK",
      subtitle: "LIMITED EDITION MERCH FROM THE AMON AMARTH RAGNAROK COLLECTION.",
      tag: "[ FEATURED ]",
      buttonText: "SHOP DROP",
      buttonLink: "/#featured-drop",
      image: "/images/amon_tanktop.jpg",
      placement: "FEATURED_DROP",
      order: 2,
    },
  ];

  for (const b of banners) {
    await prisma.banner.create({ data: b });
  }
  console.log(`✅ ${banners.length} Banners seeded.`);

  // 6. Web Content (CMS)
  await prisma.webContent.create({
    data: {
      sectionKey: "ABOUT_US",
      title: "THIS IS BROCODE LOUD, PROUD, AND UNTAMED",
      subtitle: "[ about us ]",
      content: JSON.stringify({
        body: "Brocode is all about turning up the volume on what matters — real bands, real fans, real merch. We're here to dress your rebellion, fuel your playlists, and celebrate the chaos of sound and self-expression. No rules, no trends — just raw music energy.",
        tagline: "LOUD, PROUD, AND UNTAMED",
        highlightColor: "#f59e0b",
      }),
      media: JSON.stringify([
        { id: 1, img: "/images/pallet_rack.jpg", label: "Studio Apparel Rack" },
        { id: 2, img: "/images/founders.jpg", label: "Brocode Creators" },
      ]),
    },
  });

  await prisma.webContent.create({
    data: {
      sectionKey: "MARQUEE_TEXT",
      title: "Hero Top Announcement Bar",
      content: JSON.stringify({
        text: "FREE SHIPPING WITHIN SOUTH AMERICA",
        emoji: "💥",
        speed: 24,
      }),
    },
  });

  await prisma.webContent.create({
    data: {
      sectionKey: "MOMENTS_GALLERY",
      title: "BROCODE MOMENTS",
      subtitle: "[ follow us ]",
      content: JSON.stringify({
        instagramHandle: "BROCODEINSTA",
        instagramUrl: "https://instagram.com",
      }),
      media: JSON.stringify([
        { id: 1, img: "/images/pallet_rack.jpg", shape: "rounded-full" },
        { id: 2, img: "/images/pink_floyd_banner.jpg", shape: "rounded-2xl" },
        { id: 3, img: "/images/patch.jpg", shape: "rounded-full" },
        { id: 4, img: "/images/cap.jpg", shape: "rounded-full" },
        { id: 5, img: "/images/founders.jpg", shape: "rounded-2xl" },
        { id: 6, img: "/images/screaming_vocalist.jpg", shape: "rounded-2xl" },
        { id: 7, img: "/images/amon_shorts.jpg", shape: "rounded-full" },
        { id: 8, img: "/images/sabaton_tee.jpg", shape: "rounded-2xl" },
      ]),
    },
  });
  console.log("✅ CMS Web Content seeded.");

  // 7. Coupons
  const coupons = [
    {
      code: "BROCODE10",
      description: "10% off for Param Collection fans",
      discountType: "PERCENTAGE",
      discountValue: 10.0,
      minOrderValue: 30.0,
      usageLimit: 500,
      usageCount: 42,
      status: "ACTIVE",
    },
    {
      code: "ROCKVIP",
      description: "$15 Flat discount on orders over $80",
      discountType: "FIXED",
      discountValue: 15.0,
      minOrderValue: 80.0,
      usageLimit: 100,
      usageCount: 19,
      status: "ACTIVE",
    },
    {
      code: "FREESHIP",
      description: "Free global priority shipping",
      discountType: "FREE_SHIPPING",
      discountValue: 100.0,
      minOrderValue: 50.0,
      usageLimit: 1000,
      usageCount: 88,
      status: "ACTIVE",
    },
  ];

  for (const c of coupons) {
    await prisma.coupon.create({ data: c });
  }
  console.log(`✅ ${coupons.length} Coupons seeded.`);

  // 8. Sample Customers & Orders
  const customer1 = await prisma.customer.create({
    data: {
      name: "Gabriel Silva",
      email: "gabriel.silva@example.com",
      phone: "+55 11 98765-4321",
      avatar: "/images/founders.jpg",
      totalOrders: 3,
      totalSpent: 215.0,
      status: "ACTIVE",
      addresses: JSON.stringify([
        {
          street: "Av. Paulista 1000, Apt 42",
          city: "São Paulo",
          state: "SP",
          country: "Brazil",
          zip: "01310-100",
        },
      ]),
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: "Mateo Alvarez",
      email: "mateo.alvarez@example.com",
      phone: "+54 11 4567-8901",
      totalOrders: 1,
      totalSpent: 83.0,
      status: "ACTIVE",
      addresses: JSON.stringify([
        {
          street: "Calle Florida 450",
          city: "Buenos Aires",
          country: "Argentina",
          zip: "C1005",
        },
      ]),
    },
  });

  // Orders
  await prisma.order.create({
    data: {
      orderNumber: "BRO-10082",
      customerId: customer1.id,
      customerName: customer1.name,
      customerEmail: customer1.email,
      customerPhone: customer1.phone,
      subtotal: 114.0,
      discount: 11.4,
      couponCode: "BROCODE10",
      shippingCost: 0.0,
      tax: 5.0,
      total: 107.6,
      paymentMethod: "CREDIT_CARD",
      paymentStatus: "PAID",
      orderStatus: "SHIPPED",
      trackingNumber: "BR-984729184SA",
      carrier: "Correios Express",
      items: {
        create: [
          {
            title: '"TEMPLARS" T-SHIRT BLACK BY SABATON',
            price: 38.0,
            quantity: 2,
            variant: "Size: L, Color: Black",
            image: "/images/sabaton_tee.jpg",
            total: 76.0,
          },
          {
            title: "CAP BLACK BY RAMMSTEIN",
            price: 35.0,
            quantity: 1,
            variant: "Size: ONE SIZE",
            image: "/images/cap.jpg",
            total: 35.0,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: "BRO-10083",
      customerId: customer2.id,
      customerName: customer2.name,
      customerEmail: customer2.email,
      customerPhone: customer2.phone,
      subtotal: 83.0,
      discount: 0.0,
      shippingCost: 8.0,
      tax: 4.0,
      total: 95.0,
      paymentMethod: "STRIPE",
      paymentStatus: "PAID",
      orderStatus: "PROCESSING",
      items: {
        create: [
          {
            title: 'BDU RIPSTOP SHORT" SHORTS',
            price: 45.0,
            quantity: 1,
            variant: "Size: 32, Color: Olive",
            image: "/images/olive_shorts.jpg",
            total: 45.0,
          },
          {
            title: '"TEMPLARS" T-SHIRT BLACK BY SABATON',
            price: 38.0,
            quantity: 1,
            variant: "Size: M, Color: Black",
            image: "/images/sabaton_tee.jpg",
            total: 38.0,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: "BRO-10084",
      customerName: "Lucas Vega",
      customerEmail: "lucas.vega@example.com",
      subtotal: 49.0,
      discount: 0.0,
      shippingCost: 5.0,
      total: 54.0,
      paymentMethod: "PAYPAL",
      paymentStatus: "PAID",
      orderStatus: "PENDING",
      items: {
        create: [
          {
            title: '"BELT BAG" BUM BAG BLACK BY GOTHICANA',
            price: 49.0,
            quantity: 1,
            variant: "Size: ONE SIZE",
            image: "/images/tactical_bag.jpg",
            total: 49.0,
          },
        ],
      },
    },
  });
  console.log("✅ Sample orders & customers seeded.");

  // 9. Initial Notifications
  await prisma.notification.createMany({
    data: [
      {
        type: "NEW_ORDER",
        title: "New Order #BRO-10084",
        message: "Lucas Vega placed an order for $54.00 USD.",
        isRead: false,
        link: "/admin/orders",
      },
      {
        type: "LOW_STOCK",
        title: 'Low Stock Alert: "BELT BAG"',
        message: 'Tactical Belt Bag is now OUT OF STOCK (0 items left).',
        isRead: false,
        link: "/admin/inventory",
      },
    ],
  });

  // 10. Store Settings
  const settings = [
    { key: "store_name", value: JSON.stringify("BROCODE"), group: "STORE" },
    { key: "store_email", value: JSON.stringify("contact@brocode.store"), group: "STORE" },
    { key: "currency_symbol", value: JSON.stringify("$"), group: "STORE" },
    { key: "currency_code", value: JSON.stringify("USD"), group: "STORE" },
    { key: "tax_rate_percent", value: JSON.stringify(5.0), group: "TAX" },
    { key: "free_shipping_threshold", value: JSON.stringify(75.0), group: "SHIPPING" },
  ];

  for (const s of settings) {
    await prisma.setting.create({ data: s });
  }

  console.log("🎉 Brocode database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

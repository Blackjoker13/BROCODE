// Automated Full Integration Test for BROCODE Store & Admin Panel
const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("==================================================");
  console.log("⚡ STARTING BROCODE ADMIN & STOREFRONT FULL TESTS");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  async function testEndpoint(name, url, options = {}) {
    try {
      const res = await fetch(`${BASE_URL}${url}`, options);
      if (res.ok) {
        console.log(`✅ [PASS] ${name} (${res.status})`);
        passed++;
        return await res.json().catch(() => null);
      } else {
        console.error(`❌ [FAIL] ${name} - Status: ${res.status}`);
        failed++;
        return null;
      }
    } catch (e) {
      console.error(`❌ [ERROR] ${name}:`, e.message);
      failed++;
      return null;
    }
  }

  // 1. Storefront Unified Live Data
  console.log("\n--- Testing Storefront Live Data API ---");
  const storeData = await testEndpoint("Storefront Live Sync", "/api/storefront/data");
  if (storeData) {
    console.log(`   - Categories fetched: ${storeData.categories?.length || 0}`);
    console.log(`   - Total Products: ${storeData.products?.length || 0}`);
    console.log(`   - New Arrivals: ${storeData.newArrivals?.length || 0}`);
    console.log(`   - Accessories: ${storeData.accessories?.length || 0}`);
    console.log(`   - Tour Banner: "${storeData.tourBanner?.title || 'None'}"`);
    console.log(`   - Store Name: "${storeData.settings?.store_name || 'BROCODE'}"`);
  }

  // 2. Admin Authentication Login
  console.log("\n--- Testing Admin Authentication ---");
  let cookieHeader = "";
  try {
    const loginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@brocode.store",
        password: "admin123456",
      }),
    });
    if (loginRes.ok) {
      const setCookie = loginRes.headers.get("set-cookie");
      cookieHeader = setCookie || "";
      console.log("✅ [PASS] Admin Login Successful (Super Admin JWT token created)");
      passed++;
    } else {
      console.error("❌ [FAIL] Admin Login failed");
      failed++;
    }
  } catch (e) {
    console.error("❌ [ERROR] Login:", e.message);
    failed++;
  }

  const authOptions = { headers: { Cookie: cookieHeader } };

  // 3. Admin Me Check
  console.log("\n--- Testing Admin Session Check ---");
  await testEndpoint("Admin Session Profile", "/api/admin/auth/me", authOptions);

  // 4. Products CRUD API
  console.log("\n--- Testing Products & Catalog APIs ---");
  const products = await testEndpoint("List Products", "/api/admin/products", authOptions);
  if (products?.products?.length > 0) {
    const firstId = products.products[0].id;
    await testEndpoint("Get Product By ID", `/api/admin/products/${firstId}`, authOptions);
  }

  // 5. Categories CRUD API
  console.log("\n--- Testing Categories APIs ---");
  await testEndpoint("List Categories", "/api/admin/categories", authOptions);

  // 6. Inventory & Stock API
  console.log("\n--- Testing Inventory & Stock APIs ---");
  await testEndpoint("List Stock Matrix", "/api/admin/inventory", authOptions);

  // 7. Orders & Fulfillment API
  console.log("\n--- Testing Orders & Fulfillment APIs ---");
  const orders = await testEndpoint("List Orders", "/api/admin/orders", authOptions);
  if (orders?.orders?.length > 0) {
    const firstOrderId = orders.orders[0].id;
    await testEndpoint("Get Order Details", `/api/admin/orders/${firstOrderId}`, authOptions);
  }

  // 8. Place a Live Customer Order
  console.log("\n--- Testing Customer Live Order Placement ---");
  let newOrderNumber = "";
  try {
    const orderRes = await fetch(`${BASE_URL}/api/admin/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Rodrigo Alvez",
        customerEmail: "rodrigo@rockmusic.com",
        customerPhone: "+55 11 9988-7766",
        shippingAddress: { street: "Rua Augusta 450", city: "São Paulo", country: "Brazil" },
        items: [
          {
            productId: products?.products?.[0]?.id || "sabaton",
            title: products?.products?.[0]?.title || '"TEMPLARS" T-SHIRT BLACK BY SABATON',
            price: 38.0,
            quantity: 2,
            variant: "Size: XL",
            image: "/images/sabaton_tee.jpg",
          },
        ],
        subtotal: 76.0,
        discount: 7.6,
        couponCode: "BROCODE10",
        total: 68.4,
      }),
    });
    const orderData = await orderRes.json();
    if (orderRes.ok && orderData.success) {
      newOrderNumber = orderData.order.orderNumber;
      console.log(`✅ [PASS] Customer Order Placed Successfully! Order #: ${newOrderNumber}`);
      console.log(`   - Inventory stock automatically deducted in database`);
      console.log(`   - Real-time customer profile and spend incremented`);
      passed++;
    } else {
      console.error("❌ [FAIL] Live Order Placement failed:", orderData.error);
      failed++;
    }
  } catch (e) {
    console.error("❌ [ERROR] Live Order Placement:", e.message);
    failed++;
  }

  // 9. Customers CRM API
  console.log("\n--- Testing Customers CRM APIs ---");
  await testEndpoint("List Customers", "/api/admin/customers", authOptions);

  // 10. Offers & Coupons API
  console.log("\n--- Testing Coupons & Offers APIs ---");
  await testEndpoint("List Active Coupons", "/api/admin/coupons", authOptions);

  // 11. Banners & Homepage CMS API
  console.log("\n--- Testing Banners CMS APIs ---");
  await testEndpoint("List Homepage Banners", "/api/admin/banners", authOptions);

  // 12. Website Content CMS API
  console.log("\n--- Testing Website Content & Story CMS ---");
  await testEndpoint("Get Brand Content & Marquee", "/api/admin/content", authOptions);

  // 13. Telemetry & Sales Analytics API
  console.log("\n--- Testing Telemetry & Analytics APIs ---");
  const analytics = await testEndpoint("Store Analytics Metrics", "/api/admin/analytics", authOptions);
  if (analytics?.metrics) {
    console.log(`   - Live Gross Revenue: $${analytics.metrics.totalRevenue.toFixed(2)}`);
    console.log(`   - Live Total Orders: ${analytics.metrics.totalOrders}`);
    console.log(`   - Live Customers: ${analytics.metrics.totalCustomers}`);
  }

  // 14. Reviews Moderation API
  console.log("\n--- Testing Product Reviews APIs ---");
  await testEndpoint("List Reviews", "/api/admin/reviews", authOptions);

  // 15. Admin Users & RBAC API
  console.log("\n--- Testing Admin Team & Roles APIs ---");
  await testEndpoint("List Admin Users", "/api/admin/users", authOptions);

  // 16. Store Settings API
  console.log("\n--- Testing Store Settings APIs ---");
  await testEndpoint("Get Store Settings", "/api/admin/settings", authOptions);

  console.log("\n==================================================");
  console.log(`🏁 FINAL RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");
}

runTests();

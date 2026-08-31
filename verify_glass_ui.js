const http = require('http');

function fetchPath(path) {
  return new Promise((resolve) => {
    const start = Date.now();
    http.get('http://localhost:3000' + path, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        resolve({
          path,
          status: res.statusCode,
          timeMs: Date.now() - start,
          bytes: Buffer.byteLength(data, 'utf8'),
          body: data,
        });
      });
    }).on('error', (e) => resolve({ path, error: e.message }));
  });
}

async function run() {
  console.log('--- 1. VERIFYING GLASS UI HTML PAYLOAD ---');
  const home = await fetchPath('/');
  console.log('Homepage Status:', home.status, 'Time:', home.timeMs, 'ms, Bytes:', home.bytes);

  const checks = [
    { name: 'glass-surface-light (Hero Product Card / Trays)', pattern: /glass-surface-light/ },
    { name: 'glass-card-swirl (Category & Product Cards)', pattern: /glass-card-swirl/ },
    { name: 'glass-pill (Size Selectors)', pattern: /glass-pill/ },
    { name: 'glass-btn-primary (Add to Bag / Quick Add)', pattern: /glass-btn-primary/ },
    { name: 'glass-btn-control (Arrow Controls / Navigation)', pattern: /glass-btn-control/ },
    { name: 'glass-badge-red (Hero & New Badges)', pattern: /glass-badge-red/ },
    { name: 'glass-badge-dark (Limited Badges)', pattern: /glass-badge-dark/ },
    { name: 'glass-surface-dark (Search Modal / Cart Drawer)', pattern: /glass-surface-dark/ },
  ];

  checks.forEach(chk => {
    const found = chk.pattern.test(home.body);
    console.log(`[${found ? 'PASS' : 'FAIL'}] ${chk.name}`);
  });

  console.log('\n--- 2. VERIFYING HEALTH CHECK ---');
  const health = await fetchPath('/api/health');
  console.log('Health Check Status:', health.status, 'Time:', health.timeMs, 'ms, Response:', health.body);

  process.exit(0);
}

run();

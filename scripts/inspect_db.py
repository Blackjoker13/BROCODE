import sqlite3
import json

conn = sqlite3.connect('prisma/dev.db')
cur = conn.cursor()

tables = [r[0] for r in cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma%'").fetchall()]

counts = {}
for t in tables:
    try:
        c = cur.execute(f'SELECT COUNT(*) FROM "{t}"').fetchone()[0]
        counts[t] = c
    except Exception as e:
        counts[t] = str(e)

print("\n=== SQLITE DEV.DB DATA COUNTS ===")
print(json.dumps(counts, indent=2))

print("\n=== CATEGORIES ===")
for row in cur.execute('SELECT id, name, slug, itemCount, "order" FROM Category').fetchall():
    print(row)

print("\n=== PRODUCTS ===")
for row in cur.execute('SELECT id, title, slug, price, stock, categoryId FROM Product').fetchall():
    print(row)

print("\n=== BANNERS ===")
for row in cur.execute('SELECT id, title, placement, isActive FROM Banner').fetchall():
    print(row)

print("\n=== WEB CONTENT ===")
for row in cur.execute('SELECT id, sectionKey, title FROM WebContent').fetchall():
    print(row)

print("\n=== ADMINS ===")
for row in cur.execute('SELECT id, email, name, role FROM Admin').fetchall():
    print(row)

print("\n=== PUBLICATION VERSIONS ===")
for row in cur.execute('SELECT id, versionNumber, releaseTitle, status, publishedAt FROM PublicationVersion').fetchall():
    print(row)

conn.close()

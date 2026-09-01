import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import fs from "fs";
import path from "path";
import { getAdminSession } from "@/lib/auth/adminAuth";
import sharp from "sharp";

export async function POST(request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.formData();
    const files = data.getAll("files");

    if (!files || files.length === 0) {
      const single = data.get("file");
      if (single) {
        files.push(single);
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const manifestPath = path.join(process.cwd(), "public", "assets-manifest.json");
    let manifest = {};
    try {
      if (fs.existsSync(manifestPath)) {
        manifest = JSON.parse(await readFile(manifestPath, "utf-8"));
      }
    } catch (e) {}

    const uploadedUrls = [];

    for (const file of files) {
      if (!file || typeof file === "string") continue;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = (path.extname(file.name) || ".jpg").toLowerCase();
      const cleanName = path
        .basename(file.name, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "_");
      const baseFilename = `${cleanName}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 7)}`;
      const filename = `${baseFilename}${ext}`;
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);
      const publicUrl = `/uploads/${filename}`;
      uploadedUrls.push(publicUrl);

      // Auto-Optimize Images on Upload
      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        try {
          const meta = await sharp(buffer).metadata();
          const webpFilename = `${baseFilename}.webp`;
          const avifFilename = `${baseFilename}.avif`;

          // Generate full WebP & AVIF
          await sharp(buffer)
            .webp({ quality: 85, effort: 5 })
            .toFile(path.join(uploadDir, webpFilename));
          await sharp(buffer)
            .avif({ quality: 75, effort: 4 })
            .toFile(path.join(uploadDir, avifFilename));

          // Generate responsive sizes (320, 640, 1024)
          const respWebpVariants = { full: `/uploads/${webpFilename}` };
          for (const width of [320, 640, 1024]) {
            if (meta.width && meta.width >= width) {
              const respName = `${baseFilename}_${width}w.webp`;
              await sharp(buffer)
                .resize(width, null, { withoutEnlargement: true })
                .webp({ quality: 82 })
                .toFile(path.join(uploadDir, respName));
              respWebpVariants[width] = `/uploads/${respName}`;
            }
          }

          // Generate LQIP
          const lqip = await sharp(buffer)
            .resize(16, Math.round(16 * ((meta.height || 16) / (meta.width || 16))), { fit: "inside" })
            .webp({ quality: 20 })
            .toBuffer();

          const entry = {
            original: publicUrl,
            width: meta.width,
            height: meta.height,
            aspectRatio: ((meta.width || 1) / (meta.height || 1)).toFixed(3),
            format: meta.format,
            variants: {
              webp: respWebpVariants,
              avif: { full: `/uploads/${avifFilename}` },
            },
            blurDataURL: `data:image/webp;base64,${lqip.toString("base64")}`,
          };

          manifest[publicUrl] = entry;
          manifest[filename] = entry;
        } catch (imgErr) {
          console.warn("[Upload Auto-Optimize Image Error]:", imgErr.message);
        }
      }
    }

    // Save updated manifest asynchronously
    try {
      await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    } catch (mErr) {}

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0] || null,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Image upload failed: " + err.message },
      { status: 500 }
    );
  }
}

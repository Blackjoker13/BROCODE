import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
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
    let files = data.getAll("files");

    if (!files || files.length === 0) {
      const single = data.get("file");
      if (single) {
        files = [single];
      }
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    let isDiskWritable = true;
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      isDiskWritable = false;
    }

    const uploadedUrls = [];

    for (const file of files) {
      if (!file || typeof file === "string") continue;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = (path.extname(file.name) || ".jpg").toLowerCase();
      const mimeType = file.type || (ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg");
      const cleanName = path
        .basename(file.name, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "_");
      const baseFilename = `${cleanName}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 7)}`;
      const filename = `${baseFilename}${ext}`;

      if (isDiskWritable) {
        try {
          const filePath = path.join(uploadDir, filename);
          await writeFile(filePath, buffer);
          uploadedUrls.push(`/uploads/${filename}`);

          // Try Sharp optimization on disk if supported
          if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
            try {
              const webpFilename = `${baseFilename}.webp`;
              await sharp(buffer)
                .webp({ quality: 85 })
                .toFile(path.join(uploadDir, webpFilename));
            } catch (_) {}
          }
          continue;
        } catch (writeErr) {
          isDiskWritable = false;
        }
      }

      // Vercel Serverless / Read-Only Fallback: Convert to optimized WebP Data URI
      try {
        if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
          const webpBuffer = await sharp(buffer)
            .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer();
          const dataUri = `data:image/webp;base64,${webpBuffer.toString("base64")}`;
          uploadedUrls.push(dataUri);
        } else {
          // Audio or other assets -> standard base64 data URI
          const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
          uploadedUrls.push(dataUri);
        }
      } catch (sharpErr) {
        const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
        uploadedUrls.push(dataUri);
      }
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0] || null,
    });
  } catch (err) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { error: "Image upload failed: " + err.message },
      { status: 500 }
    );
  }
}

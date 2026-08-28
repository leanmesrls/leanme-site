/**
 * Replace official Alessandro portrait from an attached source photo.
 * Updates docs/assets + public/assets/official (same path used site-wide).
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const source =
  "C:/Users/siyaa/.cursor/projects/c-Cursor-leanme-site/assets/c__Users_siyaa_AppData_Roaming_Cursor_User_workspaceStorage_4fff17df49a104b7ead63645546f5dc9_images_Immagine_2026-08-28_173227-b925680d-e8f4-4191-bbb9-d4d03ec1d335.jpg";

const targets = [
  path.join(root, "docs/assets/alessandro.png"),
  path.join(root, "public/assets/official/alessandro.png"),
];

if (!fs.existsSync(source)) {
  throw new Error(`Source photo not found: ${source}`);
}

const meta = await sharp(source).metadata();
const side = Math.min(meta.width ?? 0, meta.height ?? 0);
if (!side) throw new Error("Invalid source dimensions");

const buffer = await sharp(source)
  .resize(side, side, { fit: "cover", position: "attention" })
  .png({ compressionLevel: 9 })
  .toBuffer();

for (const dest of targets) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buffer);
  const out = await sharp(dest).metadata();
  console.log(`${path.relative(root, dest)} → ${out.width}x${out.height}`);
}

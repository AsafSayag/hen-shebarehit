import { readFile, writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

// Originals are downloaded through the connected Drive account, never thumbnails.
// Usage: node scripts/import-drive-furniture.mjs /path/to/numbered-originals
const sourceDir = process.argv[2];
if (!sourceDir) throw new Error("Pass the directory containing the numbered Drive originals (001.jpg, etc.).");
const groups = JSON.parse(await readFile("data/supplier/drive-furniture-groups.json", "utf8"));
const files = JSON.parse(await readFile("data/supplier/drive-files.json", "utf8"));
const outputDir = "public/products/drive";
await mkdir(outputDir, { recursive: true });
const imageData = {};
const sourceAudit = [];
for (const index of [...new Set(groups.products.flatMap((p) => p.photos))].sort((a, b) => a - b)) {
  const file = files.find((f) => f.index === index);
  if (!file?.mimeType.startsWith("image/")) throw new Error(`Missing image metadata: ${index}`);
  const input = await readFile(path.join(sourceDir, `${String(index).padStart(3, "0")}.jpg`));
  const original = sharp(input).rotate();
  const { width, height } = await original.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  const variants = [];
  for (const edge of [...new Set([Math.min(width, 480), Math.min(width, 960), width])].sort((a, b) => a - b)) {
    const filename = `${file.id}-${edge}.webp`;
    const info = await original.clone().resize({ width: edge, withoutEnlargement: true })
      .webp({ quality: edge === width ? 88 : 84, effort: 6 }).toFile(path.join(outputDir, filename));
    if (edge === width && info.size > input.length) {
      // Keep the exact original when WebP would be larger. Smaller screen variants stay WebP.
      const originalName = `${file.id}-${edge}.jpg`;
      await writeFile(path.join(outputDir, originalName), input);
      await unlink(path.join(outputDir, filename));
      variants.push({ src: `/products/drive/${originalName}`, width: info.width, height: info.height });
    } else {
      variants.push({ src: `/products/drive/${filename}`, width: info.width, height: info.height });
    }
  }
  imageData[index] = variants;
  sourceAudit.push({ index, driveId: file.id, filename: file.name, sourceUrl: file.url,
    width, height, originalBytes: input.length, sha256: createHash("sha256").update(input).digest("hex"), variants });
}

const products = groups.products.map((p) => {
  const images = p.photos.map((index) => imageData[index].at(-1).src);
  return {
    id: p.id, category: p.group === "sideboards" ? "sideboards" : "living-rooms",
    collection: p.group, name: p.name, details: [], images,
    imageVariants: Object.fromEntries(p.photos.map((index, i) => [images[i], imageData[index]])),
    ...(p.focus ? { imageFocus: Object.fromEntries(p.photos.filter((index) => p.focus[index])
      .map((index) => [imageData[index].at(-1).src, p.focus[index]])) } : {}),
    sourceUrl: files.find((f) => f.index === p.photos[0]).url,
  };
});
if (new Set(products.map((p) => p.id)).size !== products.length) throw new Error("Duplicate product IDs");
await writeFile("data/drive-furniture.json", JSON.stringify(products, null, 2) + "\n");
await writeFile("data/supplier/drive-image-audit.json", JSON.stringify(sourceAudit, null, 2) + "\n");
console.log(JSON.stringify({ products: products.length, photos: sourceAudit.length,
  groups: Object.fromEntries(["sofas", "armchairs", "sideboards"].map((g) => [g, products.filter((p) => p.collection === g).length])) }));

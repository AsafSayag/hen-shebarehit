#!/usr/bin/env python3
"""Build browser-safe catalog data and responsive copies from downloaded photos."""

from __future__ import annotations

import hashlib
import json
import re
from collections import Counter
from html import unescape
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data/supplier/guber-products.json"
MANIFEST = ROOT / "data/supplier/guber-image-manifest.json"
OUTPUT = ROOT / "data/guber-products.json"
SIZES = (480, 960)
DIMENSION_LIMITS = {"עומק": 150, "גובה": 400, "רוחב": 1000, "אורך": 1000}
TABLE_LABELS = {"מידות", 'מידות בס"מ', "גובה", "רוחב", "עומק", "עומק/רוחב", "אורך / עומק", "תיאור מוצר"}


def normalize_line(line: str) -> str:
    line = unescape(line).strip()
    line = line.replace('מידות בס"מגובה', 'מידות בס"מ · גובה')
    line = re.sub(r"(?<=\S)(גובה|רוחב|עומק|אורך)(?=\s|\d|[–:-])", r" · \1", line)
    line = re.sub(r"(גובה|רוחב|עומק|אורך)(?=\d)", r"\1 ", line)
    return re.sub(r"\s+", " ", line).strip(" ·")


def has_implausible_dimension(line: str) -> bool:
    for label, limit in DIMENSION_LIMITS.items():
        for match in re.finditer(label + r"\s*[–:=-]?\s*(\d+(?:\.\d+)?)", line):
            if float(match.group(1)) > limit:
                return True
    return False


def public_id(source_id: int) -> int:
    digest = hashlib.sha256(f"bedroom-catalog:{source_id}".encode()).digest()
    return 900_000_000 + int.from_bytes(digest[:4], "big") % 100_000_000


def variants_for(record: dict) -> list[dict]:
    original_path = record["path"]
    path = ROOT / "public" / original_path.lstrip("/")
    if not path.is_file():
        raise FileNotFoundError(path)
    if hashlib.sha256(path.read_bytes()).hexdigest() != record["sha256"]:
        raise ValueError(f"Source image changed: {path}")
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source)
        width, height = image.size
        variants: list[dict] = []
        for target_width in SIZES:
            if width <= target_width:
                continue
            target_height = max(1, round(height * target_width / width))
            small = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
            if small.mode not in {"RGB", "RGBA"}:
                has_alpha = image.mode in {"RGBA", "LA"} or "transparency" in image.info
                small = small.convert("RGBA" if has_alpha else "RGB")
            variant_path = path.with_name(path.stem + f"-{target_width}.webp")
            if not variant_path.exists():
                small.save(variant_path, "WEBP", quality=86, method=4)
            variants.append({"src": "/" + str(variant_path.relative_to(ROOT / "public")), "width": target_width, "height": target_height})
        variants.append({"src": original_path, "width": width, "height": height})
        return variants


def main() -> None:
    source_document = json.loads(SOURCE.read_text())
    source = source_document["products"]
    for group, expected in source_document["counts"].items():
        actual = sum(group in product["groups"] for product in source)
        if actual != expected:
            raise RuntimeError(f"Group {group}: {actual} products, expected {expected}")
    if any(not product["name"].strip() or not product["images"] for product in source):
        raise RuntimeError("A source product has no title or images")
    manifest = json.loads(MANIFEST.read_text())
    urls = {image["src"] for product in source for image in product["images"]}
    missing = sorted(urls - manifest.keys())
    if missing:
        raise RuntimeError(f"{len(missing)} images have not been downloaded; first: {missing[0]}")

    image_variants = {}
    for index, url in enumerate(sorted(urls), 1):
        record = manifest[url]
        image_variants[url] = variants_for(record)
        if index % 100 == 0:
            print(f"Prepared {index}/{len(urls)} images", flush=True)

    name_counts = Counter(product["name"] for product in source)
    public_ids = [public_id(product["id"]) for product in source]
    if len(set(public_ids)) != len(public_ids):
        raise RuntimeError("Generated public product IDs are not unique")
    catalog = []
    suspect_dimensions = 0
    for product in source:
        seen: set[str] = set()
        images: list[str] = []
        variants: dict[str, list[dict]] = {}
        for image in product["images"]:
            url = image["src"]
            if url in seen:
                continue
            seen.add(url)
            path = manifest[url]["path"]
            images.append(path)
            variants[path] = image_variants[url]
        details = [normalize_line(line) for line in product["descriptionLines"] or product["shortDescriptionLines"]]
        details = [line for line in details if line and line not in TABLE_LABELS and not re.fullmatch(r"[\d.,\s]+", line)]
        questionable = [line for line in details if has_implausible_dimension(line)]
        if questionable:
            suspect_dimensions += len(questionable)
            details = [line for line in details if line not in questionable]
            details.append("למידה המדויקת, צרו קשר.")
        if not details:
            details = ["לפרטים על המידות והאפשרויות של הדגם, צרו קשר."]
        if any(re.search(r"₪|ש[\"״]ח|מחיר|הנחה|תוספת|%|\d{1,3},\d{3}", line) for line in details):
            raise ValueError(f"Price-like content in product {product['id']}")
        name = product["name"]
        if name_counts[name] > 1:
            doors = re.search(r"\b\d+\s*דלתות\b", " ".join(details))
            if not doors:
                raise ValueError(f"Cannot distinguish duplicate title for product {product['id']}")
            name += " · " + doors.group()
        catalog.append({
            "id": public_id(product["id"]),
            "category": "bedrooms",
            "bedroomGroups": product["groups"],
            "name": name,
            "details": details,
            "images": images,
            "imageVariants": variants,
        })

    OUTPUT.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {len(catalog)} products to {OUTPUT}; omitted {suspect_dimensions} suspect dimension lines", flush=True)


if __name__ == "__main__":
    main()

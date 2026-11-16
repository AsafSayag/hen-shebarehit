#!/usr/bin/env python3
"""Remove unselected Guber photos and their display copies without touching other catalogs."""

from __future__ import annotations

import argparse
import json
from pathlib import Path, PurePosixPath

from guber_image_selection import selected_images


ROOT = Path(__file__).resolve().parents[1]
CATALOG_DIR = ROOT / "public/products/catalog"
SOURCE = ROOT / "data/supplier/guber-products.json"
SELECTION = ROOT / "data/supplier/guber-wardrobe-selection.json"
MANIFEST = ROOT / "data/supplier/guber-image-manifest.json"
OUTPUT = ROOT / "data/guber-products.json"


def strings(value: object):
    if isinstance(value, str):
        yield value
    elif isinstance(value, list):
        for item in value:
            yield from strings(item)
    elif isinstance(value, dict):
        for item in value.values():
            yield from strings(item)


def variants(path: str) -> set[str]:
    original = PurePosixPath(path)
    return {path, *(str(original.with_name(original.stem + f"-{width}.webp")) for width in (480, 960))}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Delete files and update the manifest")
    args = parser.parse_args()

    source = json.loads(SOURCE.read_text())["products"]
    chosen = selected_images(source, SELECTION)
    kept_urls = {image["src"] for images in chosen.values() for image in images}
    manifest = json.loads(MANIFEST.read_text())
    if not kept_urls <= manifest.keys():
        raise ValueError(f"Missing manifest entries: {kept_urls - manifest.keys()}")
    catalog = json.loads(OUTPUT.read_text())
    needed = {path for product in catalog for path in strings({"images": product["images"], "imageVariants": product["imageVariants"]}) if path.startswith("/products/catalog/")}
    kept_paths = {path for url in kept_urls for path in variants(manifest[url]["path"]) if (ROOT / "public" / path.lstrip("/")).is_file()}
    if needed != kept_paths:
        raise ValueError(f"Catalog image paths differ from selected source images: {len(needed - kept_paths)} missing, {len(kept_paths - needed)} extra")

    other_references: set[str] = set()
    for document in (ROOT / "data").rglob("*.json"):
        if document in {OUTPUT, MANIFEST}:
            continue
        other_references.update(path for path in strings(json.loads(document.read_text())) if path.startswith("/products/catalog/"))
    rejected_paths = {path for url, record in manifest.items() if url not in kept_urls for path in variants(record["path"])}
    if rejected_paths & (needed | other_references):
        raise ValueError("An unselected image is referenced by another product or catalog")
    files = sorted(ROOT / "public" / path.lstrip("/") for path in rejected_paths)
    files = [path for path in files if path.is_file()]
    if any(path.parent != CATALOG_DIR or not path.name.startswith("img-") for path in files):
        raise ValueError("Unexpected file outside the catalog image directory")
    bytes_to_remove = sum(path.stat().st_size for path in files)
    print(f"Keep {len(kept_urls)} source photos; remove {len(files)} files ({bytes_to_remove / 1_000_000:.1f} MB)")
    if not args.apply:
        print("Dry run. Pass --apply to remove the files.")
        return
    for path in files:
        path.unlink()
    MANIFEST.write_text(json.dumps({url: manifest[url] for url in sorted(kept_urls)}, ensure_ascii=False, indent=2) + "\n")
    print("Removed unselected photos and updated the image manifest.")


if __name__ == "__main__":
    main()

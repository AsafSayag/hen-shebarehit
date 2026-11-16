#!/usr/bin/env python3
"""Download Guber product photos at a gentle, resumable pace, unchanged."""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

from guber_image_selection import selected_images


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data/supplier/guber-products.json"
MANIFEST = ROOT / "data/supplier/guber-image-manifest.json"
DESTINATION = ROOT / "public/products/catalog"
SELECTION = ROOT / "data/supplier/guber-wardrobe-selection.json"


def save_manifest(records: dict[str, dict]) -> None:
    temporary = MANIFEST.with_suffix(".json.tmp")
    temporary.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n")
    temporary.replace(MANIFEST)


def download(url: str) -> tuple[bytes, int, int, str]:
    parsed = urllib.parse.urlsplit(url)
    encoded_url = urllib.parse.urlunsplit((
        parsed.scheme, parsed.netloc, urllib.parse.quote(parsed.path, safe="/%"), parsed.query, parsed.fragment
    ))
    request = urllib.request.Request(encoded_url, headers={"User-Agent": "Mozilla/5.0", "Accept": "image/*"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                content_type = response.headers.get("Content-Type", "").split(";", 1)[0]
                if not content_type.startswith("image/"):
                    raise ValueError(f"Unexpected content type: {content_type}")
                data = response.read()
            with Image.open(io.BytesIO(data)) as image:
                width, height = image.size
                image.verify()
            return data, width, height, content_type
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as error:
            status = getattr(error, "code", None)
            if attempt == 3 or (status is not None and status not in {429, 500, 502, 503, 504}):
                raise
            time.sleep(20 * (attempt + 1))
    raise RuntimeError("Unreachable retry branch")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--delay", type=float, default=2.5, help="Minimum seconds between requests")
    parser.add_argument("--limit", type=int, default=0, help="Only download this many new images")
    args = parser.parse_args()
    if args.delay < 2:
        parser.error("Delay must be at least two seconds")

    source = json.loads(SOURCE.read_text())
    images_by_product = selected_images(source["products"], SELECTION)
    urls = sorted({image["src"] for images in images_by_product.values() for image in images})
    records: dict[str, dict] = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    pending = [url for url in urls if url not in records or not (ROOT / "public" / records[url]["path"].lstrip("/")).is_file()]
    if args.limit:
        pending = pending[: args.limit]
    DESTINATION.mkdir(parents=True, exist_ok=True)
    print(f"{len(urls)} unique images; {len(pending)} to fetch in this run", flush=True)
    failures: list[tuple[str, str]] = []
    for index, url in enumerate(pending, 1):
        if index > 1:
            time.sleep(args.delay)
        extension = Path(urllib.parse.urlsplit(url).path).suffix.lower()
        if extension not in {".jpg", ".jpeg", ".png", ".webp"}:
            failures.append((url, f"Unsupported extension {extension}"))
            continue
        name = "img-" + hashlib.sha256(url.encode()).hexdigest()[:24] + extension
        target = DESTINATION / name
        try:
            data, width, height, content_type = download(url)
            temporary = target.with_suffix(target.suffix + ".tmp")
            temporary.write_bytes(data)
            temporary.replace(target)
            records[url] = {
                "path": "/products/catalog/" + name,
                "width": width,
                "height": height,
                "bytes": len(data),
                "sha256": hashlib.sha256(data).hexdigest(),
                "contentType": content_type,
            }
        except Exception as error:
            failures.append((url, str(error)))
            print(f"failed {Path(urllib.parse.urlsplit(url).path).name}: {error}", flush=True)
        if index % 20 == 0 or index == len(pending):
            save_manifest(records)
            print(f"processed {index}/{len(pending)}; saved {len(records)}/{len(urls)}; failed {len(failures)}", flush=True)
    save_manifest(records)
    if failures:
        for url, reason in failures[:10]:
            print(f"FAILED {url}: {reason}", flush=True)
        raise SystemExit(f"{len(failures)} images failed; run again to retry")


if __name__ == "__main__":
    main()

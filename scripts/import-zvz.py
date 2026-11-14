"""Build five ZVZ mattress records and download their images one at a time.

The source manifest was checked against the public product pages. RIO is omitted.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "supplier" / "zvz-mattresses.json"
OUTPUT = ROOT / "data" / "zvz-mattresses.json"
IMAGE_DIR = ROOT / "public" / "products" / "zvz"


def build() -> tuple[list[dict], dict[str, str]]:
    source = json.loads(SOURCE.read_text())
    assert len(source) == 5
    assert {item["model"] for item in source} == {"gold", "yellow", "cloud", "waterlily", "carbon"}
    products = []
    image_sources = {}
    for item in source:
        assert item["sizes"] and item["images"]
        images = []
        for index, url in enumerate(item["images"], 1):
            parsed = urlparse(url)
            assert parsed.hostname == "zvzstyle.com" and parsed.path.startswith("/cdn/shop/files/")
            extension = Path(parsed.path).suffix.lower()
            assert extension in {".jpg", ".jpeg", ".png", ".webp"}
            path = f"/products/zvz/{item['model']}-{index}{extension}"
            images.append(path)
            image_sources[path] = url
        products.append({
            "id": item["id"],
            "category": "mattresses",
            "name": item["name"],
            "details": item["details"],
            "sizes": item["sizes"],
            "images": images,
            "sourceUrl": item["sourceUrl"],
        })
    assert len({product["id"] for product in products}) == 5
    return products, image_sources


def download(image_sources: dict[str, str], delay: float) -> None:
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    for index, (path, url) in enumerate(image_sources.items(), 1):
        target = ROOT / "public" / path.lstrip("/")
        if target.exists() and target.stat().st_size > 100:
            continue
        request = Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; catalog-import/1.0)"})
        try:
            with urlopen(request, timeout=40) as response:
                body = response.read()
                content_type = response.headers.get("Content-Type", "")
            if not content_type.startswith("image/") or len(body) < 100:
                raise ValueError(f"Invalid image: {content_type}, {len(body)} bytes")
            target.write_bytes(body)
            print(f"Downloaded {index}/{len(image_sources)}: {path}", flush=True)
        except (HTTPError, URLError, ValueError, TimeoutError) as error:
            print(f"Failed {path}: {error}; stopping", flush=True)
            raise
        time.sleep(delay)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--download", action="store_true")
    parser.add_argument("--delay", type=float, default=1.5)
    args = parser.parse_args()
    products, images = build()
    OUTPUT.write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n")
    print(f"Prepared {len(products)} mattresses and {len(images)} images", flush=True)
    if args.download:
        download(images, args.delay)


if __name__ == "__main__":
    main()

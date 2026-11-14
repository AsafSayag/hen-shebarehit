"""Import the two approved ABPrice catalog categories from saved Store API responses.

The input snapshots are fetched separately. Image downloads run one at a time,
pause between requests, and can be resumed without repeating completed files.
"""

from __future__ import annotations

import argparse
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import time
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlparse, urlunparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / "data" / "supplier"
IMAGE_DIR = ROOT / "public" / "products" / "abprice"
OUTPUT = ROOT / "data" / "products.json"


class DescriptionParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"p", "br", "li", "div"}:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        self.parts.append(data)


def clean_description(source: str) -> list[str]:
    parser = DescriptionParser()
    parser.feed(source)
    content = html.unescape("".join(parser.parts))
    content = content.split("פרטי סימון מוצר:", 1)[0]
    lines = [re.sub(r"\s+", " ", line).strip() for line in content.splitlines()]
    return [
        line
        for line in lines
        if line
        and not any(
            phrase in line
            for phrase in ("משלוח", "מחיר הרכבה")
        )
    ]


def image_url(image: dict) -> str:
    candidates = []
    for entry in image.get("srcset", "").split(", "):
        pieces = entry.rsplit(" ", 1)
        if len(pieces) == 2 and pieces[1].endswith("w"):
            try:
                candidates.append((int(pieces[1][:-1]), pieces[0]))
            except ValueError:
                pass
    suitable = sorted((width, url) for width, url in candidates if width >= 768)
    return suitable[0][1] if suitable else image["src"]


def source_products() -> list[tuple[str, dict]]:
    result = []
    for filename, category in (("chairs.json", "dining-chairs"), ("tables.json", "dining-sets")):
        products = json.loads((SNAPSHOT / filename).read_text())
        result.extend((category, product) for product in products)
    assert len(result) == 94, "Supplier count changed; inspect before importing"
    assert len({product["id"] for _, product in result}) == 94
    return result


def build_data(source: list[tuple[str, dict]]) -> tuple[list[dict], dict[str, str]]:
    image_sources: dict[str, str] = {}
    products = []
    for category, product in source:
        paths = []
        for image in product["images"]:
            url = image_url(image)
            parsed = urlparse(url)
            assert parsed.hostname == "abprice.co.il"
            extension = Path(parsed.path).suffix.lower()
            assert extension in {".webp", ".jpg", ".jpeg", ".png"}
            filename = f"{image['id']}-{Path(parsed.path).stem[-48:]}{extension}"
            path = f"/products/abprice/{filename}"
            paths.append(path)
            if path in image_sources:
                assert image_sources[path] == url
            else:
                image_sources[path] = url
        products.append(
            {
                "id": product["id"],
                "category": category,
                "name": html.unescape(product["name"]),
                "sku": product["sku"],
                "details": clean_description(product["description"]),
                "images": paths,
                "sourceUrl": product["permalink"],
                "supplierPriceIls": product["prices"]["price"],
                "supplierInStock": product["is_in_stock"],
            }
        )
    assert all(product["images"] for product in products)
    return products, image_sources


def download_images(image_sources: dict[str, str], delay: float) -> None:
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    failures = []
    total = len(image_sources)
    for index, (path, url) in enumerate(image_sources.items(), 1):
        target = ROOT / "public" / path.lstrip("/")
        if target.exists() and target.stat().st_size > 100:
            continue
        parsed = urlparse(url)
        encoded_url = urlunparse(parsed._replace(path=quote(parsed.path, safe="/%")))
        request = Request(encoded_url, headers={"User-Agent": "Mozilla/5.0 (compatible; catalog-import/1.0)"})
        try:
            with urlopen(request, timeout=35) as response:
                body = response.read()
                content_type = response.headers.get("Content-Type", "")
            if not content_type.startswith("image/") or len(body) < 100:
                raise ValueError(f"Invalid image: {content_type}, {len(body)} bytes")
            target.write_bytes(body)
            if index % 20 == 0 or index == total:
                print(f"Downloaded {index}/{total} images", flush=True)
        except (HTTPError, URLError, ValueError, TimeoutError) as error:
            failures.append((path, str(error)))
            print(f"Failed {path}: {error}", flush=True)
            if isinstance(error, HTTPError) and error.code in {403, 429}:
                print("Supplier rate limit detected; stopping immediately", flush=True)
                break
        time.sleep(delay)
    if failures:
        raise RuntimeError(f"{len(failures)} images failed; rerun to resume")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--download", action="store_true")
    parser.add_argument("--delay", type=float, default=1.5)
    args = parser.parse_args()
    products, images = build_data(source_products())
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n")
    print(f"Prepared {len(products)} products and {len(images)} unique images", flush=True)
    if args.download:
        download_images(images, args.delay)


if __name__ == "__main__":
    main()

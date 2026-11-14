"""Extract three Englander mattresses from saved public Dr Gav product pages.

Only size options with linked product variants are included. Prices, inventory,
delivery terms and contradictory height values are deliberately excluded.
"""

from __future__ import annotations

import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "data" / "supplier" / "drgav"
OUTPUT = ROOT / "data" / "mattresses.json"
IMAGE_DIR = ROOT / "public" / "products" / "drgav"

MODELS = {
    "lexus": {
        "url": "https://www.dr-gav.co.il/sleep/mattresses/twin-mattresses/englander/0a97d02b",
        "details": ["מערכת קפיצים מבודדים", "שכבת ויסקו אלסטי", "בד סריג נושם"],
        "sizes": ["140 × 190", "160 × 190", "160 × 200"],
        "cover": 2,
    },
    "infinity": {
        "url": "https://www.dr-gav.co.il/sleep/mattresses/twin-mattresses/englander/0f020f95",
        "details": ["מערכת קפיצים מבודדים", "שכבת ויסקו אלסטי", "בד סריג נושם", "טכנולוגיית NO FLIP"],
        "sizes": ["140 × 190", "160 × 190", "160 × 200"],
        "cover": 5,
    },
    "genesis": {
        "url": "https://www.dr-gav.co.il/sleep/mattresses/twin-mattresses/englander/037ee26c",
        "details": ["מערכת קפיצים מבודדים", "שכבת לטקס", "בד סריג נושם", "טכנולוגיית NO FLIP"],
        "sizes": ["140 × 190", "160 × 190", "160 × 200", "180 × 200"],
        "cover": 6,
    },
}


class GalleryParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.images: list[dict] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if tag != "div" or "product-page-gallery" not in (attributes.get("class") or "") or not attributes.get("data-mage-init"):
            return
        gallery = json.loads(attributes["data-mage-init"])["Idus_Product/js/gallery"]
        self.images = gallery["data"]


def extract() -> tuple[list[dict], dict[str, str]]:
    products = []
    image_sources = {}
    for model, config in MODELS.items():
        source = (SOURCE_DIR / f"{model}.html").read_text()
        marker = '"jsonConfig":'
        position = source.find(marker)
        assert position >= 0
        options, _ = json.JSONDecoder().raw_decode(source[position + len(marker):].lstrip())
        size_options = next(attribute for attribute in options["attributes"].values() if attribute["code"] == "size")
        sizes = [item["label"].replace(" X ", " × ") for item in size_options["options"] if item["products"]]
        assert sizes == config["sizes"], f"Inspect changed sizes for {model}: {sizes}"

        gallery = GalleryParser()
        gallery.feed(source)
        assert len(gallery.images) == 6, f"Inspect changed gallery for {model}"
        images = []
        for index, image in enumerate(gallery.images, 1):
            url = image["img"]
            parsed = urlparse(url)
            assert parsed.hostname == "www.dr-gav.co.il"
            extension = Path(parsed.path).suffix.lower()
            assert extension in {".jpg", ".png", ".webp"}
            path = f"/products/drgav/{model}-{index}{extension}"
            images.append(path)
            image_sources[path] = url

        cover = images.pop(config["cover"] - 1)
        images.insert(0, cover)

        products.append({
            "id": int(options["productId"]),
            "category": "mattresses",
            "name": f"מזרן זוגי ENGLANDER {model.upper()}",
            "details": config["details"],
            "sizes": sizes,
            "images": images,
            "sourceUrl": config["url"],
        })
    assert len({item["id"] for item in products}) == 3
    return products, image_sources


def download_images(image_sources: dict[str, str], delay: float) -> None:
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
            print(f"Failed {path}: {error}", flush=True)
            raise
        time.sleep(delay)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--download", action="store_true")
    parser.add_argument("--delay", type=float, default=1.5)
    args = parser.parse_args()
    products, images = extract()
    OUTPUT.write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n")
    print(f"Prepared {len(products)} mattresses and {len(images)} images", flush=True)
    if args.download:
        download_images(images, args.delay)


if __name__ == "__main__":
    main()

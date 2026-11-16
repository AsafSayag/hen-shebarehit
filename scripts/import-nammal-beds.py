"""Import the two requested Nammal bed categories without prices or supplier copy.

Requires Pillow. With --pages-dir, reads previously downloaded HTML files named
<product-id>.html and category files double.html/jewish.html. Otherwise fetches
the current public pages. The normalized source manifest retains option labels
and image URLs so the catalog can be audited later.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
BASE = "https://nammal-sleep.co.il"
CATEGORIES = {
    "double": f"{BASE}/product-category/double-beds/",
    "jewish": f"{BASE}/product-category/jewish-beds/",
}
ATTRIBUTE_LABELS = {
    "בדים": "בד",
    "צורת-הפרדה": "הפרדה",
    "צבע": "צבע",
    "mida": "מידה",
}
ATTRIBUTE_ORDER = ("צורת-הפרדה", "בדים", "צבע", "mida")


def fetch(url: str) -> bytes:
    if not url.startswith(f"{BASE}/"):
        raise ValueError(f"Unexpected image or page host: {url}")
    safe_url = urllib.parse.quote(url, safe=":/?&=%#")
    request = urllib.request.Request(safe_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=45) as response:
        return response.read()


def parse_cards(page: str, category: str) -> list[dict]:
    cards = re.split(r'<div class="jet-woo-products__item ', page)[1:]
    result = []
    for card in cards:
        product_id = re.search(r'data-product-id="(\d+)"', card)
        url = re.search(r'data-url="([^"]+)"', card)
        title = re.search(r'<h2 class="jet-woo-product-title"><a[^>]*>(.*?)</a>', card, re.S)
        thumbnail = re.search(r'<div class="jet-woo-product-thumbnail">.*?<img[^>]+src="([^"]+)"', card, re.S)
        if not all((product_id, url, title, thumbnail)):
            raise ValueError("Incomplete product card in category page")
        if not re.fullmatch(rf"{BASE}/product/[a-z0-9-]+/", url.group(1)):
            raise ValueError(f"Unexpected product URL: {url.group(1)}")
        result.append({
            "sourceId": int(product_id.group(1)),
            "category": category,
            "name": html.unescape(re.sub(r"<[^>]+>", "", title.group(1))).strip(),
            "sourceUrl": url.group(1),
            "thumbnailUrl": html.unescape(thumbnail.group(1)),
        })
    return result


def parse_detail(card: dict, page: str) -> dict:
    match = re.search(r'data-product_variations="([^"]+)', page)
    if not match:
        raise ValueError(f"No variants for {card['sourceId']}")
    raw_variants = json.loads(html.unescape(match.group(1)))
    option_labels: dict[str, dict[str, str]] = {}
    for select in re.finditer(r'<select[^>]+name="(attribute_[^"]+)"[^>]*>(.*?)</select>', page, re.S):
        key = select.group(1)
        option_labels.setdefault(key, {})
        for value, label in re.findall(r'<option[^>]+value="([^"]*)"[^>]*>(.*?)</option>', select.group(2), re.S):
            option_labels[key][value] = html.unescape(re.sub(r"<[^>]+>", "", label)).strip()
    variants = []
    for variation in raw_variants:
        attributes = {}
        for key, value in variation["attributes"].items():
            key_name = urllib.parse.unquote(key.removeprefix("attribute_pa_"))
            label = option_labels.get(key, {}).get(value)
            if not label:
                raise ValueError(f"Missing option label for {card['sourceId']}: {key}={value}")
            attributes[key_name] = label
        image_url = variation["image"].get("full_src")
        if not image_url:
            raise ValueError(f"Missing image for {card['sourceId']}")
        variants.append({"attributes": attributes, "imageUrl": image_url})
    if not variants:
        raise ValueError(f"No visible variants for {card['sourceId']}")
    return {**card, "variants": variants}


def localize_image(url: str) -> tuple[str, list[dict]]:
    digest = hashlib.sha256(url.encode()).hexdigest()[:16]
    folder = ROOT / "public/products/nammal"
    existing = sorted(folder.glob(f"{digest}-*.webp"))
    if existing:
        files = sorted(existing, key=lambda file: int(file.stem.split("-")[-1]))
        variants = []
        for file in files:
            with Image.open(file) as image:
                variants.append({"src": f"/products/nammal/{file.name}", "width": image.width, "height": image.height})
        return variants[-1]["src"], variants
    with Image.open(BytesIO(fetch(url))) as original:
        image = ImageOps.exif_transpose(original).convert("RGBA")
    background = Image.new("RGBA", image.size, "#f1eee8")
    image = Image.alpha_composite(background, image).convert("RGB")
    # The Emily source has a supplier advertising badge below the bed.
    if url.endswith("/כולל-ארגז-מצעים-5.png"):
        image = image.crop((0, 0, image.width, round(image.height * 0.88)))
    folder.mkdir(parents=True, exist_ok=True)
    widths = sorted(set(min(width, image.width) for width in (480, 960, 1500)))
    variants = []
    for width in widths:
        height = round(image.height * width / image.width)
        file = folder / f"{digest}-{width}.webp"
        image.resize((width, height), Image.Resampling.LANCZOS).save(file, format="WEBP", quality=86, method=6)
        variants.append({"src": f"/products/nammal/{file.name}", "width": width, "height": height})
    return variants[-1]["src"], variants


def build_product(source: dict, photos: dict[str, tuple[str, list[dict]]]) -> dict:
    image_urls = list(dict.fromkeys([source["thumbnailUrl"], *(item["imageUrl"] for item in source["variants"])]))
    images = [photos[url][0] for url in image_urls]
    images = list(dict.fromkeys(images))
    image_variants = {photos[url][0]: photos[url][1] for url in image_urls}
    bed_variants = []
    for item in source["variants"]:
        attrs = item["attributes"]
        label = " · ".join(
            f"{ATTRIBUTE_LABELS[key]}: {attrs[key]}" for key in ATTRIBUTE_ORDER if key in attrs
        )
        bed_variants.append({"label": label, "image": photos[item["imageUrl"]][0]})
    model_name = source["name"].replace("מיטה דגם ", "").replace("מיטה יהודית דגם ", "")
    title = f"מיטה {'יהודית' if source['category'] == 'jewish' else 'זוגית'} דגם {model_name}"
    return {
        "id": 700000 + source["sourceId"],
        "category": "beds",
        "bedType": source["category"],
        "name": title,
        "details": [],
        "images": images,
        "imageVariants": image_variants,
        "bedVariants": bed_variants,
        "sourceUrl": source["sourceUrl"],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pages-dir", type=Path, help="Read category and product HTML from this folder")
    args = parser.parse_args()
    cards = []
    for category, url in CATEGORIES.items():
        page = (args.pages_dir / f"{category}.html").read_text() if args.pages_dir else fetch(url).decode()
        cards.extend(parse_cards(page, category))
    if len({card["sourceId"] for card in cards}) != len(cards):
        raise ValueError("Duplicate product IDs across requested categories")
    sources = []
    for card in cards:
        page = (args.pages_dir / f"{card['sourceId']}.html").read_text() if args.pages_dir else fetch(card["sourceUrl"]).decode()
        sources.append(parse_detail(card, page))
    urls = list(dict.fromkeys(url for source in sources for url in [source["thumbnailUrl"], *(item["imageUrl"] for item in source["variants"])]))
    with ThreadPoolExecutor(max_workers=6) as executor:
        photo_results = list(executor.map(localize_image, urls))
    photos = dict(zip(urls, photo_results))
    products = [build_product(source, photos) for source in sources]
    (ROOT / "data/supplier/nammal-beds.json").write_text(json.dumps(sources, ensure_ascii=False, indent=2) + "\n")
    (ROOT / "data/nammal-beds.json").write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n")
    print(f"Imported {len(products)} beds, {sum(len(item['variants']) for item in sources)} variants, {len(urls)} source photos")


if __name__ == "__main__":
    main()

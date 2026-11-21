# Makes small WebP copies (480 and 960 wide, and a full-size WebP capped at 1600) for product photos that the
# importers left without them, so phones download a light file instead of the original (some PNGs are 2.5 MB).
# Writes data/image-variants.json, which lib/products.ts merges in; the importers' own variants always win.
#
# It also saves each framed item of a multi-item photo (imageFocus) as its own small file, in public/products/crops/,
# listed in data/image-crops.json. A plain <img> of the crop loads lazily; drawing the whole photo through an SVG
# viewBox made every one of them load at once. The original photos are not changed.
#
# Run from the project root after an import that adds photos:
#   python3 scripts/build-image-variants.py
# Needs Pillow. Files that already exist are reused, so a second run only does new photos.
import hashlib
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
SOURCES = ["products", "mattresses", "zvz-mattresses", "drive-furniture", "nammal-beds", "guber-products"]
OUTPUT = ROOT / "data" / "image-variants.json"
CROPS_OUTPUT = ROOT / "data" / "image-crops.json"
CROPS = PUBLIC / "products" / "crops"
WIDTHS = (480, 960)
LARGEST = 1600
LARGEST_CROP = 1200


def merged_products():
    """Each product's photos, variants and framing after data/photo-overrides.json, merged as lib/products.ts does."""
    overrides = json.loads((ROOT / "data" / "photo-overrides.json").read_text())
    for name in SOURCES:
        for product in json.loads((ROOT / "data" / f"{name}.json").read_text()):
            override = overrides.get(str(product["id"]), {})
            images = override.get("images", product["images"])
            variants = override["imageVariants"] if "imageVariants" in override else product.get("imageVariants")
            focus = override.get("imageFocus") if "images" in override else (override.get("imageFocus") or product.get("imageFocus"))
            yield images, variants or {}, focus or {}


def number(value):
    """A number written the way JavaScript's String() writes it, so the crop keys match in lib/products.ts."""
    text = repr(float(value))
    return text[:-2] if text.endswith(".0") else text


def crop_key(src, focus):
    return f"{src}|{','.join(number(v) for v in focus)}"


def crop_variants(src, focus):
    with Image.open(PUBLIC / src.lstrip("/")) as opened:
        image = opened.convert("RGBA" if opened.mode in ("RGBA", "LA", "P") else "RGB")
    x, y, w, h = focus
    box = (round(x * image.width), round(y * image.height), round((x + w) * image.width), round((y + h) * image.height))
    crop = image.crop(box)
    name = hashlib.sha1(crop_key(src, focus).encode()).hexdigest()[:16]
    CROPS.mkdir(exist_ok=True)
    widths = [480] if crop.width > 480 else []
    widths.append(min(crop.width, LARGEST_CROP))
    return [save_webp(crop, width, CROPS / f"{name}-{width}.webp") for width in widths]


def save_webp(image: Image.Image, width: int, path: Path):
    if not path.exists():
        height = round(image.height * width / image.width)
        resized = image if width == image.width else image.resize((width, height), Image.Resampling.LANCZOS)
        resized.save(path, "WEBP", quality=84, method=6)
    with Image.open(path) as saved:
        return {"src": "/" + path.relative_to(PUBLIC).as_posix(), "width": saved.width, "height": saved.height}


def variants_for(src: str):
    path = PUBLIC / src.lstrip("/")
    with Image.open(path) as opened:
        image = opened.convert("RGBA" if opened.mode in ("RGBA", "LA", "P") else "RGB")
    variants = [save_webp(image, width, path.with_name(f"{path.stem}-{width}.webp")) for width in WIDTHS if width < image.width]
    # The largest entry is also the <img> fallback, so it is a WebP no wider than LARGEST rather than the original file.
    if path.suffix == ".webp" and image.width <= LARGEST:
        variants.append({"src": src, "width": image.width, "height": image.height})
    else:
        width = min(image.width, LARGEST)
        variants.append(save_webp(image, width, path.with_name(f"{path.stem}-{width}.webp")))
    return variants


def main():
    result, crops = {}, {}
    for images, variants, focus in merged_products():
        for src in images:
            if src not in variants and src not in result:
                result[src] = variants_for(src)
            if src in focus and crop_key(src, focus[src]) not in crops:
                crops[crop_key(src, focus[src])] = crop_variants(src, focus[src])
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=1) + "\n")
    CROPS_OUTPUT.write_text(json.dumps(crops, ensure_ascii=False, indent=1) + "\n")
    print(f"{len(result)} photos -> {OUTPUT.relative_to(ROOT)}, {len(crops)} framed items -> {CROPS_OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

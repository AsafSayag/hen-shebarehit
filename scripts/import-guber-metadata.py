#!/usr/bin/env python3
"""Read the six Guber catalog groups through the public WooCommerce Store API.

Requests are sequential and spaced out. The output is source material for the
catalog builder; it is never imported by browser-facing components directly.
"""

from __future__ import annotations

import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from html import unescape
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data/supplier/guber-products.json"
API = "https://gubergallery.co.il/wp-json/wc/store/v1/products"
GROUPS = {
    "sliding-wardrobes": 121,
    "hinged-wardrobes": 116,
    "holy-closets": 122,
    "imported-wardrobes": 126,
    "bedroom-sets": 119,
    "kids-rooms": 128,
}
DELAY_SECONDS = 5


class DescriptionText(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"p", "div", "br", "tr", "li", "h2", "h3", "h4"}:
            self.parts.append("\n")
        elif tag in {"td", "th"}:
            self.parts.append(" · ")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"p", "div", "tr", "li", "h2", "h3", "h4"}:
            self.parts.append("\n")

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)

    def handle_data(self, data: str) -> None:
        self.parts.append(data)


PRICE_LANGUAGE = re.compile(r"₪|ש[\"״]ח|מחיר|הנחה|הובלה|הרכבה|תוספת|%|\bprice\b", re.I)
BOILERPLATE = {"עיצוב שמרגיש כמו בית", "אפשרויות נוספות"}


def clean_description(html: str) -> list[str]:
    parser = DescriptionText()
    parser.feed(html)
    text = "".join(parser.parts)
    if "מפרט ומידות" in text:
        text = text.split("מפרט ומידות", 1)[1]
    for stop in ("תקנון משלוח", "מדיניות ופרטיות", "הצהרת נגישות"):
        text = text.split(stop, 1)[0]
    lines = [re.sub(r"\s+", " ", line).strip(" ·:;-") for line in text.splitlines()]
    lines = [line for line in lines if line and line not in BOILERPLATE and not PRICE_LANGUAGE.search(line)]
    return list(dict.fromkeys(lines))[:60]


def get_json(url: str) -> tuple[list[dict], int]:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return json.load(response), int(response.headers["X-WP-Total"])
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as error:
            status = getattr(error, "code", None)
            if attempt == 3 or (status is not None and status not in {429, 500, 502, 503, 504}):
                raise
            time.sleep(20 * (attempt + 1))
    raise RuntimeError("Unreachable retry branch")


def main() -> None:
    products: dict[int, dict] = {}
    counts: dict[str, int] = {}
    first_request = True
    for group, category_id in GROUPS.items():
        url = API + "?" + urllib.parse.urlencode({"category": category_id, "per_page": 100, "page": 1})
        if not first_request:
            time.sleep(DELAY_SECONDS)
        first_request = False
        items, total = get_json(url)
        if len(items) != total:
            raise RuntimeError(f"{group}: fetched {len(items)} of {total}; pagination requires review")
        counts[group] = total
        for item in items:
            product_id = item["id"]
            if product_id not in products:
                products[product_id] = {
                    "id": product_id,
                    "name": unescape(item["name"]),
                    "sourceUrl": item["permalink"],
                    "descriptionLines": clean_description(item.get("description", "")),
                    "shortDescriptionLines": clean_description(item.get("short_description", "")),
                    "images": [
                        {"src": image["src"], "alt": image.get("alt", "")}
                        for image in item.get("images", [])
                        if image.get("src")
                    ],
                    "groups": [],
                }
            products[product_id]["groups"].append(group)
        print(f"{group}: {total} listings", flush=True)

    if any(PRICE_LANGUAGE.search(line) for product in products.values()
           for line in product["descriptionLines"] + product["shortDescriptionLines"]):
        raise RuntimeError("Price language remained in a saved description")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps({"counts": counts, "products": list(products.values())}, ensure_ascii=False, indent=2) + "\n")
    print(f"Saved {len(products)} unique products to {OUTPUT}", flush=True)


if __name__ == "__main__":
    main()

"""Validated image choices for wardrobe galleries."""

from __future__ import annotations

import json
from pathlib import Path


WARDROBE_GROUPS = {
    "sliding-wardrobes",
    "hinged-wardrobes",
    "holy-closets",
    "imported-wardrobes",
}


def selected_images(products: list[dict], selection_path: Path) -> dict[int, list[dict]]:
    choices = json.loads(selection_path.read_text())
    expected = {
        str(product["id"])
        for product in products
        if WARDROBE_GROUPS.intersection(product["groups"]) and len(product["images"]) > 1
    }
    if set(choices) != expected:
        raise ValueError(f"Wardrobe selections missing {expected - set(choices)}; extra {set(choices) - expected}")

    result = {}
    for product in products:
        images = product["images"]
        indices = choices.get(str(product["id"]))
        if indices is None:
            result[product["id"]] = images
            continue
        if len(indices) != 3 or any(not isinstance(i, int) or i < 1 or i > len(images) for i in indices):
            raise ValueError(f"Invalid image indices for wardrobe {product['id']}: {indices}")
        selected = [images[i - 1] for i in indices]
        if len({image["src"] for image in selected}) != 3:
            raise ValueError(f"Wardrobe {product['id']} has duplicate selected images")
        result[product["id"]] = selected
    return result

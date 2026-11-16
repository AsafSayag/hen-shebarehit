#!/usr/bin/env python3
"""Give public product images source-neutral URLs without changing their bytes."""

from __future__ import annotations

import json
import re
import uuid
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PRODUCTS = ROOT / "public/products"
DATA_FILES = sorted((ROOT / "data").rglob("*.json"))
NEUTRAL_NAME = re.compile(r"img-[0-9a-f]{32}\.[a-z0-9]+$")


def main() -> None:
    moves: dict[Path, Path] = {}
    for original in sorted(PRODUCTS.rglob("*")):
        if not original.is_file():
            continue
        collection = original.relative_to(PRODUCTS).parts[0]
        if collection == "catalog" or (collection == "edited" and NEUTRAL_NAME.fullmatch(original.name)):
            continue
        target_dir = PRODUCTS / ("edited" if collection == "edited" else "catalog")
        target = target_dir / f"img-{uuid.uuid4().hex}{original.suffix.lower()}"
        moves[original] = target

    if not moves:
        print("No product images need renaming.")
        return

    replacements = {
        "/" + str(old.relative_to(ROOT / "public")): "/" + str(new.relative_to(ROOT / "public"))
        for old, new in moves.items()
    }
    original_data: dict[Path, str] = {}
    updated_data: dict[Path, str] = {}
    for path in DATA_FILES:
        original = path.read_text()
        updated = original
        for old, new in replacements.items():
            updated = updated.replace(old, new)
        if updated != original:
            json.loads(updated)
            original_data[path] = original
            updated_data[path] = updated

    moved: list[tuple[Path, Path]] = []
    written: list[Path] = []
    try:
        for old, new in moves.items():
            new.parent.mkdir(parents=True, exist_ok=True)
            old.rename(new)
            moved.append((old, new))
        for path, content in updated_data.items():
            path.write_text(content)
            written.append(path)
    except Exception:
        for path in written:
            path.write_text(original_data[path])
        for old, new in reversed(moved):
            new.rename(old)
        raise

    for path in sorted(PRODUCTS.iterdir()):
        if path.is_dir() and path.name not in {"catalog", "edited"} and not any(path.iterdir()):
            path.rmdir()
    print(f"Renamed {len(moves)} images and updated {len(updated_data)} JSON files.")


if __name__ == "__main__":
    main()

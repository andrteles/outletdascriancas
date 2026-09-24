#!/usr/bin/env python3
"""Transforma o export Shopify (products_export_1.csv) em src/data/products.json.

Uso: python3 scripts/build-products.py /caminho/para/products_export_1.csv
"""
import csv
import json
import re
import sys
import unicodedata
from pathlib import Path

CATEGORY_KEYWORDS = [
    ("banho de sol", "Macacões"),
    ("kit", "Kits"),
    ("conjunto", "Conjuntos"),
    ("macacão", "Macacões"),
    ("macaquinho", "Macacões"),
    ("pijama", "Pijamas"),
    ("roupão", "Pijamas"),
    ("camiseta", "Camisetas"),
    ("regata", "Camisetas"),
    ("blusa", "Blusas"),
    ("calça", "Calças"),
    ("legging", "Calças"),
    ("meia-calça", "Calças"),
    ("vestido", "Vestidos"),
    ("saia", "Vestidos"),
    ("short-saia", "Vestidos"),
    ("short", "Shorts e Bermudas"),
    ("bermuda", "Shorts e Bermudas"),
    ("jardineira", "Jardineiras e Salopetes"),
    ("salopete", "Jardineiras e Salopetes"),
    ("enxoval", "Enxoval"),
    ("óculos", "Acessórios"),
    ("touca", "Acessórios"),
    ("pantufa", "Calçados"),
    ("sapato", "Calçados"),
    ("tênis", "Calçados"),
    ("cobertor", "Casa e Banho"),
    ("banho", "Casa e Banho"),
    ("maiô", "Praia"),
    ("casaco", "Casacos e Moletons"),
    ("moletom", "Casacos e Moletons"),
]

BABY_SIZES = {"PREM", "RN", "0-3M", "3M", "6M", "9M", "12M", "18M", "24M", "ÚNICO"}


def strip_accents(text: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn")


def slugify(text: str) -> str:
    text = strip_accents(text).lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text


def infer_category(title: str) -> str:
    lowered = title.lower()
    for keyword, category in CATEGORY_KEYWORDS:
        if keyword in lowered:
            return category
    return "Outros"


def infer_age_group(sizes: list[str]) -> str:
    if any(size in BABY_SIZES for size in sizes):
        return "Bebê"
    return "Infantil"


def clean_title(title: str) -> str:
    return re.sub(r"\s*\|\s*Carter'?s\s*$", "", title).strip()


def main() -> None:
    if len(sys.argv) != 2:
        print("uso: build-products.py <caminho-csv>", file=sys.stderr)
        sys.exit(1)

    csv_path = Path(sys.argv[1])
    repo_root = Path(__file__).resolve().parent.parent
    out_path = repo_root / "src" / "data" / "products.json"

    with csv_path.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    grouped: dict[str, list[dict]] = {}
    for row in rows:
        grouped.setdefault(row["Handle"], []).append(row)

    products = []
    skipped = 0
    for handle, group in grouped.items():
        first = group[0]
        try:
            price = float(first["Variant Price"] or 0)
        except ValueError:
            price = 0.0

        if price <= 0 or first.get("Status") != "active" or first.get("Published") != "true":
            skipped += 1
            continue

        compare_raw = first.get("Variant Compare At Price") or ""
        try:
            compare_at = float(compare_raw) if compare_raw else None
        except ValueError:
            compare_at = None
        if compare_at is not None and compare_at <= price:
            compare_at = None

        sizes = []
        for row in group:
            value = (row.get("Option1 Value") or "").strip()
            if value and value not in sizes:
                sizes.append(value)

        images = []
        for row in sorted(group, key=lambda r: int(r["Image Position"] or 0)):
            src = row.get("Image Src")
            if src and src not in images:
                images.append(src)

        title = clean_title(first["Title"])
        category = infer_category(title)
        age_group = infer_age_group(sizes)
        discount_pct = (
            round((1 - price / compare_at) * 100) if compare_at else None
        )

        products.append(
            {
                "handle": handle,
                "slug": slugify(handle),
                "title": title,
                "brand": first.get("Vendor") or "Carter's",
                "price": price,
                "compareAtPrice": compare_at,
                "discountPercent": discount_pct,
                "images": images,
                "sizes": sizes,
                "category": category,
                "ageGroup": age_group,
                "tags": [t.strip() for t in (first.get("Tags") or "").split(",") if t.strip()],
            }
        )

    products.sort(key=lambda p: p["title"])

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"produtos gerados: {len(products)}")
    print(f"ignorados (sem preço/inativos): {skipped}")
    print(f"arquivo: {out_path}")


if __name__ == "__main__":
    main()

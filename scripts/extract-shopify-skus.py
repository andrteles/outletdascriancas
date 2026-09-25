#!/usr/bin/env python3
"""Extrai handle -> {tamanho: sku} do export Shopify, pra casar com o sku que a Zedy
importou por variante (o sku importado é o próprio id de variante da Shopify).

Uso: python3 scripts/extract-shopify-skus.py
Gera: scripts/shopify-skus.json
"""
from __future__ import annotations

import csv
import json
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent
csv_path = repo_root / "scripts" / "products_export_1.csv"
out_path = repo_root / "scripts" / "shopify-skus.json"

with csv_path.open(newline="", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

result: dict[str, dict[str, str]] = {}
for row in rows:
    handle = row["Handle"]
    size = (row.get("Option1 Value") or "").strip()
    sku = (row.get("Variant SKU") or "").strip().lstrip("'")
    if not handle or not size or not sku:
        continue
    result.setdefault(handle, {})[size] = sku

out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"{len(result)} handles com sku extraídos -> {out_path}")

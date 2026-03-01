#!/usr/bin/env python3
"""Generate SQL INSERT statements from RECIPES in seed_recipes.py"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from scripts.seed_recipes import RECIPES


def escape(s):
    return (s or "").replace("'", "''")


def main():
    lines = []
    for r in RECIPES:
        name = escape(r["name"])
        desc = escape(r.get("description", ""))
        inst = escape(r.get("instructions", ""))
        lines.append(
            f"INSERT INTO recipes (name, description, instructions) VALUES (E'{name}', E'{desc}', E'{inst}');"
        )
        for ing in r.get("ingredients", []):
            iname = escape(ing["name"])
            qty = escape(ing["quantity"])
            lines.append(
                f"INSERT INTO ingredients (recipe_id, name, quantity) VALUES (currval(pg_get_serial_sequence('recipes', 'id')), E'{iname}', E'{qty}');"
            )
    out_path = os.path.join(os.path.dirname(__file__), "seed.sql")
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines))
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()

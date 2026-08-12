#!/usr/bin/env python3
"""Empaqueta diplomas generados (AI/arte Maggie) a JPG+WebP+ZIP+manifest.

Fuente preferida: PNGs en /opt/cursor/artifacts/assets/diploma-<id>.png
Fallback: overlay de texto sobre plantillas public/images/diplomas/diploma-*.jpg
"""

from __future__ import annotations

import csv
import json
import zipfile
from datetime import date
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path("/opt/cursor/artifacts/assets")
OUT = ROOT / "public" / "images" / "diplomas" / "generated"
CSV_PATH = ROOT / "public" / "diplomas" / "ulpan-diplomas-bulk-create.csv"

FONT_DISPLAY = "/usr/share/fonts/truetype/noto/NotoSerifDisplay-Bold.ttf"
FONT_BODY_REG = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
INK = (42, 68, 48)

AI_FILES = {
    "unit-alefato": "diploma-unit-alefato-ai.png",
    "unit-palabras": "diploma-unit-palabras.png",
    "unit-gramatica": "diploma-unit-gramatica.png",
    "unit-frases": "diploma-unit-frases.png",
    "unit-sionismo": "diploma-unit-sionismo.png",
    "unit-calendario": "diploma-unit-calendario.png",
    "streak-3": "diploma-streak-3.png",
    "streak-7": "diploma-streak-7.png",
    "streak-14": "diploma-streak-14.png",
    "streak-30": "diploma-streak-30.png",
    "lessons-5": "diploma-lessons-5.png",
    "lessons-10": "diploma-lessons-10.png",
    "lessons-20": "diploma-lessons-20.png",
}


def load_rows() -> list[dict]:
    with CSV_PATH.open(encoding="utf-8") as f:
        return list(csv.DictReader(f))


def save_variants(im: Image.Image, stem: str):
    rgb = im.convert("RGB").resize((1536, 864), Image.Resampling.LANCZOS)
    for dest in [
        OUT,
        ROOT / "images" / "diplomas" / "generated",
        ROOT / "docs" / "images" / "diplomas" / "generated",
    ]:
        dest.mkdir(parents=True, exist_ok=True)
        rgb.save(dest / f"{stem}.jpg", quality=90, optimize=True)
        rgb.save(dest / f"{stem}.webp", "WEBP", quality=86, method=6)


def overlay_fallback(row: dict, student: str, when: str) -> Image.Image:
    kind = row["kind"]
    src = ROOT / "public" / "images" / "diplomas" / f"{row['image_hint']}.jpg"
    im = Image.open(src).convert("RGBA")
    draw = ImageDraw.Draw(im)
    name_f = ImageFont.truetype(FONT_DISPLAY, 40)
    body_f = ImageFont.truetype(FONT_BODY_REG, 28)
    cx, cy = 900, 520
    text = student
    bbox = draw.textbbox((0, 0), text, font=name_f)
    draw.text((cx - (bbox[2] - bbox[0]) / 2, cy), text, font=name_f, fill=INK)
    detail = row["subtitle"] if kind != "streak" else row["title"]
    bbox = draw.textbbox((0, 0), detail, font=body_f)
    draw.text((cx - (bbox[2] - bbox[0]) / 2, cy + 70), detail, font=body_f, fill=INK)
    draw.text((1000, 780), when, font=body_f, fill=INK)
    return im


def main():
    student = "Talmid/a del Ulpan"
    when = date.today().isoformat()
    rows = load_rows()
    meta = []
    OUT.mkdir(parents=True, exist_ok=True)

    for row in rows:
        stem = row["diploma_id"]
        ai = ASSETS / AI_FILES.get(stem, "")
        if ai.exists():
            im = Image.open(ai)
            print("AI ", stem)
        else:
            im = overlay_fallback(row, student, when)
            print("OV ", stem)
        save_variants(im, stem)
        meta.append(
            {
                "diplomaId": stem,
                "kind": row["kind"],
                "title": row["title"],
                "subtitle": row["subtitle"],
                "hebrewTitle": row["hebrew_title"],
                "studentName": student,
                "dateLabel": when,
                "jpg": f"images/diplomas/generated/{stem}.jpg",
                "webp": f"images/diplomas/generated/{stem}.webp",
            }
        )

    zip_path = ROOT / "public" / "diplomas" / "ulpan-diplomas-maggie.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for m in meta:
            zf.write(OUT / f"{m['diplomaId']}.jpg", arcname=f"{m['diplomaId']}.jpg")
    for dest in [ROOT / "diplomas" / "ulpan-diplomas-maggie.zip", ROOT / "docs" / "diplomas" / "ulpan-diplomas-maggie.zip"]:
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(zip_path.read_bytes())

    manifest = {
        "generatedAt": when,
        "studentName": student,
        "count": len(meta),
        "zip": "diplomas/ulpan-diplomas-maggie.zip",
        "diplomas": meta,
    }
    for man in [
        ROOT / "public" / "diplomas" / "generated-manifest.json",
        ROOT / "diplomas" / "generated-manifest.json",
        ROOT / "docs" / "diplomas" / "generated-manifest.json",
    ]:
        man.parent.mkdir(parents=True, exist_ok=True)
        man.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    # sync README copies
    readme = ROOT / "public" / "diplomas" / "README.md"
    for dest in [ROOT / "diplomas" / "README.md", ROOT / "docs" / "diplomas" / "README.md"]:
        if readme.exists():
            dest.write_text(readme.read_text(encoding="utf-8"), encoding="utf-8")

    print(f"\n{len(meta)} diplomas → {OUT}")
    print(f"ZIP → {zip_path}")


if __name__ == "__main__":
    main()

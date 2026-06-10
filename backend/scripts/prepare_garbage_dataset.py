"""Download the Kaggle garbage-classification dataset and split it into
train/val folders in the format Ultralytics classification training expects:

    datasets/garbage/
        train/<class>/*.jpg
        val/<class>/*.jpg

Dataset: https://www.kaggle.com/datasets/asdasdasasdas/garbage-classification
Classes: cardboard, glass, metal, paper, plastic, trash (~2,500 images)

Usage (from backend/):
    .venv\Scripts\python.exe scripts/prepare_garbage_dataset.py
"""

from __future__ import annotations

import random
import shutil
from pathlib import Path

import kagglehub

BACKEND_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BACKEND_ROOT / "datasets" / "garbage"
CLASSES = ("cardboard", "glass", "metal", "paper", "plastic", "trash")
VAL_FRACTION = 0.15
SEED = 42


def find_class_root(download_root: Path) -> Path:
    """Locate the directory that directly contains the class folders."""
    for candidate in [download_root, *download_root.rglob("*")]:
        if not candidate.is_dir():
            continue
        subdirs = {d.name.lower() for d in candidate.iterdir() if d.is_dir()}
        if set(CLASSES).issubset(subdirs):
            return candidate
    raise FileNotFoundError(
        f"Could not find class folders {CLASSES} under {download_root}"
    )


def main() -> None:
    print("Downloading dataset from Kaggle (cached after first run)...")
    download_root = Path(kagglehub.dataset_download("asdasdasasdas/garbage-classification"))
    class_root = find_class_root(download_root)
    print(f"Found classes in: {class_root}")

    rng = random.Random(SEED)
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)

    total_train = total_val = 0
    for cls in CLASSES:
        images = sorted(
            p
            for p in (class_root / cls).iterdir()
            if p.suffix.lower() in (".jpg", ".jpeg", ".png")
        )
        rng.shuffle(images)
        n_val = max(1, int(len(images) * VAL_FRACTION))
        splits = {"val": images[:n_val], "train": images[n_val:]}

        for split, files in splits.items():
            dest = OUTPUT_DIR / split / cls
            dest.mkdir(parents=True, exist_ok=True)
            for src in files:
                shutil.copy2(src, dest / src.name)

        total_train += len(splits["train"])
        total_val += len(splits["val"])
        print(f"  {cls:10s}: {len(splits['train'])} train / {len(splits['val'])} val")

    print(f"Done. {total_train} train / {total_val} val images in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()

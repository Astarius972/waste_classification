"""Train a YOLOv8 classification model on the prepared garbage dataset and
copy the best weights to models/garbage_classifier.pt.

Run scripts/prepare_garbage_dataset.py first.

Usage (from backend/):
    .venv\Scripts\python.exe scripts/train_garbage_classifier.py
"""

from __future__ import annotations

import shutil
from pathlib import Path

from ultralytics import YOLO

BACKEND_ROOT = Path(__file__).resolve().parent.parent
DATASET_DIR = BACKEND_ROOT / "datasets" / "garbage"
OUTPUT_MODEL = BACKEND_ROOT / "models" / "garbage_classifier.pt"

EPOCHS = 20
IMGSZ = 224
BATCH = 32


def main() -> None:
    if not DATASET_DIR.exists():
        raise SystemExit("Dataset not found. Run scripts/prepare_garbage_dataset.py first.")

    model = YOLO("yolov8n-cls.pt")
    results = model.train(
        data=str(DATASET_DIR),
        epochs=EPOCHS,
        imgsz=IMGSZ,
        batch=BATCH,
        project=str(BACKEND_ROOT / "runs"),
        name="garbage_cls",
        exist_ok=True,
        patience=8,
    )

    best = Path(results.save_dir) / "weights" / "best.pt"
    OUTPUT_MODEL.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(best, OUTPUT_MODEL)
    print(f"\nBest weights copied to {OUTPUT_MODEL}")
    print("Restart the backend to start using the classifier.")


if __name__ == "__main__":
    main()

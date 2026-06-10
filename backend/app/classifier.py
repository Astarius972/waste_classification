"""Second-stage garbage material classifier (YOLOv8-cls trained on the
Kaggle garbage-classification dataset: cardboard/glass/metal/paper/plastic/trash).

The detector finds objects and boxes; this classifier looks at each cropped
box (or the whole image when nothing was detected) and decides the material.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np

from app.config import CLASSIFIER_MIN_CONF, CLASSIFIER_PATH

# Classifier class -> canonical knowledge-base label understood by lookup_waste_info.
CLS_LABEL_TO_LOOKUP = {
    "cardboard": "paper",
    "paper": "paper",
    "glass": "glass bottle",
    "metal": "can",
    "plastic": "plastic bottle",
    "trash": "unknown",
}

# Padding added around a detection box before classification, as a fraction
# of the box size — context helps the classifier.
CROP_PADDING = 0.12


class GarbageClassifier:
    def __init__(self, model_path: Path, min_conf: float) -> None:
        from ultralytics import YOLO

        self.model = YOLO(str(model_path))
        self.min_conf = min_conf

    def classify(self, image_bgr: np.ndarray) -> tuple[str, float] | None:
        """Return (class_label, confidence) or None when unsure."""
        if image_bgr.size == 0:
            return None
        results = self.model.predict(source=image_bgr, imgsz=224, verbose=False)
        probs = results[0].probs
        if probs is None:
            return None
        label = str(results[0].names[int(probs.top1)]).lower()
        conf = float(probs.top1conf)
        if conf < self.min_conf:
            return None
        return label, conf

    def classify_crop(
        self, image_bgr: np.ndarray, bbox: tuple[int, int, int, int]
    ) -> tuple[str, float] | None:
        height, width = image_bgr.shape[:2]
        x1, y1, x2, y2 = bbox
        pad_x = int((x2 - x1) * CROP_PADDING)
        pad_y = int((y2 - y1) * CROP_PADDING)
        x1 = max(0, x1 - pad_x)
        y1 = max(0, y1 - pad_y)
        x2 = min(width, x2 + pad_x)
        y2 = min(height, y2 + pad_y)
        if x2 <= x1 or y2 <= y1:
            return None
        return self.classify(image_bgr[y1:y2, x1:x2])


def create_classifier() -> GarbageClassifier | None:
    """Load the trained classifier if its weights exist, else None."""
    if not CLASSIFIER_PATH.exists():
        return None
    return GarbageClassifier(CLASSIFIER_PATH, CLASSIFIER_MIN_CONF)

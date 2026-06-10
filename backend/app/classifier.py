"""Second-stage garbage material classifier.

An ImageNet-pretrained torchvision model (MobileNetV2 or EfficientNetB0)
fine-tuned on the Kaggle garbage-classification dataset
(cardboard/glass/metal/paper/plastic/trash).

The detector finds objects and boxes; this classifier looks at each cropped
box (or the whole image when nothing was detected) and decides the material.
"""

from __future__ import annotations

from pathlib import Path

import cv2
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

IMAGENET_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
IMAGENET_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)


class GarbageClassifier:
    def __init__(self, model_path: Path, min_conf: float) -> None:
        import torch
        from torchvision import models

        checkpoint = torch.load(model_path, map_location="cpu", weights_only=True)
        arch = checkpoint["arch"]
        self.classes: list[str] = list(checkpoint["classes"])

        if arch == "mobilenet_v2":
            model = models.mobilenet_v2(weights=None)
            model.classifier[1] = torch.nn.Linear(model.last_channel, len(self.classes))
        elif arch == "efficientnet_b0":
            model = models.efficientnet_b0(weights=None)
            model.classifier[1] = torch.nn.Linear(
                model.classifier[1].in_features, len(self.classes)
            )
        else:
            raise ValueError(f"Unsupported arch in checkpoint: {arch}")

        model.load_state_dict(checkpoint["state_dict"])
        model.eval()
        self.model = model
        self.torch = torch
        self.min_conf = min_conf

    def _preprocess(self, image_bgr: np.ndarray):
        """BGR uint8 -> normalized float tensor (1, 3, 224, 224)."""
        rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
        # Resize shorter side to 256, then center-crop 224 (matches val transform).
        h, w = rgb.shape[:2]
        scale = 256 / min(h, w)
        rgb = cv2.resize(rgb, (round(w * scale), round(h * scale)), interpolation=cv2.INTER_LINEAR)
        h, w = rgb.shape[:2]
        top = (h - 224) // 2
        left = (w - 224) // 2
        rgb = rgb[top : top + 224, left : left + 224]

        arr = rgb.astype(np.float32) / 255.0
        arr = (arr - IMAGENET_MEAN) / IMAGENET_STD
        tensor = self.torch.from_numpy(arr.transpose(2, 0, 1)).unsqueeze(0)
        return tensor

    def classify(self, image_bgr: np.ndarray) -> tuple[str, float] | None:
        """Return (class_label, confidence) or None when unsure."""
        if image_bgr.size == 0 or min(image_bgr.shape[:2]) < 16:
            return None
        tensor = self._preprocess(image_bgr)
        with self.torch.no_grad():
            probs = self.torch.softmax(self.model(tensor)[0], dim=0)
        conf, idx = probs.max(dim=0)
        if float(conf) < self.min_conf:
            return None
        return self.classes[int(idx)], float(conf)

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
    try:
        return GarbageClassifier(CLASSIFIER_PATH, CLASSIFIER_MIN_CONF)
    except Exception as exc:  # noqa: BLE001 — old/incompatible checkpoint formats
        print(f"WARNING: could not load classifier from {CLASSIFIER_PATH}: {exc}")
        return None

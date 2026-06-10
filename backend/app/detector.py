"""YOLO-based waste detection with Ultralytics or OpenCV YOLOv3 backends."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Protocol

import cv2
import numpy as np

from app.config import (
    CONFIDENCE_THRESHOLD,
    DETECTOR_ENGINE,
    INFERENCE_IMGSZ,
    IOU_THRESHOLD,
    MODEL_PATH,
    YOLOV3_CONFIG,
    YOLOV3_NAMES,
    YOLOV3_WEIGHTS,
)


@dataclass
class Detection:
    label: str
    confidence: float
    bbox: tuple[int, int, int, int]  # x1, y1, x2, y2


class DetectorBackend(Protocol):
    def detect(self, image_bgr: np.ndarray) -> list[Detection]: ...


class UltralyticsDetector:
    """YOLOv8+ via ultralytics — recommended for training and inference."""

    def __init__(self, model_path: Path, conf: float, iou: float, imgsz: int) -> None:
        from ultralytics import YOLO

        self.model = YOLO(str(model_path))
        self.conf = conf
        self.iou = iou
        self.imgsz = imgsz

    def detect(self, image_bgr: np.ndarray) -> list[Detection]:
        results = self.model.predict(
            source=image_bgr,
            conf=self.conf,
            iou=self.iou,
            imgsz=self.imgsz,
            max_det=20,
            agnostic_nms=True,
            verbose=False,
        )
        detections: list[Detection] = []
        for result in results:
            if result.boxes is None:
                continue
            names = result.names or {}
            for box in result.boxes:
                cls_id = int(box.cls[0])
                raw_label = names.get(cls_id) if isinstance(names, dict) else None
                if raw_label is None and isinstance(names, (list, tuple)) and cls_id < len(names):
                    raw_label = names[cls_id]
                label = str(raw_label).strip() if raw_label is not None else f"class_{cls_id}"
                confidence = float(box.conf[0])
                x1, y1, x2, y2 = (int(v) for v in box.xyxy[0].tolist())
                detections.append(
                    Detection(label=label, confidence=confidence, bbox=(x1, y1, x2, y2))
                )
        return detections


class YoloV3OpenCVDetector:
    """Classic YOLOv3 using OpenCV DNN module (Darknet weights)."""

    def __init__(
        self,
        weights: Path,
        config: Path,
        names_file: Path,
        conf: float,
    ) -> None:
        if not weights.exists():
            raise FileNotFoundError(
                f"YOLOv3 weights not found at {weights}. See backend/models/README.md"
            )
        self.net = cv2.dnn.readNet(str(weights), str(config))
        self.net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
        self.net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)
        self.conf = conf
        self.class_names = self._load_names(names_file)
        self.output_layers = self.net.getUnconnectedOutLayersNames()

    @staticmethod
    def _load_names(path: Path) -> list[str]:
        if not path.exists():
            return []
        return [line.strip() for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]

    def detect(self, image_bgr: np.ndarray) -> list[Detection]:
        height, width = image_bgr.shape[:2]
        blob = cv2.dnn.blobFromImage(
            image_bgr, 1 / 255.0, (416, 416), swapRB=True, crop=False
        )
        self.net.setInput(blob)
        outputs = self.net.forward(self.output_layers)

        boxes: list[list[int]] = []
        confidences: list[float] = []
        class_ids: list[int] = []

        for output in outputs:
            for detection in output:
                scores = detection[5:]
                class_id = int(np.argmax(scores))
                confidence = float(scores[class_id])
                if confidence < self.conf:
                    continue
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)
                x = int(center_x - w / 2)
                y = int(center_y - h / 2)
                boxes.append([x, y, w, h])
                confidences.append(confidence)
                class_ids.append(class_id)

        indices = cv2.dnn.NMSBoxes(boxes, confidences, self.conf, 0.4)
        results: list[Detection] = []
        if len(indices) == 0:
            return results

        for i in np.array(indices).flatten():
            x, y, w, h = boxes[i]
            label = (
                self.class_names[class_ids[i]]
                if class_ids[i] < len(self.class_names)
                else str(class_ids[i])
            )
            results.append(
                Detection(
                    label=label,
                    confidence=confidences[i],
                    bbox=(x, y, x + w, y + h),
                )
            )
        return results


def create_detector() -> DetectorBackend:
    if DETECTOR_ENGINE == "yolov3_opencv":
        return YoloV3OpenCVDetector(
            YOLOV3_WEIGHTS, YOLOV3_CONFIG, YOLOV3_NAMES, CONFIDENCE_THRESHOLD
        )
    return UltralyticsDetector(
        MODEL_PATH, CONFIDENCE_THRESHOLD, IOU_THRESHOLD, INFERENCE_IMGSZ
    )


def decode_image_bytes(data: bytes) -> np.ndarray:
    arr = np.frombuffer(data, dtype=np.uint8)
    image = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("Could not decode image")
    return image

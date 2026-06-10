"""Configuration loaded from environment variables."""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(BACKEND_ROOT / ".env")

API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

DETECTOR_ENGINE = os.getenv("DETECTOR_ENGINE", "ultralytics")
MODEL_PATH = BACKEND_ROOT / os.getenv("MODEL_PATH", "models/yolov8s.pt")
YOLOV3_WEIGHTS = BACKEND_ROOT / os.getenv("YOLOV3_WEIGHTS", "models/yolov3.weights")
YOLOV3_CONFIG = BACKEND_ROOT / os.getenv("YOLOV3_CONFIG", "models/yolov3.cfg")
YOLOV3_NAMES = BACKEND_ROOT / os.getenv("YOLOV3_NAMES", "models/coco.names")
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.25"))
INFERENCE_IMGSZ = int(os.getenv("INFERENCE_IMGSZ", "960"))
IOU_THRESHOLD = float(os.getenv("IOU_THRESHOLD", "0.45"))

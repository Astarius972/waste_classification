"""FastAPI application for waste detection."""

from __future__ import annotations

import base64
from typing import Any

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.classifier import CLS_LABEL_TO_LOOKUP, create_classifier
from app.config import CORS_ORIGINS, MIN_LABEL_CONFIDENCE
from app.detector import create_detector, decode_image_bytes
from app.waste_info import lookup_waste_info

app = FastAPI(
    title="Waste Detector API",
    description="Detect waste in images and return environmental information.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = None
classifier = None


@app.on_event("startup")
def load_model() -> None:
    global detector, classifier
    detector = create_detector()
    classifier = create_classifier()


class FramePayload(BaseModel):
    image: str = Field(..., description="Base64-encoded image (with or without data URL prefix)")


def _enrich_detection(
    label: str,
    confidence: float,
    bbox: tuple[int, int, int, int],
    trusted: bool = False,
) -> dict[str, Any]:
    safe_label = (label or "").strip() or "unknown"
    # Low-confidence class predictions are unreliable: report "unknown object"
    # instead of a possibly wrong label, but keep the bounding box.
    # Labels confirmed by the material classifier are trusted as-is.
    if not trusted and confidence < MIN_LABEL_CONFIDENCE:
        safe_label = "unknown"
    info = lookup_waste_info(safe_label)
    return {
        "label": safe_label,
        "waste_key": info.waste_key,
        "material": info.material,
        "confidence": round(confidence, 4),
        "bbox": {"x1": bbox[0], "y1": bbox[1], "x2": bbox[2], "y2": bbox[3]},
        "waste": {
            "category": info.category,
            "decomposition_time": info.decomposition_time,
            "environmental_impact": info.environmental_impact,
            "recycling_recommendations": info.recycling_recommendations,
            "disposal_methods": info.disposal_methods,
        },
    }


def _run_detection(image_bytes: bytes) -> list[dict[str, Any]]:
    if detector is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    try:
        image = decode_image_bytes(image_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    raw = detector.detect(image)
    results: list[dict[str, Any]] = []
    for d in raw:
        # Second stage: the material classifier looks at the cropped box and,
        # when confident, overrides the generic COCO label with the material.
        cls = classifier.classify_crop(image, d.bbox) if classifier else None
        if cls is not None:
            cls_label, cls_conf = cls
            lookup_label = CLS_LABEL_TO_LOOKUP.get(cls_label, "unknown")
            results.append(_enrich_detection(lookup_label, cls_conf, d.bbox, trusted=True))
        else:
            results.append(_enrich_detection(d.label, d.confidence, d.bbox))

    # Nothing detected (common for close-up shots of trash): classify the
    # whole image and return one full-frame result when confident.
    if not results and classifier is not None:
        cls = classifier.classify(image)
        if cls is not None:
            cls_label, cls_conf = cls
            lookup_label = CLS_LABEL_TO_LOOKUP.get(cls_label, "unknown")
            if lookup_label != "unknown":
                h, w = image.shape[:2]
                results.append(
                    _enrich_detection(lookup_label, cls_conf, (0, 0, w, h), trusted=True)
                )
    return results


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/detect/upload")
async def detect_upload(file: UploadFile = File(...)) -> dict[str, Any]:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    data = await file.read()
    detections = _run_detection(data)
    return {"detections": detections, "count": len(detections)}


@app.post("/api/detect/frame")
async def detect_frame(payload: FramePayload) -> dict[str, Any]:
    raw = payload.image
    if "," in raw:
        raw = raw.split(",", 1)[1]
    try:
        data = base64.b64decode(raw)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid base64 image") from exc
    detections = _run_detection(data)
    return {"detections": detections, "count": len(detections)}

import type { BoundingBox } from "@/types/detection";

export interface DisplayMetrics {
  scale: number;
  offsetX: number;
  offsetY: number;
  displayWidth: number;
  displayHeight: number;
}

/** Map bbox from source image pixels to CSS display coords (object-cover). */
export function getCoverMetrics(
  sourceWidth: number,
  sourceHeight: number,
  displayWidth: number,
  displayHeight: number,
): DisplayMetrics {
  if (!sourceWidth || !sourceHeight || !displayWidth || !displayHeight) {
    return { scale: 1, offsetX: 0, offsetY: 0, displayWidth, displayHeight };
  }

  const sourceAspect = sourceWidth / sourceHeight;
  const displayAspect = displayWidth / displayHeight;

  if (sourceAspect > displayAspect) {
    const scale = displayHeight / sourceHeight;
    return {
      scale,
      offsetX: (displayWidth - sourceWidth * scale) / 2,
      offsetY: 0,
      displayWidth,
      displayHeight,
    };
  }

  const scale = displayWidth / sourceWidth;
  return {
    scale,
    offsetX: 0,
    offsetY: (displayHeight - sourceHeight * scale) / 2,
    displayWidth,
    displayHeight,
  };
}

export function mapBBoxToDisplay(
  bbox: BoundingBox,
  metrics: DisplayMetrics,
): { left: number; top: number; width: number; height: number } {
  const left = metrics.offsetX + bbox.x1 * metrics.scale;
  const top = metrics.offsetY + bbox.y1 * metrics.scale;
  const width = (bbox.x2 - bbox.x1) * metrics.scale;
  const height = (bbox.y2 - bbox.y1) * metrics.scale;
  return { left, top, width, height };
}

/** Map bbox from source image pixels to CSS display coords (object-contain). */
export function getContainMetrics(
  sourceWidth: number,
  sourceHeight: number,
  displayWidth: number,
  displayHeight: number,
): DisplayMetrics {
  if (!sourceWidth || !sourceHeight || !displayWidth || !displayHeight) {
    return { scale: 1, offsetX: 0, offsetY: 0, displayWidth, displayHeight };
  }

  const scale = Math.min(displayWidth / sourceWidth, displayHeight / sourceHeight);
  return {
    scale,
    offsetX: (displayWidth - sourceWidth * scale) / 2,
    offsetY: (displayHeight - sourceHeight * scale) / 2,
    displayWidth,
    displayHeight,
  };
}

function iou(a: BoundingBox, b: BoundingBox): number {
  const x1 = Math.max(a.x1, b.x1);
  const y1 = Math.max(a.y1, b.y1);
  const x2 = Math.min(a.x2, b.x2);
  const y2 = Math.min(a.y2, b.y2);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  if (inter <= 0) return 0;
  const areaA = (a.x2 - a.x1) * (a.y2 - a.y1);
  const areaB = (b.x2 - b.x1) * (b.y2 - b.y1);
  return inter / (areaA + areaB - inter);
}

/**
 * Smooth bounding boxes between consecutive camera scans to reduce jitter.
 * New detections matching a previous one (same waste type, IoU > 0.3) get an
 * exponentially smoothed box instead of jumping to the new position.
 */
export function stabilizeDetections<
  T extends { bbox: BoundingBox; waste_key?: string; label: string },
>(previous: T[], next: T[], alpha = 0.6): T[] {
  if (previous.length === 0) return next;
  return next.map((det) => {
    const match = previous.find(
      (prev) =>
        (prev.waste_key ?? prev.label) === (det.waste_key ?? det.label) &&
        iou(prev.bbox, det.bbox) > 0.3,
    );
    if (!match) return det;
    const blend = (a: number, b: number) => Math.round(a * alpha + b * (1 - alpha));
    return {
      ...det,
      bbox: {
        x1: blend(det.bbox.x1, match.bbox.x1),
        y1: blend(det.bbox.y1, match.bbox.y1),
        x2: blend(det.bbox.x2, match.bbox.x2),
        y2: blend(det.bbox.y2, match.bbox.y2),
      },
    };
  });
}

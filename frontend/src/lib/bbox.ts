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

export function getWasteLabel(label: string, category?: string): string {
  const safe = (label || "").trim();
  if (safe && safe !== "undefined" && safe !== "null") return safe;
  if (category?.trim()) return category;
  return "object";
}

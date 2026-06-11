"use client";

import { getContainMetrics, getCoverMetrics, mapBBoxToDisplay } from "@/lib/bbox";
import { resolveMaterial, resolveWasteKey } from "@/lib/waste";
import type { WasteMaterial } from "@/types/detection";
import { useI18n } from "@/i18n/I18nProvider";
import type { Detection } from "@/types/detection";
import { useEffect, useRef } from "react";

// Consistent box color per material category so users learn the color coding.
const MATERIAL_HUES: Record<WasteMaterial, number> = {
  plastic: 210, // blue
  metal: 45, // amber
  glass: 180, // cyan
  paper: 30, // orange
  organic: 130, // green
  hazardous: 0, // red
  unknown: 270, // purple
};

interface DetectionOverlayProps {
  detections: Detection[];
  sourceWidth: number;
  sourceHeight: number;
  fit?: "cover" | "contain";
  className?: string;
}

export function DetectionOverlay({
  detections,
  sourceWidth,
  sourceHeight,
  fit = "cover",
  className = "",
}: DetectionOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const draw = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      if (!sourceWidth || !sourceHeight || detections.length === 0) return;

      const metrics =
        fit === "contain"
          ? getContainMetrics(sourceWidth, sourceHeight, width, height)
          : getCoverMetrics(sourceWidth, sourceHeight, width, height);

      detections.forEach((detection) => {
        const box = mapBBoxToDisplay(detection.bbox, metrics);
        const { left, top, width: wWidth, height: wHeight } = box;

        const wasteKey = resolveWasteKey(detection.label, detection.waste_key);
        const material = resolveMaterial(wasteKey, detection.material);
        const label = t.materials[material];
        const pct = Math.round(detection.confidence * 100);
        const hue = MATERIAL_HUES[material];

        // Subtle tinted fill + thin outline
        ctx.fillStyle = `hsla(${hue}, 85%, 55%, 0.08)`;
        ctx.fillRect(left, top, wWidth, wHeight);
        ctx.strokeStyle = `hsla(${hue}, 90%, 60%, 0.55)`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(left, top, wWidth, wHeight);

        // Glowing corner brackets (scanner style)
        const corner = Math.min(22, wWidth * 0.25, wHeight * 0.25);
        ctx.strokeStyle = `hsla(${hue}, 95%, 62%, 1)`;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.shadowColor = `hsla(${hue}, 95%, 60%, 0.8)`;
        ctx.shadowBlur = 8;
        const corners: [number, number, number, number][] = [
          [left, top + corner, left, top],
          [left, top, left + corner, top],
          [left + wWidth - corner, top, left + wWidth, top],
          [left + wWidth, top, left + wWidth, top + corner],
          [left, top + wHeight - corner, left, top + wHeight],
          [left, top + wHeight, left + corner, top + wHeight],
          [left + wWidth - corner, top + wHeight, left + wWidth, top + wHeight],
          [left + wWidth, top + wHeight, left + wWidth, top + wHeight - corner],
        ];
        for (let c = 0; c < corners.length; c += 2) {
          ctx.beginPath();
          ctx.moveTo(corners[c][0], corners[c][1]);
          ctx.lineTo(corners[c][2], corners[c][3]);
          ctx.lineTo(corners[c + 1][2], corners[c + 1][3]);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;

        // Label pill with confidence
        const tag = `${label}  ${pct}%`;
        ctx.font = "700 12px system-ui, sans-serif";
        const tagWidth = ctx.measureText(tag).width + 18;
        const tagHeight = 24;
        const tagY = top - tagHeight - 6 > 0 ? top - tagHeight - 6 : top + 6;
        const tagX = Math.max(0, Math.min(left, width - tagWidth));

        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(tagX, tagY, tagWidth, tagHeight, 12);
        } else {
          ctx.rect(tagX, tagY, tagWidth, tagHeight);
        }
        ctx.fillStyle = `hsla(${hue}, 75%, 30%, 0.92)`;
        ctx.fill();
        ctx.strokeStyle = `hsla(${hue}, 90%, 60%, 0.6)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.fillText(tag, tagX + 9, tagY + 16);
      });
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(container);
    return () => observer.disconnect();
  }, [detections, sourceWidth, sourceHeight, fit, t]);

  return (
    <div ref={containerRef} className={`pointer-events-none absolute inset-0 ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

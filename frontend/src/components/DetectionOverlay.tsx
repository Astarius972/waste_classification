"use client";

import { getContainMetrics, getCoverMetrics, getWasteLabel, mapBBoxToDisplay } from "@/lib/bbox";
import { getWasteTranslation, resolveWasteKey } from "@/lib/waste";
import { useI18n } from "@/i18n/I18nProvider";
import type { Detection } from "@/types/detection";
import { useEffect, useRef } from "react";

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

      detections.forEach((detection, index) => {
        const box = mapBBoxToDisplay(detection.bbox, metrics);
        const { left, top, width: wWidth, height: wHeight } = box;

        const wasteKey = resolveWasteKey(detection.label, detection.waste_key);
        const info = getWasteTranslation(wasteKey, t.waste, t.unknownWaste, detection.waste);
        const label = getWasteLabel(detection.label, info.category);
        const pct = Math.round(detection.confidence * 100);

        const hue = (index * 67) % 360;
        ctx.strokeStyle = `hsla(${hue}, 90%, 55%, 0.95)`;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(left, top, wWidth, wHeight);

        const tag = `${label} ${pct}%`;
        ctx.font = "600 12px system-ui, sans-serif";
        const tagWidth = ctx.measureText(tag).width + 12;
        const tagHeight = 22;
        const tagY = top - tagHeight > 0 ? top - tagHeight : top + 4;

        ctx.fillStyle = `hsla(${hue}, 85%, 42%, 0.92)`;
        ctx.fillRect(left, tagY, tagWidth, tagHeight);
        ctx.fillStyle = "#fff";
        ctx.fillText(tag, left + 6, tagY + 15);
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

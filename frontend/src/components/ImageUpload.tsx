"use client";

import { useCallback, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { detectUpload } from "@/lib/api";
import type { Detection } from "@/types/detection";
import { DetectionOverlay } from "./DetectionOverlay";
import { DetectionResults } from "./DetectionResults";

export function ImageUpload() {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sourceSize, setSourceSize] = useState({ width: 0, height: 0 });
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setLoading(true);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      const img = new Image();
      img.onload = () => setSourceSize({ width: img.naturalWidth, height: img.naturalHeight });
      img.src = objectUrl;

      try {
        const result = await detectUpload(file);
        setDetections(result.detections);
      } catch (err) {
        setError(err instanceof Error ? err.message : t.results.failed);
        setDetections([]);
      } finally {
        setLoading(false);
      }
    },
    [t.results.failed],
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div
        className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-400/30 bg-emerald-950/20 px-4 py-10 transition hover:border-emerald-400/60 sm:rounded-3xl sm:px-6 sm:py-12"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file?.type.startsWith("image/")) void handleFile(file);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <p className="text-center text-sm font-medium text-emerald-100">{t.scanner.dropzone}</p>
        <p className="mt-1 text-center text-xs text-slate-400">{t.scanner.dropzoneHint}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
      </div>

      {preview && (
        <div
          ref={containerRef}
          className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 sm:rounded-3xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Upload preview"
            className="max-h-[60vh] w-full object-contain bg-black/50 sm:max-h-80"
            onLoad={(e) => {
              const img = e.currentTarget;
              setSourceSize({ width: img.naturalWidth, height: img.naturalHeight });
            }}
          />
          <DetectionOverlay
            detections={detections}
            sourceWidth={sourceSize.width}
            sourceHeight={sourceSize.height}
            fit="contain"
          />
        </div>
      )}

      <DetectionResults detections={detections} loading={loading} error={error} />
    </div>
  );
}

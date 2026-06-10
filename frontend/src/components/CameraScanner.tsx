"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatMessage, useI18n } from "@/i18n/I18nProvider";
import { detectFrame } from "@/lib/api";
import { stabilizeDetections } from "@/lib/bbox";
import type { Detection } from "@/types/detection";
import { DetectionOverlay } from "./DetectionOverlay";
import { DetectionResults } from "./DetectionResults";

const SCAN_INTERVAL_MS = 1500;
// Frames are downscaled before upload: the server resizes to ~960px anyway,
// so sending full HD only wastes bandwidth and adds latency on mobile.
const MAX_FRAME_DIM = 1024;
const FRAME_JPEG_QUALITY = 0.85;

async function getCameraStream(facingMode: "environment" | "user") {
  const constraints: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: { ideal: facingMode },
      width: { ideal: 1920, min: 640 },
      height: { ideal: 1080, min: 480 },
      frameRate: { ideal: 30, max: 30 },
    },
  };

  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch {
    return navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
    });
  }
}

export function CameraScanner() {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanGeneration = useRef(0);
  const inFlight = useRef(false);

  const [active, setActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [detections, setDetections] = useState<Detection[]>([]);
  const [sourceSize, setSourceSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setActive(false);
    scanGeneration.current += 1;
    inFlight.current = false;
  }, []);

  const bindStream = useCallback(async (stream: MediaStream) => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = stream;
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
    video.setAttribute("playsinline", "true");
    await video.play();
    setSourceSize({ width: video.videoWidth, height: video.videoHeight });
    setActive(true);
  }, []);

  const startCamera = useCallback(
    async (mode: "environment" | "user" = facingMode) => {
      setCameraError(null);
      setError(null);
      try {
        const stream = await getCameraStream(mode);
        await bindStream(stream);
      } catch {
        setCameraError(t.scanner.cameraError);
      }
    },
    [bindStream, facingMode, t.scanner.cameraError],
  );

  const flipCamera = useCallback(async () => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    setDetections([]);
    if (!active) return;
    scanGeneration.current += 1;
    try {
      const stream = await getCameraStream(next);
      await bindStream(stream);
    } catch {
      setCameraError(t.scanner.cameraError);
    }
  }, [active, bindStream, facingMode, t.scanner.cameraError]);

  const captureFrame = useCallback(async () => {
    const video = videoRef.current;
    const canvas = captureRef.current;
    if (!video || !canvas || video.readyState < 2 || inFlight.current) return;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    if (!videoWidth || !videoHeight) return;

    const downscale = Math.min(1, MAX_FRAME_DIM / Math.max(videoWidth, videoHeight));
    const width = Math.round(videoWidth * downscale);
    const height = Math.round(videoHeight * downscale);

    canvas.width = width;
    canvas.height = height;
    setSourceSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height },
    );

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg", FRAME_JPEG_QUALITY);
    const generation = ++scanGeneration.current;

    inFlight.current = true;
    setLoading(true);
    setError(null);

    try {
      const result = await detectFrame(dataUrl);
      if (generation !== scanGeneration.current) return;
      setDetections((prev) => stabilizeDetections(prev, result.detections));
    } catch (err) {
      if (generation !== scanGeneration.current) return;
      setError(err instanceof Error ? err.message : t.results.failed);
    } finally {
      inFlight.current = false;
      if (generation === scanGeneration.current) setLoading(false);
    }
  }, [t.results.failed]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => void captureFrame(), SCAN_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [active, captureFrame]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl sm:rounded-3xl">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="aspect-[3/4] w-full object-cover sm:aspect-video"
        />
        {active && (
          <DetectionOverlay
            detections={detections}
            sourceWidth={sourceSize.width}
            sourceHeight={sourceSize.height}
          />
        )}
        {!active && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 px-4 text-center">
            <p className="text-sm text-slate-300">{t.scanner.cameraOff}</p>
          </div>
        )}
        {loading && active && detections.length === 0 && (
          <div className="absolute inset-x-0 top-0 bg-emerald-500/25 px-3 py-2 text-center text-xs font-semibold text-emerald-100 backdrop-blur-sm">
            {t.results.analyzing}
          </div>
        )}
        <canvas ref={captureRef} className="hidden" />
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {!active ? (
          <button
            type="button"
            onClick={() => void startCamera()}
            className="min-h-[44px] flex-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-emerald-950 sm:flex-none sm:px-5"
          >
            {t.scanner.startCamera}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => void captureFrame()}
              disabled={loading}
              className="min-h-[44px] flex-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-emerald-950 disabled:opacity-60 sm:flex-none sm:px-5"
            >
              {t.scanner.scanNow}
            </button>
            <button
              type="button"
              onClick={() => void flipCamera()}
              className="min-h-[44px] rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white sm:px-5"
            >
              {t.scanner.flipCamera}
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="min-h-[44px] rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white sm:px-5"
            >
              {t.scanner.stopCamera}
            </button>
          </>
        )}
      </div>

      {cameraError && <p className="text-sm text-red-400">{cameraError}</p>}
      <p className="text-xs text-slate-400">
        {formatMessage(t.scanner.autoScan, { seconds: SCAN_INTERVAL_MS / 1000 })}
      </p>

      <DetectionResults detections={detections} loading={loading && detections.length === 0} error={error} />
    </div>
  );
}

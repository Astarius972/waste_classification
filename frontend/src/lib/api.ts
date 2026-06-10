import type { DetectResponse, Detection } from "@/types/detection";
import { normalizeDetection } from "@/lib/waste";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

function normalizeResponse(data: DetectResponse): DetectResponse {
  const detections = (data.detections ?? [])
    .map((item) => normalizeDetection(item))
    .filter((item): item is Detection => item !== null);
  return { detections, count: detections.length };
}

export async function detectUpload(file: File): Promise<DetectResponse> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(`${API_BASE}/api/detect/upload`, {
    method: "POST",
    body: form,
  });
  const data = await parseResponse<DetectResponse>(response);
  return normalizeResponse(data);
}

export async function detectFrame(base64Image: string): Promise<DetectResponse> {
  const response = await fetch(`${API_BASE}/api/detect/frame`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image }),
  });
  const data = await parseResponse<DetectResponse>(response);
  return normalizeResponse(data);
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

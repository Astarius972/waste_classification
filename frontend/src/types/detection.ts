export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface WasteDetails {
  category: string;
  decomposition_time: string;
  environmental_impact: string;
  recycling_recommendations: string;
  disposal_methods: string;
}

export interface Detection {
  label: string;
  confidence: number;
  bbox: BoundingBox;
  waste_key?: string;
  waste: WasteDetails;
}

export interface DetectResponse {
  detections: Detection[];
  count: number;
}

export type ScanMode = "camera" | "upload";

import type { WasteTranslation } from "@/i18n";
import type { Detection, WasteDetails, WasteMaterial } from "@/types/detection";

const KEY_TO_MATERIAL: Record<string, WasteMaterial> = {
  plastic_bottle: "plastic",
  plastic_bag: "plastic",
  styrofoam: "plastic",
  can: "metal",
  glass_bottle: "glass",
  paper: "paper",
  cup: "paper",
  food_waste: "organic",
  battery: "hazardous",
};

/** Resolve the material sorting group (plastic/metal/glass/paper/organic/...). */
export function resolveMaterial(
  wasteKey: string,
  apiMaterial?: string,
): WasteMaterial {
  if (apiMaterial && apiMaterial !== "unknown") return apiMaterial as WasteMaterial;
  return KEY_TO_MATERIAL[wasteKey] ?? "unknown";
}

const LABEL_TO_KEY: Record<string, string> = {
  bottle: "plastic_bottle",
  "plastic bottle": "plastic_bottle",
  "wine glass": "glass_bottle",
  cup: "cup",
  "cell phone": "battery",
  book: "paper",
  "suitcase": "plastic_bag",
  backpack: "plastic_bag",
  handbag: "plastic_bag",
  banana: "food_waste",
  apple: "food_waste",
  orange: "food_waste",
  sandwich: "food_waste",
  broccoli: "food_waste",
  carrot: "food_waste",
  "hot dog": "food_waste",
  pizza: "food_waste",
  donut: "food_waste",
  cake: "food_waste",
};

export function resolveWasteKey(label: string | undefined | null, apiKey?: string): string {
  if (apiKey && apiKey !== "unknown") return apiKey;
  if (!label || typeof label !== "string") return "unknown";
  const normalized = label.trim().toLowerCase().replace(/_/g, " ");
  if (!normalized || normalized === "undefined" || normalized === "null") return "unknown";
  if (LABEL_TO_KEY[normalized]) return LABEL_TO_KEY[normalized];
  const compact = normalized.replace(/\s+/g, "_");
  if (compact.includes("bottle")) return "plastic_bottle";
  if (compact.includes("bag")) return "plastic_bag";
  if (compact === "can" || compact.includes("can")) return "can";
  if (compact.includes("glass")) return "glass_bottle";
  if (compact.includes("paper") || compact.includes("cardboard")) return "paper";
  if (compact.includes("battery")) return "battery";
  if (compact.includes("foam") || compact.includes("styrofoam")) return "styrofoam";
  return compact in LABEL_TO_KEY ? LABEL_TO_KEY[compact] : "unknown";
}

export function getWasteTranslation(
  wasteKey: string,
  waste: Record<string, WasteTranslation>,
  unknownWaste: WasteTranslation,
  fallback?: WasteDetails,
): WasteTranslation {
  const translated = waste[wasteKey];
  if (translated) return translated;
  if (fallback) {
    return {
      category: fallback.category || unknownWaste.category,
      decomposition_time: fallback.decomposition_time || unknownWaste.decomposition_time,
      environmental_impact: fallback.environmental_impact || unknownWaste.environmental_impact,
      recycling_recommendations:
        fallback.recycling_recommendations || unknownWaste.recycling_recommendations,
      disposal_methods: fallback.disposal_methods || unknownWaste.disposal_methods,
    };
  }
  return unknownWaste;
}

export function normalizeDetection(raw: Partial<Detection> & { waste_key?: string }): Detection | null {
  const label = typeof raw.label === "string" ? raw.label.trim() : "";
  const confidence = typeof raw.confidence === "number" ? raw.confidence : 0;
  const bbox = raw.bbox ?? { x1: 0, y1: 0, x2: 0, y2: 0 };
  const waste = raw.waste ?? {
    category: "",
    decomposition_time: "",
    environmental_impact: "",
    recycling_recommendations: "",
    disposal_methods: "",
  };

  if (!label && confidence <= 0) return null;

  const wasteKey = resolveWasteKey(label || undefined, raw.waste_key);

  return {
    label: label || "unknown",
    confidence,
    bbox,
    waste_key: wasteKey,
    material: resolveMaterial(wasteKey, raw.material),
    waste: {
      category: waste.category || "",
      decomposition_time: waste.decomposition_time || "",
      environmental_impact: waste.environmental_impact || "",
      recycling_recommendations: waste.recycling_recommendations || "",
      disposal_methods: waste.disposal_methods || "",
    },
  };
}

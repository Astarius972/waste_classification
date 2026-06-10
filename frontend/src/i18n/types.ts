export type Locale = "en" | "mn";

export interface WasteTranslation {
  category: string;
  decomposition_time: string;
  environmental_impact: string;
  recycling_recommendations: string;
  disposal_methods: string;
}

export interface Dictionary {
  nav: {
    crisis: string;
    problems: string;
    examples: string;
    scan: string;
    tryNow: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    scrollHint: string;
  };
  slides: {
    crisis: {
      label: string;
      title: string;
      body: string;
      stat1: string;
      stat1Label: string;
      stat2: string;
      stat2Label: string;
      stat3: string;
      stat3Label: string;
    };
    problems: {
      label: string;
      title: string;
      items: { title: string; description: string }[];
    };
    examples: {
      label: string;
      title: string;
      subtitle: string;
      bottle: string;
      can: string;
      bag: string;
    };
    cta: {
      label: string;
      title: string;
      subtitle: string;
    };
  };
  scanner: {
    badge: string;
    title: string;
    subtitle: string;
    apiOffline: string;
    camera: string;
    upload: string;
    startCamera: string;
    scanNow: string;
    stopCamera: string;
    flipCamera: string;
    cameraOff: string;
    cameraError: string;
    autoScan: string;
    dropzone: string;
    dropzoneHint: string;
  };
  results: {
    analyzing: string;
    failed: string;
    empty: string;
    count: string;
    detectedAs: string;
    decomposition: string;
    impact: string;
    recycling: string;
    disposal: string;
    confidence: string;
  };
  waste: Record<string, WasteTranslation>;
  unknownWaste: WasteTranslation;
}

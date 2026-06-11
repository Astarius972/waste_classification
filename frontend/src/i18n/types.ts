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
    problem: string;
    impact: string;
    solution: string;
    scan: string;
    tryNow: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scrollHint: string;
  };
  problem: {
    label: string;
    title: string;
    body: string;
    stats: { value: number; decimals: number; suffix: string; label: string }[];
    mongolia: {
      title: string;
      body: string;
      stats: { value: number; decimals: number; suffix: string; label: string }[];
    };
  };
  impact: {
    label: string;
    title: string;
    subtitle: string;
    scaleNote: string;
  };
  solution: {
    label: string;
    title: string;
    subtitle: string;
    steps: { title: string; description: string }[];
  };
  about: {
    storyTitle: string;
    story: { title: string; description: string }[];
    techTitle: string;
  };
  vision: {
    label: string;
    title: string;
    body: string;
    points: { title: string; description: string }[];
    goalTitle: string;
    goal: string;
  };
  footer: {
    tagline: string;
    description: string;
    navTitle: string;
    techTitle: string;
    rights: string;
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
  materials: {
    plastic: string;
    metal: string;
    glass: string;
    paper: string;
    organic: string;
    hazardous: string;
    unknown: string;
  };
  waste: Record<string, WasteTranslation>;
  unknownWaste: WasteTranslation;
}

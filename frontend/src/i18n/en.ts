import type { Dictionary } from "./types";

const en: Dictionary = {
  nav: {
    problem: "The problem",
    impact: "Impact",
    solution: "Solution",
    scan: "Scan",
    tryNow: "Try EcoScan",
  },
  hero: {
    badge: "AI for a cleaner planet",
    title1: "Every Piece of Waste",
    title2: "Has a Story.",
    subtitle:
      "EcoScan uses artificial intelligence to recognize waste in real time — and reveals the story behind it: how long it lives, the harm it causes, and the right way to let it go.",
    ctaPrimary: "Try AI Detection",
    ctaSecondary: "Learn More",
    scrollHint: "Scroll to explore",
  },
  problem: {
    label: "The Problem",
    title: "We are drowning in our own waste.",
    body: "Every year, humanity produces more waste than ever before. Most of it is buried, burned, or lost into nature — where it lingers for decades, centuries, or forever.",
    stats: [
      {
        value: 2.01,
        decimals: 2,
        suffix: "B",
        label: "tonnes of municipal waste generated every single year",
      },
      {
        value: 33,
        decimals: 0,
        suffix: "%",
        label: "is not managed in an environmentally safe way",
      },
      {
        value: 8,
        decimals: 0,
        suffix: "M+",
        label: "tonnes of plastic flow into the ocean annually",
      },
    ],
    mongolia: {
      title: "And in Mongolia?",
      body: "The story is close to home. Ulaanbaatar alone sends thousands of tonnes of waste to open landfills every single day — and most of it is never sorted.",
      stats: [
        {
          value: 1.2,
          decimals: 1,
          suffix: "M+",
          label: "tonnes of waste produced in Ulaanbaatar every year",
        },
        {
          value: 3000,
          decimals: 0,
          suffix: "+",
          label: "tonnes arrive at the capital's landfills every day",
        },
        {
          value: 10,
          decimals: 0,
          suffix: "%",
          label: "or less is recycled — the rest is buried or burned",
        },
      ],
    },
  },
  impact: {
    label: "Environmental Impact",
    title: "Nature doesn't forget.",
    subtitle:
      "Every material decomposes on its own timeline — and some will outlive everyone reading this by centuries.",
    scaleNote: "Bar length uses a logarithmic time scale",
  },
  solution: {
    label: "The AI Solution",
    title: "Meet EcoScan.",
    subtitle:
      "Point a camera at any object and let AI do the sorting — from pixels to environmental insight in under a second.",
    steps: [
      {
        title: "Camera",
        description: "Use a live camera feed or upload a photo from any device.",
      },
      {
        title: "AI Detection",
        description:
          "A YOLOv8 detector finds objects, and a fine-tuned classifier identifies the material.",
      },
      {
        title: "Waste Category",
        description:
          "The item is sorted into plastic, paper, metal, glass, or organic waste.",
      },
      {
        title: "Environmental Insights",
        description:
          "Decomposition time, environmental damage, and the right way to recycle or dispose.",
      },
    ],
  },
  about: {
    storyTitle: "The story behind it",
    story: [
      {
        title: "Born at a Science Fair",
        description:
          "It all started with a smart waste-sorting bin built for a Science Fair — a bin that could recognize what was thrown into it.",
      },
      {
        title: "Expanded to the web",
        description:
          "To make the idea accessible to everyone, the concept was transformed into a web platform that works on any smartphone or computer.",
      },
      {
        title: "A complete full-stack AI solution",
        description:
          "A Next.js frontend, Python + FastAPI backend, and a YOLOv8 detection pipeline — deployed on Vercel and Render, combining web development, machine learning, and environmental awareness.",
      },
    ],
    techTitle: "Technologies used",
  },
  vision: {
    label: "Future Vision",
    title: "Cleaner cities start with a single scan.",
    body: "AI waste recognition can power smart bins, automated recycling plants, and education at scale — turning every thrown-away object into a teachable moment.",
    points: [
      {
        title: "Smart sorting bins",
        description: "On-device AI that sorts waste the moment it is thrown away.",
      },
      {
        title: "Education everywhere",
        description: "Anyone with a phone can learn what their waste does to the planet.",
      },
      {
        title: "Data for cities",
        description: "Detection data reveals what we throw away — and how to reduce it.",
      },
    ],
    goalTitle: "Our goal",
    goal: "To make waste sorting easier, increase environmental awareness, and promote responsible recycling through artificial intelligence.",
  },
  footer: {
    tagline: "AI Waste Classification System",
    description:
      "A full-stack AI project combining web development, machine learning, and environmental awareness.",
    navTitle: "Explore",
    techTitle: "Built with",
    rights: "Built for a cleaner planet.",
  },
  scanner: {
    badge: "AI detection",
    title: "Scan waste in real time",
    subtitle:
      "Point your camera or upload an image. Get instant guidance on decomposition, impact, and disposal.",
    apiOffline:
      "Backend API is offline. Deploy the Python server or run it locally on port 8000.",
    camera: "Live camera",
    upload: "Upload image",
    startCamera: "Start camera",
    scanNow: "Scan now",
    stopCamera: "Stop camera",
    flipCamera: "Flip camera",
    cameraOff: "Camera off — start scanning to detect waste in real time",
    cameraError:
      "Could not access the camera. Allow permissions and use HTTPS or localhost.",
    autoScan: "Auto-scans every {seconds}s while the camera is active.",
    dropzone: "Drop an image here or click to browse",
    dropzoneHint: "PNG, JPG, WEBP up to 10 MB",
  },
  results: {
    analyzing: "Analyzing image…",
    failed: "Detection failed",
    empty: "No waste detected. Try a clearer photo or adjust lighting.",
    count: "Results",
    detectedAs: "Detected as",
    decomposition: "Decomposition time",
    impact: "Environmental impact",
    recycling: "Recycling",
    disposal: "Proper disposal",
    confidence: "confidence",
  },
  materials: {
    plastic: "Plastic",
    metal: "Metal",
    glass: "Glass",
    paper: "Paper",
    organic: "Organic",
    hazardous: "Hazardous",
    unknown: "Unknown object",
  },
  waste: {
    plastic_bottle: {
      category: "Plastic — PET bottle",
      decomposition_time: "450–1,000 years",
      environmental_impact:
        "Breaks into microplastics that enter waterways and food chains; releases toxic additives as it degrades.",
      recycling_recommendations:
        "Rinse and remove caps/labels if required locally. Deposit in curbside recycling or bottle-return programs.",
      disposal_methods:
        "Never litter or burn. If not recyclable locally, use designated plastic collection points.",
    },
    plastic_bag: {
      category: "Plastic — Single-use bag",
      decomposition_time: "10–1,000 years (varies by material)",
      environmental_impact:
        "Harmful to marine life; animals can ingest or become entangled. Lightweight bags clog storm drains and recycling machinery.",
      recycling_recommendations:
        "Many curbside programs do not accept thin film. Use store drop-off bins for plastic film when available.",
      disposal_methods: "Avoid single-use bags; reuse or refuse when possible.",
    },
    can: {
      category: "Metal — Aluminum/steel can",
      decomposition_time: "80–200 years (aluminum); steel rusts faster in soil",
      environmental_impact:
        "Mining and smelting consume large energy; littered cans leach metals and pose sharp hazards to wildlife.",
      recycling_recommendations:
        "Aluminum is highly recyclable indefinitely. Rinse and place in metal recycling.",
      disposal_methods:
        "Do not crush cans with food residue inside if your facility requires clean material.",
    },
    glass_bottle: {
      category: "Glass — Bottle/jar",
      decomposition_time: "1 million+ years (does not biodegrade)",
      environmental_impact:
        "Broken glass injures wildlife; inert in landfills but wastes reusable material.",
      recycling_recommendations:
        "Separate by color if required; remove caps; recycle via glass bins.",
      disposal_methods:
        "Wrap broken glass before landfill disposal to protect sanitation workers.",
    },
    paper: {
      category: "Paper / cardboard",
      decomposition_time: "2–6 weeks (under ideal composting conditions)",
      environmental_impact:
        "Deforestation and bleaching chemicals if not recycled; wet paper degrades quickly but can release methane in landfills.",
      recycling_recommendations:
        "Keep dry and flat; remove plastic windows or grease-contaminated sections.",
      disposal_methods:
        "Compost clean uncoated paper; landfill only when recycling is unavailable.",
    },
    food_waste: {
      category: "Organic — Food scraps",
      decomposition_time: "1 month – 6 months (composting)",
      environmental_impact:
        "In landfills, organics produce methane, a potent greenhouse gas.",
      recycling_recommendations: "Compost at home or use municipal organics collection.",
      disposal_methods:
        "Never mix with dry recyclables; avoid dumping in natural areas.",
    },
    battery: {
      category: "Hazardous — Battery",
      decomposition_time: "100+ years; chemicals persist",
      environmental_impact:
        "Leaches heavy metals (lead, cadmium, lithium) into soil and groundwater.",
      recycling_recommendations:
        "Take to e-waste or battery recycling drop-off points only.",
      disposal_methods:
        "Never place in household trash or fire; tape terminals on lithium cells.",
    },
    styrofoam: {
      category: "Plastic — Expanded polystyrene (EPS)",
      decomposition_time: "500+ years",
      environmental_impact:
        "Breaks into small particles, ingested by marine life; rarely accepted curbside.",
      recycling_recommendations:
        "Check for specialized EPS drop-off; reduce use when possible.",
      disposal_methods:
        "Landfill if no local EPS program; do not burn (toxic fumes).",
    },
    cup: {
      category: "Plastic / paper cup",
      decomposition_time: "20–500 years depending on lining",
      environmental_impact:
        "Often lined with plastic; not recyclable in most programs when contaminated.",
      recycling_recommendations:
        "Check if your city accepts cups; empty and rinse first.",
      disposal_methods: "Use reusable cups when possible; dispose in general waste if not recyclable.",
    },
  },
  unknownWaste: {
    category: "Unidentified waste",
    decomposition_time: "Varies widely — verify the material type",
    environmental_impact:
      "Improper disposal can pollute soil, water, and harm wildlife. Identify the material for accurate guidance.",
    recycling_recommendations:
      "Check local municipal guidelines or use a waste-sorting app for your region.",
    disposal_methods: "Use designated bins; never dump in nature.",
  },
};

export default en;

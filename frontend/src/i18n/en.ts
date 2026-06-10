import type { Dictionary } from "./types";

const en: Dictionary = {
  nav: {
    crisis: "The crisis",
    problems: "Impact",
    examples: "Examples",
    scan: "Scan",
    tryNow: "Try EcoScan",
  },
  hero: {
    badge: "Environmental awareness",
    title: "Every piece of waste reshapes our planet",
    subtitle:
      "Scroll through the story of what happens when we throw things away — then use AI to identify waste and learn how to dispose of it responsibly.",
    cta: "Start the journey",
    scrollHint: "Scroll to explore",
  },
  slides: {
    crisis: {
      label: "Slide 01 — The crisis",
      title: "What happens if we keep throwing waste away like we do now?",
      body: "The world generates over 2 billion tonnes of municipal solid waste every year. Without better sorting and recycling, most of it ends up in landfills, open dumps, or the ocean — lingering for decades or centuries.",
      stat1: "2.01B",
      stat1Label: "tonnes of waste per year globally",
      stat2: "33%",
      stat2Label: "is not managed in an environmentally safe way",
      stat3: "450+",
      stat3Label: "years for a plastic bottle to decompose",
    },
    problems: {
      label: "Slide 02 — Environmental damage",
      title: "What kind of problems does waste cause?",
      items: [
        {
          title: "Ocean pollution",
          description:
            "Plastic and microplastics harm marine life, enter the food chain, and accumulate in ocean gyres.",
        },
        {
          title: "Greenhouse gases",
          description:
            "Organic waste in landfills releases methane — a gas far more potent than CO₂ in the short term.",
        },
        {
          title: "Soil & water contamination",
          description:
            "Batteries, chemicals, and plastics leach toxins into groundwater and farmland.",
        },
        {
          title: "Wildlife & health risks",
          description:
            "Animals ingest or become entangled in waste; humans face exposure through food, water, and air.",
        },
      ],
    },
    examples: {
      label: "Slide 03 — Waste in 3D",
      title: "Common waste items around us",
      subtitle: "Rotate and explore — these everyday objects can persist in nature for centuries.",
      bottle: "Plastic bottle",
      can: "Metal can",
      bag: "Plastic bag",
    },
    cta: {
      label: "Slide 04 — Take action",
      title: "See it. Understand it. Dispose of it correctly.",
      subtitle:
        "Use your camera or upload a photo — EcoScan detects waste and tells you how long it lasts, what harm it causes, and how to recycle or dispose of it properly.",
    },
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

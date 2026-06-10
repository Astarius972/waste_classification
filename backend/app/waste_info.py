"""Waste category metadata: decomposition, impact, recycling, disposal."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class WasteInfo:
    waste_key: str
    category: str
    decomposition_time: str
    environmental_impact: str
    recycling_recommendations: str
    disposal_methods: str
    aliases: tuple[str, ...] = ()


# Map detected class labels (lowercase) to environmental information.
WASTE_KNOWLEDGE: dict[str, WasteInfo] = {
    "plastic bottle": WasteInfo(
        waste_key="plastic_bottle",
        category="Plastic — PET bottle",
        decomposition_time="450–1,000 years",
        environmental_impact=(
            "Breaks into microplastics that enter waterways and food chains; "
            "releases toxic additives as it degrades."
        ),
        recycling_recommendations=(
            "Rinse and remove caps/labels if required locally. "
            "Deposit in curbside recycling or bottle-return programs."
        ),
        disposal_methods=(
            "Never litter or burn. If not recyclable locally, use designated "
            "plastic collection points or landfill as last resort."
        ),
        aliases=("bottle", "plastic_bottle", "pet bottle", "water bottle"),
    ),
    "plastic bag": WasteInfo(
        waste_key="plastic_bag",
        category="Plastic — Single-use bag",
        decomposition_time="10–1,000 years (varies by material)",
        environmental_impact=(
            "Harmful to marine life; animals can ingest or become entangled. "
            "Lightweight bags clog storm drains and recycling machinery."
        ),
        recycling_recommendations=(
            "Many curbside programs do not accept thin film. "
            "Use store drop-off bins for plastic film when available."
        ),
        disposal_methods="Avoid single-use bags; reuse or refuse when possible.",
        aliases=("bag", "plastic_bag", "polybag", "handbag", "backpack", "suitcase"),
    ),
    "can": WasteInfo(
        waste_key="can",
        category="Metal — Aluminum/steel can",
        decomposition_time="80–200 years (aluminum); steel rusts faster in soil",
        environmental_impact=(
            "Mining and smelting consume large energy; littered cans leach metals "
            "and pose sharp hazards to wildlife."
        ),
        recycling_recommendations=(
            "Aluminum is highly recyclable indefinitely. Rinse and place in metal recycling."
        ),
        disposal_methods="Do not crush cans with food residue inside if your facility requires clean material.",
        aliases=("aluminum can", "tin can", "metal can"),
    ),
    "glass bottle": WasteInfo(
        waste_key="glass_bottle",
        category="Glass — Bottle/jar",
        decomposition_time="1 million+ years (does not biodegrade)",
        environmental_impact=(
            "Broken glass injures wildlife; inert in landfills but wastes reusable material."
        ),
        recycling_recommendations="Separate by color if required; remove caps; recycle via glass bins.",
        disposal_methods="Wrap broken glass before landfill disposal to protect sanitation workers.",
        aliases=("glass", "glass_bottle", "jar", "wine glass"),
    ),
    "paper": WasteInfo(
        waste_key="paper",
        category="Paper / cardboard",
        decomposition_time="2–6 weeks (under ideal composting conditions)",
        environmental_impact=(
            "Deforestation and bleaching chemicals if not recycled; "
            "wet paper degrades quickly but can release methane in landfills."
        ),
        recycling_recommendations="Keep dry and flat; remove plastic windows or grease-contaminated sections.",
        disposal_methods="Compost clean uncoated paper; landfill only when recycling is unavailable.",
        aliases=("cardboard", "newspaper", "carton", "book"),
    ),
    "food waste": WasteInfo(
        waste_key="food_waste",
        category="Organic — Food scraps",
        decomposition_time="1 month – 6 months (composting)",
        environmental_impact=(
            "In landfills, organics produce methane, a potent greenhouse gas."
        ),
        recycling_recommendations="Compost at home or use municipal organics collection.",
        disposal_methods="Never mix with dry recyclables; avoid dumping in natural areas.",
        aliases=("food", "organic", "compost", "banana", "apple", "orange", "sandwich", "pizza"),
    ),
    "battery": WasteInfo(
        waste_key="battery",
        category="Hazardous — Battery",
        decomposition_time="100+ years; chemicals persist",
        environmental_impact=(
            "Leaches heavy metals (lead, cadmium, lithium) into soil and groundwater."
        ),
        recycling_recommendations="Take to e-waste or battery recycling drop-off points only.",
        disposal_methods="Never place in household trash or fire; tape terminals on lithium cells.",
        aliases=("batteries", "cell", "cell phone"),
    ),
    "styrofoam": WasteInfo(
        waste_key="styrofoam",
        category="Plastic — Expanded polystyrene (EPS)",
        decomposition_time="500+ years",
        environmental_impact=(
            "Breaks into small particles, ingested by marine life; rarely accepted curbside."
        ),
        recycling_recommendations="Check for specialized EPS drop-off; reduce use when possible.",
        disposal_methods="Landfill if no local EPS program; do not burn (toxic fumes).",
        aliases=("eps", "foam", "polystyrene"),
    ),
    "cup": WasteInfo(
        waste_key="cup",
        category="Plastic / paper cup",
        decomposition_time="20–500 years depending on lining",
        environmental_impact=(
            "Often lined with plastic; not recyclable in most programs when contaminated."
        ),
        recycling_recommendations="Check if your city accepts cups; empty and rinse first.",
        disposal_methods="Use reusable cups when possible; dispose in general waste if not recyclable.",
        aliases=("coffee cup", "paper cup"),
    ),
}

DEFAULT_WASTE_INFO = WasteInfo(
    waste_key="unknown",
    category="Unidentified waste",
    decomposition_time="Varies widely — verify material type",
    environmental_impact=(
        "Improper disposal can pollute soil, water, and harm wildlife. "
        "Identify the material for accurate guidance."
    ),
    recycling_recommendations=(
        "Check local municipal guidelines or use a waste-sorting app for your region."
    ),
    disposal_methods="Use designated bins; never dump in nature.",
)


def lookup_waste_info(label: str | None) -> WasteInfo:
    """Resolve a YOLO class label to structured waste information."""
    if not label or not str(label).strip():
        return DEFAULT_WASTE_INFO
    normalized = str(label).strip().lower().replace("_", " ")
    if normalized in ("undefined", "null", "none"):
        return DEFAULT_WASTE_INFO
    if normalized in WASTE_KNOWLEDGE:
        return WASTE_KNOWLEDGE[normalized]
    for info in WASTE_KNOWLEDGE.values():
        if normalized in info.aliases or any(a in normalized for a in info.aliases):
            return info
    return DEFAULT_WASTE_INFO

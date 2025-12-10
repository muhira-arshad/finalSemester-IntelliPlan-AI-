import json
import random
import os

# ========== PATHS ==========
COLOR_PATH = r"D:\Zainab\FYP\dataset-working-test\coloring_normalized_checked.json"
DIM_PATH = r"D:\Zainab\FYP\dataset-working-test\parsed_dimensions_clean.json"
RULES_PATH = r"D:\Zainab\FYP\dataset-working-test\realistic_dimensions.json"
OUT_PATH = r"D:\Zainab\FYP\dataset-working-test\paired_labels_dimensions_realistic.json"

# ========== LOAD FILES ==========
with open(COLOR_PATH, "r", encoding="utf-8") as f:
    color_data = json.load(f)

with open(DIM_PATH, "r", encoding="utf-8") as f:
    dim_data = json.load(f)

with open(RULES_PATH, "r", encoding="utf-8") as f:
    rules_data = json.load(f)

print(f"🎨 Loaded {len(color_data)} labels from coloring.json")
print(f"📏 Loaded {len(dim_data)} raw dimension pairs")
print(f"📐 Loaded realistic rules for {len(rules_data['room_sizes'])} room types")

# ========== HELPER FUNCTIONS ==========
# Map label strings to room types
category_to_room_type = {
    # Bedrooms
    "master": "bedroom_master",
    "guest": "bedroom_guest",
    "bedroom": "bedroom_small",
    "bed": "bedroom_small",
    "loft": "bedroom_small",
    "alcove": "bedroom_small",
    "guestroom": "bedroom_guest",

    # Bathrooms
    "bath": "bath_attached",
    "toilet": "bath_common",
    "wc": "bath_common",

    # Kitchen
    "kitchen": "kitchen_closed",
    "open kitchen": "kitchen_open",
    "pantry": "pantry",

    # Living/dining
    "lounge": "lounge_tv",
    "living": "lounge_tv",
    "drawing": "drawing_room",
    "dining": "drawing_room",

    # Garages
    "garage": "garage_single",
    "double garage": "garage_double",
    "parking": "garage_single",

    # Other rooms
    "balcony": "balcony",
    "terrace": "balcony",
    "foyer": "foyer",
    "entry": "foyer",
    "corridor": "corridor",
    "hallway": "corridor",
    "utility": "utility_room",
    "study": "study_room",
}

# Non-room defaults
non_room_defaults = {
    "wall": {"width_ft": 0.5, "height_ft": 10},
    "door": {"width_ft": 3, "height_ft": 7},
    "window": {"width_ft": 4, "height_ft": 5},
    "roof": {"width_ft": None, "height_ft": None},
    "column": {"width_ft": 1, "height_ft": 10},
    "chimney": {"width_ft": 2, "height_ft": 8},
    "pool": {"width_ft": 15, "height_ft": 5},
    "relaxation": {"width_ft": 10, "height_ft": 12},
    "attic": {"width_ft": 20, "height_ft": 8},
    "basement": {"width_ft": 20, "height_ft": 8},
    "text": {"width_ft": None, "height_ft": None},
    "upper_floor": {"width_ft": None, "height_ft": None},
}

# ✅ Add previously unmapped labels with default dimensions
non_room_defaults.update({
    "storage": {"width_ft": 6, "height_ft": 8},
    "boiler": {"width_ft": 4, "height_ft": 6},
    "garden": {"width_ft": 20, "height_ft": 20},
    "greenhouse": {"width_ft": 15, "height_ft": 10},
    "staircase": {"width_ft": 6, "height_ft": 10},
    "elevator": {"width_ft": 5, "height_ft": 8},
    "driveway": {"width_ft": 12, "height_ft": 20}
})

def map_label_to_room_type(label: str):
    l = label.lower()
    for key in category_to_room_type:
        if key in l:
            return category_to_room_type[key]
    for key in non_room_defaults:
        if key in l:
            return key
    return None  # unknown

def sample_dimension_for_label(label, rules):
    """Return realistic width/height for a label, or fallback."""
    room_type = map_label_to_room_type(label)
    # Room with rules
    if room_type and room_type in rules:
        r = rules[room_type]
        if "min" in r and "comfortable" in r:
            w_min, h_min = r["min"]
            w_max, h_max = r["comfortable"]
            width = round(random.uniform(w_min, w_max), 3)
            height = round(random.uniform(h_min, h_max), 3)
            return width, height
        elif "min_width" in r and "max_width" in r:
            width = round(random.uniform(r["min_width"], r["max_width"]), 3)
            height = round(random.uniform(width, width * 1.2), 3)
            return width, height
    # Non-room default
    if room_type in non_room_defaults:
        w = non_room_defaults[room_type]["width_ft"]
        h = non_room_defaults[room_type]["height_ft"]
        return w, h
    # Fallback: pick randomly from dataset
    dim = random.choice(dim_data)
    return round(dim["width_ft"], 3), round(dim["height_ft"], 3)

# ========== PAIRING ==========
paired_data = []
labels = list(color_data.keys())
colors = [color_data[label] for label in labels]

unmapped_labels = []

for i, label in enumerate(labels):
    rgb = colors[i]
    width_ft, height_ft = sample_dimension_for_label(label, rules_data["room_sizes"])
    if map_label_to_room_type(label) is None:
        unmapped_labels.append(label)
    paired_data.append({
        "label": label,
        "rgb": rgb,
        "width_ft": width_ft,
        "height_ft": height_ft
    })

# ========== SAVE ==========
os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
with open(OUT_PATH, "w", encoding="utf-8") as f:
    json.dump(paired_data, f, indent=4)

print(f"✅ Saved {len(paired_data)} paired samples to: {OUT_PATH}")

if unmapped_labels:
    print(f"⚠️ Labels not mapped ({len(unmapped_labels)}): {unmapped_labels[:20]} ...")

# Optional: print a few samples
print("\n🔹 Sample entries:")
for ex in paired_data[:5]:
    print(ex)

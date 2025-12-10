import json
import os
import random

# === CONFIG ===
INPUT_PATH = r"D:\Zainab\FYP\dataset-working-test\paired_labels_dimensions_realistic.json"
OUTPUT_PATH = r"D:\Zainab\FYP\dataset-working-test\paired_labels_dimensions_filled.json"

# --- Category mapping for borrowing realistic dimensions ---
fallback_mapping = {
    "roof": "wall",
    "laundry": "utilityroom",
    "dressingroom": "bedroom",
    "office": "study",
    "fireplace": "relaxation",
    "technicalroom": "storage",
    "cottage": "livingroom",
    "visual": "wall",
    "furniture": "kitchen",
    "retail": "livingroom",
    "library": "study",
    "meeting": "office",
    "cafe": "kitchen",
    "upper_floor": "staircase",
    "text": "background",
    "background": "wall",
    "alcove": "bedroom",
    "coatrack": "storage",
    "handle": "door",
    "hanger": "storage"
}

# --- Load ---
if not os.path.exists(INPUT_PATH):
    raise FileNotFoundError(f"❌ File not found: {INPUT_PATH}")

with open(INPUT_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"📦 Loaded {len(data)} base entries")

# --- Index by label ---
by_label = {d["label"].lower(): d for d in data if "label" in d}
all_labels = set(by_label.keys())

# --- Helper functions ---
def flatten_rgb(rgb):
    """Normalize any RGB form (nested or not) into a clean [r, g, b] float list"""
    if isinstance(rgb, list):
        # Flatten deeply nested lists
        flat = []
        for item in rgb:
            if isinstance(item, list):
                flat.extend(item)
            else:
                flat.append(item)
        # Return first 3 numbers
        flat = [float(x) for x in flat[:3]]
        if len(flat) == 3:
            return flat
    return [0.5, 0.5, 0.5]  # fallback neutral gray

def random_rgb(existing_rgbs):
    """Generate a new unique RGB color not already used"""
    while True:
        rgb = [round(random.uniform(0, 1), 3) for _ in range(3)]
        if tuple(rgb) not in existing_rgbs:
            return rgb

# --- Build existing RGB set safely ---
existing_rgbs = set()
for d in data:
    rgb = flatten_rgb(d.get("rgb"))
    existing_rgbs.add(tuple(rgb))

# --- Missing categories found manually ---
missing_categories = [
    'roof', 'laundry', 'dressingroom', 'office', 'fireplace', 'technicalroom',
    'cottage', 'visual', 'furniture', 'retail', 'library', 'meeting', 'cafe',
    'upper_floor', 'text', 'background', 'alcove', 'coatrack', 'handle', 'hanger'
]

filled = list(data)  # start with originals
borrowed_count, synthetic_count = 0, 0

for cat in missing_categories:
    lower_cat = cat.lower()

    # Step 1: Try to find a fallback category to borrow realistic dimensions
    source_label = fallback_mapping.get(lower_cat)
    if source_label and source_label in by_label:
        base = by_label[source_label]
        base_rgb = flatten_rgb(base.get("rgb"))
        new_entry = {
            "label": lower_cat,
            "rgb": base_rgb,
            "width_ft": float(base.get("width_ft", 10.0)),
            "height_ft": float(base.get("height_ft", 10.0))
        }
        borrowed_count += 1
        print(f"🔁 Borrowed realistic data for '{lower_cat}' from '{source_label}'")
    else:
        # Step 2: Create a synthetic but plausible one
        rgb_new = random_rgb(existing_rgbs)
        new_entry = {
            "label": lower_cat,
            "rgb": rgb_new,
            "width_ft": round(random.uniform(8, 20), 2),
            "height_ft": round(random.uniform(8, 20), 2)
        }
        synthetic_count += 1
        print(f"✨ Created synthetic entry for '{lower_cat}'")

    existing_rgbs.add(tuple(flatten_rgb(new_entry["rgb"])))
    filled.append(new_entry)

# --- Save ---
with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(filled, f, indent=4)

print(f"\n✅ Completed successfully!")
print(f"📊 Total categories saved: {len(filled)}")
print(f"🔁 Borrowed realistic entries: {borrowed_count}")
print(f"✨ Synthetic entries created: {synthetic_count}")
print(f"💾 File written to: {OUTPUT_PATH}")

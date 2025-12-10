import json
import os
from statistics import mean

# === CONFIG ===
INPUT_PATH = r"D:\Zainab\FYP\dataset-working-test\paired_labels_dimensions_consistent.json"
OUTPUT_PATH = r"D:\Zainab\FYP\dataset-working-test\paired_labels_dimensions_regression_ready.json"

# --- Load data ---
if not os.path.exists(INPUT_PATH):
    raise FileNotFoundError(f"❌ File not found: {INPUT_PATH}")

with open(INPUT_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"📦 Loaded {len(data)} entries from {os.path.basename(INPUT_PATH)}")

# --- Build category mapping automatically ---
category_map = {}
for d in data:
    label = d.get("label", "").lower()
    category = d.get("category", "").lower()
    if label and category:
        category_map[label] = category

# --- Aggregate by label ---
aggregated = {}
for entry in data:
    label = entry.get("label", "").strip().lower()
    w, h = entry.get("width_ft"), entry.get("height_ft")

    if not label or not isinstance(w, (int, float)) or not isinstance(h, (int, float)):
        continue

    if label not in aggregated:
        aggregated[label] = {"widths": [], "heights": [], "category": category_map.get(label, "unknown")}

    aggregated[label]["widths"].append(w)
    aggregated[label]["heights"].append(h)

# --- Compute averages ---
final_data = []
for label, vals in aggregated.items():
    avg_w = round(mean(vals["widths"]), 3)
    avg_h = round(mean(vals["heights"]), 3)
    final_data.append({
        "label": label,
        "category": vals["category"],
        "width_ft": avg_w,
        "height_ft": avg_h
    })

print(f"✅ Prepared {len(final_data)} unique labels with categories for regression training")

# --- Save cleaned version ---
with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(final_data, f, indent=4)

print(f"💾 Saved regression data with categories → {OUTPUT_PATH}")

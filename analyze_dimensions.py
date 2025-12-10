import json
import matplotlib.pyplot as plt
import numpy as np
import os

# ========== CONFIG ==========
INPUT_PATH = r"D:\Zainab\FYP\dataset-working-test\parsed_dimensions.json"
OUTPUT_PATH = r"D:\Zainab\FYP\dataset-working-test\parsed_dimensions_clean.json"

# ========== LOAD DATA ==========
with open(INPUT_PATH, "r") as f:
    data = json.load(f)

widths, heights = [], []
valid_entries = []

# ========== FILTER VALID DIMENSIONS ==========
for d in data:
    w, h = d.get("width_ft"), d.get("height_ft")

    # Skip if missing or invalid
    if w is None or h is None:
        continue
    if w <= 0 or h <= 0:
        continue
    if w > 100 or h > 100:   # remove unrealistic large sizes
        continue

    widths.append(w)
    heights.append(h)
    valid_entries.append({"width_ft": w, "height_ft": h})

# ========== PRINT STATS ==========
print(f"✅ Cleaned: {len(valid_entries)} valid samples")

if len(widths) > 0 and len(heights) > 0:
    print(f"Width range: {min(widths):.2f} - {max(widths):.2f} ft")
    print(f"Height range: {min(heights):.2f} - {max(heights):.2f} ft")
    print(f"Average size: {np.mean(widths):.2f} × {np.mean(heights):.2f} ft")
else:
    print("⚠️ No valid dimensions found!")

# ========== SAVE CLEANED DATA ==========
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
with open(OUTPUT_PATH, "w") as f:
    json.dump(valid_entries, f, indent=4)

print(f"\n💾 Saved cleaned dimensions to: {OUTPUT_PATH}")

# ========== VISUALIZE ==========
if len(widths) > 0 and len(heights) > 0:
    plt.figure(figsize=(10, 4))

    plt.subplot(1, 2, 1)
    plt.hist(widths, bins=40, color="skyblue", edgecolor="black")
    plt.title("Width Distribution (ft)")

    plt.subplot(1, 2, 2)
    plt.hist(heights, bins=40, color="lightcoral", edgecolor="black")
    plt.title("Height Distribution (ft)")

    plt.tight_layout()
    plt.show()

import os
import re
import json
import math
from bs4 import BeautifulSoup
from tqdm import tqdm

# ========== CONFIG ==========
SVG_ROOTS = [
    r"D:\Zainab\FYP\IntelliPlan-AI\cubicasa5k\cubicasa5k\high_quality_architectural",
    r"D:\Zainab\FYP\IntelliPlan-AI\cubicasa5k\cubicasa5k\high_quality",
    r"D:\Zainab\FYP\IntelliPlan-AI\cubicasa5k\cubicasa5k\colorful",
]
OUTPUT_FILE = r"D:\Zainab\FYP\dataset-working-test\real_paired_dimensions.json"

# ========== FUNCTIONS ==========
def parse_feet_inch(text):
    """
    Converts text like 12'3" or 9'10" to float feet.
    Returns None if conversion fails.
    """
    text = text.replace("’", "'").replace("”", "\"").replace("‘", "'").replace("“", "\"").strip()
    match = re.match(r"(\d+)'(\d+)?\"?", text)
    if match:
        ft = int(match.group(1))
        inch = int(match.group(2)) if match.group(2) else 0
        return ft + inch / 12.0
    return None

def extract_dimensions(text):
    """
    Extracts width and height from a string like "12'4\" x 9'10\"".
    Returns tuple (width_ft, height_ft) or (None, None)
    """
    parts = re.findall(r"(\d+'(?:\d+\")?)", text)
    if len(parts) >= 2:
        w = parse_feet_inch(parts[0])
        h = parse_feet_inch(parts[1])
        return w, h
    return None, None

def distance(t1, t2):
    """
    Euclidean distance between two text elements.
    """
    try:
        x1, y1 = float(t1.get("x", 0)), float(t1.get("y", 0))
        x2, y2 = float(t2.get("x", 0)), float(t2.get("y", 0))
        return math.hypot(x1 - x2, y1 - y2)
    except:
        return float("inf")

# ========== MAIN ==========
results = []

# Collect all SVG files
all_files = [
    os.path.join(root, f)
    for folder in SVG_ROOTS
    for root, _, files in os.walk(folder)
    for f in files if f.lower().endswith(".svg")
]

for svg_path in tqdm(all_files, desc="Processing SVGs"):
    try:
        with open(svg_path, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "xml")

        texts = soup.find_all("text")
        if not texts:
            continue

        # Separate labels and dimensions
        label_nodes = [t for t in texts if not re.search(r"\d+'", t.text)]
        dim_nodes = [t for t in texts if re.search(r"\d+'", t.text)]

        if not dim_nodes or not label_nodes:
            continue

        for dim_node in dim_nodes:
            w, h = extract_dimensions(dim_node.text)
            if w is None or h is None:
                continue

            # Find nearest label
            nearest_label = None
            nearest_dist = float("inf")
            for lbl in label_nodes:
                d = distance(dim_node, lbl)
                if d < nearest_dist:
                    nearest_label = lbl
                    nearest_dist = d

            if nearest_label:
                label = nearest_label.text.strip().upper()
                results.append({
                    "label": label,
                    "width_ft": round(w, 3),
                    "height_ft": round(h, 3),
                    "source_svg": os.path.basename(svg_path)
                })

    except Exception as e:
        print(f"⚠️ Error in {svg_path}: {e}")

# ========== SAVE ==========
print(f"✅ Extracted {len(results)} real dimension pairs.")
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=4)
print(f"📁 Saved to {OUTPUT_FILE}")

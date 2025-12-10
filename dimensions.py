import re
import json

# ====== INPUT / OUTPUT FILES ======
INPUT_FILE = r"D:\Zainab\FYP\unmapped.txt"
OUTPUT_JSON = r"D:\Zainab\FYP\IntelliPlan-AI\parsed_dimensions.json"

# ====== REGEX PATTERNS ======
# Matches values like 10'2", 12'8", 9', 8'6", etc.
FEET_INCH_PATTERN = r"(\d{1,2})'(\d{0,2})\"?"
# Matches dimension pairs like 10'2" x 12'8" or 8' x 10'
PAIR_PATTERN = re.compile(rf"{FEET_INCH_PATTERN}\s*[xX_×-]\s*{FEET_INCH_PATTERN}")

# ====== HELPERS ======
def feet_inches_to_float(feet, inches):
    """Convert 10'2" → 10.17 (feet as float)"""
    feet = int(feet)
    inches = int(inches) if inches else 0
    return round(feet + inches / 12, 3)

# ====== PARSE FILE ======
dimensions = []
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    lines = f.readlines()

for line in lines:
    line = line.strip()
    if not line:
        continue

    # Try pair first (10'2" x 12'8")
    match_pair = PAIR_PATTERN.search(line)
    if match_pair:
        f1, i1, f2, i2 = match_pair.groups()
        w = feet_inches_to_float(f1, i1)
        h = feet_inches_to_float(f2, i2)
        dimensions.append({"raw": line, "width_ft": w, "height_ft": h})
        continue

    # Try single dimension (10'2" or 9')
    match_single = re.search(FEET_INCH_PATTERN, line)
    if match_single:
        f1, i1 = match_single.groups()
        val = feet_inches_to_float(f1, i1)
        dimensions.append({"raw": line, "width_ft": val, "height_ft": None})

# ====== SAVE TO JSON ======
with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(dimensions, f, indent=4)

print(f"✅ Extracted {len(dimensions)} valid dimension entries.")
print(f"📄 Saved parsed results to: {OUTPUT_JSON}")

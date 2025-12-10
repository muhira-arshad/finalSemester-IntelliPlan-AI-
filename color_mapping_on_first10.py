import os
import glob
import json
from PIL import Image, ImageDraw
import cairosvg
from bs4 import BeautifulSoup

# -------------------- CONFIG --------------------
INPUT_FOLDER = r"D:\Zainab\FYP\IntelliPlan-AI\cubicasa5k\cubicasa5k\high_quality_architectural"
OUTPUT_FOLDER = r"D:\Zainab\FYP\IntelliPlan-AI\cubicasa5k\501-1500-colored"
COLOR_MAP_PATH = "dataset_color_map_clean_normalized.json"
START_INDEX = 500   # <-- Skip the first 500 images
NUM_FILES = 1000    # <-- Process the next 1000

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# -------------------- LOAD COLOR MAP --------------------
with open(COLOR_MAP_PATH, "r") as f:
    COLORS = json.load(f)

# Convert list -> tuple for PIL
for k in COLORS:
    COLORS[k] = tuple(COLORS[k])

# -------------------- PROCESS SVG FILES --------------------
svg_files = glob.glob(os.path.join(INPUT_FOLDER, "**", "*.svg"), recursive=True)
svg_files = sorted(svg_files)  # ensure consistent order

# Skip first 500, take next 1000
svg_files = svg_files[START_INDEX:START_INDEX + NUM_FILES]
print(f"Found {len(svg_files)} SVG files (from {START_INDEX + 1} to {START_INDEX + len(svg_files)}). Processing...")

for svg_path in svg_files:
    try:
        base_name = os.path.splitext(os.path.basename(svg_path))[0]
        parent_folder = os.path.basename(os.path.dirname(svg_path))
        output_label_path = os.path.join(OUTPUT_FOLDER, f"{parent_folder}_{base_name}_color.png")

        # --- Parse SVG ---
        with open(svg_path, "r", encoding="utf-8") as f:
            svg_content = f.read()
        soup = BeautifulSoup(svg_content, "xml")

        # --- Render base PNG (for size reference) ---
        temp_png = "temp_render.png"
        cairosvg.svg2png(url=svg_path, write_to=temp_png)
        base_img = Image.open(temp_png).convert("RGBA")
        width, height = base_img.size

        # --- Create label image ---
        label_img = Image.new("RGB", (width, height), (255, 255, 255))
        draw = ImageDraw.Draw(label_img)

        # --- Draw polygons ---
        for g in soup.find_all("g"):
            label = g.get("class") or g.get("id") or ""
            matched_color = None

            for key, color in COLORS.items():
                if key.lower() in label.lower():
                    matched_color = color
                    break

            if matched_color:
                for polygon in g.find_all("polygon"):
                    try:
                        points = [
                            tuple(map(float, p.split(",")))
                            for p in polygon["points"].strip().split()
                            if "," in p and all(coord.strip() for coord in p.split(","))]
                        if len(points) > 2:
                            draw.polygon(points, fill=matched_color)
                    except Exception as e:
                        print(f"⚠️ Skipped malformed polygon in {base_name}: {e}")

        # --- Save label image ---
        label_img.save(output_label_path)
        print(f"✅ Saved: {output_label_path}")

    except Exception as e:
        print(f"❌ Failed to process {svg_path}: {e}")

    finally:
        if os.path.exists("temp_render.png"):
            os.remove("temp_render.png")

print("🎨 Color mapping complete for images 501–1500!")

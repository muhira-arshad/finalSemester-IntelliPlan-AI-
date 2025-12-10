import json
from PIL import Image, ImageDraw
import os, cairosvg
from bs4 import BeautifulSoup

# --- Load color map ---
with open("dataset_color_map_clean_normalized.json", "r") as f:
    COLORS = json.load(f)

# Convert list -> tuple
for k in COLORS:
    COLORS[k] = tuple(COLORS[k])

# --- Paths ---
svg_path = r"D:\Zainab\FYP\IntelliPlan-AI\cubicasa5k\cubicasa5k\high_quality_architectural\6044\model.svg"
output_label_path = r"D:\Zainab\FYP\IntelliPlan-AI\cubicasa5k\cubicasa5k\high_quality_architectural\6044\color.png"

# --- Parse SVG ---
with open(svg_path, "r", encoding="utf-8") as f:
    svg_content = f.read()
soup = BeautifulSoup(svg_content, "xml")

# --- Render base image ---
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
                    if "," in p
                ]
                if len(points) > 2:
                    draw.polygon(points, fill=matched_color)
            except Exception as e:
                print(f"⚠️ Skipped malformed polygon: {e}")

label_img.save(output_label_path)
print(f"✅ Label image saved as: {output_label_path}")

os.remove(temp_png)

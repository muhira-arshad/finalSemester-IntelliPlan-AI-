import os
from bs4 import BeautifulSoup
import json
import random

# Paths to both dataset folders
folders = [
    r"D:\Zainab\FYP\IntelliPlan-AI\cubicasa5k\cubicasa5k\high_quality_architectural",
    r"D:\Zainab\FYP\IntelliPlan-AI\cubicasa5k\cubicasa5k\high_quality"
]

# --- Helper function to clean labels ---
def clean_label(label):
    """Normalize labels: remove spaces, make lowercase, handle multiple words"""
    if not label:
        return []
    # Split by space, remove empty strings, lowercase everything
    return [part.strip().lower() for part in label.split() if part.strip()]

all_labels = set()

for base_path in folders:
    print(f"\nScanning folder: {base_path}")
    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file.endswith(".svg"):
                svg_path = os.path.join(root, file)
                print(f"Processing: {svg_path}")
                try:
                    with open(svg_path, "r", encoding="utf-8") as f:
                        svg_content = f.read()

                    soup = BeautifulSoup(svg_content, "xml")

                    for tag in soup.find_all(True):
                        # 1. class attribute
                        class_attr = tag.get("class")
                        if class_attr:
                            if isinstance(class_attr, list):
                                for c in class_attr:
                                    all_labels.update(clean_label(c))
                            else:
                                all_labels.update(clean_label(class_attr))

                        # 2. id
                        id_attr = tag.get("id")
                        if id_attr:
                            all_labels.update(clean_label(id_attr))

                        # 3. inkscape:label
                        label_attr = tag.get("inkscape:label")
                        if label_attr:
                            all_labels.update(clean_label(label_attr))

                        # 4. data-name / data-type
                        data_name = tag.get("data-name")
                        if data_name:
                            all_labels.update(clean_label(data_name))
                        data_type = tag.get("data-type")
                        if data_type:
                            all_labels.update(clean_label(data_type))

                        # 5. text tag content
                        if tag.name == "text" and tag.string:
                            all_labels.update(clean_label(tag.string))

                except Exception as e:
                    print(f"Error processing {svg_path}: {e}")

print(f"\nTotal unique cleaned labels found across both folders: {len(all_labels)}")

# --- Assign random RGB colors ---
color_map = {
    cls: (
        random.randint(0, 255),
        random.randint(0, 255),
        random.randint(0, 255)
    )
    for cls in sorted(all_labels)
}

# --- Save color map to file ---
output_path = "dataset_color_map.json"
with open(output_path, "w") as f:
    json.dump(color_map, f, indent=4)

print(f"Color map saved successfully to {output_path}")

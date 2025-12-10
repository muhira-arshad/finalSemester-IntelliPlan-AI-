import json
import os
from statistics import mean

# ========== CONFIG ==========
INPUT_PATH = r"D:\Zainab\FYP\dataset-working-test\paired_labels_dimensions_filled.json"
OUTPUT_PATH = r"D:\Zainab\FYP\dataset-working-test\paired_labels_dimensions_consistent.json"

# ========== CATEGORIES (paste your full mapping here) ==========
categories = {
    # --- Structural ---
    "wall": ["wall", "partition", "column", "beam", "structural"],
    "door": ["door", "double door", "sliding door", "doorway"],
    "window": ["window", "frame", "glass", "balcony door"],
    "roof": ["roof", "sisäkatto", "katt.h"],

    # --- Rooms ---
    "bedroom": [
        "bedroom", "bed", "master bed", "guest bed", "mh", "(mh)", "ask/mh", "(ask/mh)",
        "makuuhuone", "alkovi", "makuuparvi", "makuusyv.", "sleeping loft", "loft",
        "open loft", "loft_work_room"
    ],
    "livingroom": [
        "living", "lounge", "hall", "dining", "family room", "oh", "aula/oh", "aula/th",
        "aula/tvh", "aula", "ala-aula", "yhteistila", "ylä-aula", "yläaula", "tupa",
        "tuvan", "th/oleskelu", "pirtti", "home theater", "music room", "rest space",
        "smoking_room", "social_space", "social_spaces", "common space", "chamber"
    ],
    "kitchen": [
        "kitchen", "pantry", "cook", "kitchenette", "kk", "(kk)", "keittokomero",
        "avokeittiö", "avok", "avoin", "ruok", "ruok/h", "ruok/k", "ruokailu",
        "ruokakellari", "ruo-kom", "scullery",
        "base_cabinet", "round_base_cabinet", "triangular_base_cabinet", "counter_top",
        "dishwasher", "refrigerator", "double_refrigerator", "appliance_space",
        "appliance_space_2", "general_appliance", "round_appliance"
    ],
    "bathroom": [
        "bath", "bathroom", "toilet", "washroom", "restroom", "wc", "shower room",
        "pukuh", "aula/pukuh", "suihkutila", "sauna", "sauna/pesuh", "ph", "ph+khh",
        "pesu+khh", "pesu/psh", "kylpyh", "shower_cabin", "round_shower_screen_left",
        "round_shower_screen_right", "shower_platform", "sink", "side_sink",
        "double_sink", "double_sink_right", "round_sink"
    ],
    "corridor": [
        "corridor", "hallway", "passage", "vestibule", "aula/et", "ylä-aula", "yläaula",
        "sis.tulo", "tk/et", "luhtikäytävä", "parvi-käytävä"
    ],
    "driveway": ["ajoluiska", "ramp", "driveway", "car_ramp", "garage_ramp"],
    "storage": [
        "storage", "closet", "wardrobe", "store", "cupboard", "lämmin", "(lämmin)",
        "varasto", "lämmintila", "archive", "arkisto", "autotalli/var", "öljys",
        "öljys.tila", "ulkovar", "vaateh/var", "var(kylmä)", "var.tekn", "var/tek",
        "var/tekn.tila", "var/tekntila", "var/kell", "var/pyörät", "var/vh",
        "vh-huolto", "vh/lvk", "vh/omp", "vh/pkh", "vh/sh", "vh/th", "puukatos",
        "puuliiteri", "puuvaja", "puuvar", "sis.var", "technicalroom", "tekninen",
        "teknvar", "tekn/khh", "tekn+var", "tekn/maal.p", "ulk.väl.var", "tank",
        "lämpökeskus", "lämpö", "lämpök", "maa-lämpö", "maalämpö", "säil", "säiliö",
        "tal-kell", "tal.", "tal.kel", "tal.kell", "talkel", "talouskellari",
        "talousrakennus", "talviasuttava", "pellettivar", "pyöräkatos", "kylmiö",
        "kylmä/var", "kylmäkellari", "katospuut", "kh+pe", "kh-tila", "kh/harr",
        "khh/pesu", "khh/tekn", "khh/tk", "khh/vh", "khh\\pkh", "kuiv", "kuiv.",
        "kuivaus", "kuivaush", "kura-et", "kuraet", "kone.", "koneh", "firewood",
        "vault", "safe/vault", "shelter wood", "shelter/canopy"
    ],
    "balcony": ["balcony", "terrace", "porch", "deck", "veranda", "parveke", "terassi", "tk/kuisti"],
    "garage": ["garage", "carport", "autotalli", "autokatos", "autosuoja", "autovaja", "auto", "parking", "parking_space", "parking shelter", "car shelter", "service pit"],
    "staircase": ["stair", "staircase", "steps", "avoparvi"],
    "entry": ["entry", "foyer", "entrance", "lobby", "aula/khh", "vastaanotto"],
    "study": [
        "ask", "askarteluhuone", "(ask)", "at/työtila", "ateljee", "työtila", "vierash/työh",
        "vierash/kirj", "työh/kirjasto", "työhuone", "toimisto", "personalrum",
        "sihteeri", "kirjasto/työh", "kokoush", "koulutustila", "library",
        "space_library", "office_library"
    ],
    "attic": ["yläpohja", "ullakokerros", "vintti", "vinttikerros", "välikerros"],
    "guestroom": ["vierash", "vierashuone", "vierasmaja", "majoitush", "koulutustila", "accommodation room"],
    "utilityroom": [
        "utility", "var/tekn", "var/tek", "vh/et", "psh/khh", "puk/khh", "pukelttum",
        "kampaamo-tila", "kh+pe", "kh-tila", "kh/harr", "khh/pesu", "khh/tekn", "khh/tk",
        "khh/vh", "khh\\pkh", "kuiv", "kuiv.", "kuivaus", "kuivaush", "kura-et",
        "kuraet", "kone.", "koneh", "washingmachine", "wm", "tumbledryer", "watertap",
        "drying", "oljy"
    ],
    "greenhouse": ["viherh", "viherh.", "viinik", "greenhouse"],
    "relaxation": [
        "vilorum", "vilpola", "vilv", "vilv.h", "vilvoit", "valokate/vilvoittelu",
        "saunakamari/kirjasto", "saunatupa", "saunakammari", "tornihuone", "työh/oleskelu",
        "recreationroom", "kotiteatteri", "kuntosali", "lepos", "gym", "harrasteh",
        "harrastetila", "harrastustila", "fireplace", "firebox", "fireplacecorner",
        "fireplaceround", "corner_fireplace", "round_fireplace"
    ],

    # --- New Logical Room Categories ---
    "laundry": ["laundry_room", "laundry", "laundry cottage", "laundry wash"],
    "dressingroom": [
        "dressing_room", "dressing", "dressing_space", "changing_room", "makeup_room",
        "apartment_dressing_room", "laundry_dressing", "laundry_dressing_room"
    ],
    "office": [
        "office", "manager", "manager's room", "meeting_room", "meeting/conference",
        "workshop", "work_space", "commercial_office", "server room", "staff_room",
        "multi-purpose room", "multi-purpose space", "business space", "retail space"
    ],
    "fireplace": [
        "fireplace", "corner_fireplace", "round_fireplace", "place_for_fireplace",
        "place_for_fireplace_corner", "place_for_fireplace_round"
    ],
    "technicalroom": [
        "technical_room", "hvac", "hvac room", "pump_room", "machine room", "tank",
        "compressor_room", "oil_room", "fuel_reservation", "technical_space", "technical_area"
    ],
    "cottage": ["cottage", "villa/cottage", "summer_cottage", "work cottage", "cottage_upper_part"],

    # --- Exterior ---
    "garden": ["garden", "yard", "lawn", "alapiha", "yläpiha", "puutarhaa", "puutarhav", "etu-piha"],
    "pool": ["pool", "swimming pool", "jacuzzi"],
    "outdoor": [
        "ulkotila", "valokatettupergola", "covered_area", "covered_section",
        "wood_platform", "wood_patio", "open_to_below", "space_open_to_below", "high space"
    ],

    # --- Visualization / Non-Physical ---
    "visual": [
        "boundary_polygon", "overlay_polygon", "inner_polygon", "outer_drain",
        "inner_drain", "visual", "unbuilt_space", "unused_space", "temporary",
        "positive", "negative", "free_shape", "circle", "rectangle"
    ],

    # --- Furniture / Fixtures ---
    "furniture": [
        "base_cabinet", "round_base_cabinet", "triangular_base_cabinet", "coatrack",
        "coat_hanger", "furniture_set", "miscellaneous_furniture", "fixedfurniture",
        "counter_top"
    ],

    # --- Commercial / Public ---
    "retail": ["retail_space", "commercial_space", "business_space", "social_space", "cafe", "cafeteria"],
    "library": ["library", "space_library", "office_library"],
    "meeting": ["meeting_room", "meeting/conference"],
    "cafe": ["cafe", "cafeteria", "coffee_room"],

    # --- Upper floors / stories ---
    "upper_floor": ["ylakerta", "ylempi", "ylös", "yläkerran", "yläkerta", "yläosä", "älakerta"],

    # --- Utilities / Misc ---
    "elevator": ["elevator", "lift"],
    "column": ["pillar", "support column"],
    "text": ["text", "label", "annotation", "note"],
    "background": ["background", "canvas"],

    # --- Small / misc objects (optional) ---
    "alcove": ["alcove"],
    "coatrack": ["coatrack"],
    "handle": ["handle"],
    "hanger": ["hanger"],

    # --- Added missing valid labels ---
    "basement": ["basement", "basement-1", "basement-2"],
    "boiler": ["boiler"],
    "chimney": ["chimney"]
}


# ========== LOAD ==========
if not os.path.exists(INPUT_PATH):
    raise FileNotFoundError(f"❌ File not found: {INPUT_PATH}")

with open(INPUT_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"📦 Loaded {len(data)} entries from {os.path.basename(INPUT_PATH)}")

# ========== STEP 1: BUILD BASE CATEGORY STATS ==========
# Collect all entries per main label
category_data = {}
for entry in data:
    label = entry["label"].lower()
    w, h = entry.get("width_ft"), entry.get("height_ft")
    rgb = entry.get("rgb")
    if label not in category_data:
        category_data[label] = {"widths": [], "heights": [], "rgbs": []}
    if isinstance(w, (int, float)) and isinstance(h, (int, float)):
        category_data[label]["widths"].append(w)
        category_data[label]["heights"].append(h)
    if rgb:
        category_data[label]["rgbs"].append(rgb)

# Compute average per base label
category_means = {}
for label, stats in category_data.items():
    if stats["widths"] and stats["heights"]:
        category_means[label] = {
            "width_ft": round(mean(stats["widths"]), 3),
            "height_ft": round(mean(stats["heights"]), 3),
            "rgb": stats["rgbs"][0] if stats["rgbs"] else [0, 0, 0]
        }

print(f"📊 Found {len(category_means)} base categories with valid data")

# ========== STEP 2: EXPAND TO SUBLABELS ==========
consistent = []
missing = []

for main_label, sublabels in categories.items():
    base = category_means.get(main_label.lower())
    if not base:
        missing.append(main_label)
        continue

    for sub in sublabels:
        consistent.append({
            "label": sub,
            "rgb": base["rgb"],
            "width_ft": base["width_ft"],
            "height_ft": base["height_ft"],
            "category": main_label
        })

print(f"✅ Generated {len(consistent)} consistent entries")
if missing:
    print(f"⚠️ Missing base data for {len(missing)} categories: {missing}")

# ========== SAVE ==========
with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(consistent, f, indent=4)

print(f"💾 Saved consistent label file → {OUTPUT_PATH}")

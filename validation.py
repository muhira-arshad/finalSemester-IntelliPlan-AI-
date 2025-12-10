import json

# ========== PATHS ==========
PAIRED_PATH = r"D:\Zainab\FYP\dataset-working-test\paired_labels_dimensions_realistic.json"
RULES_PATH = r"D:\Zainab\FYP\dataset-working-test\realistic_dimensions.json"

# ========== LOAD FILES ==========
with open(PAIRED_PATH, "r", encoding="utf-8") as f:
    paired_data = json.load(f)

with open(RULES_PATH, "r", encoding="utf-8") as f:
    rules_data = json.load(f)

room_sizes = rules_data["room_sizes"]

# ========== CATEGORIES MAPPING ==========
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

# ========== HELPER FUNCTIONS ==========
def map_label_to_room_size(label):
    """Map a dataset label to a room_sizes key using categories."""
    label_lower = label.lower().replace(" ", "_")
    for room_type, aliases in categories.items():
        for alias in aliases:
            if alias.lower().replace(" ", "_") == label_lower:
                # Special handling for bedrooms
                if room_type == "bedroom":
                    if "master" in label_lower or "master" in alias.lower():
                        return "bedroom_master"
                    elif "guest" in label_lower or "guest" in alias.lower():
                        return "bedroom_guest"
                    else:
                        return "bedroom_small"
                if room_type in room_sizes:
                    return room_type
                else:
                    # fallback: first room_size key
                    return next(iter(room_sizes))
    return None

def check_dimensions(width, height, rule):
    """Check if width/height fall within min and comfortable ranges."""
    if not rule:
        return False
    if "min" in rule and "comfortable" in rule:
        w_min, h_min = rule["min"]
        w_max, h_max = rule["comfortable"]
        return w_min <= width <= w_max and h_min <= height <= h_max
    if "min_width" in rule and "max_width" in rule:
        w_min = rule["min_width"]
        w_max = rule["max_width"]
        # height proportion between 1x and 1.2x width
        return w_min <= width <= w_max and w_min <= height <= w_max*1.2
    return False

# ========== VALIDATION ==========
total_entries = len(paired_data)
problematic_entries = []

for entry in paired_data:
    mapped_key = map_label_to_room_size(entry["label"])
    entry["expected_rule"] = mapped_key if mapped_key else "UNKNOWN"
    rule = room_sizes.get(mapped_key)
    if not check_dimensions(entry["width_ft"], entry["height_ft"], rule):
        problematic_entries.append(entry)

# ========== OUTPUT ==========
print(f"✅ Total paired entries: {total_entries}")
print(f"❌ Entries violating rules or unknown: {len(problematic_entries)}")

print("\n🔹 Sample problematic entries (up to 10):")
for ex in problematic_entries[:10]:
    print(ex)

# Optional: summary stats per room type
from collections import defaultdict
stats = defaultdict(list)
for entry in paired_data:
    key = entry["expected_rule"]
    stats[key].append((entry["width_ft"], entry["height_ft"]))

print("\n📊 Summary stats per room type:")
for k, dims in stats.items():
    widths = [d[0] for d in dims]
    heights = [d[1] for d in dims]
    print(f"{k}: width {min(widths):.1f}-{max(widths):.1f}, height {min(heights):.1f}-{max(heights):.1f}")

import json
import re
import random
from rapidfuzz import process, fuzz

# ==========================================================
# 🧹 STEP 1 — Label validation / cleaning rules
# ==========================================================
import re

import re

import re
import re

import re

def is_valid_label(label):
    """
    Returns True if the label represents a meaningful
    architectural/physical object, room, appliance, or utility for GAN/VAE training,
    otherwise False.
    """
    if not label:
        return False

    label = label.strip().lower()

    # --- 1️⃣ Skip empty or too short ---
    if len(label) < 2:
        return False

    # --- 2️⃣ Skip pure numbers or numeric units ---
    if re.fullmatch(r"[\d\.\']+\"?", label) or re.fullmatch(r"\d+(\.\d+)?\s*(m2|m|ft|cm|mm|°)?", label):
        return False

    # --- 3️⃣ Skip UUID-like or long hex strings ---
    if re.fullmatch(r"[0-9a-fA-F\-]{8,}", label):
        return False

    # --- 4️⃣ Skip punctuation-only or symbol-only ---
    if re.fullmatch(r"[\W_]+", label):
        return False

    # --- 5️⃣ Skip floor indicators ---
    if re.fullmatch(r"\d+(\.\s*)?(kerros|krs|floor)", label):
        return False

    # --- 6️⃣ Skip single letters / isolated punctuation ---
    if re.fullmatch(r"[a-z]|\(|\)|\+|\/|\,|\.", label):
        return False

    # --- 7️⃣ Skip known irrelevant / commercial / temporary / CAD markers ---
    remove_terms = {
        "ljh", "ljk", "lmj", "löö", "löylyh",
        "m-", "m-soppi",
        *["mark" + str(i) for i in range(1, 200)],
        "misc", "model",
        "muutos",
        "open", "opentobelow", "opposite",
        "osuus",
        "outercircle", "outerdrain", "overlaypolygon",
        "palos", "panel", "pannuh",
        "placeforfireplacecorner",
        "swing",  # optional: small furniture may also be included in training if desired
        # ambiguous / context-dependent
        "temp", "threshold", "tn", "tp", "tsto-h", "työ-ja", 
        "työh/kuntoiluh", "työh/verstat", "tomisto", "translatecontrol","ah", "aitta",
        "aluetta", "alusta", "apk", "b19", "baarios",
        "basecabinet", "basecabinetround", "basecabinettriangle",
        "bike", "boundarpolygon", "boundarypolygon", "bt", "btr", "burner",
        "burnerarea", "cb","panelarea", "parallelslide", "pfp", "pfpc", "pfpr", "pipe", "pkt",
        "placeforfireplace", "placeforfireplaceround", "porr.", "positive", "puhjakerros",
        "rectangle", "regular", "removecontrol", "resizeecontrol", "resizencontrol", "resizenecontrol",
        "resizescontrol", "resizesecontrol", "retailspace", "rh/k", "rheb", "right", "rollup",
        "rotatecontrol", "selectioncontrols", "serveri", "siiv", "siiv-", "siiv.", "siivous", "siivoush.",
        "sivukainen", "soppi", "space", "sähkö",
        "kassaholvi", "kauko-", "kaukol.", "kauppa", "kerros/kellari", "kvss", "korkea", "käyttämätön", "käytössä)","copypastecontrol",
"dimension",
"dimensionmark",
"dw",
"empty",
"background",
"gs",
"hanna",
"indicator",
"innercircle",
"innerdrain",
"innerpolygon",
"innerpolygonbottom",
"innerpolygonleft",
"innerpolygonright",
"innerpolygontop",
"irt.var",
"irtainvar.",
"fold",
"fp",
"freeshape",
"laajennusvara",
"laatoitus",
"laiteh",
"las.",
"las.p.",
"lasi",
"lasi-parv",
"lasi.",
"lasit.",
"lasitettu",
"lasitus",
"lines",
"mākivaarantie",
"negative",
"rt/tkh",
"sb_high",
"sb_low",
"sb_mid",
"uvv",
"v1-1",
"visual",
"wood",
"ylos",
"zfold"

    }
    if label in remove_terms:
        return False

    # --- 8️⃣ Keep if label is in categories keys or values ---
    from itertools import chain
    all_category_terms = set(categories.keys()) | set(chain.from_iterable(categories.values()))
    if label in all_category_terms:
        return True

    # --- 9️⃣ Keep if it contains at least one alphabetic character (likely meaningful room / object) ---
    if re.search(r"[a-zA-Z]", label):
        return True

    # Otherwise, discard
    return False


# ==========================================================
# 📂 STEP 2 — Load extracted raw color map
# ==========================================================
input_path = "dataset_color_map.json"
with open(input_path, "r", encoding="utf-8") as f:
    raw_labels = json.load(f)

print(f"📦 Loaded {len(raw_labels)} total labels from {input_path}")


# ==========================================================
# 🧭 STEP 3 — Define normalization categories
# ==========================================================
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



# Flatten all known terms for fuzzy matching
all_known_terms = [main for main in categories]
for synonyms in categories.values():
    all_known_terms.extend(synonyms)


# ==========================================================
# 🧠 STEP 4 — Hybrid Normalization (Exact + Fuzzy)
# ==========================================================
cleaned_labels = {}
skipped, matched, added = 0, 0, 0

for label, color in raw_labels.items():
    label = label.strip()
    if not is_valid_label(label):
        skipped += 1
        continue

    match, score, _ = process.extractOne(label.lower(), all_known_terms, scorer=fuzz.partial_ratio)

    if score >= 80:
        canonical = next((k for k, v in categories.items() if match in v or match == k), None)
        if canonical:
            # Prevent overwriting — only set once
            if canonical not in cleaned_labels:
                cleaned_labels[canonical] = color
                matched += 1
        else:
            skipped += 1
    else:
        # Keep alphabetic unknowns as-is
        if re.search(r"[a-zA-Z]", label):
            cleaned_labels[label.lower()] = color
            added += 1
        else:
            skipped += 1


# ==========================================================
# 💾 STEP 5 — Save Cleaned and Normalized Map
# ==========================================================
output_path = "dataset_color_map_clean_normalized.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(cleaned_labels, f, indent=4)

print(f"\n✅ Cleaned + normalized map saved as: {output_path}")
print(f"🧩 Final kept labels: {len(cleaned_labels)}")
print(f"🔹 Matched: {matched} | 🔹 Added raw: {added} | 🔹 Skipped: {skipped}")

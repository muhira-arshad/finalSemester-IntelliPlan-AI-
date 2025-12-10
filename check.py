import json
from rapidfuzz import process, fuzz

# --- Paths ---
COLORING_PATH = r"D:\Zainab\FYP\dataset-working-test\coloring.json"

# --- Load ---
with open(COLORING_PATH, "r", encoding="utf-8") as f:
    color_data = json.load(f)

# --- Categories dictionary (your existing one) ---
categories = {
    "wall": ["wall", "partition", "column", "beam", "structural"],
    "door": ["door", "double door", "sliding door", "doorway"],
    "window": ["window", "frame", "glass", "balcony door"],
    "roof": ["roof", "sisäkatto", "katt.h"],
    "bedroom": ["bedroom", "bed", "master bed", "guest bed", "mh", "(mh)", "ask/mh", "(ask/mh)", "makuuhuone", "alkovi", "makuuparvi", "makuusyv."],
    "livingroom": ["living", "lounge", "hall", "dining", "family room", "oh", "aula/oh", "aula/th", "aula/tvh", "aula", "ala-aula", "yhteistila", "ylä-aula", "yläaula", "tupa", "tuvan", "th/oleskelu", "pirtti"],
    "kitchen": ["kitchen", "pantry", "cook", "kitchenette", "kk", "(kk)", "keittokomero", "avokeittiö", "avok", "avoin", "ruok", "ruok/h", "ruok/k", "ruokailu", "ruokakellari", "ruo-kom", "scullery"],
    "bathroom": ["bath", "bathroom", "toilet", "washroom", "restroom", "wc", "shower room", "pukuh", "aula/pukuh", "suihkutila", "sauna", "sauna/pesuh", "ph", "ph+khh", "pesu+khh", "pesu/psh", "kylpyh"],
    "corridor": ["corridor", "hallway", "passage", "vestibule", "aula/et", "ylä-aula", "yläaula", "sis.tulo", "tk/et", "luhtikäytävä", "parvi-käytävä"],
    "driveway": ["ajoluiska", "ramp", "driveway", "car_ramp", "garage_ramp"],
    "storage": ["storage", "closet", "wardrobe", "store", "cupboard"],
    "balcony": ["balcony", "terrace", "porch", "deck", "veranda", "parveke", "terassi", "tk/kuisti"],
    "garage": ["garage", "carport", "autotalli", "autokatos", "autosuoja", "autovaja", "auto"],
    "staircase": ["stair", "staircase", "steps", "avoparvi"],
    "entry": ["entry", "foyer", "entrance", "lobby", "aula/khh", "vastaanotto"],
    "study": ["ask", "askarteluhuone", "(ask)", "at/työtila", "ateljee", "työtila"],
    "attic": ["yläpohja", "ullakokerros", "vintti", "vinttikerros", "välikerros"],
    "guestroom": ["vierash", "vierashuone", "vierasmaja", "majoitush", "koulutustila"],
    "utilityroom": ["utility", "var/tekn", "var/tek", "vh/et", "psh/khh"],
    "greenhouse": ["viherh", "viherh.", "viinik", "greenhouse"],
    "relaxation": ["saunakamari/kirjasto", "saunatupa", "saunakammari", "recreationroom", "gym"],
    "garden": ["garden", "yard", "lawn"],
    "pool": ["pool", "swimming pool"],
    "outdoor": ["ulkotila", "valokatettupergola"],
    "upper_floor": ["ylakerta", "ylempi", "ylös"],
    "elevator": ["elevator", "lift"],
    "column": ["pillar", "support column"],
    "text": ["text", "label", "annotation", "note"],
    "background": ["background", "canvas"],
    "basement": ["basement", "basement-1", "basement-2"],
    "boiler": ["boiler"],
    "chimney": ["chimney"]
}

# --- Flatten all terms ---
flat_terms = {term.lower(): main for main, terms in categories.items() for term in [main] + terms}

matched = {}
unmatched = []

# --- Match process ---
for label in color_data.keys():
    label_norm = label.strip().lower()
    if label_norm in flat_terms:
        matched[label] = flat_terms[label_norm]
    else:
        match, score, _ = process.extractOne(label_norm, flat_terms.keys(), scorer=fuzz.partial_ratio)
        if score >= 80:
            matched[label] = flat_terms[match]
        else:
            unmatched.append(label)

# --- Summary ---
print(f"✅ Matched {len(matched)} labels from coloring.json")
print(f"⚠️ Unmatched labels: {len(unmatched)}")
if unmatched:
    print(f"Examples: {unmatched[:30]}")

# --- Save normalized map ---
output = {}
for label, main_cat in matched.items():
    output.setdefault(main_cat, []).append(color_data[label])

with open("coloring_normalized_checked.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=4)

# --- Save unmatched labels ---
unmatched_labels = sorted(list(unmatched))
with open("unmatched_labels_list.json", "w", encoding="utf-8") as f:
    json.dump(unmatched_labels, f, indent=4)

print(f"🧾 Saved full unmatched label list → unmatched_labels_list.json ({len(unmatched_labels)} labels)")

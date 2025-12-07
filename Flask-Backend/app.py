from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import time
import traceback

app = Flask(__name__)
CORS(app)

# -------------------------
# Load city data
# -------------------------
def load_city_data():
    """Load data from three separate city JSON files"""
    cities_data = {}
    city_files = {
        "Lahore": "lahore.json",
        "Karachi": "karachi.json", 
        "Islamabad": "islamabad.json"
    }
    
    for city, filename in city_files.items():
        file_path = os.path.join(os.path.dirname(__file__), filename)
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                cities_data[city] = json.load(f)
            print(f"✅ Loaded {city} data from {filename}")
        except FileNotFoundError:
            print(f"⚠️ Warning: {filename} not found for {city}")
            cities_data[city] = {"authorities": {}}
    
    return cities_data

CITIES_DATA = load_city_data()

def analyze_data():
    """Analyze and display loaded data"""
    print("\n🏠 City-based Residential Housing Regulations Backend Starting...")
    print(f"📍 Loaded cities: {', '.join(CITIES_DATA.keys())}")
    
    for city, data in CITIES_DATA.items():
        authorities = data.get("authorities", {})
        num_authorities = len(authorities)
        total_plot_sizes = sum(len(auth.get("plot_sizes", {})) for auth in authorities.values())
        print(f"   {city}: {num_authorities} authorities, {total_plot_sizes} plot sizes")
    
    print("🎯 Focus: Residential Housing Only\n")

analyze_data()

# -------------------------
# Basic Routes
# -------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "🏠 City Housing Regulations API is running!"}), 200

@app.route("/api/form-options", methods=["GET"])
def get_form_options():
    try:
        transformed_data = {
            "cities": {},
            "global_options": {
                "orientation": ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"],
                "facing": ["Main Road", "Side Road", "Corner", "Back Lane"],
                "shape": ["Regular", "Irregular", "Corner", "L-Shape"]
            }
        }
        
        for city, city_data in CITIES_DATA.items():
            transformed_data["cities"][city] = {"authorities": {}}
            authorities = city_data.get("authorities", {})
            for authority, authority_data in authorities.items():
                transformed_data["cities"][city]["authorities"][authority] = {"plot_sizes": {}}
                plot_sizes = authority_data.get("plot_sizes", {})
                for plot_key, plot_data in plot_sizes.items():
                    frontend_key = plot_key.lower().replace(" ", "-").replace("(", "").replace(")", "")
                    transformed_data["cities"][city]["authorities"][authority]["plot_sizes"][frontend_key] = {
                        "meta": {
                            "plot_size_label": plot_key,
                            "authority": authority,
                            "city": city,
                            "frontend_key": frontend_key
                        },
                        "available_options": {
                            "max_floors": plot_data.get("max_floors", 2),
                            "max_height_ft": plot_data.get("max_height_ft"),
                            "ground_coverage_percent": plot_data.get("ground_coverage_percent", 60),
                            "FAR": plot_data.get("FAR", "Not specified"),
                            "mandatory_open_spaces": {
                                "front": f"{plot_data.get('setbacks', {}).get('front', 0)} ft",
                                "rear": f"{plot_data.get('setbacks', {}).get('rear', 0)} ft",
                                "side": f"{plot_data.get('setbacks', {}).get('side', 0)} ft"
                            },
                            "bedrooms_range": plot_data.get("bedrooms_range", {"min": 1, "max": 5}),
                            "washrooms_range": plot_data.get("washrooms_range", {"min": 2, "max": 5}),
                            "public_zones": ["Lounge", "Drawing Room", "TV Lounge", "Family Room", "Study Room"],
                            "service_zones": ["Kitchen", "Store", "Laundry", "Servant Quarter", "Garage"],
                            "kitchen_types": ["Open Kitchen", "Closed Kitchen", "Island Kitchen"],
                            "allowed_features": {
                                "servant_quarter": plot_data.get("max_floors", 2) >= 2,
                                "swimming_pool": plot_data.get("ground_coverage_percent", 60) <= 60,
                                "basement": False,
                                "mumty": True
                            },
                            "parking": {
                                "type": "Single Car Garage" if plot_data.get("max_floors", 2) >= 2 else "Not Required",
                                "spaces": 1 if plot_data.get("max_floors", 2) >= 2 else 0
                            },
                            "special_rules": [
                                f"Maximum {plot_data.get('max_floors', 2)} floors allowed",
                                f"Ground coverage: {plot_data.get('ground_coverage_percent', 60)}%",
                                f"FAR: {plot_data.get('FAR', 'Not specified')}"
                            ],
                            "additional_rules": {}
                        },
                        "raw_bylaws": plot_data
                    }
        print("✅ Successfully transformed form options data")
        return jsonify(transformed_data), 200
    except Exception as e:
        print(f"❌ Error in get_form_options: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/api/cities", methods=["GET"])
def get_cities():
    try:
        return jsonify({"cities": list(CITIES_DATA.keys())}), 200
    except Exception as e:
        print(f"❌ Error in get_cities: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/cities/<city>/authorities", methods=["GET"])
def get_authorities(city):
    try:
        if city not in CITIES_DATA:
            return jsonify({"error": f"City '{city}' not found"}), 404
        return jsonify({"authorities": list(CITIES_DATA[city].get("authorities", {}).keys())}), 200
    except Exception as e:
        print(f"❌ Error in get_authorities: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/bylaws/<city>/<authority>/<plot_size>", methods=["GET"])
def get_bylaws(city, authority, plot_size):
    try:
        if city not in CITIES_DATA:
            return jsonify({"error": f"City '{city}' not found"}), 404
        city_data = CITIES_DATA[city]
        authorities = city_data.get("authorities", {})
        if authority not in authorities:
            return jsonify({"error": f"Authority '{authority}' not found"}), 404
        plot_sizes = authorities[authority].get("plot_sizes", {})
        plot_data = None
        for key, value in plot_sizes.items():
            frontend_key = key.lower().replace(" ", "-").replace("(", "").replace(")", "")
            if frontend_key == plot_size or key == plot_size:
                plot_data = value
                break
        if not plot_data:
            return jsonify({"error": f"Plot size '{plot_size}' not found"}), 404
        return jsonify({"city": city, "authority": authority, "plot_size": plot_size, "bylaws": plot_data}), 200
    except Exception as e:
        print(f"❌ Error in get_bylaws: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/api/validate-selection", methods=["POST"])
def validate_selection():
    try:
        data = request.json
        city = data.get("city")
        plot_size = data.get("plotSize")
        authority = data.get("authority")
        if not city or not plot_size or not authority:
            return jsonify({"error": "City, authority, and plot size are required"}), 400
        if city not in CITIES_DATA:
            return jsonify({"error": f"City '{city}' not found"}), 404
        if authority not in CITIES_DATA[city].get("authorities", {}):
            return jsonify({"error": f"Authority '{authority}' not found"}), 404
        return jsonify({"message": "Validation successful", "valid": True}), 200
    except Exception as e:
        print(f"❌ Error in validate_selection: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/generate-plan", methods=["POST"])
def generate_plan():
    try:
        data = request.json
        city = data.get("city")
        plot_size = data.get("plotSize")
        authority = data.get("authority")
        if not all([city, plot_size, authority]):
            return jsonify({"error": "City, authority, and plot size are required"}), 400
        response = {
            "status": "success",
            "message": "Floorplan generated successfully!",
            "city": city,
            "plot_size": plot_size,
            "authority": authority,
            "configuration": {
                "floors": data.get("floors", []),
                "bedrooms": data.get("bedrooms"),
                "washrooms": data.get("washrooms"),
                "public_zones": data.get("publicZones", []),
                "service_zones": data.get("serviceZones", []),
                "kitchen_type": data.get("kitchenType"),
                "special_features": data.get("specialFeatures", []),
                "orientation": data.get("orientation"),
                "facing": data.get("facing")
            },
            "generated_at": "2024-12-06",
            "plan_id": f"PLAN_{city}_{authority}_{plot_size}_{len(data.get('floors', []))}_floors"
        }
        print(f"✅ Generated plan for {city} - {authority} - {plot_size}")
        return jsonify(response), 200
    except Exception as e:
        print(f"❌ Error in generate_plan: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# -------------------------
# COST ESTIMATION & CONSTRUCTION ENDPOINTS
# -------------------------
@app.route("/api/cost-estimate", methods=["POST"])
def save_cost_estimate():
    try:
        data = request.json
        required_fields = ["city", "authority", "plotSize", "length", "width", "floors", "totalCost"]
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400
        estimate_id = f"EST_{int(time.time())}_{data['city']}_{data['plotSize']}"
        estimate = {
            "estimate_id": estimate_id,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "project_details": {
                "city": data["city"],
                "authority": data["authority"],
                "plot_size": data["plotSize"],
                "dimensions": {
                    "length": data["length"],
                    "width": data["width"],
                    "floors": data["floors"],
                    "total_area": data.get("totalArea", 0)
                }
            },
            "cost_breakdown": data.get("costBreakdown", {}),
            "total_cost": data["totalCost"],
            "parameters": {
                "material_rate": data.get("materialRate"),
                "labor_rate": data.get("laborRate"),
                "electrical_cost": data.get("electricalCost"),
                "plumbing_cost": data.get("plumbingCost"),
                "finishing_cost": data.get("finishingCost"),
                "contingency_percent": data.get("contingencyPercent")
            }
        }
        print(f"✅ Cost estimate saved: {estimate_id}")
        return jsonify({"status": "success", "message": "Cost estimate saved successfully", "estimate": estimate}), 200
    except Exception as e:
        print(f"❌ Error saving cost estimate: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/api/cost-rates", methods=["GET"])
def get_cost_rates():
    try:
        rates = {
            "Lahore": {"material_rates":{"basic":2200,"standard":2600,"premium":3000,"luxury":3500},"labor_rate":500,"electrical_rate":150,"plumbing_rate":100,"finishing_rate":800,"recommended_contingency":5},
            "Karachi": {"material_rates":{"basic":2300,"standard":2700,"premium":3100,"luxury":3600},"labor_rate":550,"electrical_rate":160,"plumbing_rate":110,"finishing_rate":850,"recommended_contingency":7},
            "Islamabad": {"material_rates":{"basic":2400,"standard":2800,"premium":3200,"luxury":3700},"labor_rate":600,"electrical_rate":170,"plumbing_rate":120,"finishing_rate":900,"recommended_contingency":6}
        }
        print("✅ Cost rates retrieved")
        return jsonify({"status":"success","rates":rates,"currency":"PKR","unit":"per_sqft","last_updated":"2024-12-06"}), 200
    except Exception as e:
        print(f"❌ Error getting cost rates: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/plot-dimensions/<city>/<plot_size>", methods=["GET"])
def get_plot_dimensions(city, plot_size):
    try:
        standard_dimensions = {
            "3-marla": {"length":22.5,"width":30},
            "5-marla": {"length":25,"width":50},
            "7-marla": {"length":32.5,"width":56},
            "10-marla": {"length":35,"width":65},
            "1-kanal": {"length":45,"width":90},
            "2-kanal": {"length":90,"width":90},
            "500-sq-ft": {"length":20,"width":25},
            "1000-sq-ft": {"length":25,"width":40},
            "2000-sq-ft": {"length":40,"width":50},
            "5000-sq-ft": {"length":50,"width":100},
            "60-119-sq-yd": {"length":20,"width":27},
            "120-199-sq-yd": {"length":25,"width":36},
            "200-399-sq-yd": {"length":35,"width":45},
            "400-999-sq-yd": {"length":50,"width":60}
        }
        dimensions = standard_dimensions.get(plot_size)
        if not dimensions:
            return jsonify({"error": f"Dimensions not found for plot size: {plot_size}", "available_sizes": list(standard_dimensions.keys())}), 404
        print(f"✅ Dimensions retrieved for {city}/{plot_size}")
        return jsonify({"status":"success","city":city,"plot_size":plot_size,"dimensions":dimensions,"area_sqft":dimensions["length"]*dimensions["width"]}),200
    except Exception as e:
        print(f"❌ Error getting plot dimensions: {str(e)}")
        return jsonify({"error": str(e)}),500

@app.route("/api/construction-calculator", methods=["POST"])
def construction_calculator():
    try:
        data = request.json
        length = float(data.get("length",0))
        width = float(data.get("width",0))
        floors = int(data.get("floors",0))
        material_rate = float(data.get("materialRate",2600))
        labor_rate = float(data.get("laborRate",500))
        electrical_rate = float(data.get("electricalRate",150))
        plumbing_rate = float(data.get("plumbingRate",100))
        finishing_rate = float(data.get("finishingRate",800))
        contingency_percent = float(data.get("contingencyPercent",5))
        if length<=0 or width<=0 or floors<=0:
            return jsonify({"error":"Length, width, and floors must be positive numbers"}),400
        plot_area = length*width
        total_area = plot_area*floors
        structural_cost = total_area*(material_rate+labor_rate)
        electrical_cost = total_area*electrical_rate
        plumbing_cost = total_area*plumbing_rate
        finishing_cost = total_area*finishing_rate
        subtotal = structural_cost+electrical_cost+plumbing_cost+finishing_cost
        contingency_cost = subtotal*(contingency_percent/100)
        total_cost = subtotal + contingency_cost
        cost_per_sqft = total_cost/total_area
        breakdown = {
            "areas":{"plot_area_sqft":plot_area,"construction_area_sqft":total_area,"floors":floors},
            "costs":{
                "structural":{"amount":structural_cost,"rate":material_rate+labor_rate,"description":"Material + Labor"},
                "electrical":{"amount":electrical_cost,"rate":electrical_rate,"description":"Electrical work"},
                "plumbing":{"amount":plumbing_cost,"rate":plumbing_rate,"description":"Plumbing & Sanitary"},
                "finishing":{"amount":finishing_cost,"rate":finishing_rate,"description":"Finishing work"},
                "contingency":{"amount":contingency_cost,"percent":contingency_percent,"description":f"Contingency ({contingency_percent}%)"}
            },
            "totals":{"subtotal":subtotal,"contingency":contingency_cost,"total_cost":total_cost,"cost_per_sqft":cost_per_sqft,"total_in_millions":total_cost/1000000}
        }
        print(f"✅ Construction cost calculated: PKR {total_cost:,.0f}")
        return jsonify({"status":"success","breakdown":breakdown,"currency":"PKR"}),200
    except Exception as e:
        print(f"❌ Error in construction calculator: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}),500

# -------------------------
# Run Flask
# -------------------------
if __name__ == "__main__":
    print("🚀 Starting Flask Backend on http://127.0.0.1:5000")
    app.run(debug=True, host="127.0.0.1", port=5000)

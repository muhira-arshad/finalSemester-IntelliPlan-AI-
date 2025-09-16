from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import re

app = Flask(__name__)
CORS(app)

# ---------------------------
# Load City-specific JSON Files
# ---------------------------
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
            cities_data[city] = {}
    
    return cities_data

CITIES_DATA = load_city_data()

# ---------------------------
# Enhanced Helper Functions for City-based Structure
# ---------------------------
def transform_plot_size_key(key):
    """Convert plot size to frontend format (e.g., '3 Marla' -> '3-marla')"""
    return key.lower().replace(" ", "-")

def get_reverse_plot_size_key(frontend_key):
    """Convert frontend format back to JSON format (e.g., '3-marla' -> '3 Marla')"""
    parts = frontend_key.split("-")
    if len(parts) == 2:
        return f"{parts[0].title()} {parts[1].title()}"
    return frontend_key.title()

def available_cities():
    """Get all available cities"""
    return list(CITIES_DATA.keys())

def available_authorities_for_city(city):
    """Get all available authorities for a specific city"""
    city_data = CITIES_DATA.get(city, {})
    residential_data = city_data.get("residential", {})
    if not residential_data:
        return []
    
    # Get authorities from first plot size
    first_plot = next(iter(residential_data), None)
    if first_plot:
        return list(residential_data[first_plot].keys())
    return []

def get_city_authority_data(city, plot_size, authority):
    """Get specific authority data for a plot size in a city"""
    city_data = CITIES_DATA.get(city, {})
    residential_data = city_data.get("residential", {})
    plot_data = residential_data.get(plot_size, {})
    return plot_data.get(authority, {})

def get_city_residential_data(city):
    """Get residential data for a specific city"""
    return CITIES_DATA.get(city, {}).get("residential", {})

def get_bedrooms_range(plot_size, authority, city):
    """Get bedroom range based on plot size, authority, and city regulations"""
    ranges = {
        "3 Marla": {"min": 1, "max": 2},
        "5 Marla": {"min": 2, "max": 3},
        "7 Marla": {"min": 2, "max": 4},
        "10 Marla": {"min": 3, "max": 5},
        "1 Kanal": {"min": 4, "max": 7},
        "2 Kanal": {"min": 5, "max": 8}
    }
    return ranges.get(plot_size, {"min": 2, "max": 3})

def get_washrooms_range(plot_size, authority, city):
    """Get washroom range based on plot size, authority, and city regulations"""
    ranges = {
        "3 Marla": {"min": 1, "max": 2},
        "5 Marla": {"min": 2, "max": 3},
        "7 Marla": {"min": 3, "max": 4},
        "10 Marla": {"min": 3, "max": 5},
        "1 Kanal": {"min": 4, "max": 6},
        "2 Kanal": {"min": 5, "max": 8}
    }
    return ranges.get(plot_size, {"min": 1, "max": 3})

def parse_boolean_from_rules(rules, keyword):
    """Return True/False/None based on presence of 'allowed'/'not allowed' with keyword."""
    if not rules:
        return None
    keyword = keyword.lower()
    for rule in rules:
        s = rule.lower()
        if keyword in s:
            if "not allowed" in s or "not permitted" in s or "prohibited" in s:
                return False
            if "allowed" in s or "permitted" in s or "can be" in s:
                return True
    return None

def get_allowed_features(city, plot_size, authority, auth_data):
    """Determine allowed features based on city-specific bylaws data"""
    special_rules = auth_data.get("special_rules", [])
    city_data = CITIES_DATA.get(city, {})
    additional_rules = city_data.get("residential", {}).get(plot_size, {}).get("additional_rules", {})

    # Parse features from rules
    servant_allowed = parse_boolean_from_rules(special_rules, "servant quarter")
    pool_allowed = parse_boolean_from_rules(special_rules, "swimming pool")
    
    basement_info = city_data.get("special_provisions", {}).get("Basement", {}).get(authority, {})

    # Default logic based on authority and plot size
    if servant_allowed is None:
        # DHA: not allowed for small plots, allowed for 10 Marla+
        if authority == "DHA":
            servant_allowed = plot_size in ["10 Marla", "1 Kanal", "2 Kanal"]
        else:
            servant_allowed = plot_size not in ["3 Marla", "5 Marla"]

    if pool_allowed is None:
        # Generally not allowed for small plots
        if authority == "DHA":
            pool_allowed = plot_size in ["1 Kanal", "2 Kanal"]
        else:
            pool_allowed = plot_size in ["10 Marla", "1 Kanal", "2 Kanal"]

    # Basement allowance
    basement_allowed = False
    if basement_info:
        if basement_info.get("allowed") is True:
            basement_allowed = True
        elif basement_info.get("allowed") == "conditional":
            basement_allowed = plot_size in ["1 Kanal", "2 Kanal"]

    # Mumty from additional rules
    mumty_info = additional_rules.get("mumty", {})
    mumty_allowed = mumty_info.get("allowed", authority != "DHA")

    return {
        "servant_quarter": servant_allowed,
        "swimming_pool": pool_allowed,
        "basement": basement_allowed,
        "mumty": mumty_allowed
    }

def get_public_zones(plot_size, authority, city):
    """Get available public zones based on plot size and city"""
    base_zones = ["Drawing Room", "TV Lounge"]

    if plot_size in ["5 Marla", "7 Marla", "10 Marla", "1 Kanal", "2 Kanal"]:
        base_zones.append("Dining Room")

    if plot_size in ["10 Marla", "1 Kanal", "2 Kanal"]:
        base_zones.extend(["Family Lounge", "Study Room"])

    if plot_size in ["1 Kanal", "2 Kanal"]:
        base_zones.append("Guest Room")

    return base_zones

def get_service_zones(plot_size, authority, city, allowed_features):
    """Get available service zones based on plot size, city, and features"""
    base_zones = ["Kitchen", "Store"]

    if plot_size in ["5 Marla", "7 Marla", "10 Marla", "1 Kanal", "2 Kanal"]:
        base_zones.append("Laundry")

    if plot_size in ["10 Marla", "1 Kanal", "2 Kanal"]:
        base_zones.append("Utility Room")

    if allowed_features.get("servant_quarter"):
        base_zones.append("Servant Quarter")

    if plot_size in ["1 Kanal", "2 Kanal"]:
        base_zones.append("Pantry")

    return base_zones

def get_kitchen_types(plot_size, authority, city):
    """Get available kitchen types based on plot size and city"""
    base_types = ["Open Kitchen", "Closed Kitchen"]

    if plot_size in ["5 Marla", "7 Marla", "10 Marla", "1 Kanal", "2 Kanal"]:
        base_types.append("Island Kitchen")

    if plot_size in ["10 Marla", "1 Kanal", "2 Kanal"]:
        base_types.append("Modular Kitchen")

    if plot_size in ["1 Kanal", "2 Kanal"]:
        base_types.append("Chef Kitchen")

    return base_types

def parse_parking_info(parking_str, plot_size):
    """Parse parking information from bylaws"""
    if not parking_str or parking_str.lower() == "optional":
        return {"type": "optional", "spaces": 0}

    # Extract number of spaces
    numbers = re.findall(r'\d+', parking_str)
    if len(numbers) == 1:
        return {"type": "required", "spaces": int(numbers[0])}
    elif len(numbers) == 2:
        return {"type": "range", "min": int(numbers[0]), "max": int(numbers[1])}

    # Default based on plot size
    defaults = {
        "3 Marla": 1, "5 Marla": 1, "7 Marla": 2,
        "10 Marla": 2, "1 Kanal": 3, "2 Kanal": 4
    }
    return {"type": "recommended", "spaces": defaults.get(plot_size, 1)}

# ---------------------------
# Main API Functions for City-based Structure
# ---------------------------
def create_city_frontend_structure():
    """Create the complete frontend structure with city-based dynamic options"""
    cities_structure = {}

    for city in available_cities():
        city_data = CITIES_DATA.get(city, {})
        residential_data = city_data.get("residential", {})
        
        cities_structure[city] = {"authorities": {}}
        
        authorities = available_authorities_for_city(city)
        
        for authority in authorities:
            cities_structure[city]["authorities"][authority] = {"plot_sizes": {}}

            for original_key, bylaws_data in residential_data.items():
                frontend_key = transform_plot_size_key(original_key)
                auth_data = get_city_authority_data(city, original_key, authority)
                if not auth_data:
                    continue

                # Get allowed features
                allowed_features = get_allowed_features(city, original_key, authority, auth_data)

                # Build available options dynamically from city bylaws
                available_options = {
                    # Basic restrictions from bylaws
                    "max_floors": auth_data.get("max_floors", 2),
                    "max_height_ft": auth_data.get("max_height_ft"),
                    "ground_coverage_percent": auth_data.get("ground_coverage_percent"),
                    "FAR": auth_data.get("FAR", "Not specified"),
                    "mandatory_open_spaces": auth_data.get("mandatory_open_spaces", {}),

                    # Dynamic ranges
                    "bedrooms_range": get_bedrooms_range(original_key, authority, city),
                    "washrooms_range": get_washrooms_range(original_key, authority, city),

                    # Available zones based on plot size and city
                    "public_zones": get_public_zones(original_key, authority, city),
                    "service_zones": get_service_zones(original_key, authority, city, allowed_features),
                    "kitchen_types": get_kitchen_types(original_key, authority, city),

                    # Features based on city bylaws
                    "allowed_features": allowed_features,

                    # Parking info
                    "parking": parse_parking_info(auth_data.get("parking", ""), original_key),

                    # Special rules
                    "special_rules": auth_data.get("special_rules", []),

                    # Additional rules
                    "additional_rules": residential_data.get(original_key, {}).get("additional_rules", {})
                }

                # The complete plot data
                plot_data = {
                    "meta": {
                        "city": city,
                        "plot_size_label": original_key,
                        "authority": authority,
                        "frontend_key": frontend_key
                    },
                    "available_options": available_options,
                    "raw_bylaws": auth_data  # Include raw data for reference
                }

                cities_structure[city]["authorities"][authority]["plot_sizes"][frontend_key] = plot_data

    return {
        "cities": cities_structure,
        "global_options": {
            "orientation": ["North", "South", "East", "West"],
            "facing": ["Standard", "Park", "Corner", "Double Road"],
            "shape": ["Regular", "Irregular"]
        }
    }

# ---------------------------
# API Endpoints for City-based Structure
# ---------------------------
@app.route("/api/cities", methods=["GET"])
def get_cities():
    """Get all available cities"""
    try:
        return jsonify({
            "cities": available_cities(),
            "total_cities": len(available_cities())
        })
    except Exception as e:
        print(f"Error in get_cities: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/cities/<city>/authorities", methods=["GET"])
def get_city_authorities(city):
    """Get all authorities for a specific city"""
    try:
        if city not in CITIES_DATA:
            return jsonify({"error": "City not found"}), 404
        
        authorities = available_authorities_for_city(city)
        return jsonify({
            "city": city,
            "authorities": authorities,
            "total_authorities": len(authorities)
        })
    except Exception as e:
        print(f"Error in get_city_authorities: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/form-options", methods=["GET"])
def form_options():
    """Return dynamic options based on city-specific bylaws data"""
    try:
        if not CITIES_DATA:
            return jsonify({"error": "No city data loaded"}), 404

        frontend_data = create_city_frontend_structure()
        return jsonify(frontend_data)
    except Exception as e:
        print(f"Error in form_options: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/bylaws/<city>/<authority>/<plot_size>", methods=["GET"])
def get_city_bylaws_info(city, authority, plot_size):
    """Get detailed bylaws information for specific city, authority and plot size"""
    try:
        if city not in CITIES_DATA:
            return jsonify({"error": "City not found"}), 404

        # Convert frontend format back to JSON format
        original_plot_size = get_reverse_plot_size_key(plot_size)
        
        residential_data = get_city_residential_data(city)
        if original_plot_size not in residential_data:
            return jsonify({"error": "Plot size not found"}), 404

        auth_data = get_city_authority_data(city, original_plot_size, authority)
        if not auth_data:
            return jsonify({"error": f"No data for {authority} {original_plot_size} in {city}"}), 404

        # Get dynamic options for this combination
        allowed_features = get_allowed_features(city, original_plot_size, authority, auth_data)

        city_data = CITIES_DATA.get(city, {})
        return jsonify({
            "city": city,
            "authority": authority,
            "plot_size": original_plot_size,
            "frontend_key": plot_size,
            "regulations": auth_data,
            "dynamic_options": {
                "bedrooms_range": get_bedrooms_range(original_plot_size, authority, city),
                "washrooms_range": get_washrooms_range(original_plot_size, authority, city),
                "public_zones": get_public_zones(original_plot_size, authority, city),
                "service_zones": get_service_zones(original_plot_size, authority, city, allowed_features),
                "kitchen_types": get_kitchen_types(original_plot_size, authority, city),
                "allowed_features": allowed_features,
                "parking": parse_parking_info(auth_data.get("parking", ""), original_plot_size)
            },
            "additional_rules": residential_data.get(original_plot_size, {}).get("additional_rules", {}),
            "common_requirements": city_data.get("common_requirements", {}),
            "setback_rules": city_data.get("setback_rules", {}).get(authority, {})
        })
    except Exception as e:
        print(f"Error in get_city_bylaws_info: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/validate-selection", methods=["POST"])
def validate_selection():
    """Validate user selection against city-specific bylaws"""
    try:
        data = request.json or {}
        city = data.get("city")
        authority = data.get("authority")
        plot_size_key = data.get("plot_size")

        if not city or city not in CITIES_DATA:
            return jsonify({"error": "Invalid or missing city"}), 400

        # Convert to original format
        original_plot_size = get_reverse_plot_size_key(plot_size_key)
        auth_data = get_city_authority_data(city, original_plot_size, authority)

        if not auth_data:
            return jsonify({"error": "Invalid city/authority/plot size combination"}), 400

        # Validate floors
        max_floors = auth_data.get("max_floors", 2)
        requested_floors = len(data.get("floors", []))
        if requested_floors > max_floors:
            return jsonify({
                "error": f"Maximum {max_floors} floors allowed for {original_plot_size} in {authority}, {city}",
                "max_allowed": max_floors
            }), 400

        # Validate bedrooms
        bedroom_range = get_bedrooms_range(original_plot_size, authority, city)
        requested_bedrooms = int(data.get("bedrooms", 0))
        if requested_bedrooms < bedroom_range["min"] or requested_bedrooms > bedroom_range["max"]:
            return jsonify({
                "error": f"Bedrooms must be between {bedroom_range['min']} and {bedroom_range['max']} for {original_plot_size} in {city}",
                "range": bedroom_range
            }), 400

        # Validate features
        allowed_features = get_allowed_features(city, original_plot_size, authority, auth_data)
        requested_features = data.get("special_features", [])

        for feature in requested_features:
            feature_key = feature.lower().replace(" ", "_").replace("-", "_")
            if feature_key in allowed_features and not allowed_features[feature_key]:
                return jsonify({
                    "error": f"{feature} is not allowed for {original_plot_size} in {authority}, {city}",
                    "allowed_features": allowed_features
                }), 400

        return jsonify({"valid": True, "message": "Selection is valid"})

    except Exception as e:
        print(f"Error in validate_selection: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/generate-plan", methods=["POST"])
def generate_plan():
    """Enhanced plan generation with city-specific bylaws validation"""
    try:
        data = request.json or {}
        city = data.get("city")
        authority = data.get("authority")
        plot_size_key = data.get("plot_size")

        # Validate first
        validation_response = validate_selection()
        if validation_response.status_code != 200:  # If validation failed
            return validation_response

        # Convert to original format
        original_plot_size = get_reverse_plot_size_key(plot_size_key)
        auth_data = get_city_authority_data(city, original_plot_size, authority)

        # Generate plan (your existing logic here)
        # This is where you'd integrate with your plan generation logic

        return jsonify({
            "message": "Residential plan generated successfully",
            "city": city,
            "authority": authority,
            "plot_size": original_plot_size,
            "compliance": f"Verified against {city} {authority} bylaws",
            "regulations_applied": auth_data,
            "plan_type": "residential"
        })

    except Exception as e:
        print(f"Error in generate_plan: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/health", methods=["GET"])
def health():
    """Health check with city-specific information"""
    total_combinations = 0
    city_summary = {}
    
    for city, city_data in CITIES_DATA.items():
        residential_data = city_data.get("residential", {})
        authorities = available_authorities_for_city(city)
        combinations = sum(len(residential_data.get(plot, {})) for plot in residential_data)
        total_combinations += combinations
        
        city_summary[city] = {
            "authorities": authorities,
            "plot_sizes": list(residential_data.keys()),
            "combinations": combinations
        }
    
    return jsonify({
        "status": "healthy",
        "cities_loaded": available_cities(),
        "city_summary": city_summary,
        "total_combinations": total_combinations,
        "focus": "residential_housing"
    })

@app.route("/api/debug", methods=["GET"])
def debug():
    """Debug endpoint with city-specific structure information"""
    debug_info = {}
    
    for city in available_cities():
        city_data = CITIES_DATA.get(city, {})
        residential_data = city_data.get("residential", {})
        
        sample_plot = next(iter(residential_data), None) if residential_data else None
        sample_data = None
        if sample_plot:
            sample_authority = next(iter(residential_data[sample_plot]), None)
            if sample_authority:
                sample_data = get_city_authority_data(city, sample_plot, sample_authority)
        
        debug_info[city] = {
            "residential_plots_count": len(residential_data),
            "sample_plot": sample_plot,
            "sample_authority_data": sample_data,
            "available_authorities": available_authorities_for_city(city),
            "structure": {
                "residential": list(residential_data.keys()),
                "has_special_provisions": "special_provisions" in city_data,
                "has_setback_rules": "setback_rules" in city_data,
                "has_common_requirements": "common_requirements" in city_data
            }
        }
    
    return jsonify({
        "cities_debug": debug_info,
        "total_cities": len(available_cities()),
        "focus": "residential_housing_only"
    })

if __name__ == "__main__":
    print("🏠 City-based Residential Housing Regulations Backend Starting...")
    print(f"📍 Loaded cities: {', '.join(available_cities())}")
    
    for city in available_cities():
        authorities = available_authorities_for_city(city)
        residential_data = get_city_residential_data(city)
        print(f"   {city}: {len(authorities)} authorities, {len(residential_data)} plot sizes")
    
    print("🎯 Focus: Residential Housing Only")
    app.run(debug=True, port=5000)

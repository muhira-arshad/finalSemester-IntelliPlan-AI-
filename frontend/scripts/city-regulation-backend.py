from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from typing import Dict, Any, List, Optional

app = Flask(__name__)
CORS(app)

# Global variables to store loaded data
CITY_DATA = {}
GLOBAL_OPTIONS = {
    "orientation": ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"],
    "facing": ["Main Road", "Side Road", "Corner", "Back Lane"],
    "shape": ["Regular", "Irregular", "Corner", "L-Shape"]
}

def load_city_data():
    """Load data from city JSON files"""
    global CITY_DATA
    
    cities = ["lahore", "karachi", "islamabad"]
    
    for city in cities:
        try:
            with open(f"{city}.json", "r", encoding="utf-8") as f:
                CITY_DATA[city.title()] = json.load(f)
                print(f"[Backend] Loaded {city.title()} data successfully")
        except FileNotFoundError:
            print(f"[Backend] Warning: {city}.json not found")
            CITY_DATA[city.title()] = {"authorities": {}}
        except json.JSONDecodeError as e:
            print(f"[Backend] Error loading {city}.json: {e}")
            CITY_DATA[city.title()] = {"authorities": {}}

def transform_plot_size_key(plot_size: str) -> str:
    """Transform plot size for frontend compatibility"""
    return plot_size.lower().replace(" ", "-").replace("_", "-")

def get_dynamic_options(bylaws_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract dynamic options from bylaws data"""
    
    # Default values
    options = {
        "max_floors": 2,
        "max_height_ft": 35,
        "ground_coverage_percent": 60,
        "FAR": "1:1",
        "mandatory_open_spaces": {
            "front": "5 feet",
            "rear": "5 feet", 
            "side": "3 feet"
        },
        "bedrooms_range": {"min": 2, "max": 5},
        "washrooms_range": {"min": 2, "max": 4},
        "public_zones": ["Drawing Room", "Dining Room", "TV Lounge", "Guest Room"],
        "service_zones": ["Kitchen", "Store", "Laundry", "Servant Quarter"],
        "kitchen_types": ["Open Kitchen", "Closed Kitchen", "Island Kitchen"],
        "allowed_features": {
            "servant_quarter": True,
            "swimming_pool": False,
            "basement": False,
            "mumty": True
        },
        "parking": {
            "type": "Covered",
            "spaces": 1
        },
        "special_rules": [],
        "additional_rules": {}
    }
    
    # Extract from bylaws if available
    if "floors" in bylaws_data:
        floors_data = bylaws_data["floors"]
        if isinstance(floors_data, dict):
            options["max_floors"] = len([k for k in floors_data.keys() if k != "basement"])
        elif isinstance(floors_data, int):
            options["max_floors"] = floors_data
    
    if "building_regulations" in bylaws_data:
        regs = bylaws_data["building_regulations"]
        if "ground_coverage" in regs:
            options["ground_coverage_percent"] = regs["ground_coverage"]
        if "FAR" in regs:
            options["FAR"] = regs["FAR"]
        if "max_height" in regs:
            options["max_height_ft"] = regs["max_height"]
    
    if "setbacks" in bylaws_data:
        setbacks = bylaws_data["setbacks"]
        options["mandatory_open_spaces"] = {
            "front": f"{setbacks.get('front', 5)} feet",
            "rear": f"{setbacks.get('rear', 5)} feet",
            "side": f"{setbacks.get('side', 3)} feet"
        }
    
    # Determine features based on plot size and authority
    plot_size = bylaws_data.get("plot_size", "")
    if "1 kanal" in plot_size.lower() or "2 kanal" in plot_size.lower():
        options["allowed_features"]["swimming_pool"] = True
        options["allowed_features"]["basement"] = True
        options["bedrooms_range"]["max"] = 6
        options["washrooms_range"]["max"] = 5
    elif "10 marla" in plot_size.lower():
        options["allowed_features"]["basement"] = True
        options["bedrooms_range"]["max"] = 4
    
    return options

@app.route('/api/form-options', methods=['GET'])
def get_form_options():
    """Get all available form options organized by city"""
    try:
        response_data = {
            "cities": {},
            "global_options": GLOBAL_OPTIONS
        }
        
        for city_name, city_data in CITY_DATA.items():
            if "authorities" not in city_data:
                continue
                
            response_data["cities"][city_name] = {
                "authorities": {}
            }
            
            for authority_name, authority_data in city_data["authorities"].items():
                if "plot_sizes" not in authority_data:
                    continue
                    
                response_data["cities"][city_name]["authorities"][authority_name] = {
                    "plot_sizes": {}
                }
                
                for plot_size, plot_data in authority_data["plot_sizes"].items():
                    frontend_key = transform_plot_size_key(plot_size)
                    
                    response_data["cities"][city_name]["authorities"][authority_name]["plot_sizes"][frontend_key] = {
                        "meta": {
                            "plot_size_label": plot_size,
                            "authority": authority_name,
                            "city": city_name,
                            "frontend_key": frontend_key
                        },
                        "available_options": get_dynamic_options(plot_data),
                        "raw_bylaws": plot_data
                    }
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"[Backend] Error in get_form_options: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/bylaws/<city>/<authority>/<plot_size>', methods=['GET'])
def get_bylaws_info(city: str, authority: str, plot_size: str):
    """Get specific bylaws information"""
    try:
        city_title = city.title()
        
        if city_title not in CITY_DATA:
            return jsonify({"error": f"City {city} not found"}), 404
            
        city_data = CITY_DATA[city_title]
        
        if authority not in city_data.get("authorities", {}):
            return jsonify({"error": f"Authority {authority} not found in {city}"}), 404
            
        authority_data = city_data["authorities"][authority]
        
        # Find plot size (handle frontend key transformation)
        plot_data = None
        for original_plot_size, data in authority_data.get("plot_sizes", {}).items():
            if transform_plot_size_key(original_plot_size) == plot_size:
                plot_data = data
                break
        
        if not plot_data:
            return jsonify({"error": f"Plot size {plot_size} not found"}), 404
        
        response = {
            "meta": {
                "plot_size_label": original_plot_size,
                "authority": authority,
                "city": city_title,
                "frontend_key": plot_size
            },
            "available_options": get_dynamic_options(plot_data),
            "raw_bylaws": plot_data
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"[Backend] Error in get_bylaws_info: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/validate-selection', methods=['POST'])
def validate_selection():
    """Validate user selection against bylaws"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        required_fields = ["city", "authority", "plotSize", "bedrooms", "floors"]
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
        
        # Get bylaws data
        city_title = data["city"].title()
        authority = data["authority"]
        plot_size = data["plotSize"]
        
        if city_title not in CITY_DATA:
            return jsonify({"error": f"Invalid city: {data['city']}"}), 400
        
        city_data = CITY_DATA[city_title]
        
        if authority not in city_data.get("authorities", {}):
            return jsonify({"error": f"Invalid authority: {authority}"}), 400
        
        authority_data = city_data["authorities"][authority]
        
        # Find plot data
        plot_data = None
        for original_plot_size, bylaws_data in authority_data.get("plot_sizes", {}).items():
            if transform_plot_size_key(original_plot_size) == plot_size:
                plot_data = bylaws_data
                break
        
        if not plot_data:
            return jsonify({"error": f"Invalid plot size: {plot_size}"}), 400
        
        # Get dynamic options for validation
        options = get_dynamic_options(plot_data)
        
        # Validate bedrooms
        bedrooms = int(data["bedrooms"])
        if bedrooms < options["bedrooms_range"]["min"] or bedrooms > options["bedrooms_range"]["max"]:
            return jsonify({
                "error": f"Bedrooms must be between {options['bedrooms_range']['min']} and {options['bedrooms_range']['max']}"
            }), 400
        
        # Validate floors
        max_floors = options["max_floors"]
        floor_count = len([f for f in data["floors"] if f != "basement"])
        if floor_count > max_floors:
            return jsonify({
                "error": f"Maximum {max_floors} floors allowed for this plot size"
            }), 400
        
        return jsonify({"valid": True, "message": "Selection is valid"})
        
    except Exception as e:
        print(f"[Backend] Error in validate_selection: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-plan', methods=['POST'])
def generate_plan():
    """Generate building plan based on user selection"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # For now, return a success response with the form data
        # In a real implementation, this would generate actual floor plans
        response = {
            "success": True,
            "message": "Plan generated successfully",
            "plan_data": {
                "city": data.get("city"),
                "authority": data.get("authority"),
                "plot_size": data.get("plotSize"),
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
                }
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"[Backend] Error in generate_plan: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "cities_loaded": list(CITY_DATA.keys()),
        "total_authorities": sum(len(city.get("authorities", {})) for city in CITY_DATA.values())
    })

if __name__ == '__main__':
    print("[Backend] Starting City Regulations Backend...")
    load_city_data()
    print(f"[Backend] Loaded data for cities: {list(CITY_DATA.keys())}")
    app.run(host='0.0.0.0', port=3001, debug=True)

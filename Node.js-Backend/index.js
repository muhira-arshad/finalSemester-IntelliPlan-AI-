const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch"); // MUST be v2

const app = express();
app.use(cors());
app.use(express.json());

const FLASK_URL = "http://127.0.0.1:5000";

// Root route to fix "Cannot GET /" error
app.get("/", (req, res) => {
  res.json({
    message: "Node.js Backend API is running!",
    status: "active",
    endpoints: [
      "GET /api/form-options",
      "POST /api/generate-plan",
      "POST /api/validate-selection",
      "POST /api/cost-estimate",
      "GET /api/cost-rates",
      "GET /api/plot-dimensions/:city/:plotSize",
      "POST /api/construction-calculator",
      "GET /api/cities",
      "GET /api/cities/:city/authorities",
      "GET /api/bylaws/:city/:authority/:plotSize"
    ]
  });
});

// Forward form-options to Flask
app.get("/api/form-options", async (req, res) => {
  console.log("📥 Frontend → Node.js: GET /api/form-options");
  try {
    const flaskResponse = await fetch(`${FLASK_URL}/api/form-options`);
    const data = await flaskResponse.json();
    console.log("✅ Node.js → Flask → Node.js → Frontend: Form options sent");
    res.json(data);
  } catch (err) {
    console.error("❌ Node → Flask error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Forward generate-plan to Flask
app.post("/api/generate-plan", async (req, res) => {
  console.log("📥 Frontend → Node.js: POST /api/generate-plan");
  console.log("📤 Node.js → Flask: Forwarding generate-plan request");
  try {
    const flaskResponse = await fetch(`${FLASK_URL}/api/generate-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      return res.status(flaskResponse.status).json(errorData);
    }

    const result = await flaskResponse.json();
    console.log("✅ Node.js → Flask → Node.js → Frontend: Plan generated");
    return res.json(result);
  } catch (error) {
    console.error("❌ Node → Flask error:", error);
    return res.status(500).json({ error: "Failed to fetch from Flask", details: error.message });
  }
});

// Forward validate-selection to Flask
app.post("/api/validate-selection", async (req, res) => {
  console.log("📥 Frontend → Node.js: POST /api/validate-selection");
  console.log("📤 Node.js → Flask: Forwarding validate-selection request");
  try {
    const flaskResponse = await fetch(`${FLASK_URL}/api/validate-selection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      return res.status(flaskResponse.status).json(errorData);
    }

    const result = await flaskResponse.json();
    console.log("✅ Node.js → Flask → Node.js → Frontend: Selection validated");
    return res.json(result);
  } catch (error) {
    console.error("❌ Node → Flask error:", error);
    return res.status(500).json({ error: "Failed to validate selection", details: error.message });
  }
});

// Forward cost-estimate to Flask
app.post("/api/cost-estimate", async (req, res) => {
  console.log("📥 Frontend → Node.js: POST /api/cost-estimate");
  console.log("📤 Node.js → Flask: Forwarding cost-estimate request");
  try {
    const flaskResponse = await fetch(`${FLASK_URL}/api/cost-estimate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      return res.status(flaskResponse.status).json(errorData);
    }

    const result = await flaskResponse.json();
    console.log("✅ Node.js → Flask → Node.js → Frontend: Cost estimate saved");
    return res.json(result);
  } catch (error) {
    console.error("❌ Node → Flask error:", error);
    return res.status(500).json({ error: "Failed to save cost estimate", details: error.message });
  }
});

// Forward cost-rates to Flask
app.get("/api/cost-rates", async (req, res) => {
  console.log("📥 Frontend → Node.js: GET /api/cost-rates");
  try {
    const flaskResponse = await fetch(`${FLASK_URL}/api/cost-rates`);
    
    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      return res.status(flaskResponse.status).json(errorData);
    }

    const data = await flaskResponse.json();
    console.log("✅ Node.js → Flask → Node.js → Frontend: Cost rates sent");
    res.json(data);
  } catch (err) {
    console.error("❌ Node → Flask error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Forward plot-dimensions to Flask
app.get("/api/plot-dimensions/:city/:plotSize", async (req, res) => {
  const { city, plotSize } = req.params;
  console.log(`📥 Frontend → Node.js: GET /api/plot-dimensions/${city}/${plotSize}`);
  try {
    const flaskResponse = await fetch(`${FLASK_URL}/api/plot-dimensions/${city}/${plotSize}`);
    
    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      return res.status(flaskResponse.status).json(errorData);
    }

    const data = await flaskResponse.json();
    console.log(`✅ Node.js → Flask → Node.js → Frontend: Plot dimensions sent for ${city}/${plotSize}`);
    res.json(data);
  } catch (err) {
    console.error("❌ Node → Flask error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Forward construction-calculator to Flask
app.post("/api/construction-calculator", async (req, res) => {
  console.log("📥 Frontend → Node.js: POST /api/construction-calculator");
  console.log("📤 Node.js → Flask: Forwarding construction-calculator request");
  try {
    const flaskResponse = await fetch(`${FLASK_URL}/api/construction-calculator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      return res.status(flaskResponse.status).json(errorData);
    }

    const result = await flaskResponse.json();
    console.log("✅ Node.js → Flask → Node.js → Frontend: Construction cost calculated");
    return res.json(result);
  } catch (error) {
    console.error("❌ Node → Flask error:", error);
    return res.status(500).json({ error: "Failed to calculate construction cost", details: error.message });
  }
});

// Forward cities to Flask
app.get("/api/cities", async (req, res) => {
  console.log("📥 Frontend → Node.js: GET /api/cities");
  try {
    const flaskResponse = await fetch(`${FLASK_URL}/api/cities`);
    
    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      return res.status(flaskResponse.status).json(errorData);
    }

    const data = await flaskResponse.json();
    console.log("✅ Node.js → Flask → Node.js → Frontend: Cities list sent");
    res.json(data);
  } catch (err) {
    console.error("❌ Node → Flask error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Forward cities/:city/authorities to Flask
app.get("/api/cities/:city/authorities", async (req, res) => {
  const { city } = req.params;
  console.log(`📥 Frontend → Node.js: GET /api/cities/${city}/authorities`);
  try {
    const flaskResponse = await fetch(`${FLASK_URL}/api/cities/${city}/authorities`);
    
    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      return res.status(flaskResponse.status).json(errorData);
    }

    const data = await flaskResponse.json();
    console.log(`✅ Node.js → Flask → Node.js → Frontend: Authorities sent for ${city}`);
    res.json(data);
  } catch (err) {
    console.error("❌ Node → Flask error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Forward bylaws/:city/:authority/:plotSize to Flask
app.get("/api/bylaws/:city/:authority/:plotSize", async (req, res) => {
  const { city, authority, plotSize } = req.params;
  console.log(`📥 Frontend → Node.js: GET /api/bylaws/${city}/${authority}/${plotSize}`);
  try {
    const flaskResponse = await fetch(`${FLASK_URL}/api/bylaws/${city}/${authority}/${plotSize}`);
    
    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json();
      return res.status(flaskResponse.status).json(errorData);
    }

    const data = await flaskResponse.json();
    console.log(`✅ Node.js → Flask → Node.js → Frontend: Bylaws sent for ${city}/${authority}/${plotSize}`);
    res.json(data);
  } catch (err) {
    console.error("❌ Node → Flask error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("🚀 Node.js backend running at http://localhost:3001");
  console.log("📡 Ready to forward requests to Flask at http://127.0.0.1:5000");
});
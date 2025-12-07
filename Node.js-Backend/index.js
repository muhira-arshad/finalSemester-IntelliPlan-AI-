const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch"); // MUST be v2

const app = express();
app.use(cors());
app.use(express.json());

// Node.js: index.js
app.get("/api/form-options", async (req, res) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/form-options");
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Forward generate-plan to Flask
app.post("/api/generate-plan", async (req, res) => {
  console.log("Sending request to Flask...");
  try {
    const flaskResponse = await fetch("http://127.0.0.1:5000/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const result = await flaskResponse.json();
    console.log("Received from Flask:", result);
    return res.json(result);
  } catch (error) {
    console.error("Node → Flask error:", error);
    return res.status(500).json({ error: "Failed to fetch from Flask", details: error.message });
  }
});

app.listen(3001, () => {
  console.log("Node.js backend running at http://localhost:3001");
});
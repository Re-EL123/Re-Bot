// server.js
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

const API_URL = "https://api-inference.huggingface.co/models/bigscience/bloom";
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 50,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      return res.status(response.status).send({ error: errorDetails });
    }

    const data = await response.json();
    const generated = data[0]?.generated_text || "No response.";
    res.send({ result: generated });
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).send({ error: "Error generating text." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


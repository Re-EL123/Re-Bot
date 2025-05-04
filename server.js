const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const hfResponse = await fetch("https://api-inference.huggingface.co/models/laion/oa-open-assistant-1", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const data = await hfResponse.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Hugging Face request failed." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));

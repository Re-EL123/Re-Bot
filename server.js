const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const fetch = require('node-fetch');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  // Flan-T5 needs a simple instruction prompt
  const formattedPrompt = `Generate: ${prompt}`;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-base", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: formattedPrompt })
    });

    const result = await response.json();
    console.log("🔍 API Result:", result);

    if (Array.isArray(result) && result[0]?.generated_text) {
      res.json({ text: result[0].generated_text });
    } else {
      res.status(500).json({ error: "No text returned." });
    }

  } catch (error) {
    console.error("❌ Error generating:", error);
    res.status(500).json({ error: "API call failed." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Re-Bot is live at http://localhost:${PORT}`));



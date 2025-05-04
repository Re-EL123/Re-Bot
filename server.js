const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const fetch = require('node-fetch');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route: Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route: Handle generation request
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  const formattedPrompt = `### Instruction:\n${prompt}\n\n### Response:\n`;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: formattedPrompt })
    });

    const result = await response.json();

    console.log("🧠 Hugging Face API Result:", result);

    if (result && result.length > 0 && result[0].generated_text) {
      res.json({ text: result[0].generated_text });
    } else if (typeof result.generated_text === 'string') {
      res.json({ text: result.generated_text });
    } else {
      res.status(500).json({ error: "No generated text returned." });
    }

  } catch (error) {
    console.error("❌ Error during generation:", error);
    res.status(500).json({ error: "Failed to generate content." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Re-Bot running at http://localhost:${PORT}`));


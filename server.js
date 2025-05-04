const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Default route: serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST route for OpenAssistant
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/laion/mini-gpt4", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const result = await response.json();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate text." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Re-Bot running on http://localhost:${PORT}`));

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle generation
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  const formattedPrompt = `Generate: ${prompt}`;

  try {
    const hfRes = await fetch(
      'https://api-inference.huggingface.co/models/google/flan-t5-base',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: formattedPrompt })
      }
    );

    const result = await hfRes.json();
    console.log('🔍 Hugging Face API result:', result);

    if (Array.isArray(result) && result[0]?.generated_text) {
      res.json({ text: result[0].generated_text });
    } else {
      res.status(500).json({ error: 'No generated text returned.' });
    }
  } catch (err) {
    console.error('❌ Generation error:', err);
    res.status(500).json({ error: 'Failed to generate content.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Re-Bot listening on http://localhost:${PORT}`)
);


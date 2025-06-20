// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate-report', async (req, res) => {
  const { reportData } = req.body;

  const messages = [
    {
      role: "system",
      content: "Tu es un expert financier. Fais une interprétation claire et structurée des données en français."
    },
    {
      role: "user",
      content: `Voici les données :\n${JSON.stringify(reportData, null, 2)}`
    }
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages,
        temperature: 0.7
      })
    });

    const data = await response.json();
    res.json({ report: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur ou OpenAI");
  }
});

app.listen(3000, () => console.log("Serveur démarré sur http://localhost:3000"));


const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MM Recap Backend Running!");
});

app.post("/recap", async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `အောက်က YouTube/TikTok Link ကို မြန်မာလို အတိုချုပ် Recap ထုတ်ပေးပါ:\n${prompt}`
              }
            ]
          }
        ]
      }
    );

    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "အဖြေမရပါ";

    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

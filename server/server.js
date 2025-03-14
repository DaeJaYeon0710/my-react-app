const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

app.post("/api/generate", async (req, res) => {
  const { prompt, previousText = "" } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "프롬프트가 없습니다." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: previousText + prompt }],
        max_tokens: 1500,
        temperature: 0.7,
        stop: ["지원동기 종료"],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ result: response.data.choices[0].message.content });
  } catch (error) {
    console.error("AI 요청 실패:", error.message);
    res.status(500).json({ error: "AI 요청 실패", details: error.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://3.39.177.32:${PORT}`);
});

process.on("SIGINT", () => {
  console.log("❌ 서버 종료 중...");
  process.exit();
});

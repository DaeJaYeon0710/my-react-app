const express = require("express");
const axios = require("axios");
require("dotenv").config(); // .env 파일 사용

const app = express();
app.use(express.json()); // JSON 요청 처리

const PORT = 5000; // 백엔드 서버 포트

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body; // 프론트엔드에서 보낸 데이터

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-3.5-turbo",
        prompt,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data); // 결과를 프론트엔드로 전송
  } catch (error) {
    res.status(500).json({ error: "AI 요청 실패", details: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

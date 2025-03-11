module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        "128": "32rem",
        "160": "40rem",
        "192": "48rem",
        "256": "64rem", // ✅ 더 넓은 width 옵션 추가
      },
      maxWidth: {
        "none": "none", // ✅ `max-w-none`이 제한되지 않도록 설정
      },
    },
  },
  plugins: [],
};
